import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ user, setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', form, { withCredentials: true });
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      setUser(data);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="login-card-grid" style={styles.card}>
        {/* Left panel */}
        <div className="login-left-panel" style={styles.leftPanel}>
          <div style={styles.panelContent}>
            <div style={styles.panelIcon}>
              <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 style={styles.panelTitle}>Welcome Back</h1>
            <p style={styles.panelDesc}>
              Sign in to access your DLEducationConnect dashboard and manage your education blog content.
            </p>
            <ul style={styles.featureList}>
              {['Create & manage blog posts', 'Upload images to Cloudinary', 'View analytics & stats', 'Manage categories & tags'].map((f) => (
                <li key={f} style={styles.featureItem}>
                  <span style={styles.featureCheck}>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right form */}
        <div style={styles.rightPanel}>
          <Link to="/" style={styles.backHome}>← Back to Home</Link>
          <h2 style={styles.formTitle}>Sign In</h2>
          <p style={styles.formSub}>Enter your credentials to continue</p>

          {error && (
            <div style={styles.errorAlert}>
              {typeof error === 'object' && error !== null
                ? (error.message || JSON.stringify(error))
                : String(error)}
            </div>
          )}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                className="form-input"
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                className="form-input"
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} /> Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #faf5ff 100%)',
    minHeight: 'calc(100vh - var(--nav-height))',
  },
  card: {
    display: 'flex', borderRadius: 20,
    overflow: 'hidden', width: '100%', maxWidth: 900,
    boxShadow: 'var(--shadow-xl)',
  },
  leftPanel: {
    flex: '0 0 380px',
    background: 'linear-gradient(160deg, #1d4ed8 0%, #7c3aed 100%)',
    padding: 48, display: 'flex', alignItems: 'center',
  },
  panelContent: {},
  panelIcon: {
    width: 56, height: 56,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 14, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  panelTitle: { fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.5px' },
  panelDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 28 },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  featureItem: { fontSize: 13.5, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 8 },
  featureCheck: { background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 },
  rightPanel: {
    flex: 1, background: 'white', padding: '44px 40px',
    display: 'flex', flexDirection: 'column',
  },
  backHome: { fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 32, display: 'inline-block' },
  formTitle: { fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6 },
  formSub: { fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 },
  errorAlert: {
    padding: '12px 16px', background: '#fef2f2',
    border: '1px solid #fecaca', borderRadius: 'var(--radius)',
    fontSize: 13.5, color: '#dc2626', marginBottom: 20,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTopColor: 'white', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  registerNote: { marginTop: 24, fontSize: 13.5, color: 'var(--text-muted)', textAlign: 'center' },
};
