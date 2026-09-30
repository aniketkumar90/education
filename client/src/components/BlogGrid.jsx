import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BlogCard from './BlogCard';
import { DEFAULT_BLOGS } from '../data/blogsData';

const CATEGORIES = ['All', 'University', 'Courses'];

export default function BlogGrid() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (activeCategory !== 'All') params.category = activeCategory;
        if (search) params.search = search;

        const { data } = await axios.get('/api/blogs', { params });
        if (isMounted) {
          if (data && data.blogs && data.blogs.length > 0) {
            const dbIds = new Set(data.blogs.map((b) => b.slug || b._id));
            let extraFallbacks = DEFAULT_BLOGS.filter(
              (b) => !dbIds.has(b.slug) && !dbIds.has(b._id)
            );
            if (activeCategory !== 'All') {
              const lowerCat = activeCategory.toLowerCase();
              extraFallbacks = extraFallbacks.filter(
                (b) =>
                  b.category?.toLowerCase() === lowerCat ||
                  b.tags?.some((t) => t.toLowerCase() === lowerCat) ||
                  b.title.toLowerCase().includes(lowerCat)
              );
            }
            if (search) {
              const lowerQ = search.toLowerCase();
              extraFallbacks = extraFallbacks.filter(
                (b) =>
                  b.title.toLowerCase().includes(lowerQ) ||
                  b.excerpt?.toLowerCase().includes(lowerQ)
              );
            }
            setBlogs([...data.blogs, ...extraFallbacks]);
            setPages(Math.max(data.pages || 1, Math.ceil((data.blogs.length + extraFallbacks.length) / 6)));
          } else {
            // Filter fallback default data
            filterFallback(activeCategory, search);
          }
        }
      } catch {
        // Backend not yet running or no MongoDB - use rich fallback data
        if (isMounted) {
          filterFallback(activeCategory, search);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const filterFallback = (cat, q) => {
      let filtered = [...DEFAULT_BLOGS];
      if (cat && cat !== 'All') {
        const lowerCat = cat.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.category?.toLowerCase() === lowerCat ||
            b.tags?.some((t) => t.toLowerCase() === lowerCat) ||
            b.title.toLowerCase().includes(lowerCat)
        );
      }
      if (q) {
        const lowerQ = q.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(lowerQ) ||
            b.excerpt?.toLowerCase().includes(lowerQ) ||
            b.tags?.some((t) => t.toLowerCase().includes(lowerQ))
        );
      }
      setBlogs(filtered);
      setPages(Math.max(1, Math.ceil(filtered.length / 6)));
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [page, activeCategory, search]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <section style={styles.section}>
      {/* Category filter tabs */}
      <div style={styles.filterRow}>
        <div style={styles.filterScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                style={{
                  ...styles.filterBtn,
                  ...(isActive ? styles.filterBtnActive : {}),
                }}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results note */}
      {search && (
        <p style={styles.searchNote}>
          Showing results for: <strong>"{search}"</strong>
        </p>
      )}

      {/* Grid of Cards */}
      {loading ? (
        <div className="responsive-blog-grid" style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={styles.skeletonCard}>
              <div className="skeleton" style={{ height: 195 }} />
              <div style={{ padding: '16px' }}>
                <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 20, width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📭</span>
          <h3 style={styles.emptyTitle}>No articles found</h3>
          <p style={styles.emptyText}>Try selecting "All" or a different category.</p>
          <button
            onClick={() => handleCategory('All')}
            className="btn btn-primary"
            style={{ marginTop: 14 }}
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <div className="responsive-blog-grid" style={styles.grid}>
          {blogs.map((blog, i) => (
            <BlogCard key={blog._id} blog={blog} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && !loading && (
        <div style={styles.pagination}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                ...styles.pageBtn,
                ...(p === page ? styles.pageBtnActive : {}),
              }}
            >
              {p}
            </button>
          ))}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            style={{ opacity: page === pages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

const styles = {
  section: { flex: 1 },
  filterRow: {
    marginBottom: 24,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  filterScroll: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 18px',
    borderRadius: 20,
    border: '1.5px solid #e2e8f0',
    background: '#ffffff',
    fontSize: 13,
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  filterBtnActive: {
    background: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
    fontWeight: 600,
  },
  searchNote: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 22,
    overflow: 'visible',
  },
  skeletonCard: {
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    gridColumn: '1/-1',
    background: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
  },
  emptyIcon: { fontSize: 48, display: 'block', marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 6 },
  emptyText: { fontSize: 13.5, color: '#64748b' },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 36,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1.5px solid #e2e8f0',
    background: '#ffffff',
    color: '#334155',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  pageBtnActive: {
    background: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
};
