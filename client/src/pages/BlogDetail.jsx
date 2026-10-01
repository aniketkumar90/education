import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../api/api';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const SPECIALIZATIONS = {
  'Management': ['MBA - General Management', 'MBA - Finance', 'MBA - Marketing', 'MBA - Human Resource', 'BBA - Business Administration'],
  'IT & Computer Applications': ['MCA - Computer Applications', 'BCA - Computer Applications', 'MSc - IT', 'BSc - Computer Science'],
  'Science': ['MSc - Real Estate Valuation', 'MSc - Agriculture', 'MSc - Optometry', 'BSc - General Science'],
  'Arts & Humanities': ['MA - English Literature', 'MA - History', 'MA - Sociology', 'BA - Arts'],
  'Commerce': ['M.Com - Accounting & Finance', 'B.Com - General & Banking'],
  'Other Courses': ['Postgraduate Diploma', 'Certificate Program'],
};

/**
 * Splits HTML blog content right after the first heading and its initial ~5-line introductory paragraph,
 * so the admission & counseling inquiry form can be dynamically inserted right where users need it.
 */
const splitContentForForm = (htmlContent) => {
  if (!htmlContent) return { before: '', after: '' };

  // 1. Find the first heading (h2 or h3) and locate the closing </p> of the paragraph directly below it
  const headingMatch = htmlContent.search(/<h[23][^>]*>/i);
  if (headingMatch !== -1) {
    const afterHeading = htmlContent.slice(headingMatch);
    const pEndIndex = afterHeading.indexOf('</p>');
    if (pEndIndex !== -1) {
      const splitPoint = headingMatch + pEndIndex + 4; // after </p>
      return {
        before: htmlContent.slice(0, splitPoint),
        after: htmlContent.slice(splitPoint),
      };
    }
  }

  // 2. Fallback: if no heading + </p> pattern, split after the first closing </p>
  const firstP = htmlContent.indexOf('</p>');
  if (firstP !== -1) {
    const splitPoint = firstP + 4;
    return {
      before: htmlContent.slice(0, splitPoint),
      after: htmlContent.slice(splitPoint),
    };
  }

  // 3. Fallback: entire content if no paragraph tags
  return {
    before: htmlContent,
    after: '',
  };
};

/**
 * Reusable Application Form Card matching exact user screenshot design:
 * Blue header (#253396), clean 1-column layout, +91 phone selector, and submit button.
 */
function ApplicationFormCard({
  appForm,
  handleAppChange,
  handleAppSubmit,
  formSubmitted,
  setAppForm,
  setFormSubmitted,
  isSubmitting = false,
  onClose = null,
  isPopup = false,
  cardId = '',
}) {
  return (
    <div
      id={cardId}
      className={isPopup ? 'popup-application-card' : 'in-article-application-card'}
      style={{
        ...styles.appCard,
        width: '100%',
        maxWidth: isPopup ? 400 : 430,
        margin: isPopup ? '0 auto' : '26px auto',
        position: 'relative',
      }}
    >
      {/* If popup, show close (✕) button in header */}
      {isPopup && onClose && (
        <button
          type="button"
          onClick={onClose}
          style={styles.modalCloseBtn}
          aria-label="Close form"
          title="Close"
        >
          ✕
        </button>
      )}

      {/* Header matching exact user screenshot */}
      <div style={styles.appHeader}>
        <h3 style={styles.appTitle}>Application Form</h3>
        <p style={styles.appSubtitle}>Prospectus | Eligibility | Fees</p>
      </div>

      {/* Form Body */}
      <div style={styles.appBody}>
        {formSubmitted ? (
          <div style={styles.appSuccess}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
              Application Submitted!
            </h4>
            <p style={{ fontSize: 12, color: '#15803d', lineHeight: 1.5, marginBottom: 14 }}>
              Thank you <strong>{appForm.name}</strong>. Our counselor will contact you shortly on <strong>+91 {appForm.phone}</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setAppForm({ name: '', phone: '', email: '', studyMode: '', course: '', subCourse: '', admissionPlanning: '' });
                setFormSubmitted(false);
              }}
              style={styles.newAppBtn}
            >
              Submit Another Query
            </button>
          </div>
        ) : (
          <form style={styles.appForm} onSubmit={handleAppSubmit}>
            {/* YOUR NAME */}
            <input
              type="text"
              name="name"
              placeholder="YOUR NAME"
              value={appForm.name}
              onChange={handleAppChange}
              required
              style={styles.appInput}
            />

            {/* YOUR PHONE with flag */}
            <div style={styles.phoneWrapper}>
              <div style={styles.phonePrefix}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#1e293b' }}>IN</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b' }}>+91</span>
                <span style={{ fontSize: 8, color: '#64748b' }}>▼</span>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="YOUR PHONE"
                value={appForm.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9]+$/.test(val)) {
                    handleAppChange(e);
                  }
                }}
                maxLength={10}
                required
                style={styles.phoneInput}
              />
            </div>

            {/* YOUR EMAIL ID */}
            <input
              type="email"
              name="email"
              placeholder="YOUR EMAIL ID"
              value={appForm.email}
              onChange={handleAppChange}
              required
              style={styles.appInput}
            />

            {/* PREFERRED STUDY MODE */}
            <select
              name="studyMode"
              value={appForm.studyMode}
              onChange={handleAppChange}
              required
              style={styles.appSelect}
            >
              <option value="">PREFERRED STUDY MODE</option>
              <option value="Distance Learning">Distance Learning</option>
              <option value="Online Learning">Online Learning</option>
              <option value="Regular / Campus">Regular / Campus</option>
              <option value="Part-Time / Hybrid">Part-Time / Hybrid</option>
            </select>

            {/* SELECT COURSE */}
            <select
              name="course"
              value={appForm.course}
              onChange={handleAppChange}
              required
              style={styles.appSelect}
            >
              <option value="">SELECT COURSE</option>
              {Object.keys(SPECIALIZATIONS).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* SELECT SPECIALIZATION */}
            <select
              name="subCourse"
              value={appForm.subCourse}
              onChange={handleAppChange}
              required
              disabled={!appForm.course}
              style={{
                ...styles.appSelect,
                opacity: appForm.course ? 1 : 0.65,
                cursor: appForm.course ? 'pointer' : 'not-allowed',
              }}
            >
              <option value="">
                {appForm.course ? 'SELECT SPECIALIZATION' : 'SELECT COURSE FIRST'}
              </option>
              {appForm.course && SPECIALIZATIONS[appForm.course]?.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* ADMISSION PLANNING */}
            <select
              name="admissionPlanning"
              value={appForm.admissionPlanning}
              onChange={handleAppChange}
              required
              style={styles.appSelect}
            >
              <option value="">ADMISSION PLANNING</option>
              <option value="Immediate (2026 Batch)">Immediate (2026 Batch)</option>
              <option value="Within 1 Month">Within 1 Month</option>
              <option value="Within 3 Months">Within 3 Months</option>
              <option value="Just Exploring Options">Just Exploring Options</option>
            </select>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      {/* Soft bottom accent */}
      <div style={styles.appFooterAccent} />
    </div>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Application Form State matching Home page Sidebar
  const [appForm, setAppForm] = useState({
    name: '',
    phone: '',
    email: '',
    studyMode: '',
    course: '',
    subCourse: '',
    admissionPlanning: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // 3-Second Timed Admission Popup Modal
  useEffect(() => {
    setShowPopup(false);
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  // Close popup modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showPopup]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    axios
      .get(`/api/blogs/${id}`)
      .then(({ data }) => {
        setBlog(data);
        return axios.get('/api/blogs?limit=6');
      })
      .then(({ data }) => {
        if (data && data.blogs) {
          setRecentBlogs(data.blogs.filter((b) => b._id !== id && b.slug !== id).slice(0, 4));
        }
      })
      .catch((err) => {
        console.error('Failed to load blog:', err);
        setBlog(null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Dynamic SEO title & description
  useEffect(() => {
    if (blog) {
      document.title = `${blog.metaTitle || blog.title} | DLEducationConnect`;
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = blog.metaDescription || blog.excerpt || '';
    }
  }, [blog]);

  const handleAppChange = (e) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setAppForm((prev) => ({ ...prev, course: value, subCourse: '' }));
    } else {
      setAppForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    if (!appForm.name.trim() || !appForm.phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    setIsSubmittingLead(true);
    try {
      await axios.post('/api/inquiries', {
        name: appForm.name.trim(),
        phone: appForm.phone.trim(),
        email: appForm.email.trim(),
        studyMode: appForm.studyMode,
        course: appForm.course,
        subCourse: appForm.subCourse,
        admissionPlanning: appForm.admissionPlanning,
        source: blog?.title ? `Blog: ${blog.title}` : 'Blog Page Application Form',
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry to backend:', err);
      // Fallback: still show success to student so they don't get frustrated, or show alert
      const errorMsg = err.response?.data?.message || 'Failed to submit application. Please check your internet connection.';
      alert(errorMsg);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="container" style={{ maxWidth: 1180 }}>
          <div className="skeleton" style={{ height: 420, borderRadius: 16, marginBottom: 30 }} />
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 45, width: '70%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
            </div>
            <div style={{ width: 340 }}>
              <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <span style={{ fontSize: 50, display: 'block', marginBottom: 16 }}>🔍</span>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Article Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          The article you are looking for does not exist in the database or could not be loaded.
        </p>
        <Link to="/blogs" className="btn btn-primary">
          ← Back to All Articles
        </Link>
      </div>
    );
  }

  // Cover image extraction using centralized resolver
  const coverUrl = getImageUrl(blog.coverImage);
  const { before: contentBeforeForm, after: contentAfterForm } = splitContentForForm(blog.content);

  return (
    <div style={styles.page}>
      {/* Main 2-Column Content Structure */}
      <div className="container" style={styles.mainContainer}>
        <div className="detail-layout-grid" style={styles.layoutGrid}>
          {/* LEFT COLUMN: Main Article Content */}
          <article className="blog-main-article" style={styles.mainArticle}>
            {/* Category Tag & Title */}
            <div style={styles.articleHeader}>
              <span style={styles.catPill}>{blog.category || 'Education'}</span>
              <h1 style={styles.postTitle}>{blog.title}</h1>

              {/* Meta Row: Author, Date, Views */}
              <div className="detail-meta-row" style={styles.metaRow}>
                <div style={styles.authorGroup}>
                  <div style={styles.authorAvatar}>
                    {(blog.authorName || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={styles.authorName}>{blog.authorName || 'Aniket Kumar'}</span>
                    <span style={styles.authorRole}>Senior Academic Advisor</span>
                  </div>
                </div>

                <div style={styles.metaDivider} />

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Published</span>
                  <span style={styles.metaValue}>{formatDate(blog.publishDate || blog.createdAt)}</span>
                </div>

                <div style={styles.metaDivider} />

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Views</span>
                  <span style={styles.metaValue}>👁 {blog.views || 1420}</span>
                </div>
              </div>
            </div>

            {/* Featured Hero Banner Image */}
            <div className="featured-img-wrap" style={styles.featuredImageWrap}>
              <img
                src={coverUrl}
                alt={blog.imageAlt || blog.title}
                style={styles.featuredImg}
              />
            </div>

            {/* Excerpt Callout Box */}
            {blog.excerpt && (
              <div style={styles.excerptBox}>
                <p style={styles.excerptText}>{blog.excerpt}</p>
              </div>
            )}

            {/* 1. Article Intro: First heading + initial ~5 lines of content */}
            {contentBeforeForm && (
              <div
                style={styles.articleBody}
                className="rich-blog-body"
                dangerouslySetInnerHTML={{
                  __html: contentBeforeForm,
                }}
              />
            )}

            {/* 2. In-Article Exact Application Form (matching user screenshot) */}
            <div id="in-article-form" style={{ width: '100%', margin: '24px 0 30px 0' }}>
              <ApplicationFormCard
                appForm={appForm}
                handleAppChange={handleAppChange}
                handleAppSubmit={handleAppSubmit}
                formSubmitted={formSubmitted}
                setAppForm={setAppForm}
                setFormSubmitted={setFormSubmitted}
                isSubmitting={isSubmittingLead}
                cardId="in-article-application-form"
              />
            </div>

            {/* 3. Remaining Article Body */}
            {contentAfterForm && (
              <div
                style={styles.articleBody}
                className="rich-blog-body"
                dangerouslySetInnerHTML={{
                  __html: contentAfterForm,
                }}
              />
            )}

            {/* Tags Strip */}
            {blog.tags && blog.tags.length > 0 && (
              <div style={styles.tagsContainer}>
                <span style={styles.tagsLabel}>Tags:</span>
                <div style={styles.tagsWrap}>
                  {blog.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/blogs?search=${encodeURIComponent(t)}`}
                      style={styles.tagBadge}
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Call to Action Card (SPM Advisory style) */}
            <div className="blog-cta-box" style={styles.ctaBox}>
              <div style={styles.ctaLeft}>
                <span style={styles.ctaBadge}>ADMISSION & COUNSELING</span>
                <h3 style={styles.ctaTitle}>Interested in exploring options mentioned in this article?</h3>
                <p style={styles.ctaDesc}>
                  Connect directly with verified admission counselors for fee structure, eligibility & scholarship guidance.
                </p>
              </div>
              <a
                href="#in-article-form"
                style={styles.ctaBtn}
              >
                Connect with Advisory Team →
              </a>
            </div>
          </article>

          {/* RIGHT COLUMN: Sidebar (Matching SPM Insights Right Rail) */}
          <aside style={styles.sidebar}>
            {/* Box 1: Recent Articles with Thumbnails (SPM style) */}
            <div style={styles.sidebarCard}>
              <div style={styles.sidebarCardHeader}>
                <h3 style={styles.sidebarCardTitle}>Other Recent Articles</h3>
              </div>
              <div style={styles.recentList}>
                {recentBlogs.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>No other articles found.</p>
                ) : (
                  recentBlogs.map((b) => {
                    const thumb = getImageUrl(b.coverImage);

                    return (
                      <div key={b._id} style={styles.recentItem}>
                        <div style={styles.recentThumbBox}>
                          <img src={thumb} alt={b.title} style={styles.recentThumb} />
                        </div>
                        <div style={styles.recentInfo}>
                          <span style={styles.recentCat}>{b.category || 'Education'}</span>
                          <Link to={`/blog/${b.slug || b._id}`} style={styles.recentLink}>
                            {b.title}
                          </Link>
                          <span style={styles.recentDate}>{formatDate(b.publishDate || b.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Box 2: Application Form Sidebar Card */}
            <ApplicationFormCard
              appForm={appForm}
              handleAppChange={handleAppChange}
              handleAppSubmit={handleAppSubmit}
              formSubmitted={formSubmitted}
              setAppForm={setAppForm}
              setFormSubmitted={setFormSubmitted}
              isSubmitting={isSubmittingLead}
              cardId="application-form"
            />
          </aside>
        </div>
      </div>

      {/* 3-Second Timed Admission Popup Modal with Close (✕) Option */}
      {showPopup && (
        <div
          className="app-modal-overlay animate-fadeIn"
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div className="app-modal-dialog" style={styles.modalDialog}>
            <ApplicationFormCard
              appForm={appForm}
              handleAppChange={handleAppChange}
              handleAppSubmit={handleAppSubmit}
              formSubmitted={formSubmitted}
              setAppForm={setAppForm}
              setFormSubmitted={setFormSubmitted}
              isSubmitting={isSubmittingLead}
              onClose={() => setShowPopup(false)}
              isPopup={true}
              cardId="popup-application-form"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: '#f8fafc',
    minHeight: '100vh',
    paddingBottom: 60,
  },
  loadingContainer: {
    padding: '40px 0',
  },
  mainContainer: {
    maxWidth: 1180,
    paddingTop: 36,
    paddingBottom: 20,
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 350px',
    gap: 36,
    alignItems: 'flex-start',
  },
  mainArticle: {
    background: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '36px 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  articleHeader: {
    marginBottom: 24,
  },
  catPill: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 14,
  },
  postTitle: {
    fontSize: 'clamp(24px, 3.2vw, 36px)',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1.25,
    letterSpacing: '-0.5px',
    marginBottom: 20,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    paddingTop: 16,
    borderTop: '1px solid #f1f5f9',
  },
  authorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#0f172a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: 700,
    color: '#0f172a',
    display: 'block',
  },
  authorRole: {
    fontSize: 11,
    color: '#64748b',
    display: 'block',
  },
  metaDivider: {
    width: 1,
    height: 24,
    background: '#e2e8f0',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 10.5,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 12.5,
    fontWeight: 600,
    color: '#334155',
  },
  featuredImageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 420,
    background: '#0f172a',
    marginBottom: 32,
  },
  featuredImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  excerptBox: {
    background: '#f8fafc',
    borderLeft: '4px solid #d97706',
    borderRadius: '0 10px 10px 0',
    padding: '18px 24px',
    marginBottom: 32,
  },
  excerptText: {
    fontSize: 16,
    lineHeight: 1.65,
    color: '#334155',
    margin: 0,
    fontWeight: 500,
  },
  articleBody: {
    fontSize: 16,
    lineHeight: 1.8,
    color: '#1e293b',
    marginBottom: 36,
  },
  tagsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '18px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  tagsLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  tagsWrap: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagBadge: {
    fontSize: 12,
    fontWeight: 600,
    background: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: 6,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  ctaBox: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: 14,
    padding: '28px 32px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  ctaLeft: {
    flex: 1,
    minWidth: 260,
  },
  ctaBadge: {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: 1,
    color: '#f59e0b',
    display: 'block',
    marginBottom: 6,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 6px 0',
    lineHeight: 1.3,
  },
  ctaDesc: {
    fontSize: 13,
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.5,
  },
  ctaBtn: {
    background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
    color: '#0f172a',
    padding: '12px 22px',
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
    whiteSpace: 'nowrap',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    position: 'sticky',
    top: 84,
  },
  sidebarCard: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '22px 20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  sidebarCardHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1.5px solid #f1f5f9',
  },
  sidebarCardTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  recentItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  recentThumbBox: {
    width: 68,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#e2e8f0',
  },
  recentThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  recentInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  recentCat: {
    fontSize: 9.5,
    fontWeight: 800,
    color: '#d97706',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  recentLink: {
    fontSize: 12.5,
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'none',
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  recentDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  // Exact Application Form Widget Styles matching Home page Sidebar
  appCard: {
    background: '#ffffff',
    border: '1.5px solid #253396',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(37, 51, 150, 0.12)',
  },
  appHeader: {
    background: '#253396',
    padding: '16px 18px',
    textAlign: 'center',
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#ffffff',
    margin: 0,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#dbeafe',
    margin: '6px 0 0 0',
    fontWeight: 500,
    letterSpacing: 0.4,
  },
  appBody: {
    padding: '18px 16px 20px 16px',
    background: '#ffffff',
  },
  appForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
  },
  appInput: {
    width: '100%',
    height: 40,
    padding: '0 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#ffffff',
  },
  phoneWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    border: '1px solid #cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
    background: '#ffffff',
    boxSizing: 'border-box',
  },
  phonePrefix: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '0 9px',
    background: '#f8fafc',
    borderRight: '1px solid #cbd5e1',
    height: '100%',
    fontSize: 12,
    fontWeight: 600,
    color: '#334155',
    flexShrink: 0,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    border: 'none',
    outline: 'none',
    padding: '0 12px',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#1e293b',
    background: 'transparent',
    boxSizing: 'border-box',
  },
  appSelect: {
    width: '100%',
    height: 40,
    padding: '0 10px',
    border: '1px solid #cbd5e1',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#334155',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    height: 44,
    marginTop: 4,
    background: '#253396',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14.5,
    fontWeight: 600,
    letterSpacing: 0.5,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(37, 51, 150, 0.3)',
    transition: 'background 0.2s, transform 0.1s',
  },
  appFooterAccent: {
    height: 24,
    background: '#253396',
    borderTop: '1px solid rgba(255,255,255,0.15)',
  },
  appSuccess: {
    padding: '24px 16px',
    textAlign: 'center',
    background: '#f0fdf4',
    borderRadius: 6,
    border: '1px solid #bbf7d0',
  },
  newAppBtn: {
    background: '#253396',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  // Modal Popup Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    overflowY: 'auto',
  },
  modalDialog: {
    width: '100%',
    maxWidth: 410,
    margin: 'auto',
    animation: 'modalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 20,
    background: 'rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    transition: 'all 0.15s ease',
  },
};
