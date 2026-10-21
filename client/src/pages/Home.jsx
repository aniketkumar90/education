import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import ExploreCategories from '../components/ExploreCategories';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  useEffect(() => {
    let isMounted = true;

    const fetchLatestBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { limit: 6, page: 1 };
        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory;
        }

        const { data } = await axios.get('/api/blogs', { params });
        if (isMounted) {
          const list = Array.isArray(data?.blogs) ? data.blogs.filter(Boolean) : [];
          setBlogs(list);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading latest blogs:', err);
          setError(err.response?.data?.message || err.message || 'Failed to load latest blogs.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLatestBlogs();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleCategorySelect = (categoryKey) => {
    setActiveCategory((prev) => (prev === categoryKey ? 'All' : categoryKey));
    const section = document.getElementById('latest-blogs-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.page}>
      {/* ── 1. Hero Section ──────────────────────────── */}
      <Hero />

      {/* ── 2. Explore Categories ─────────────────────── */}
      <ExploreCategories
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* ── 3. Latest Blogs Section ───────────────────── */}
      <section id="latest-blogs-section" style={styles.blogsSection}>
        <div className="container">
          {/* Section Header */}
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.accentDash} />
              <h2 style={styles.sectionTitle}>Latest Blogs</h2>
              <p style={styles.sectionSub}>
                Stay updated with the latest articles, tips and guides from our experts.
                {activeCategory !== 'All' && (
                  <span style={styles.filterNotice}>
                    {' '}• Filtered by: <strong>{activeCategory}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setActiveCategory('All')}
                      style={styles.clearFilterBtn}
                    >
                      (Clear)
                    </button>
                  </span>
                )}
              </p>
            </div>

            {/* View All Blogs Link */}
            <Link to="/blogs" style={styles.viewAllLink} className="view-all-link">
              <span>View All Blogs</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          {/* Grid of Real Blogs / Skeletons / Fallback */}
          {loading ? (
            <div style={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div className="skeleton" style={{ height: 195 }} />
                  <div style={{ padding: '18px 20px' }}>
                    <div className="skeleton" style={{ height: 18, width: '35%', marginBottom: 12, borderRadius: 12 }} />
                    <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 20, width: '75%', marginBottom: 14 }} />
                    <div className="skeleton" style={{ height: 14, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 14, width: '85%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={styles.emptyCard}>
              <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>
                Could not connect to database: {error}
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="btn btn-primary"
                style={{ marginTop: 10 }}
              >
                Retry
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3 style={{ fontSize: 18, color: '#0e233d', marginBottom: 6 }}>No articles found</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 14 }}>
                No published articles matched the selected category.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                style={styles.showAllBtn}
              >
                Show All Blogs
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {blogs.map((blog, idx) => (
                <BlogCard key={blog._id || blog.slug || idx} blog={blog} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
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
  blogsSection: {
    padding: '16px 0 72px',
    background: '#ffffff',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  accentDash: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1d68e1',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0e233d',
    letterSpacing: '-0.4px',
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 14.5,
    color: '#64748b',
    lineHeight: 1.5,
  },
  filterNotice: {
    color: '#1d68e1',
  },
  clearFilterBtn: {
    background: 'none',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'underline',
    padding: 0,
    marginLeft: 4,
  },
  viewAllLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#1d68e1',
    fontWeight: 700,
    fontSize: 14.5,
    textDecoration: 'none',
    transition: 'transform 0.15s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 24,
  },
  skeletonCard: {
    background: '#ffffff',
    borderRadius: 14,
    border: '1px solid #e9edf3',
    overflow: 'hidden',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '48px 24px',
    background: '#f8fafc',
    borderRadius: 14,
    border: '1px solid #e2e8f0',
  },
  showAllBtn: {
    background: '#1d68e1',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
