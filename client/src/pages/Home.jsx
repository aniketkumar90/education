import Hero from '../components/Hero';
import BlogGrid from '../components/BlogGrid';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <>
      <Hero />
      <main style={styles.main}>
        <div className="container main-two-col">
          {/* Blog articles grid */}
          <div style={styles.gridArea}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Latest Articles</h2>
              <p style={styles.sectionSub}>Stay up to date with the latest in education technology</p>
            </div>
            <BlogGrid />
          </div>

          {/* Sidebar */}
          <div className="sidebar-area" style={styles.sidebarArea}>
            <Sidebar />
          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: { padding: '48px 0 64px', background: 'var(--bg-secondary)', flex: 1 },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 40,
    alignItems: 'start',
  },
  gridArea: {},
  sidebarArea: {
    position: 'sticky', top: 'calc(var(--nav-height) + 24px)',
  },
  sectionHeader: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 26, fontWeight: 800,
    color: 'var(--text)', letterSpacing: '-0.5px',
    marginBottom: 6,
  },
  sectionSub: { fontSize: 14, color: 'var(--text-muted)' },
};
