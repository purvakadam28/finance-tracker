import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>§</span>
          <span style={styles.brandName}>Ledger</span>
        </div>
        <h1 style={styles.heading}>Open an account</h1>
        <p style={styles.subtext}>Takes ten seconds. No card required.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="At least 6 characters"
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: 'var(--paper)',
    border: '1px solid var(--line)',
    borderRadius: 4,
    padding: '40px 36px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 },
  brandMark: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
    width: 30, height: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 3,
  },
  brandName: { fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.02em' },
  heading: { fontFamily: 'var(--font-display)', fontSize: 30, margin: '0 0 6px', fontWeight: 500 },
  subtext: { color: 'var(--ink-soft)', margin: '0 0 28px', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 },
  input: {
    padding: '10px 12px',
    border: '1px solid var(--line)',
    borderRadius: 3,
    background: 'var(--bg)',
    color: 'var(--ink)',
  },
  error: { color: 'var(--expense)', fontSize: 13, margin: 0 },
  button: {
    marginTop: 8,
    padding: '11px 16px',
    background: 'var(--primary)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 3,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.02em',
  },
  footer: { marginTop: 24, fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center' },
  link: { color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' },
};
