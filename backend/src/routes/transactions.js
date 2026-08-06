import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/transactions - list all transactions for the logged-in user
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC')
    .all(req.userId);
  res.json(rows);
});

// POST /api/transactions - create a transaction
router.post('/', (req, res) => {
  const { type, amount, category, note, date } = req.body;

  if (!type || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const result = db
    .prepare(
      `INSERT INTO transactions (user_id, type, amount, category, note, date)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.userId, type, Number(amount), category, note || null, date);

  const created = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/transactions/:id - update a transaction
router.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!existing) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const { type, amount, category, note, date } = req.body;

  db.prepare(
    `UPDATE transactions SET type = ?, amount = ?, category = ?, note = ?, date = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    type ?? existing.type,
    amount ?? existing.amount,
    category ?? existing.category,
    note ?? existing.note,
    date ?? existing.date,
    req.params.id,
    req.userId
  );

  const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(204).send();
});

// GET /api/transactions/summary - totals + breakdown by category
router.get('/meta/summary', (req, res) => {
  const totals = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
       FROM transactions WHERE user_id = ?`
    )
    .get(req.userId);

  const byCategory = db
    .prepare(
      `SELECT category, SUM(amount) as total
       FROM transactions
       WHERE user_id = ? AND type = 'expense'
       GROUP BY category
       ORDER BY total DESC`
    )
    .all(req.userId);

  res.json({
    income: totals.income,
    expense: totals.expense,
    balance: totals.income - totals.expense,
    byCategory,
  });
});

export default router;
