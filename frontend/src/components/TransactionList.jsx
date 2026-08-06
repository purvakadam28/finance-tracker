const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ margin: 0 }}>Nothing logged yet. Add your first transaction above.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ ...styles.row, ...styles.headRow }}>
        <span>Date</span>
        <span>Category</span>
        <span>Note</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
        <span></span>
      </div>
      {transactions.map((tx) => (
        <div key={tx.id} style={styles.row}>
          <span className="mono" style={styles.date}>{tx.date}</span>
          <span>
            <span style={styles.badge(tx.type)}>{tx.category}</span>
          </span>
          <span style={styles.note}>{tx.note || '—'}</span>
          <span
            className="mono"
            style={{ textAlign: 'right', fontWeight: 700, color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}
          >
            {tx.type === 'income' ? '+' : '−'}${fmt(tx.amount)}
          </span>
          <button onClick={() => onDelete(tx.id)} style={styles.deleteBtn} aria-label={`Delete ${tx.category} transaction`}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: { background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' },
  row: {
    display: 'grid',
    gridTemplateColumns: '110px 140px 1fr 120px 32px',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid var(--line)',
    fontSize: 14,
  },
  headRow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--ink-soft)',
    background: 'var(--bg)',
    fontWeight: 600,
  },
  date: { color: 'var(--ink-soft)', fontSize: 13 },
  note: { color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: (type) => ({
    fontSize: 12,
    padding: '3px 9px',
    borderRadius: 20,
    background: type === 'income' ? 'var(--primary-soft)' : 'var(--expense-soft)',
    color: type === 'income' ? 'var(--primary)' : 'var(--expense)',
    fontWeight: 600,
  }),
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--ink-soft)',
    fontSize: 18,
    lineHeight: 1,
    padding: 4,
  },
  empty: {
    background: 'var(--paper)',
    border: '1px dashed var(--line)',
    borderRadius: 4,
    padding: '32px 24px',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 14,
  },
};
