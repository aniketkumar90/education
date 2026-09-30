import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';

const formatDate = (dateStr) => {
  if (!dateStr) return 'September 10, 2026';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function BlogCard({ blog, index = 0 }) {
  const dateFormatted = formatDate(blog.publishDate || blog.createdAt);
  
  // Extract cover image URL safely using centralized resolver
  const coverUrl = getImageUrl(blog.coverImage);

  const bannerData = typeof blog.coverImage === 'object' && blog.coverImage ? blog.coverImage : {};
  const blogLink = `/blog/${blog.slug || blog._id}`;

  return (
    <article
      className="animate-fadeUp"
      style={{ ...styles.card, animationDelay: `${index * 0.06}s` }}
    >
      {/* ── 1. Thumbnail Banner ─────────────────────────── */}
      <Link to={blogLink} style={styles.thumbLink}>
        <div style={styles.bannerWrap}>
          {/* Background image */}
          <img
            src={coverUrl}
            alt={blog.imageAlt || blog.title}
            style={styles.bannerImg}
            loading="lazy"
          />

          {/* Dark gradient overlay for text readability */}
          <div style={styles.bannerOverlay} />

          {/* Top-left branding badge */}
          <div style={styles.brandBadge}>
            <span style={styles.brandIcon}>🎓</span>
            <span style={styles.brandText}>{bannerData.tag || 'Education iConnect'}</span>
          </div>

          {/* Banner text overlay */}
          <div style={styles.bannerContent}>
            <div style={styles.bannerTitle}>
              {bannerData.badgeTitle || (blog.title ? blog.title.split('|')[0] : '')}
            </div>
            {bannerData.subtitle && (
              <div style={styles.bannerSub}>{bannerData.subtitle}</div>
            )}
            {bannerData.details && (
              <div style={styles.bannerDetails}>{bannerData.details}</div>
            )}
            <div style={styles.applyBadge}>APPLY NOW 👉</div>
          </div>
        </div>
      </Link>

      {/* ── 2. Overlapping Circular Avatar ──────────────── */}
      <div style={styles.avatarRow}>
        <div style={styles.avatarCircle}>
          {blog.author?.avatar ? (
            <img src={blog.author.avatar} alt={blog.authorName || blog.author?.name} style={styles.avatarPhoto} />
          ) : (
            <svg viewBox="0 0 24 24" fill="#9ca3af" width="26" height="26">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
      </div>

      {/* ── 3. Blog Title ───────────────────────────────── */}
      <div style={styles.titleWrap}>
        <h3 style={styles.title}>
          <Link to={blogLink} style={styles.titleLink}>
            {blog.title}
          </Link>
        </h3>
      </div>

      {/* ── 4. Bottom Meta: IT • Date in red/burgundy ───── */}
      <div style={styles.metaRow}>
        <span style={styles.catText}>{blog.category || 'IT'}</span>
        <span style={styles.dot}>•</span>
        <span style={styles.dateText}>{dateFormatted}</span>
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 8,
    overflow: 'visible',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    position: 'relative',
    height: '100%',
  },

  /* Thumbnail Banner */
  thumbLink: {
    display: 'block',
    textDecoration: 'none',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  bannerWrap: {
    position: 'relative',
    height: 195,
    overflow: 'hidden',
    background: '#1e293b',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    filter: 'brightness(0.92)',
    transition: 'transform 0.4s ease',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.78) 100%)',
    zIndex: 1,
  },
  brandBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    color: '#1e293b',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  brandIcon: {
    fontSize: 11,
  },
  brandText: {
    letterSpacing: '0.2px',
  },
  bannerContent: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 2,
    color: '#ffffff',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.25,
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  bannerSub: {
    fontSize: 10.5,
    fontWeight: 600,
    color: '#38bdf8',
    marginTop: 2,
    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
  },
  bannerDetails: {
    fontSize: 9.5,
    color: '#cbd5e1',
    marginTop: 2,
    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
  },
  applyBadge: {
    display: 'inline-block',
    marginTop: 6,
    background: '#dc2626',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 800,
    padding: '2px 6px',
    borderRadius: 3,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },

  /* Overlapping Avatar */
  avatarRow: {
    position: 'relative',
    paddingLeft: 16,
    marginTop: -20,
    zIndex: 3,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#ffffff',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.16)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  avatarPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  /* Title area */
  titleWrap: {
    padding: '10px 16px 14px',
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.42,
    color: '#111827',
    margin: 0,
  },
  titleLink: {
    color: '#111827',
    textDecoration: 'none',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    transition: 'color 0.15s ease',
  },

  /* Meta line at bottom: IT • September 10, 2026 */
  metaRow: {
    borderTop: '1px solid #f1f5f9',
    padding: '9px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 'auto',
  },
  catText: {
    color: '#b91c1c',
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '0.2px',
    textTransform: 'uppercase',
  },
  dot: {
    color: '#b91c1c',
    fontSize: 11,
    margin: '0 1px',
  },
  dateText: {
    color: '#b91c1c',
    fontSize: 11.5,
    fontWeight: 500,
  },
};
