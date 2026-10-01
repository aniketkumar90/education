import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoAdmin = () => {
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.desc}>
              An unexpected error occurred while rendering the page. Your data is safe.
            </p>
            {this.state.error && (
              <div style={styles.errorBox}>
                <code>{this.state.error.toString()}</code>
              </div>
            )}
            <div style={styles.actions}>
              <button type="button" onClick={this.handleReload} style={styles.btnPrimary}>
                🔄 Reload Page
              </button>
              <button type="button" onClick={this.handleGoAdmin} style={styles.btnSecondary}>
                ⚙️ Admin Dashboard
              </button>
              <button type="button" onClick={this.handleGoHome} style={styles.btnSecondary}>
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: '#f8fafc',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '36px 32px',
    maxWidth: 520,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 10px',
  },
  desc: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 20px',
    lineHeight: 1.5,
  },
  errorBox: {
    padding: '12px 14px',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    color: '#991b1b',
    fontSize: 12.5,
    textAlign: 'left',
    overflowX: 'auto',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '10px 20px',
    borderRadius: 8,
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 13.5,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  btnSecondary: {
    padding: '10px 18px',
    borderRadius: 8,
    background: '#f1f5f9',
    color: '#334155',
    fontWeight: 600,
    fontSize: 13.5,
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
