import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Oct 5, 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Map categories to screenshot badge styling
const getCategoryStyle = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('distance')) {
    return { bg: '#e0f2fe', color: '#0369a1', label: category || 'Distance Education' };
  }
  if (cat.includes('university')) {
    return { bg: '#f3e8ff', color: '#7e22ce', label: category || 'University Guides' };
  }
  if (cat.includes('admission')) {
    return { bg: '#fef3c7', color: '#b45309', label: category || 'Admission News' };
  }
  if (cat.includes('course') || cat.includes('online')) {
    return { bg: '#dcfce7', color: '#15803d', label: category || 'Online Courses' };
  }
  if (cat.includes('career')) {
    return { bg: '#ffe4e6', color: '#be123c', label: category || 'Career Guidance' };
  }
  if (cat.includes('study')) {
    return { bg: '#e0f2fe', color: '#0284c7', label: category || 'Study Tips' };
  }
  return { bg: '#eff6ff', color: '#1d4ed8', label: category || 'Education' };
};

// Calculate estimate reading time
const getReadTime = (blog) => {
  if (blog.readTime) return blog.readTime;
  const wordCount = (blog.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(4, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// Extract clean excerpt text
const getExcerpt = (blog) => {
  if (blog.excerpt && blog.excerpt.trim()) return blog.excerpt;
  const clean = (blog.content || '').replace(/<[^>]*>/g, '').trim();
  if (!clean) return 'Get expert tips and verified guidance on admission, eligibility criteria, and career scope.';
  return clean.slice(0, 140) + (clean.length > 140 ? '...' : '');
};

export default function BlogCard({ blog, index = 0 }) {
  if (!blog) return null;

  const pubDate = blog.publishDate || blog.createdAt;
  const coverUrl = getImageUrl(blog.coverImage);
  const blogLink = `/blog/${blog.slug || blog._id}`;
  const catStyle = getCategoryStyle(blog.category);
  const readTime = getReadTime(blog);
  const excerpt = getExcerpt(blog);
  const dateFormatted = formatDate(pubDate);

  return (
    <article className="modern-blog-card" style={styles.card}>
      {/* ── 1. Thumbnail Image ───────────────────────── */}
      <Link to={blogLink} style={styles.imageLink} aria-label={blog.title}>
        <div style={styles.imageWrap}>
          <img
            src={coverUrl}
            alt={blog.imageAlt || blog.title}
            style={styles.cardImg}
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </div>
      </Link>

      {/* ── 2. Card Content Body ────────────────────── */}
      <div style={styles.body}>
        {/* Category Pill Tag */}
        <div style={styles.categoryRow}>
          <span
            style={{
              ...styles.catBadge,
              backgroundColor: catStyle.bg,
              color: catStyle.color,
            }}
          >
            {catStyle.label}
          </span>
        </div>

        {/* Blog Title */}
        <h3 style={styles.titleWrap}>
          <Link to={blogLink} className="blog-title-link" style={styles.title}>
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p style={styles.excerpt}>{excerpt}</p>

        {/* ── 3. Footer Meta Row ──────────────────────── */}
        <div style={styles.footer}>
          <div style={styles.metaLeft}>
            {/* Calendar & Date */}
            <span style={styles.metaItem}>
              <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{dateFormatted}</span>
            </span>

            {/* Clock & Read Time */}
            <span style={styles.metaItem}>
              <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{readTime}</span>
            </span>
          </div>

          {/* Blue Arrow on Right */}
          <Link to={blogLink} style={styles.arrowLink} aria-label="Read article">
            <svg
              className="blog-card-arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d68e1"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e9edf3',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
    transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
    height: '100%',
  },
  imageLink: {
    display: 'block',
    textDecoration: 'none',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 195,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  },
  body: {
    padding: '18px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  categoryRow: {
    marginBottom: 10,
  },
  catBadge: {
    display: 'inline-block',
    padding: '3.5px 11px',
    borderRadius: 16,
    fontSize: 11.5,
    fontWeight: 600,
    letterSpacing: '0.2px',
    lineHeight: 1.3,
  },
  titleWrap: {
    margin: '0 0 8px 0',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0e233d',
    lineHeight: 1.38,
    textDecoration: 'none',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    transition: 'color 0.15s ease',
  },
  excerpt: {
    fontSize: 13.5,
    lineHeight: 1.55,
    color: '#64748b',
    margin: '0 0 16px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
  },
  arrowLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
  },
};
