import BlogGrid from '../components/BlogGrid';
import Sidebar from '../components/Sidebar';

export default function Blogs() {
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div className="container">
          <h1 style={styles.title}>All Articles</h1>
          <p style={styles.sub}>Explore all education blogs, tutorials, and guides</p>
        </div>
      </div>
      <main style={styles.main}>
        <div className="container main-two-col">
          <div>
            <BlogGrid />
          </div>
          <div className="sidebar-area" style={styles.sidebarWrap}>
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { flex: 1 },
  pageHeader: {
    background: 'linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)',
    padding: '52px 0 48px',
  },
  title: { fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  main: { background: 'var(--bg-secondary)', padding: '48px 0 80px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' },
  sidebarWrap: { position: 'sticky', top: 'calc(var(--nav-height) + 24px)' },
};
