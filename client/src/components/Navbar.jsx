import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({ user, setUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const searchWrapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setMenuOpen(false);
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

  const isHomeActive = location.pathname === '/';

  return (
    <header className="site-navbar" style={styles.header}>
      <div className="container" style={styles.inner}>
        {/* ── Brand Logo ──────────────────────────────── */}
        <Link to="/" style={styles.brand} aria-label="DL Education Connect Home">
          <div style={styles.logoBadge}>
            <img
              src="/logo-512.png"
              alt="DL Education Connect Logo"
              width={38}
              height={38}
              style={styles.logoImg}
            />
          </div>
          <div style={styles.brandTextWrap}>
            <span style={styles.brandMain}>DL EDUCATION</span>
            <span style={styles.brandSub}>CONNECT</span>
          </div>
        </Link>

        {/* ── Desktop Navigation ──────────────────────── */}
        <nav className="desktop-nav" style={styles.navMenu}>
          {/* Home */}
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isHomeActive ? styles.navLinkActive : {}),
            }}
          >
            <span>Home</span>
            {isHomeActive && <span style={styles.activeBar} />}
          </Link>

          {/* Universities */}
          <Link
            to="/blogs?category=University"
            style={{
              ...styles.navLink,
              ...(location.search.includes('University') ? styles.navLinkActive : {}),
            }}
          >
            <span>Universities</span>
            {location.search.includes('University') && <span style={styles.activeBar} />}
          </Link>

          {/* Courses */}
          <Link
            to="/blogs?category=Courses"
            style={{
              ...styles.navLink,
              ...(location.search.includes('Courses') ? styles.navLinkActive : {}),
            }}
          >
            <span>Courses</span>
            {location.search.includes('Courses') && <span style={styles.activeBar} />}
          </Link>

          {/* Blog */}
          <Link
            to="/blogs"
            style={{
              ...styles.navLink,
              ...(location.pathname === '/blogs' && !location.search ? styles.navLinkActive : {}),
            }}
          >
            <span>Blog</span>
            {location.pathname === '/blogs' && !location.search && <span style={styles.activeBar} />}
          </Link>

          {/* Admin link if logged in */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                ...styles.adminBadge,
                ...(isActive ? styles.adminBadgeActive : {}),
              })}
            >
              Dashboard
            </NavLink>
          )}

          {user && (
            <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          )}
        </nav>

        {/* ── Right Actions ───────────────────────────── */}
        <div style={styles.rightActions}>
          {/* Search Trigger */}
          <div ref={searchWrapRef} style={{ position: 'relative' }}>
            <button
              type="button"
              style={styles.searchIconBtn}
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Toggle search input"
              title="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Expandable Search Dropdown */}
            {isSearchOpen && (
              <form onSubmit={handleSearch} style={styles.searchDropdown}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search blogs, universities, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.dropdownInput}
                />
                <button type="submit" style={styles.dropdownBtn}>
                  Search
                </button>
              </form>
            )}
          </div>

          {/* Explore Courses Button */}
          <Link to="/blogs?category=Courses" className="nav-explore-btn" style={styles.exploreBtn}>
            <span>Explore Courses</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-hamburger"
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ─────────────────────── */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/blogs?category=University" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Universities
          </Link>
          <Link to="/blogs?category=Courses" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Courses
          </Link>
          <Link to="/blogs" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link
            to="/blogs?category=Courses"
            style={{ ...styles.mobileLink, color: '#bc8f8f', fontWeight: 700 }}
            onClick={() => setMenuOpen(false)}
          >
            Explore Courses →
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          {user && (
            <button type="button" onClick={handleLogout} style={styles.mobileLogoutBtn}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 74,
    gap: 16,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 38,
    height: 38,
    objectFit: 'contain',
  },
  brandTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  brandMain: {
    fontSize: 15.5,
    fontWeight: 800,
    color: '#0e2a47',
    letterSpacing: '0.4px',
    fontFamily: 'var(--font)',
  },
  brandSub: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#bc8f8f',
    letterSpacing: '2.5px',
    fontFamily: 'var(--font)',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  navLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
    textDecoration: 'none',
    padding: '8px 2px',
    transition: 'color 0.15s ease',
  },
  navLinkActive: {
    color: '#bc8f8f',
    fontWeight: 600,
  },
  activeBar: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#bc8f8f',
  },
  adminBadge: {
    fontSize: 12.5,
    fontWeight: 600,
    color: '#92400e',
    background: '#fef3c7',
    border: '1px solid #fde68a',
    padding: '5px 12px',
    borderRadius: 6,
    textDecoration: 'none',
  },
  adminBadgeActive: {
    background: '#fde68a',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 6,
    padding: '5px 12px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexShrink: 0,
  },
  searchIconBtn: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  searchDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 30,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 6px 4px 16px',
    width: 320,
    zIndex: 110,
  },
  dropdownInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 13.5,
    color: '#0f172a',
    background: 'transparent',
  },
  dropdownBtn: {
    background: '#bc8f8f',
    color: '#ffffff',
    border: 'none',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  exploreBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#bc8f8f',
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: 600,
    padding: '9px 18px',
    borderRadius: 24,
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(188, 143, 143, 0.35)',
    transition: 'all 0.2s ease',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
    padding: 6,
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '14px 20px 20px',
    borderTop: '1px solid #f1f5f9',
    background: '#ffffff',
  },
  mobileLink: {
    padding: '10px 0',
    fontSize: 15,
    fontWeight: 500,
    color: '#0f172a',
    textDecoration: 'none',
    borderBottom: '1px solid #f8fafc',
  },
  mobileLogoutBtn: {
    background: 'none',
    border: 'none',
    color: '#dc2626',
    textAlign: 'left',
    padding: '10px 0',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
