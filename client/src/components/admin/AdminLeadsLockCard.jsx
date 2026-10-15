import { useState } from 'react';

export default function AdminLeadsLockCard({
  variant = 'dashboard', // 'dashboard' | 'page' | 'modal'
  onUnlock,
  onClose,
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPass = password.trim();
    if (!cleanPass) {
      setError('Please enter password');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await onUnlock(cleanPass);
      if (res && res.error) {
        setError(res.error || 'Incorrect password');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isModal = variant === 'modal';

  const cardContent = (
    <div
      style={{
        ...styles.wrapper,
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

      {/* Unlock Form: ONLY 2 FIELDS (password and unlock button) */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter password..."
          autoFocus
          style={styles.input}
        />

        <button
          type="submit"
          disabled={isSubmitting || !password.trim()}
          style={{
            ...styles.submitBtn,
            opacity: isSubmitting || !password.trim() ? 0.7 : 1,
            cursor: isSubmitting || !password.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Unlocking...' : 'Unlock'}
        </button>
      </form>

      {/* Error Message if wrong */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}
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
    maxWidth: 420,
    width: '100%',
    position: 'relative',
    animation: 'leadsFadeIn 0.2s ease-out',
  },
  wrapper: {
    background: '#ffffff',
    borderRadius: 12,
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
  },
  wrapperModal: {
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
    border: '1px solid #e2e8f0',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: '#f1f5f9',
    border: 'none',
    width: 28,
    height: 28,
    borderRadius: 14,
    fontSize: 13,
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: '11px 14px',
    fontSize: 14,
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    background: '#ffffff',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  errorBox: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: 600,
    marginTop: 10,
    textAlign: 'center',
  },
};
