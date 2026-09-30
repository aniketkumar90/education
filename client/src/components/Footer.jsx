import { Link } from 'react-router-dom';

const QUICK_LINKS = ['Home', 'Blogs'];
const CATEGORIES = ['University', 'Courses'];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.brand}>
            <Link to="/" style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={styles.logoText}>DLEducation<span style={{ color: 'var(--primary)' }}>Connect</span></span>
            </Link>
            <p style={styles.desc}>
              A fast, SEO-optimized platform for education blogs covering MERN stack, Next.js, 
              databases, UI/UX and more.
            </p>
            <div style={styles.socials}>
              {[
                { href: '#', label: 'Twitter', icon: 'X' },
                { href: '#', label: 'GitHub', icon: 'G' },
                { href: '#', label: 'LinkedIn', icon: 'in' },
              ].map(({ href, label, icon }) => (
                <a key={label} href={href} style={styles.social} aria-label={label}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              {QUICK_LINKS.map((name) => (
                <li key={name}>
                  <Link to={`/${name.toLowerCase() === 'home' ? '' : name.toLowerCase()}`} style={styles.link}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={styles.colTitle}>Categories</h4>
            <ul style={styles.linkList}>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to={`/blogs?category=${cat}`} style={styles.link}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={styles.colTitle}>Contact</h4>
            <ul style={styles.contactList}>
              <li style={styles.contactItem}>📧 hello@dleducation.com</li>
              <li style={styles.contactItem}>📍 New Delhi, India</li>
              <li style={styles.contactItem}>🕐 Mon – Fri, 9am – 6pm IST</li>
            </ul>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copy}>© {new Date().getFullYear()} DLEducationConnect. All rights reserved.</p>
          <div style={styles.bottomLinks}>
            <a href="#" style={styles.bottomLink}>Privacy Policy</a>
            <a href="#" style={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0f172a',
    color: '#94a3b8',
    marginTop: 'auto',
    paddingTop: 60,
    paddingBottom: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 40,
    paddingBottom: 48,
  },
  brand: { gridColumn: '1 / 2' },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', marginBottom: 14,
  },
  logoIcon: {
    width: 30, height: 30,
    background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
    borderRadius: 7,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  desc: { fontSize: 13.5, lineHeight: 1.7, color: '#64748b', maxWidth: 260 },
  socials: { display: 'flex', gap: 10, marginTop: 18 },
  social: {
    width: 34, height: 34,
    background: '#1e293b',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#94a3b8', textDecoration: 'none',
    fontSize: 12, fontWeight: 700,
    transition: 'all 0.2s ease',
    border: '1px solid #334155',
  },
  colTitle: {
    fontSize: 13, fontWeight: 700,
    color: '#f1f5f9', letterSpacing: '0.5px',
    textTransform: 'uppercase', marginBottom: 16,
  },
  linkList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  link: {
    fontSize: 13.5, color: '#64748b',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  contactList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  contactItem: { fontSize: 13.5, color: '#64748b', lineHeight: 1.5 },
  bottom: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
    borderTop: '1px solid #1e293b',
    paddingTop: 20, paddingBottom: 24,
  },
  copy: { fontSize: 13, color: '#475569' },
  bottomLinks: { display: 'flex', gap: 20 },
  bottomLink: { fontSize: 13, color: '#475569', textDecoration: 'none' },
};
