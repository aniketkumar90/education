import { useState, useEffect } from 'react';
import axios from 'axios';
import MainContentSection from './MainContentSection';
import SidebarSettingsSection from './SidebarSettingsSection';
import SeoMetadataFields from './SeoMetadataFields';

export default function SeoBlogForm({ onSuccess, onCancel, categories = [], blogToEdit = null }) {
  const [form, setForm] = useState({
    title: '',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    slug: '',
    category: 'University',
    tags: '',
    imageAlt: '',
    excerpt: '',
    content: '',
    authorName: 'Aniket Kumar',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'Published',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Populate form if blogToEdit is provided
  useEffect(() => {
    if (blogToEdit) {
      setForm({
        title: blogToEdit.title || '',
        metaTitle: blogToEdit.metaTitle || blogToEdit.title || '',
        metaDescription: blogToEdit.metaDescription || blogToEdit.excerpt || '',
        focusKeyword: blogToEdit.focusKeyword || '',
        slug: blogToEdit.slug || '',
        category: blogToEdit.category || 'University',
        tags: Array.isArray(blogToEdit.tags) ? blogToEdit.tags.join(', ') : blogToEdit.tags || '',
        imageAlt: blogToEdit.imageAlt || '',
        excerpt: blogToEdit.excerpt || '',
        content: blogToEdit.content || '',
        authorName: blogToEdit.authorName || 'Aniket Kumar',
        publishDate: blogToEdit.publishDate
          ? new Date(blogToEdit.publishDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: blogToEdit.status || 'Published',
      });

      const existingImg = typeof blogToEdit.coverImage === 'string'
        ? blogToEdit.coverImage
        : blogToEdit.coverImage?.url || '';
      setFeaturedImageUrl(existingImg);
      setCoverImage(null);
    }
  }, [blogToEdit]);

  const generateCleanSlug = (text) => {
    let clean = text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const eduMatch = clean.match(/(.*?(-education))/i);
    if (eduMatch && eduMatch[1]) {
      return eduMatch[1];
    }
    return clean;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'title' && !prev.slug) {
        next.slug = generateCleanSlug(value);
      }
      return next;
    });
  };

  const handleAutoSlug = () => {
    if (form.title) {
      const generated = generateCleanSlug(form.title);
      setForm((prev) => ({ ...prev, slug: generated }));
    }
  };

  const handleInsertContent = (snippet) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n${snippet}` : snippet,
    }));
  };

  const handleSubmit = async (e, forcedStatus) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.title.trim()) {
      setError('Blog Title is required.');
      return;
    }
    if (!form.excerpt.trim()) {
      setError('Short description / excerpt is required.');
      return;
    }
    if (!form.content.trim()) {
      setError('Blog Content is required.');
      return;
    }

    setSubmitting(true);

    try {
      const targetStatus = forcedStatus || form.status || 'Published';
      const formData = new FormData();

      formData.append('title', form.title.trim());
      formData.append('metaTitle', form.metaTitle.trim() || form.title.trim());
      formData.append('metaDescription', form.metaDescription.trim() || form.excerpt.trim());
      formData.append('focusKeyword', form.focusKeyword.trim());
      formData.append('slug', form.slug.trim());
      formData.append('category', form.category.trim() || 'University');
      formData.append('tags', form.tags.trim());
      formData.append('imageAlt', form.imageAlt.trim());
      formData.append('excerpt', form.excerpt.trim());
      formData.append('content', form.content.trim());
      formData.append('authorName', form.authorName.trim() || 'Aniket Kumar');
      formData.append('publishDate', form.publishDate);
      formData.append('status', targetStatus);

      if (coverImage) {
        formData.append('coverImage', coverImage);
      } else if (featuredImageUrl) {
        formData.append('featuredImageUrl', featuredImageUrl.trim());
      }

      const isDbEdit = blogToEdit?._id && /^[0-9a-fA-F]{24}$/.test(blogToEdit._id);

      if (isDbEdit) {
        await axios.put(`/api/blogs/${blogToEdit._id}`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/blogs', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const msg = isDbEdit
        ? `💾 Blog post updated successfully as ${targetStatus}!`
        : targetStatus === 'Draft'
        ? '💾 Blog saved as Draft!'
        : '🚀 Blog published successfully!';

      setSuccessMsg(msg);

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save blog post. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(blogToEdit);

  return (
    <form onSubmit={(e) => handleSubmit(e, form.status)} style={styles.form}>
      {/* Notifications */}
      {successMsg && <div style={styles.successBox}>{successMsg}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* TOP SECTION: 2-Column Layout */}
      <div className="admin-form-grid">
        {/* Left Column: Auto generate url, Blog title, Blog content, Excerpt & tags */}
        <div className="admin-form-main">
          <MainContentSection
            form={form}
            onChange={handleChange}
            onAutoSlug={handleAutoSlug}
            onInsertContent={handleInsertContent}
          />
        </div>

        {/* Right Column: Author name, Published date, Post status, categories, Featured img, Img alt text */}
        <div className="admin-form-sidebar">
          <SidebarSettingsSection
            form={form}
            onChange={handleChange}
            categories={categories}
            coverImage={coverImage}
            onImageChange={setCoverImage}
            featuredImageUrl={featuredImageUrl}
            onUrlChange={setFeaturedImageUrl}
            submitting={submitting}
            onSubmit={(st) => handleSubmit(null, st)}
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Full-width SEO & Google Search Snippet Preview */}
      <div style={styles.bottomSection}>
        <SeoMetadataFields
          form={form}
          onChange={handleChange}
          onAutoSlug={handleAutoSlug}
        />
      </div>

      {/* Action Buttons Bar */}
      <div style={styles.actionBar}>
        <div style={styles.actionLeft}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, 'Published')}
            style={styles.publishBtn}
          >
            {submitting ? 'Saving...' : isEditing ? '💾 Update & Publish Post' : '🚀 Publish Blog Post'}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, 'Draft')}
            style={styles.draftBtn}
          >
            {isEditing ? 'Save Changes as Draft' : '💾 Save as Draft'}
          </button>
        </div>

        {onCancel && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column' },
  bottomSection: { width: '100%', marginTop: 24 },
  successBox: {
    padding: '14px 18px',
    background: '#dcfce7',
    border: '1.5px solid #86efac',
    borderRadius: 8,
    color: '#166534',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  errorBox: {
    padding: '14px 18px',
    background: '#fee2e2',
    border: '1.5px solid #fca5a5',
    borderRadius: 8,
    color: '#991b1b',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    background: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: 10,
    marginTop: 20,
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionLeft: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  publishBtn: {
    padding: '12px 28px',
    fontSize: 14.5,
    fontWeight: 700,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  draftBtn: {
    padding: '12px 22px',
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    background: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
