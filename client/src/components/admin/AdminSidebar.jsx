import { Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar({ activeTab, onSelectTab, onLogout, isOpen = false, onClose }) {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    onSelectTab(tabId);
    if (onClose) onClose();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: 'blogs',
      label: 'Articles & Blogs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      id: 'create-blog',
      label: 'Add Article / Post',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      ),
    },
    {
      id: 'inquiries',
      label: 'Inquiries & Leads',
      badge: 'New',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Admin Profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : ''}`} style={styles.sidebar}>
        {/* Brand Header */}
        <div style={styles.brandHeader}>
          <div style={styles.brandLogoBox}>
            <img
              src="/logo-512.png"
              alt="DLEducationConnect Logo"
              width={38}
              height={38}
              style={{ width: 38, height: 38, objectFit: 'contain' }}
            />
            <div>
              <div style={styles.brandTitle}>DLEDUCATION</div>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : styles.navItemInactive),
                }}
              >
              <span style={{ ...styles.itemIcon, color: isActive ? '#0f172a' : '#94a3b8' }}>
                {item.icon}
              </span>
              <span style={{ ...styles.itemLabel, color: isActive ? '#0f172a' : '#cbd5e1' }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={isActive ? styles.badgeActive : styles.badgeInactive}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions: View Public Site & Sign Out */}
      <div style={styles.footerSection}>
        <Link to="/" style={styles.footerLink} title="Open User Facing Site">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>View Public Site</span>
          <span style={{ marginLeft: 'auto', fontSize: 13 }}>↗</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          style={styles.signOutBtn}
          title="Sign out of Admin Suite"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  </>
  );
}

const styles = {
  sidebar: {
    width: 260,
    minWidth: 260,
    background: '#0b132b',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    borderRight: '1px solid rgba(255,255,255,0.06)',
    zIndex: 100,
    transition: 'all 0.25s ease',
  },
  brandHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  brandLogoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: 1.2,
    color: '#ffffff',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: '#94a3b8',
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.18s ease',
  },
  navItemActive: {
    background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
  },
  navItemInactive: {
    background: 'transparent',
    color: '#cbd5e1',
  },
  itemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    flex: 1,
  },
  badgeActive: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
    background: '#0f172a',
    color: '#ffffff',
  },
  badgeInactive: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    color: '#94a3b8',
  },
  footerSection: {
    padding: '16px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: 8,
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    color: '#f87171',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.15s ease',
  },
};
