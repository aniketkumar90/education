import { useNavigate } from 'react-router-dom';

const CATEGORIES_DATA = [
  {
    id: 'distance-education',
    name: 'Distance Education',
    count: '120+ blogs',
    queryKey: 'Distance Education',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    ),
  },
  {
    id: 'online-courses',
    name: 'Online Courses',
    count: '85+ blogs',
    queryKey: 'Online Courses',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    id: 'university-reviews',
    name: 'University Reviews',
    count: '70+ blogs',
    queryKey: 'University',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"></path>
        <path d="M3 10h18"></path>
        <path d="M5 6l7-3 7 3"></path>
        <path d="M4 10v11"></path>
        <path d="M20 10v11"></path>
        <path d="M8 14v4"></path>
        <path d="M12 14v4"></path>
        <path d="M16 14v4"></path>
      </svg>
    ),
  },
  {
    id: 'admission-news',
    name: 'Admission News',
    count: '95+ blogs',
    queryKey: 'Admission',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
  {
    id: 'career-guidance',
    name: 'Career Guidance',
    count: '60+ blogs',
    queryKey: 'Career',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
  },
];

export default function ExploreCategories({ activeCategory, onSelectCategory }) {
  const navigate = useNavigate();

  const handleCardClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat.queryKey);
    } else {
      navigate(`/blogs?category=${encodeURIComponent(cat.queryKey)}`);
    }
  };

  return (
    <section className="explore-categories-section" style={styles.section}>
      <div className="container">
        {/* ── Section Header ──────────────────────────── */}
        <div style={styles.header}>
          <div style={styles.accentDash} />
          <h2 style={styles.title}>Explore Categories</h2>
          <p style={styles.subtitle}>Find articles based on your interest and educational needs.</p>
        </div>

        {/* ── 5 Cards Grid ────────────────────────────── */}
        <div className="categories-grid" style={styles.grid}>
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = activeCategory === cat.queryKey;
            return (
              <button
                key={cat.id}
                type="button"
                className="category-card"
                onClick={() => handleCardClick(cat)}
                style={{
                  ...styles.card,
                  ...(isSelected ? styles.cardActive : {}),
                }}
              >
                {/* Circular Icon */}
                <div
                  style={{
                    ...styles.iconWrap,
                    backgroundColor: cat.iconBg,
                    color: cat.iconColor,
                  }}
                >
                  {cat.icon}
                </div>

                {/* Card Title & Count */}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardName}>{cat.name}</h3>
                  <span style={styles.cardCount}>({cat.count})</span>
                </div>

                {/* Arrow at bottom-right */}
                <div style={styles.arrowWrap} className="category-arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '44px 0 36px',
    background: '#ffffff',
  },
  header: {
    marginBottom: 28,
  },
  accentDash: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1d68e1',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0e233d',
    letterSpacing: '-0.4px',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#64748b',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e9edf3',
    borderRadius: 16,
    padding: '22px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.22s ease',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
    outline: 'none',
  },
  cardActive: {
    borderColor: '#1d68e1',
    boxShadow: '0 8px 24px rgba(29, 104, 225, 0.12)',
    transform: 'translateY(-3px)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexShrink: 0,
    transition: 'transform 0.2s ease',
  },
  cardContent: {
    flex: 1,
    marginBottom: 12,
  },
  cardName: {
    fontSize: 14.5,
    fontWeight: 700,
    color: '#0e233d',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: 500,
  },
  arrowWrap: {
    alignSelf: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    transition: 'transform 0.2s ease, color 0.2s ease',
  },
};
