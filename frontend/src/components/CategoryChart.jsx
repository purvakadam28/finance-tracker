import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#1B4332', '#B08A2E', '#A6491F', '#5B6259', '#2D6A4F', '#7A6248', '#8C3B1B', '#3E5C4F'];

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ margin: 0 }}>No expenses logged yet — add one to see the breakdown.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[i % COLORS.length]} stroke="var(--paper)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 13, borderRadius: 4, border: '1px solid var(--line)' }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{ fontSize: 13, fontFamily: 'var(--font-body)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  wrap: { background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 4, padding: '16px 8px' },
  empty: {
    background: 'var(--paper)',
    border: '1px dashed var(--line)',
    borderRadius: 4,
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 14,
  },
};
