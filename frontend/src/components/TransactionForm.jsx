import { useState } from 'react';

const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const today = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (t) => {
    setType(t);
    setCategory(t === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    setSubmitting(true);
    try {
      await onAdd({ type, amount: Number(amount), category, date, note });
      setAmount('');
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.toggleRow}>
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            style={{
              ...styles.toggle,
              ...(type === t ? styles.toggleActive(t) : {}),
            }}
          >
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        <label style={styles.label}>
          Amount
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
        </label>

        <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
          Note (optional)
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Weekly groceries"
            style={styles.input}
          />
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={submitting} style={styles.button}>
        {submitting ? 'Adding…' : `Add ${type}`}
      </button>
    </form>
  );
}

const styles = {
  form: { background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 4, padding: 20 },
  toggleRow: { display: 'flex', gap: 8, marginBottom: 16 },
  toggle: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 3,
    border: '1px solid var(--line)',
    background: 'var(--bg)',
    color: 'var(--ink-soft)',
    fontWeight: 600,
    fontSize: 13,
  },
  toggleActive: (t) => ({
    background: t === 'expense' ? 'var(--expense-soft)' : 'var(--primary-soft)',
    color: t === 'expense' ? 'var(--expense)' : 'var(--primary)',
    borderColor: t === 'expense' ? 'var(--expense)' : 'var(--primary)',
  }),
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500 },
  input: {
    padding: '9px 10px',
    border: '1px solid var(--line)',
    borderRadius: 3,
    background: 'var(--bg)',
    color: 'var(--ink)',
  },
  error: { color: 'var(--expense)', fontSize: 13, margin: '12px 0 0' },
  button: {
    marginTop: 16,
    width: '100%',
    padding: '11px 16px',
    background: 'var(--primary)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 3,
    fontWeight: 600,
    fontSize: 14,
  },
};
