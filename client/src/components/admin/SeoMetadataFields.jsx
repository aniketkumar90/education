export default function SeoMetadataFields({ form, onChange, onAutoSlug }) {
  const metaTitleLen = (form.metaTitle || '').length;
  const metaDescLen = (form.metaDescription || '').length;

  const previewSlug = form.slug
    ? form.slug.replace(/^\/?blog\/?/i, '')
    : form.title
    ? (() => {
        const raw = form.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const match = raw.match(/(.*?(-education))/i);
        return match ? match[1] : raw;
      })()
    : 'your-post-url';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>🎯</div>
        <div>
          <h3 style={styles.title}>SEO & Metadata Settings</h3>
          <p style={styles.subtitle}>Optimize search engine rankings, Google SERP snippet, and keywords</p>
        </div>
      </div>

      <div style={styles.body}>
        {/* Google SERP Snippet Preview Box */}
        <div style={styles.serpPreview}>
          <div style={styles.serpTop}>
            <span style={styles.serpBadge}>Google Search Preview</span>
            <span style={styles.serpUrl}>https://dleducationconnect.in › blog › {previewSlug}</span>
          </div>
          <div style={styles.serpTitle}>
            {form.metaTitle || form.title || 'Your SEO Meta Title Will Appear Here'}
          </div>
          <div style={styles.serpDesc}>
            {form.metaDescription || form.excerpt || 'Your meta description will appear here in Google search results. Keep it between 120-160 characters for maximum CTR.'}
          </div>
        </div>

        {/* Row: Focus Keyword & Slug */}
        <div style={styles.grid}>
          {/* Focus Keyword */}
          <div style={styles.field}>
            <label style={styles.label}>
              Focus Keyword <span style={styles.tip}>(Primary keyword to rank for)</span>
            </label>
            <input
              type="text"
              name="focusKeyword"
              value={form.focusKeyword}
              onChange={onChange}
              placeholder="e.g. SEO for beginners"
              style={styles.input}
            />
          </div>

          {/* Slug / URL */}
          <div style={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Slug / URL</label>
              <button
                type="button"
                onClick={onAutoSlug}
                style={styles.autoSlugBtn}
                title="Auto-generate slug from blog title"
              >
                ⚡ Auto Generate
              </button>
            </div>
            <div style={styles.slugInputWrapper}>
              <span style={styles.slugPrefix}>/blog/</span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={onChange}
                placeholder="seo-for-beginners"
                style={styles.slugInput}
              />
            </div>
          </div>
        </div>

        {/* Meta Title */}
        <div style={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={styles.label}>
              Meta Title <span style={styles.tip}>(Shown in browser tab & search results)</span>
            </label>
            <span
              style={{
                ...styles.charCounter,
                color: metaTitleLen > 65 ? 'var(--danger)' : metaTitleLen >= 40 ? 'var(--success)' : 'var(--text-muted)',
              }}
            >
              {metaTitleLen} / 70 characters {metaTitleLen >= 40 && metaTitleLen <= 65 ? '✅ Good' : ''}
            </span>
          </div>
          <input
            type="text"
            name="metaTitle"
            value={form.metaTitle}
            onChange={onChange}
            placeholder="e.g. What is SEO? Complete SEO Guide for Beginners 2026"
            maxLength={70}
            style={styles.input}
          />
        </div>

        {/* Meta Description */}
        <div style={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={styles.label}>
              Meta Description <span style={styles.tip}>(Brief summary for Google search snippet)</span>
            </label>
            <span
              style={{
                ...styles.charCounter,
                color: metaDescLen > 165 ? 'var(--danger)' : metaDescLen >= 100 ? 'var(--success)' : 'var(--text-muted)',
              }}
            >
              {metaDescLen} / 200 characters {metaDescLen >= 120 && metaDescLen <= 160 ? '✅ Ideal' : ''}
            </span>
          </div>
          <textarea
            name="metaDescription"
            value={form.metaDescription}
            onChange={onChange}
            placeholder="e.g. Learn what SEO is, how it works, and the best SEO techniques to improve your website ranking."
            rows={2}
            maxLength={200}
            style={styles.textarea}
          />
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
  tip: { fontSize: 11.5, fontWeight: 400, color: '#64748b' },
  charCounter: { fontSize: 11.5, fontWeight: 600 },
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  slugInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#ffffff',
  },
  slugPrefix: {
    padding: '0 10px',
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: 12.5,
    fontWeight: 600,
    borderRight: '1px solid var(--border)',
    height: 40,
    display: 'flex',
    alignItems: 'center',
  },
  slugInput: {
    flex: 1,
    height: 40,
    padding: '0 12px',
    border: 'none',
    outline: 'none',
    fontSize: 13,
    color: 'var(--text)',
  },
  autoSlugBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
  },
  serpPreview: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  serpTop: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  serpBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: 'uppercase',
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '2px 6px',
    borderRadius: 4,
  },
  serpUrl: { fontSize: 12, color: '#16a34a', wordBreak: 'break-all' },
  serpTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1a0dab',
    lineHeight: 1.3,
    cursor: 'pointer',
  },
  serpDesc: { fontSize: 12.5, color: '#4d5156', lineHeight: 1.4 },
};
