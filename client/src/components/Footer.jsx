import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

          {/* Column 2: Quick Links */}
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
                <Link to="/blogs?category=Admission" style={styles.link}>Admission Guides</Link>
              </li>
              <li>
                <Link to="/blogs" style={styles.link}>Blog</Link>
              </li>
              <li>
                <a href="#about" style={styles.link}>About Us</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h4 style={styles.colTitle}>Useful Links</h4>
            <ul style={styles.linkList}>
              <li>
                <a href="#about" style={styles.link}>Privacy Policy</a>
              </li>
              <li>
                <a href="#about" style={styles.link}>Terms &amp; Conditions</a>
              </li>
              <li>
                <a href="#about" style={styles.link}>Contact Us</a>
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

            {/* Social Icons Row */}
            <div style={styles.socialRow}>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="Facebook">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="X (Twitter)">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="Instagram">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="YouTube">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="LinkedIn">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────── */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © 2026 DL Education Connect. All rights reserved.
          </p>

          {/* Scroll to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            style={styles.backToTopBtn}
            aria-label="Back to top"
            title="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0a192f',
    color: '#94a3b8',
    paddingTop: 56,
    paddingBottom: 24,
    marginTop: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr 1.3fr',
    gap: 40,
    paddingBottom: 48,
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
    color: '#38bdf8',
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
    background: '#1d68e1',
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
  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  copyright: {
    fontSize: 13,
    color: '#64748b',
  },
  backToTopBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
