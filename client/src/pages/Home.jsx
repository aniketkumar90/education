import { useEffect } from 'react';
import Hero from '../components/Hero';
import BlogGrid from '../components/BlogGrid';
import Sidebar from '../components/Sidebar';

export default function Home() {
  useEffect(() => {
    document.title = 'DLEducationConnect - Distance Education, Online Courses & Admission Guides 2026';
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://dleducationconnect.in/');
  }, []);

  return (
    <div style={styles.page}>
      {/* ── 1. Hero Section (Home banner jo abhi hai vhi rahega) ─── */}
      <Hero />

      {/* ── 2. Blog Grid + Sidebar (Clean 2-column layout with categories & pagination) ─── */}
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
  page: {
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  main: {
    background: '#ffffff',
    padding: '44px 0 80px',
  },
  sidebarWrap: {
    position: 'sticky',
    top: 'calc(var(--nav-height) + 24px)',
  },
};
