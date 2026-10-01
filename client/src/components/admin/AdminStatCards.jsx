export default function AdminStatCards({ stats = {} }) {
  const safeStats = stats || {};
  const cards = [
    {
      title: 'TOTAL ARTICLES',
      value: safeStats.totalBlogs || 0,
      subtext: `${safeStats.universityCount || 0} University  •  ${safeStats.coursesCount || 0} Courses`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      iconBg: '#0f172a',
      iconColor: '#f59e0b',
    },
    {
      title: 'TOTAL LEADS / INQUIRIES',
      value: safeStats.totalInquiries || 0,
      subtext: '0 uncontacted leads',
      subtextColor: '#d97706',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      ),
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      title: 'PUBLISHED BLOGS',
      value: safeStats.publishedBlogs || 0,
      subtext: 'Live on Google & Search engines',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      iconBg: '#ecfdf5',
      iconColor: '#059669',
    },
    {
      title: 'REGISTERED USERS',
      value: stats.userCount || 1,
      subtext: 'Active administrative accounts',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
    },
  ];

  return (
    <div className="admin-stat-grid" style={styles.grid}>
      {cards.map((card, idx) => (
        <div key={idx} style={styles.card}>
          <div style={styles.cardTop}>
            <div>
              <div style={styles.title}>{card.title}</div>
              <div style={styles.value}>{card.value}</div>
            </div>
            <div style={{ ...styles.iconBox, background: card.iconBg, color: card.iconColor }}>
              {card.icon}
            </div>
          </div>
          <div style={{ ...styles.subtext, color: card.subtextColor || '#64748b' }}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '20px 22px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtext: {
    fontSize: 12,
    fontWeight: 600,
  },
};
