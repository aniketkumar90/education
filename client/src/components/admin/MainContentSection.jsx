import { useState, useRef, useEffect } from 'react';
import RichContentEditor from './RichContentEditor';

export default function MainContentSection({
  form,
  onChange,
  onAutoSlug,
  onInsertContent,
}) {
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const cleanSlug = form.slug
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
    : 'url-slug';

  const tagsList = form.tags
    ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const addSnippet = (snippet) => {
    if (onInsertContent) {
      onInsertContent(snippet);
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. Top Box: Auto Generate URL bar + Blog Title */}
      <div style={styles.card}>
        {/* URL Bar matching the sketch: "Auto generate url   edit" */}
        <div className="admin-url-bar" style={styles.urlBar}>
          <div className="admin-url-display" style={styles.urlDisplay}>
            <span style={styles.urlLabel}>🌐 Permalink:</span>
            <span style={styles.urlDomain}>https://dleducationconnect.in/blog/</span>
            {isEditingSlug ? (
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={onChange}
                placeholder="custom-slug"
                style={styles.inlineSlugInput}
                autoFocus
              />
            ) : (
              <span style={styles.urlSlug}>{cleanSlug}</span>
            )}
          </div>

          <div className="admin-url-actions" style={styles.urlActions}>
            <button
              type="button"
              onClick={onAutoSlug}
              style={styles.urlBtn}
              title="Auto generate URL from title"
            >
              ⚡ Auto generate url
            </button>
            <button
              type="button"
              onClick={() => setIsEditingSlug(!isEditingSlug)}
              style={styles.urlEditBtn}
            >
              {isEditingSlug ? '✓ Done' : '✏️ edit'}
            </button>
          </div>
        </div>

        {/* Blog Title Input */}
        <div style={styles.titleWrap}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Blog title..."
            required
            style={styles.titleInput}
          />
        </div>
      </div>

      {/* 2. Middle Box: Blog Content with Floating Selection Toolbar */}
      <div style={styles.card}>
        <RichContentEditor
          value={form.content}
          onChange={onChange}
        />
      </div>

      {/* 3. Short Description / Excerpt & Tags */}
      <div style={styles.card}>
        <div style={styles.excerptWrap}>
          <label style={styles.fieldLabel}>
            Short Description / Excerpt <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={onChange}
            placeholder="A brief beginner-friendly summary of the article..."
            rows={2}
            required
            style={styles.excerptInput}
          />
        </div>

        <div style={styles.tagsWrap}>
          <label style={styles.fieldLabel}>
            Tags <span style={{ fontSize: 11.5, color: '#64748b' }}>(comma-separated)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="SEO, Digital Marketing, Google Ranking..."
            style={styles.tagInput}
          />
          {tagsList.length > 0 && (
            <div style={styles.tagRow}>
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
  container: { display: 'flex', flexDirection: 'column', gap: 18 },
  card: {
    background: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  urlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#f8fafc',
    borderBottom: '1px solid var(--border)',
    fontSize: 12.5,
    flexWrap: 'wrap',
    gap: 8,
  },
  urlDisplay: { display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  urlLabel: { fontWeight: 600, color: '#475569' },
  urlDomain: { color: '#64748b' },
  urlSlug: { fontWeight: 700, color: 'var(--primary)' },
  inlineSlugInput: {
    padding: '2px 8px',
    borderRadius: 4,
    border: '1.5px solid var(--primary)',
    fontSize: 12.5,
    fontFamily: 'monospace',
    outline: 'none',
  },
  urlActions: { display: 'flex', gap: 8, alignItems: 'center' },
  urlBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
  },
  urlEditBtn: {
    background: '#e0e7ff',
    border: 'none',
    color: '#3730a3',
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    padding: '3px 10px',
    borderRadius: 4,
  },
  titleWrap: { padding: '16px' },
  titleInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f8fafc',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: 8,
  },
  contentLabel: { fontSize: 14, fontWeight: 700, color: '#1e293b' },
  toolbar: { display: 'flex', gap: 6 },
  toolBtn: {
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid var(--border)',
    background: '#ffffff',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#475569',
  },
  contentTextarea: {
    width: '100%',
    padding: '16px',
    border: 'none',
    outline: 'none',
    fontSize: 14,
    fontFamily: 'var(--font)',
    lineHeight: 1.65,
    color: 'var(--text)',
    minHeight: 340,
    resize: 'none',
    overflowY: 'hidden',
    boxSizing: 'border-box',
    transition: 'height 0.08s ease',
  },
  excerptWrap: { padding: '16px', borderBottom: '1px solid var(--border)' },
  tagsWrap: { padding: '16px' },
  fieldLabel: { fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 },
  excerptInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  tagInput: {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    boxSizing: 'border-box',
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tagChip: {
    padding: '3px 10px',
    borderRadius: 20,
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: 11.5,
    fontWeight: 600,
  },
};
