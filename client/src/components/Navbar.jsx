import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({ user, setUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.logoText}>DLEducation<span style={styles.logoAccent}>Connect</span></span>
        </Link>

        {/* Search Bar */}
        <form className="nav-search-wrap" style={styles.searchForm} onSubmit={handleSearch}>
          <div
            style={{
              ...styles.searchWrap,
              ...(isFocused ? styles.searchWrapFocused : {}),
            }}
          >
            <div style={{ ...styles.searchIconLeft, color: isFocused ? 'var(--primary)' : '#94a3b8' }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search universities, courses, blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={styles.searchClearBtn}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button type="submit" style={styles.searchBtn} aria-label="Search">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav Links */}
        <nav className="desktop-nav" style={styles.nav}>
          {[
            { to: '/', label: 'Home' },
            { to: '/blogs', label: 'Blogs' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 6 }}>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  style={({ isActive }) => ({
                    ...styles.adminBtn,
                    ...(isActive ? styles.adminBtnActive : {}),
                  })}
                >
                  Dashboard
                </NavLink>
              )}
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <NavLink to="/login" style={styles.loginBtn}>
              Sign In
            </NavLink>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="mobile-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ ...styles.bar, ...(menuOpen ? styles.barTop : {}) }} />
          <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.bar, ...(menuOpen ? styles.barBot : {}) }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {[
            { to: '/', label: 'Home' },
            { to: '/blogs', label: 'Blogs' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{label}</NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin Dashboard</NavLink>
              )}
              <button style={styles.mobileLinkBtn} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign In</NavLink>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    height: 'var(--nav-height)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', flexShrink: 0,
  },
  logoIcon: {
    width: 36, height: 36,
    background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
  },
  logoText: {
    fontSize: 17, fontWeight: 700, color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  logoAccent: { color: 'var(--primary)' },
  searchForm: {
    flex: 1,
    maxWidth: 460,
    margin: '0 20px',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    height: 42,
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: 24,
    padding: '3px 4px 3px 14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    transition: 'all 0.2s ease',
  },
  searchWrapFocused: {
    background: '#ffffff',
    borderColor: 'var(--primary)',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.12)',
  },
  searchIconLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
    transition: 'color 0.2s ease',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: '0 6px',
    border: 'none',
    fontSize: 13.5,
    fontFamily: 'var(--font)',
    background: 'transparent',
    outline: 'none',
    color: 'var(--text)',
  },
  searchClearBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: 12,
    cursor: 'pointer',
    padding: '0 6px',
    marginRight: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s ease',
  },
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'var(--primary)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
    transition: 'all 0.15s ease',
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  navLink: {
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    color: 'var(--primary)',
    background: 'var(--primary-light)',
    fontWeight: 600,
  },
  adminBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  adminBtnActive: {
    background: '#fde68a',
  },
  loginBtn: {
    padding: '7px 18px',
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 600,
    background: 'var(--primary)',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    marginLeft: 6,
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
  },
  logoutBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    background: 'transparent',
    color: 'var(--danger)',
    border: '1.5px solid var(--danger)',
    transition: 'all 0.2s ease',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: 5,
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    '@media (max-width: 768px)': { display: 'flex' },
  },
  bar: {
    display: 'block',
    width: 22,
    height: 2,
    background: 'var(--text)',
    borderRadius: 2,
    transition: 'all 0.25s ease',
  },
  barTop: { transform: 'translateY(7px) rotate(45deg)' },
  barBot: { transform: 'translateY(-7px) rotate(-45deg)' },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 20px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  mobileLink: {
    padding: '10px 0',
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border)',
  },
  mobileLinkBtn: {
    marginTop: 10,
    padding: '10px 0',
    background: 'none',
    border: 'none',
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--danger)',
    textAlign: 'left',
    cursor: 'pointer',
  },
};
