export default function GeneralInfoFields({ form, onChange, categories }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>📌</div>
        <div>
          <h3 style={styles.title}>General Information</h3>
          <p style={styles.subtitle}>Core details about the article and publication</p>
        </div>
      </div>

      <div style={styles.body}>
        {/* Blog Title */}
        <div style={styles.field}>
          <label style={styles.label}>
            Blog Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="e.g. What is SEO? Complete Guide for Beginners"
            required
            style={styles.input}
          />
        </div>

        {/* Row: Category, Author, Publish Date, Status */}
        <div style={styles.grid}>
          {/* Category */}
          <div style={styles.field}>
            <label style={styles.label}>
              Category <span style={styles.required}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="e.g. SEO Basics, University, Courses"
                list="category-suggestions"
                required
                style={styles.input}
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Author */}
          <div style={styles.field}>
            <label style={styles.label}>Author Name</label>
            <input
              type="text"
              name="authorName"
              value={form.authorName}
              onChange={onChange}
              placeholder="e.g. Aniket Kumar"
              style={styles.input}
            />
          </div>

          {/* Publish Date */}
          <div style={styles.field}>
            <label style={styles.label}>Publish Date</label>
            <input
              type="date"
              name="publishDate"
              value={form.publishDate}
              onChange={onChange}
              style={styles.input}
            />
          </div>

          {/* Status */}
          <div style={styles.field}>
            <label style={styles.label}>Post Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              style={styles.select}
            >
              <option value="Published">🟢 Published (Live on site)</option>
              <option value="Draft">🟡 Draft (Hidden from public)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid var(--border)',
  },
  icon: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 },
  subtitle: { fontSize: 12.5, color: 'var(--text-muted)', margin: '2px 0 0 0' },
  body: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  required: { color: 'var(--danger)' },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    background: '#ffffff',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    background: '#ffffff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
};
