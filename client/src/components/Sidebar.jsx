import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DEFAULT_BLOGS } from '../data/blogsData';
import { getImageUrl } from '../api/api';

const TRENDING_CATEGORIES = ['University', 'Courses'];

const SPECIALIZATIONS = {
  'Management': ['MBA - General Management', 'MBA - Finance', 'MBA - Marketing', 'MBA - Human Resource', 'BBA - Business Administration'],
  'IT & Computer Applications': ['MCA - Computer Applications', 'BCA - Computer Applications', 'MSc - IT', 'BSc - Computer Science'],
  'Science': ['MSc - Real Estate Valuation', 'MSc - Agriculture', 'MSc - Optometry', 'BSc - General Science'],
  'Arts & Humanities': ['MA - English Literature', 'MA - History', 'MA - Sociology', 'BA - Arts'],
  'Commerce': ['M.Com - Accounting & Finance', 'B.Com - General & Banking'],
  'Other Courses': ['Postgraduate Diploma', 'Certificate Program'],
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Sidebar() {
  const [latestBlogs, setLatestBlogs] = useState(DEFAULT_BLOGS.slice(0, 4));
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

  useEffect(() => {
    axios.get('/api/blogs?limit=4')
      .then(({ data }) => {
        if (data && data.blogs && data.blogs.length > 0) {
          setLatestBlogs(data.blogs);
        }
      })
      .catch(() => {
        setLatestBlogs(DEFAULT_BLOGS.slice(0, 4));
      });
  }, []);

  const handleAppChange = (e) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setAppForm((prev) => ({ ...prev, course: value, subCourse: '' }));
    } else {
      setAppForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    if (appForm.name.trim() && appForm.phone.trim()) {
      setFormSubmitted(true);
    }
  };

  return (
    <aside style={styles.aside}>
      {/* Latest Updates */}
      <div style={styles.widget}>
        <h3 style={styles.widgetTitle}>
          <span style={styles.titleBar} />
          Latest Updates
        </h3>
        {latestBlogs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="skeleton" style={{ width: 60, height: 50, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 13 }} />
                  <div className="skeleton" style={{ height: 13, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul style={styles.latestList}>
            {latestBlogs.map((blog) => (
              <li key={blog._id} style={styles.latestItem}>
                <div style={styles.latestThumb}>
                  <img src={getImageUrl(blog.coverImage)} alt={blog.title} style={styles.thumbImg} />
                </div>
                <div style={styles.latestContent}>
                  <Link to={`/blog/${blog.slug || blog._id}`} style={styles.latestTitle}>{blog.title}</Link>
                  <span style={styles.latestDate}>{formatDate(blog.publishDate || blog.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.divider} />

      {/* Trending Categories */}
      <div style={styles.widget}>
        <h3 style={styles.widgetTitle}>
          <span style={styles.titleBar} />
          Trending Categories
        </h3>
        <div style={styles.catGrid}>
          {TRENDING_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/blogs?category=${cat}`}
              style={styles.catChip}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Application Form Widget (Replaces Stay Updated) */}
      <div style={styles.appCard}>
        {/* Header */}
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
                  <span style={{ fontSize: 14 }}>🇮🇳</span>
                  <span>+91</span>
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
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>

              {/* SELECT SUB-COURSE / SPECIALIZATION */}
              <select
                name="subCourse"
                value={appForm.subCourse}
                onChange={handleAppChange}
                required
                disabled={!appForm.course}
                style={{
                  ...styles.appSelect,
                  background: !appForm.course ? '#f8fafc' : '#ffffff',
                  color: !appForm.course ? '#94a3b8' : '#1e293b',
                  cursor: !appForm.course ? 'not-allowed' : 'pointer',
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
              <button type="submit" style={styles.submitBtn}>
                Submit
              </button>
            </form>
          )}
        </div>

        {/* Soft bottom accent */}
        <div style={styles.appFooterAccent} />
      </div>
    </aside>
  );
}

const styles = {
  aside: { display: 'flex', flexDirection: 'column', gap: 0 },
  widget: { padding: '24px 0' },
  widgetTitle: {
    fontSize: 15, fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 16,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  titleBar: {
    display: 'inline-block', width: 4, height: 18,
    background: 'var(--primary)', borderRadius: 2, flexShrink: 0,
  },
  catGrid: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
  },
  catChip: {
    padding: '5px 14px',
    borderRadius: 20,
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: 12.5, fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1.5px solid transparent',
  },
  divider: { height: 1, background: 'var(--border)' },
  latestList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 },
  latestItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  latestThumb: {
    width: 62, height: 52, borderRadius: 8,
    overflow: 'hidden', background: 'var(--bg-secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, border: '1px solid var(--border)',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  thumbEmoji: { fontSize: 22 },
  latestContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  latestTitle: {
    fontSize: 13, fontWeight: 600, color: 'var(--text)',
    textDecoration: 'none', lineHeight: 1.4,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
    transition: 'color 0.15s',
  },
  latestDate: { fontSize: 11.5, color: 'var(--text-light)' },

  // Application Form styles matching screenshot
  appCard: {
    margin: '20px 0',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(30, 41, 59, 0.10)',
    border: '1px solid #dbeafe',
    background: '#ffffff',
  },
  appHeader: {
    background: 'linear-gradient(180deg, #2b3990 0%, #1e2b7b 100%)',
    padding: '20px 16px 16px 16px',
    textAlign: 'center',
  },
  appTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22,
    fontWeight: 600,
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
    background: '#eff6ff',
    borderTop: '1px solid #e0e7ff',
  },
  appSuccess: {
    padding: '24px 16px',
    textAlign: 'center',
    background: '#f0fdf4',
    borderRadius: 8,
    border: '1px solid #bbf7d0',
  },
  newAppBtn: {
    padding: '8px 16px',
    background: '#166534',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
