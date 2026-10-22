import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showFloatingArrow, setShowFloatingArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingArrow(true);
      } else {
        setShowFloatingArrow(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="about" className="site-footer" style={styles.footer}>
      <div className="container">
        {/* ── 4 Columns Top Section ───────────────────── */}
        <div style={styles.grid}>
          {/* Column 1: Brand & Tagline */}
          <div style={styles.brandCol}>
            <Link to="/" style={styles.brandLink}>
              <img
                src="/logo-512.png"
                alt="DL Education Connect"
                width={36}
                height={36}
                style={styles.logoImg}
              />
              <div style={styles.brandText}>
                <span style={styles.brandTitle}>DL EDUCATION</span>
                <span style={styles.brandSub}>CONNECT</span>
              </div>
            </Link>
            <p style={styles.tagline}>
              Your trusted partner in educational journey.
            </p>
          </div>

          {/* Column 2: Quick Links (Matching Header Links) */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/" style={styles.link}>Home</Link>
              </li>
              <li>
                <Link to="/blogs?category=University" style={styles.link}>Universities</Link>
              </li>
              <li>
                <Link to="/blogs?category=Courses" style={styles.link}>Courses</Link>
              </li>
              <li>
                <Link to="/blogs" style={styles.link}>Blog</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated & Socials */}
          <div>
            <h4 style={styles.colTitle}>Stay Updated</h4>
            <p style={styles.subscribeText}>
              Get the latest blogs and updates in your inbox.
            </p>
            <form onSubmit={handleSubscribe} style={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.subscribeInput}
                aria-label="Email address for newsletter"
              />
              <button type="submit" style={styles.subscribeBtn} aria-label="Subscribe">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
            {subscribed && (
              <p style={{ color: '#4ade80', fontSize: 12.5, marginTop: 8 }}>
                ✓ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* ── Scroll To Top Up Arrow in Footer ── */}
        <div style={styles.arrowRow}>
          <button
            type="button"
            onClick={scrollToTop}
            style={styles.backToTopBtn}
            className="footer-scroll-top-btn"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={styles.bottomDivider} />

        {/* ── Short Educational Disclaimer (Small Font) ── */}
        <div style={styles.disclaimerContainer}>
          <p style={styles.disclaimerText}>
            <span style={styles.disclaimerTag}>Disclaimer:</span> We run an educational blog for informational guidance and do not claim 100% official accuracy. For verified and official details, please check the respective university&apos;s official website.
          </p>
        </div>

        {/* ── Bottom Bar: Copyright & Privacy Policy ── */}
        <div style={styles.bottomBar}>
          <p style={styles.copyrightText}>
            © {new Date().getFullYear()} DL Education Connect. All rights reserved.
          </p>
          <div style={styles.legalLinks}>
            <Link to="/privacy-policy" style={styles.legalLink}>
              Privacy Policy
            </Link>
            <span style={styles.legalSeparator}>•</span>
            <Link to="/privacy-policy#disclaimer" style={styles.legalLink}>
              Disclaimer
            </Link>
            <span style={styles.legalSeparator}>•</span>
            <Link to="/privacy-policy#terms" style={styles.legalLink}>
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button when user scrolls down */}
      {showFloatingArrow && (
        <button
          type="button"
          onClick={scrollToTop}
          style={styles.floatingArrowBtn}
          className="floating-scroll-top-btn"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      )}
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0a192f',
    color: '#94a3b8',
    paddingTop: 56,
    paddingBottom: 48,
    marginTop: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1.3fr',
    gap: 40,
    paddingBottom: 0,
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    marginBottom: 16,
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: 'contain',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '0.4px',
  },
  brandSub: {
    fontSize: 10,
    fontWeight: 700,
    color: '#bc8f8f',
    letterSpacing: '2.5px',
  },
  tagline: {
    fontSize: 13.5,
    color: '#94a3b8',
    lineHeight: 1.5,
    maxWidth: 240,
  },
  colTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: '0.2px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 0,
    margin: 0,
  },
  link: {
    fontSize: 13.5,
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  subscribeText: {
    fontSize: 13.5,
    color: '#94a3b8',
    marginBottom: 14,
    lineHeight: 1.5,
  },
  subscribeForm: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: 24,
    padding: '3px 4px 3px 14px',
    maxWidth: 320,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    marginBottom: 20,
  },
  subscribeInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 13,
    color: '#0f172a',
    background: 'transparent',
    fontFamily: 'inherit',
  },
  subscribeBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#bc8f8f',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s ease',
  },
  socialRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  arrowRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  backToTopBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  floatingArrowBtn: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 999,
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: '#bc8f8f',
    border: 'none',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(188, 143, 143, 0.45)',
    transition: 'all 0.25s ease',
  },
  bottomDivider: {
    height: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    marginTop: 20,
    marginBottom: 14,
    width: '100%',
  },
  disclaimerContainer: {
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.025)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 6,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#94a3b8',
    margin: 0,
    textAlign: 'center',
  },
  disclaimerTag: {
    color: '#cbd5e1',
    fontWeight: 700,
    marginRight: 5,
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 2,
  },
  copyrightText: {
    fontSize: 11.5,
    color: '#64748b',
    margin: 0,
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  legalLink: {
    fontSize: 11.5,
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  legalSeparator: {
    color: '#475569',
    fontSize: 10,
  },
};
