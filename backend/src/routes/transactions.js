import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// GET /api/transactions
router.get('/', async (req, res) => {
  const result = await db.query(
    `SELECT * FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC, id DESC`,
    [req.userId]
  );

  res.json(result.rows);
});

// POST /api/transactions
router.post('/', async (req, res) => {
  const { type, amount, category, note, date } = req.body;

  if (!type || !['income', 'expense'].includes(type)) {
    return res.status(400).json({
      error: "Type must be 'income' or 'expense'",
    });
  }

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      error: 'Amount must be a positive number',
    });
  }

  if (!category) {
    return res.status(400).json({
      error: 'Category is required',
    });
  }

  if (!date) {
    return res.status(400).json({
      error: 'Date is required',
    });
  }

  const result = await db.query(
    `INSERT INTO transactions
      (user_id, type, amount, category, note, date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      req.userId,
      type,
      Number(amount),
      category,
      note || null,
      date,
    ]
  );

  res.status(201).json(result.rows[0]);
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  const existingResult = await db.query(
    `SELECT * FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.userId]
  );

  const existing = existingResult.rows[0];

  if (!existing) {
    return res.status(404).json({
      error: 'Transaction not found',
    });
  }

  const { type, amount, category, note, date } = req.body;

  const result = await db.query(
    `UPDATE transactions
     SET type = $1,
         amount = $2,
         category = $3,
         note = $4,
         date = $5
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [
      type ?? existing.type,
      amount ?? existing.amount,
      category ?? existing.category,
      note ?? existing.note,
      date ?? existing.date,
      req.params.id,
      req.userId,
    ]
  );

  res.json(result.rows[0]);
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  const result = await db.query(
    `DELETE FROM transactions
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [req.params.id, req.userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'Transaction not found',
    });
  }

  res.status(204).send();
});

// GET /api/transactions/meta/summary
router.get('/meta/summary', async (req, res) => {
  const totalsResult = await db.query(
    `SELECT
       COALESCE(
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
         0
       ) AS income,
       COALESCE(
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
         0
       ) AS expense
     FROM transactions
     WHERE user_id = $1`,
    [req.userId]
  );

  const byCategoryResult = await db.query(
    `SELECT
       category,
       SUM(amount) AS total
     FROM transactions
     WHERE user_id = $1
       AND type = 'expense'
     GROUP BY category
     ORDER BY total DESC`,
    [req.userId]
  );

  const income = Number(totalsResult.rows[0].income);
  const expense = Number(totalsResult.rows[0].expense);

  res.json({
    income,
    expense,
    balance: income - expense,
    byCategory: byCategoryResult.rows.map((row) => ({
      category: row.category,
      total: Number(row.total),
    })),
  });
});

export default router;