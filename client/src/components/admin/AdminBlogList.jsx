import { Link } from 'react-router-dom';

export default function AdminBlogList({ blogs, loading, onAddNewPost, onDeleteBlog, onToggleStatus, onEditBlog }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>All Articles & Blog Posts ({blogs.length})</h2>
          <p style={styles.subtitle}>
            Manage, edit, inspect SEO performance, or publish new education posts
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNewPost}
          style={styles.addBtn}
        >
          <span>+</span>
          <span>Add New Post</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 10 }} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>📝</span>
          <p style={{ fontWeight: 600, color: '#334155', margin: '8px 0' }}>No blogs created yet</p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            Create your first SEO Education post using our 14-field form!
          </p>
          <button type="button" onClick={onAddNewPost} style={styles.addBtn}>
            Create First Blog
          </button>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={{ ...styles.th, width: '40%' }}>TITLE & SEO DETAILS</th>
                <th style={styles.th}>CATEGORY</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>VIEWS</th>
                <th style={styles.th}>DATE</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} style={styles.tr}>
                  <td style={styles.td}>
                    <Link to={`/blog/${blog.slug || blog._id}`} style={styles.titleLink}>
                      {blog.title}
                    </Link>
                    <div style={styles.badgeRow}>
                      {blog.focusKeyword && (
                        <span style={styles.keywordBadge}>
                          🎯 {blog.focusKeyword}
                        </span>
                      )}
                      {blog.slug && (
                        <span style={styles.slugBadge}>
                          /{blog.slug}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.catBadge}>{blog.category}</span>
                  </td>
                  <td style={styles.td}>
                    <button
                      type="button"
                      onClick={() => onToggleStatus && onToggleStatus(blog)}
                      title="Click to toggle Published / Draft"
                      style={{
                        ...styles.statusBadge,
                        ...(blog.status === 'Draft' ? styles.statusDraft : styles.statusPublished),
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {blog.status === 'Draft' ? '🟡 Draft' : '🟢 Published'}
                    </button>
                  </td>
                  <td style={{ ...styles.td, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                    {blog.views || 0}
                  </td>
                  <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>
                    {new Date(blog.publishDate || blog.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actionGroup}>
                      {blog.status === 'Draft' && onToggleStatus && (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(blog)}
                          style={styles.publishQuickBtn}
                          title="Publish this blog to Home Page"
                        >
                          🚀 Publish
                        </button>
                      )}
                      <Link to={`/blog/${blog.slug || blog._id}`} style={styles.viewBtn}>
                        View
                      </Link>
                      {onEditBlog && (
                        <button
                          type="button"
                          onClick={() => onEditBlog(blog)}
                          style={styles.editBtn}
                          title="Edit this blog post"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteBlog(blog._id)}
                        style={styles.delBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '24px 28px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tableWrap: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  },
  table: {
    width: '100%',
    minWidth: 650,
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '2px solid #f1f5f9',
  },
  th: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: 0.6,
    padding: '12px 14px 12px 0',
  },
  tr: {
    borderBottom: '1px solid #f8fafc',
    transition: 'background 0.12s ease',
  },
  td: {
    padding: '16px 14px 16px 0',
    verticalAlign: 'middle',
  },
  titleLink: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 4,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  keywordBadge: {
    fontSize: 11,
    fontWeight: 600,
    background: '#fef3c7',
    color: '#92400e',
    padding: '1px 7px',
    borderRadius: 4,
  },
  slugBadge: {
    fontSize: 11,
    fontFamily: 'monospace',
    background: '#f1f5f9',
    color: '#475569',
    padding: '1px 7px',
    borderRadius: 4,
  },
  catBadge: {
    display: 'inline-block',
    fontSize: 11.5,
    fontWeight: 600,
    background: '#eff6ff',
    color: '#2563eb',
    padding: '3px 10px',
    borderRadius: 20,
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
  },
  statusPublished: {
    background: '#dcfce7',
    color: '#15803d',
  },
  statusDraft: {
    background: '#fef3c7',
    color: '#b45309',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  publishQuickBtn: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    border: 'none',
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
  },
  viewBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: '#2563eb',
    background: '#eff6ff',
    padding: '5px 12px',
    borderRadius: 6,
    textDecoration: 'none',
  },
  editBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0f172a',
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  delBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: '#dc2626',
    background: '#fef2f2',
    border: 'none',
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
};
