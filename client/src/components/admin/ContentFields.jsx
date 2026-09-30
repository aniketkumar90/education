export default function ContentFields({ form, onChange, onInsertContent }) {
  const tagsList = form.tags
    ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const addSnippet = (snippet) => {
    if (onInsertContent) {
      onInsertContent(snippet);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>✍️</div>
        <div>
          <h3 style={styles.title}>Article Content & Excerpt</h3>
          <p style={styles.subtitle}>Write your full educational article, quick excerpt, and tags</p>
        </div>
      </div>

      <div style={styles.body}>
        {/* Short Description / Excerpt */}
        <div style={styles.field}>
          <label style={styles.label}>
            Short Description / Excerpt <span style={styles.required}>*</span>
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={onChange}
            placeholder="e.g. A beginner-friendly guide to understanding SEO and search engine rankings."
            rows={2}
            required
            style={styles.textarea}
          />
        </div>

        {/* Blog Content */}
        <div style={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <label style={styles.label}>
              Blog Content <span style={styles.required}>*</span>
            </label>
            {/* Quick HTML/Markdown formatting toolbar */}
            <div style={styles.toolbar}>
              <button type="button" onClick={() => addSnippet('<h2>Subheading H2</h2>\n')} style={styles.toolBtn}>H2</button>
              <button type="button" onClick={() => addSnippet('<h3>Subheading H3</h3>\n')} style={styles.toolBtn}>H3</button>
              <button type="button" onClick={() => addSnippet('<strong>Bold Text</strong>')} style={styles.toolBtn}>B</button>
              <button type="button" onClick={() => addSnippet('<ul>\n  <li>Point 1</li>\n  <li>Point 2</li>\n</ul>\n')} style={styles.toolBtn}>• List</button>
              <button type="button" onClick={() => addSnippet('<p>Paragraph text here...</p>\n')} style={styles.toolBtn}>P</button>
            </div>
          </div>
          <textarea
            name="content"
            value={form.content}
            onChange={onChange}
            placeholder="Write complete article or paste HTML/Markdown content here..."
            required
            rows={14}
            style={styles.contentArea}
          />
        </div>

        {/* Tags */}
        <div style={styles.field}>
          <label style={styles.label}>
            Tags <span style={styles.tip}>(Comma-separated, e.g. SEO, Digital Marketing, Google Ranking)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="SEO, Digital Marketing, Google Ranking..."
            style={styles.input}
          />
          {tagsList.length > 0 && (
            <div style={styles.tagsRow}>
              {tagsList.map((tag) => (
                <span key={tag} style={styles.tagChip}>#{tag}</span>
              ))}
            </div>
          )}
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
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  required: { color: 'var(--danger)' },
  tip: { fontSize: 11.5, fontWeight: 400, color: '#64748b' },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    background: '#ffffff',
    resize: 'vertical',
  },
  contentArea: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: 'Consolas, Monaco, monospace, var(--font)',
    lineHeight: 1.6,
    outline: 'none',
    color: 'var(--text)',
    background: '#ffffff',
    resize: 'vertical',
    minHeight: 260,
  },
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
  },
  toolbar: { display: 'flex', gap: 6, alignItems: 'center' },
  toolBtn: {
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid var(--border)',
    background: '#f8fafc',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#475569',
  },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tagChip: {
    padding: '3px 10px',
    borderRadius: 20,
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: 11.5,
    fontWeight: 600,
  },
};
