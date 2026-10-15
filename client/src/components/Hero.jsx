import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingTopics = [
    { label: 'Pune University', q: 'Pune University' },
    { label: 'Bangalore University', q: 'Bangalore University' },
    { label: 'One-Year MBA', q: 'One-Year MBA' },
    { label: 'Diploma in NTT', q: 'NTT' },
    { label: 'B.Sc Courses', q: 'B.Sc' },
    { label: 'Madras University', q: 'Madras University' },
  ];

  const trustHighlights = [
    {
      icon: '🏛️',
      title: 'UGC-DEB Approved',
      subtitle: 'Verified Distance Universities',
      bg: '#eff6ff',
      color: '#1d4ed8',
    },
    {
      icon: '🎓',
      title: '100+ Degree Programs',
      subtitle: 'BA, B.Com, B.Sc, MBA, MCA, MA',
      bg: '#f0fdf4',
      color: '#15803d',
    },
    {
      icon: '📑',
      title: '2026 Admission Guides',
      subtitle: 'Accurate Fees, Eligibility & Dates',
      bg: '#fefce8',
      color: '#a16207',
    },
    {
      icon: '🛡️',
      title: 'Free Student Advisory',
      subtitle: 'Genuine Career & Degree Guidance',
      bg: '#faf5ff',
      color: '#7e22ce',
    },
  ];

  return (
    <section className="hero-official-section">
      <div className="container">
        {/* Official Pill Badge */}
        <div className="hero-official-badge">
          <span>TRUSTED BY 10,000+ STUDENTS</span>
        </div>

        {/* Official Headline */}
        <h1 className="hero-official-title">
          Welcome to
          <br />
          <span className="hero-title-highlight">Distance Education</span>{' '}
          <span className="hero-title-brand">Connect</span>
        </h1>

        {/* Mission Subtitle */}
        <p className="hero-official-desc">
          India's Premier Higher Education Advisory Portal for UGC-DEB Approved Distance Degree Programs, 
          University Admission Notifications, Genuine Fee Comparisons & 2026 Session Updates.
        </p>

        {/* Interactive Search Bar */}
        <form className="hero-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search universities, courses or degrees (e.g., Pune University, MBA, B.Sc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>
        </form>

        {/* Popular Trending Topics */}
        <div className="hero-trending-row">
          <span className="hero-trending-label">Trending:</span>
          {trendingTopics.map((item) => (
            <Link
              key={item.label}
              to={`/blogs?search=${encodeURIComponent(item.q)}`}
              className="hero-trending-pill"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Official Trust & Features 4-Card Grid */}
        <div className="hero-trust-grid">
          {trustHighlights.map((item) => (
            <div key={item.title} className="hero-trust-card">
              <div
                className="hero-trust-icon"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="hero-trust-title">{item.title}</div>
                <div className="hero-trust-sub">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
