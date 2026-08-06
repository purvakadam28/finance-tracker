const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { label: 'Balance', value: summary.balance, tone: summary.balance >= 0 ? 'primary' : 'expense' },
    { label: 'Income', value: summary.income, tone: 'income' },
    { label: 'Expenses', value: summary.expense, tone: 'expense' },
  ];

  return (
    <div style={styles.row}>
      {cards.map((c) => (
        <div key={c.label} style={styles.card}>
          <div style={styles.label}>{c.label}</div>
          <div className="mono" style={{ ...styles.value, color: colorFor(c.tone) }}>
            {c.value < 0 ? '−' : ''}${fmt(Math.abs(c.value))}
          </div>
        </div>
      ))}
    </div>
  );
}

function colorFor(tone) {
  if (tone === 'income') return 'var(--income)';
  if (tone === 'expense') return 'var(--expense)';
  return 'var(--primary)';
}

const styles = {
  row: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: {
    background: 'var(--paper)',
    border: '1px solid var(--line)',
    borderRadius: 4,
    padding: '18px 20px',
  },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-soft)', marginBottom: 8 },
  value: { fontSize: 26, fontWeight: 700 },
};
