import { useState } from 'react';

export default function FeaturedImageFields({
  coverImage,
  onImageChange,
  featuredImageUrl,
  onUrlChange,
  imageAlt,
  onAltChange,
  focusKeyword,
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'

  const previewSrc = coverImage
    ? URL.createObjectURL(coverImage)
    : featuredImageUrl || '';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>🖼️</div>
        <div>
          <h3 style={styles.title}>Featured Image & Image SEO</h3>
          <p style={styles.subtitle}>Upload post cover image and configure Google Image SEO alt text</p>
        </div>
      </div>

      <div style={styles.body}>
        {/* Toggle between File Upload and Image URL */}
        <div style={styles.toggleRow}>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(mode === 'upload' ? styles.toggleBtnActive : {}),
            }}
            onClick={() => setMode('upload')}
          >
            📁 Upload from Computer
          </button>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(mode === 'url' ? styles.toggleBtnActive : {}),
            }}
            onClick={() => setMode('url')}
          >
            🔗 Image Web URL
          </button>
        </div>

        <div style={styles.grid}>
          {/* Left: Input */}
          <div style={styles.field}>
            {mode === 'upload' ? (
              <div>
                <label style={styles.label}>Choose Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageChange(e.target.files[0] || null)}
                  style={styles.fileInput}
                />
                <span style={styles.helpText}>Supported: JPG, PNG, WebP (Max: 5MB)</span>
              </div>
            ) : (
              <div>
                <label style={styles.label}>Image Web URL</label>
                <input
                  type="url"
                  value={featuredImageUrl}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="https://images.unsplash.com/... or cloud image URL"
                  style={styles.input}
                />
                <span style={styles.helpText}>Direct link to high-res image</span>
              </div>
            )}

            {/* Image Alt Text */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={styles.label}>
                  Image Alt Text <span style={styles.tip}>(Crucial for Google Image SEO)</span>
                </label>
                {focusKeyword && (
                  <button
                    type="button"
                    onClick={() => onAltChange(focusKeyword)}
                    style={styles.useKeywordBtn}
                    title="Use focus keyword as alt text"
                  >
                    ⚡ Use Focus Keyword
                  </button>
                )}
              </div>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="e.g. SEO guide for beginners"
                style={styles.input}
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div style={styles.previewBox}>
            {previewSrc ? (
              <div style={styles.previewWrap}>
                <img src={previewSrc} alt={imageAlt || 'Featured preview'} style={styles.previewImg} />
                <div style={styles.previewCaption}>
                  <span><strong>Alt:</strong> {imageAlt || <em style={{ color: 'var(--danger)' }}>No Alt text set!</em>}</span>
                </div>
              </div>
            ) : (
              <div style={styles.noPreview}>
                <span style={{ fontSize: 32 }}>🖼️</span>
                <span style={{ fontSize: 12.5, color: '#94a3b8' }}>No image selected yet</span>
              </div>
            )}
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
  toggleRow: { display: 'flex', gap: 8 },
  toggleBtn: {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1.5px solid var(--border)',
    background: '#f8fafc',
    color: 'var(--text-muted)',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  toggleBtnActive: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    borderColor: 'var(--primary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
    alignItems: 'start',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  tip: { fontSize: 11.5, fontWeight: 400, color: '#64748b' },
  helpText: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, display: 'block' },
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
  fileInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 12.5,
    background: '#f8fafc',
    cursor: 'pointer',
  },
  useKeywordBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  previewBox: {
    height: 170,
    border: '1.5px dashed var(--border)',
    borderRadius: 8,
    background: '#f8fafc',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewWrap: { width: '100%', height: '100%', position: 'relative' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  previewCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    color: '#ffffff',
    padding: '4px 10px',
    fontSize: 11.5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  noPreview: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
};
