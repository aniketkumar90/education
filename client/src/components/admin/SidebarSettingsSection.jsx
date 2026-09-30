import { useState } from 'react';

export default function SidebarSettingsSection({
  form,
  onChange,
  categories = [],
  coverImage,
  onImageChange,
  featuredImageUrl,
  onUrlChange,
  submitting,
  onSubmit,
}) {
  const [imgMode, setImgMode] = useState('upload'); // 'upload' | 'url'

  const previewSrc = coverImage
    ? URL.createObjectURL(coverImage)
    : featuredImageUrl || '';

  return (
    <div style={styles.container}>
      {/* Box 1: Author, Published Date, Post Status & Action Buttons */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>Publishing Settings</h4>
        </div>
        <div style={styles.cardBody}>
          {/* Author Name */}
          <div style={styles.field}>
            <label style={styles.label}>Author name</label>
            <input
              type="text"
              name="authorName"
              value={form.authorName}
              onChange={onChange}
              placeholder="e.g. Aniket Kumar"
              style={styles.input}
            />
          </div>

          {/* Published Date */}
          <div style={styles.field}>
            <label style={styles.label}>Published date</label>
            <input
              type="date"
              name="publishDate"
              value={form.publishDate}
              onChange={onChange}
              style={styles.input}
            />
          </div>

          {/* Post Status */}
          <div style={styles.field}>
            <label style={styles.label}>Post status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              style={styles.select}
            >
              <option value="Published">🟢 Published</option>
              <option value="Draft">🟡 Draft</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            <button
              type="button"
              disabled={submitting}
              onClick={() => onSubmit('Published')}
              style={styles.publishBtn}
            >
              {submitting ? 'Saving...' : '🚀 Publish Post'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => onSubmit('Draft')}
              style={styles.draftBtn}
            >
              💾 Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Box 2: Categories */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>Categories</h4>
        </div>
        <div style={styles.cardBody}>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="e.g. SEO Basics, University, Courses"
            list="sidebar-category-list"
            required
            style={styles.input}
          />
          <datalist id="sidebar-category-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <div style={styles.catChips}>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ target: { name: 'category', value: cat } })}
                style={{
                  ...styles.catChip,
                  ...(form.category === cat ? styles.catChipActive : {}),
                }}
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Box 3: Featured Image */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>Featured img</h4>
        </div>
        <div style={styles.cardBody}>
          {/* Mode Switcher */}
          <div style={styles.imgModeRow}>
            <button
              type="button"
              style={{ ...styles.modeBtn, ...(imgMode === 'upload' ? styles.modeBtnActive : {}) }}
              onClick={() => setImgMode('upload')}
            >
              📁 File
            </button>
            <button
              type="button"
              style={{ ...styles.modeBtn, ...(imgMode === 'url' ? styles.modeBtnActive : {}) }}
              onClick={() => setImgMode('url')}
            >
              🔗 Web URL
            </button>
          </div>

          {imgMode === 'upload' ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageChange(e.target.files[0] || null)}
              style={styles.fileInput}
            />
          ) : (
            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={styles.input}
            />
          )}

          {/* Thumbnail preview */}
          <div style={styles.thumbWrap}>
            {previewSrc ? (
              <img src={previewSrc} alt={form.imageAlt || 'Featured preview'} style={styles.thumbImg} />
            ) : (
              <div style={styles.noThumb}>
                <span>🖼️ No image selected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Box 4: Image Alt Text */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>Img alt text</h4>
        </div>
        <div style={styles.cardBody}>
          <input
            type="text"
            name="imageAlt"
            value={form.imageAlt}
            onChange={onChange}
            placeholder="e.g. SEO guide for beginners"
            style={styles.input}
          />
          {form.focusKeyword && (
            <button
              type="button"
              onClick={() => onChange({ target: { name: 'imageAlt', value: form.focusKeyword } })}
              style={styles.useKeywordBtn}
            >
              ⚡ Use: "{form.focusKeyword}"
            </button>
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
  cardHeader: {
    padding: '12px 16px',
    background: '#f8fafc',
    borderBottom: '1px solid var(--border)',
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    letterSpacing: 0.2,
  },
  cardBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12.5, fontWeight: 600, color: '#334155' },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'var(--font)',
    outline: 'none',
    color: 'var(--text)',
    background: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  actionRow: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 },
  publishBtn: {
    width: '100%',
    padding: '10px 16px',
    background: 'var(--primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
  },
  draftBtn: {
    width: '100%',
    padding: '8px 16px',
    background: '#f8fafc',
    color: '#475569',
    border: '1.5px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  catChips: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  catChip: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: 11,
    padding: '3px 8px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  catChipActive: { background: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary)' },
  imgModeRow: { display: 'flex', gap: 6, marginBottom: 4 },
  modeBtn: {
    flex: 1,
    padding: '5px 8px',
    border: '1px solid var(--border)',
    borderRadius: 4,
    background: '#f8fafc',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#64748b',
  },
  modeBtnActive: { background: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary)' },
  fileInput: {
    width: '100%',
    padding: '6px 8px',
    border: '1.5px dashed var(--border)',
    borderRadius: 6,
    fontSize: 12,
    background: '#f8fafc',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  thumbWrap: {
    height: 130,
    border: '1px solid var(--border)',
    borderRadius: 6,
    overflow: 'hidden',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  noThumb: { fontSize: 12, color: '#94a3b8' },
  useKeywordBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0',
    textAlign: 'left',
  },
};
