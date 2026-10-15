import { useState } from 'react';

export default function AdminLeadsLockCard({
  variant = 'dashboard', // 'dashboard' | 'page' | 'modal'
  onUnlock,
  onClose,
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPass = password.trim();
    if (!cleanPass) {
      setError('Please enter the password to unlock leads.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await onUnlock(cleanPass);
      if (res && res.error) {
        setError(res.error || 'Incorrect password. Access denied.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Verification failed. Please check password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isModal = variant === 'modal';
  const isPage = variant === 'page';

  const cardContent = (
    <div
      style={{
        ...styles.wrapper,
        ...(isPage ? styles.wrapperPage : {}),
        ...(isModal ? styles.wrapperModal : {}),
      }}
    >
      {/* Close button for modal */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          style={styles.closeBtn}
          aria-label="Close modal"
        >
          ✕
        </button>
      )}

      {/* Lock Shield Icon with Ambient Glow */}
      <div style={styles.iconContainer}>
        <div style={styles.iconGlow} />
        <div style={styles.iconCircle}>
          <svg
            width={isPage ? 36 : 28}
            height={isPage ? 36 : 28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
      </div>

      {/* Badge */}
      <div style={styles.badge}>
        <span style={styles.badgeDot} />
        SECURITY LOCKED • PASSWORD PROTECTED
      </div>

      {/* Header Titles */}
      <h3 style={{ ...styles.title, fontSize: isPage ? 22 : 18 }}>
        {isPage ? '🎓 Admission Leads & Inquiries Protected' : 'Leads & Inquiries Locked'}
      </h3>
      <p style={{ ...styles.subtitle, fontSize: isPage ? 13.5 : 12.5 }}>
        {isPage
          ? 'Enter your security password to access inquiries, student phone numbers, course applications, and Excel exports.'
          : 'Pehle password daalna hoga tabhi dashboard leads data aur operations dikhenge.'}
      </p>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Unlock Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <div style={styles.inputPrefix}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter leads password..."
            autoFocus
            style={styles.input}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !password.trim()}
          style={{
            ...styles.submitBtn,
            opacity: isSubmitting || !password.trim() ? 0.7 : 1,
            cursor: isSubmitting || !password.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? (
            <span style={styles.submittingWrap}>
              <span style={styles.spinner} />
              <span>Verifying Password...</span>
            </span>
          ) : (
            <span style={styles.submittingWrap}>
              <span>🔓 Unlock Leads</span>
            </span>
          )}
        </button>
      </form>

      {/* Security Note Footer */}
      <div style={styles.hintWrap}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span style={styles.hintText}>
          Protected by environment variable (<code style={styles.hintCode}>.env</code>). Unlocks dashboard & leads management.
        </span>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modalContainer: {
    maxWidth: 480,
    width: '100%',
    position: 'relative',
    animation: 'leadsFadeIn 0.2s ease-out',
  },
  wrapper: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '36px 30px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
  },
  wrapperPage: {
    maxWidth: 580,
    margin: '40px auto',
    padding: '48px 40px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
  },
  wrapperModal: {
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: '#f1f5f9',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: 16,
    fontSize: 14,
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  iconGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, rgba(217, 119, 6, 0) 70%)',
    borderRadius: '50%',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: '#fffbeb',
    border: '2px solid #fef3c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.12)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#fef3c7',
    color: '#b45309',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#d97706',
  },
  title: {
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#64748b',
    lineHeight: 1.5,
    margin: '0 0 20px 0',
    maxWidth: 420,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '9px 14px',
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 600,
    marginBottom: 16,
    width: '100%',
    maxWidth: 380,
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  form: {
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8fafc',
    border: '1.5px solid #cbd5e1',
    borderRadius: 10,
    padding: '0 12px',
    transition: 'border-color 0.15s ease',
  },
  inputPrefix: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '12px 0',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 600,
    outline: 'none',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
    transition: 'all 0.15s ease',
  },
  submittingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
  hintWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    fontSize: 11.5,
    color: '#64748b',
  },
  hintText: {
    color: '#64748b',
  },
  hintCode: {
    background: '#f1f5f9',
    padding: '2px 5px',
    borderRadius: 4,
    fontFamily: 'monospace',
    color: '#334155',
    fontSize: 11,
  },
};
