export default function AdminQuickActions({ onAddPost, onViewInquiries, onManageBlogs }) {
  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <h3 style={styles.title}>Quick Actions</h3>
        <p style={styles.desc}>
          Quickly create new SEO blog posts, inspect student application leads, or update categories
        </p>
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          onClick={onAddPost}
          style={styles.primaryBtn}
        >
          <span style={{ fontSize: 16 }}>+</span>
          <span>Add New Post</span>
        </button>

        <button
          type="button"
          onClick={onManageBlogs}
          style={styles.secondaryBtn}
        >
          <span>📑 Manage Articles</span>
        </button>

        <button
          type="button"
          onClick={onViewInquiries}
          style={styles.outlineBtn}
        >
          <span>View Inquiries</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  desc: {
    fontSize: 12.5,
    color: '#64748b',
    margin: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryBtn: {
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
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#d97706',
    color: '#ffffff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  outlineBtn: {
    padding: '8px 18px',
    background: '#ffffff',
    color: '#334155',
    border: '1.5px solid #cbd5e1',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
