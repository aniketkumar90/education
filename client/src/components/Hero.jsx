import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="hero-section" style={styles.section}>
      <div className="container" style={styles.container}>
        {/* ── Left Content Column ──────────────────────── */}
        <div style={styles.leftCol}>
          {/* Pill Badge */}
          <div style={styles.badge}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d68e1"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: 7 }}
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Education Blog</span>
          </div>

          {/* Main Headline */}
          <h1 style={styles.headline}>
            Learn, Grow, Build
            <br />
            Your Future
          </h1>

          {/* Subtitle */}
          <p style={styles.subtitle}>
            Get the latest updates on distance education, online courses, university reviews,
            admission news and more. Your trusted source for educational guidance.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <div style={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search blogs, universities, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              aria-label="Search blogs, universities, courses"
            />
            <button type="submit" style={styles.searchBtn}>
              Search
            </button>
          </form>
        </div>

        {/* ── Right Visual Column with Stacked Books & Cap ─── */}
        <div style={styles.rightCol}>
          {/* Handwritten Annotation with Curved Doodle Arrow */}
          <div className="hero-handwritten-note" style={styles.handwrittenWrap}>
            <div style={styles.handwrittenText}>
              Better
              <br />
              Education
              <br />
              Brighter
              <br />
              Future
            </div>
            {/* Curved SVG Doodle Arrow */}
            <svg
              width="50"
              height="60"
              viewBox="0 0 50 60"
              fill="none"
              style={styles.doodleArrow}
            >
              <path
                d="M10 5 C 28 8, 42 22, 36 48"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 0"
              />
              <path
                d="M26 42 L 36 49 L 41 38"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Book Stack with Mortarboard Image */}
          <div style={styles.imageCard}>
            <img
              src="/images/hero-books-cap.jpg"
              alt="Education Stack of Books with Graduation Cap"
              style={styles.heroImg}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    background: 'linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%)',
    padding: '52px 0 60px',
    overflow: 'hidden',
    position: 'relative',
    borderBottom: '1px solid #f1f5f9',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    alignItems: 'center',
    gap: 48,
    position: 'relative',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#ebf3fe',
    border: '1px solid #d6e6fc',
    color: '#1d68e1',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 22,
    boxShadow: '0 1px 3px rgba(29, 104, 225, 0.08)',
  },
  headline: {
    fontFamily: 'var(--font)',
    fontSize: 'clamp(38px, 4.8vw, 56px)',
    fontWeight: 800,
    color: '#0e233d',
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 15.5,
    lineHeight: 1.6,
    color: '#64748b',
    maxWidth: 480,
    marginBottom: 28,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    border: '1.5px solid #cbd5e1',
    borderRadius: 9999,
    padding: '5px 6px 5px 18px',
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
    transition: 'all 0.2s ease',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14.5,
    color: '#0f172a',
    background: 'transparent',
  },
  searchBtn: {
    background: '#1d68e1',
    color: '#ffffff',
    border: 'none',
    borderRadius: 9999,
    padding: '9px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(29, 104, 225, 0.28)',
    transition: 'all 0.2s ease',
  },
  rightCol: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handwrittenWrap: {
    position: 'absolute',
    top: -12,
    left: -20,
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  handwrittenText: {
    fontFamily: '"Caveat", "Comic Sans MS", cursive, sans-serif',
    fontSize: 18,
    lineHeight: 1.15,
    color: '#1e293b',
    fontWeight: 700,
    transform: 'rotate(-10deg)',
    textAlign: 'center',
  },
  doodleArrow: {
    marginLeft: 26,
    marginTop: -4,
  },
  imageCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.1)',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  heroImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
};
