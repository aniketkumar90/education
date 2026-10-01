import { Link } from 'react-router-dom';

export default function AdminHeader({ user, title, onAddNewPost, onToggleSidebar }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="admin-header" style={styles.header}>
      <div style={styles.left}>
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="admin-page-title" style={styles.pageTitle}>{title || 'Dashboard Overview'}</h1>
      </div>

      <div style={styles.right}>
        {onAddNewPost && (
          <button
            type="button"
            onClick={onAddNewPost}
            className="admin-header-add-btn"
            style={styles.addBtn}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>+</span>
            <span className="admin-add-btn-text">Add New Post</span>
          </button>
        )}

        {/* Admin Profile Chip */}
        <div style={styles.userProfile}>
          <div style={styles.avatar}>
            {initial}
          </div>
          <div className="admin-user-info" style={styles.userInfo}>
            <span style={styles.userName}>{user?.name || 'Admin'}</span>
            <span style={styles.userRole}>ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 70,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#d97706',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 15,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  userName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  userRole: {
    fontSize: 10,
    fontWeight: 800,
    color: '#059669',
    letterSpacing: 0.5,
  },
};
