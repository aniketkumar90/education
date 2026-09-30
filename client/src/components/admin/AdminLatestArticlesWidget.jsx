import { Link } from 'react-router-dom';
import { getImageUrl } from '../../api/api';

export default function AdminLatestArticlesWidget({ blogs = [], onManage, onEditBlog }) {
  const displayBlogs = blogs.slice(0, 4);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Latest Articles</h3>
        {onManage && (
          <button type="button" onClick={onManage} style={styles.manageBtn}>
            Manage ({blogs.length}) →
          </button>
        )}
      </div>

      <div style={styles.list}>
        {displayBlogs.length === 0 ? (
          <div style={styles.empty}>No articles created yet.</div>
        ) : (
          displayBlogs.map((b) => {
            const imgSrc = getImageUrl(b.coverImage);

            return (
              <div key={b._id} style={styles.item}>
                <div style={styles.thumbWrap}>
                  <img src={imgSrc} alt={b.title} style={styles.thumb} />
                </div>
                <div style={styles.info}>
                  <span style={styles.catBadge}>
                    {(b.category || 'University').toUpperCase()}
                  </span>
                  <Link to={`/blog/${b.slug || b._id}`} style={styles.blogTitle}>
                    {b.title}
                  </Link>
                  <div style={styles.metaRow}>
                    <span style={styles.meta}>
                      {b.views || 0} views • {b.status || 'Published'}
                    </span>
                  </div>
                </div>
                {onEditBlog && (
                  <button
                    type="button"
                    onClick={() => onEditBlog(b)}
                    style={styles.editBtn}
                    title="Edit article"
                  >
                    ✏️
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '20px 22px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    flex: 1,
    minWidth: 280,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  manageBtn: {
    background: 'none',
    border: 'none',
    color: '#d97706',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px',
    borderRadius: 8,
    border: '1px solid #f1f5f9',
    transition: 'background 0.15s ease',
  },
  thumbWrap: {
    width: 62,
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#e2e8f0',
  },
  thumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  catBadge: {
    fontSize: 9.5,
    fontWeight: 800,
    color: '#d97706',
    letterSpacing: 0.5,
  },
  blogTitle: {
    fontSize: 12.5,
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: 13,
    color: '#64748b',
    borderRadius: 4,
  },
  empty: {
    fontSize: 13,
    color: '#94a3b8',
    padding: '20px 0',
    textAlign: 'center',
  },
};
