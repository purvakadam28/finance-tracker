import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import SummaryCards from '../components/SummaryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [txs, sum] = await Promise.all([api.getTransactions(token), api.getSummary(token)]);
      setTransactions(txs);
      setSummary(sum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (tx) => {
    await api.createTransaction(token, tx);
    await load();
  };

  const handleDelete = async (id) => {
    await api.deleteTransaction(token, id);
    await load();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>§</span>
          <span style={styles.brandName}>Ledger</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={logout} style={styles.logoutBtn}>Sign out</button>
        </div>
      </header>

      <main style={styles.main}>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>Loading your ledger…</p>
        ) : error ? (
          <p style={{ color: 'var(--expense)' }}>{error}</p>
        ) : (
          <>
            <SummaryCards summary={summary} />

            <div style={styles.splitRow}>
              <div style={styles.left}>
                <h2 style={styles.sectionTitle}>Add a transaction</h2>
                <TransactionForm onAdd={handleAdd} />
              </div>
              <div style={styles.right}>
                <h2 style={styles.sectionTitle}>Spending by category</h2>
                <CategoryChart data={summary?.byCategory} />
              </div>
            </div>

            <h2 style={styles.sectionTitle}>History</h2>
            <TransactionList transactions={transactions} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 32px',
    borderBottom: '1px solid var(--line)',
    background: 'var(--paper)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  brandMark: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
    width: 26, height: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 3,
  },
  brandName: { fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: '0.02em' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  userEmail: { fontSize: 13, color: 'var(--ink-soft)' },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid var(--line)',
    borderRadius: 3,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink)',
  },
  main: { maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px', display: 'flex', flexDirection: 'column', gap: 28 },
  splitRow: { display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'start' },
  left: {},
  right: {},
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 18,
    margin: '0 0 12px',
  },
};
