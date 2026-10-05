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
              <img
                src="/logo-512.png"
                alt="DLEducationConnect Logo"
                width={32}
                height={32}
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
              <span style={styles.logoText}>DLEducation<span style={{ color: 'var(--primary)' }}>Connect</span></span>
            </Link>
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
