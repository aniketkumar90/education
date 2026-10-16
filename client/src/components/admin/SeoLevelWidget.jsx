import { useState, useMemo } from 'react';
import { calculateSeoScore } from '../../utils/seoCalculator';

export default function SeoLevelWidget({
  form,
  coverImage = null,
  featuredImageUrl = '',
  compact = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'FAIL' | 'WARN' | 'PASS'

  const audit = useMemo(() => {
    return calculateSeoScore({
      ...form,
      coverImage,
      featuredImageUrl,
    });
  }, [form, coverImage, featuredImageUrl]);

  const filteredChecks = useMemo(() => {
    if (activeFilter === 'PASS') return audit.checks.filter((c) => c.status === 'pass');
    if (activeFilter === 'WARN') return audit.checks.filter((c) => c.status === 'warn');
    if (activeFilter === 'FAIL') return audit.checks.filter((c) => c.status === 'fail');
    return audit.checks;
  }, [audit.checks, activeFilter]);

  // Color gradient for progress bar
  const getProgressGradient = (score) => {
    if (score >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    if (score >= 65) return 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
    if (score >= 45) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
  };

  if (compact) {
    // Ultra compact badge mode (can be used inside headers or list cells)
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 20,
          background: audit.badgeBg,
          border: `1px solid ${audit.badgeBorder}`,
          color: audit.badgeColor,
          fontSize: 12,
          fontWeight: 700,
        }}
        title={`${audit.score}/100 - ${audit.level} (${audit.passedCount}/${audit.totalChecks} checks passed)`}
      >
        <span>{audit.icon}</span>
        <span>SEO: {audit.score}/100</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.85 }}>({audit.level})</span>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      {/* Top Banner: Score, Level & Live Progress Meter */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div
            style={{
              ...styles.scoreBadgeCircle,
              background: audit.badgeBg,
              borderColor: audit.badgeBorder,
              color: audit.badgeColor,
            }}
          >
            <span style={styles.scoreNumber}>{audit.score}</span>
            <span style={styles.scoreOutOf}>/100</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={styles.title}>SEO Level: {audit.level}</h3>
              <span
                style={{
                  ...styles.gradeBadge,
                  background: audit.badgeBg,
                  color: audit.badgeColor,
                  border: `1px solid ${audit.badgeBorder}`,
                }}
              >
                {audit.icon} Grade {audit.grade}
              </span>
            </div>
            <p style={styles.summaryText}>{audit.summary}</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              ...styles.toggleBtn,
              background: isExpanded ? '#e2e8f0' : '#f1f5f9',
            }}
          >
            <span>{isExpanded ? 'Hide Audit Checklist ▲' : 'Inspect SEO Checklist (' + audit.passedCount + '/' + audit.totalChecks + ') ▼'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBarWrapper}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${Math.max(4, audit.score)}%`,
            background: getProgressGradient(audit.score),
          }}
        />
      </div>

      {/* Quick Metrics Bar */}
      <div style={styles.metricsBar}>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Word Count</span>
          <span style={styles.metricValue}>
            {audit.wordCount} words{' '}
            <span style={styles.metricSub}>({audit.readingTimeMinutes} min read)</span>
          </span>
        </div>

        <div style={styles.metricDivider} />

        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Focus Keyword</span>
          <span style={styles.metricValue}>
            {form.focusKeyword ? (
              <span style={{ color: '#0f172a', fontWeight: 700 }}>"{form.focusKeyword}"</span>
            ) : (
              <span style={{ color: '#ef4444' }}>Not Set</span>
            )}
          </span>
        </div>

        <div style={styles.metricDivider} />

        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Density</span>
          <span style={styles.metricValue}>
            {audit.density}%{' '}
            <span style={styles.metricSub}>({audit.occurrences}x in text)</span>
          </span>
        </div>

        <div style={styles.metricDivider} />

        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Checks Status</span>
          <span style={styles.metricValue}>
            <span style={{ color: '#16a34a' }}>✅ {audit.passedCount}</span>{' '}
            <span style={{ color: '#d97706', margin: '0 4px' }}>⚠️ {audit.warnedCount}</span>{' '}
            <span style={{ color: '#dc2626' }}>❌ {audit.failedCount}</span>
          </span>
        </div>
      </div>

      {/* Expandable Detailed Checklist */}
      {isExpanded && (
        <div style={styles.expandedSection}>
          {/* Filter Pills */}
          <div style={styles.filterRow}>
            <span style={styles.filterTitle}>Filter SEO Checks:</span>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              style={{
                ...styles.filterPill,
                ...(activeFilter === 'ALL' ? styles.filterPillActive : {}),
              }}
            >
              All ({audit.totalChecks})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('FAIL')}
              style={{
                ...styles.filterPill,
                ...(activeFilter === 'FAIL' ? styles.filterPillActive : {}),
                color: activeFilter === 'FAIL' ? '#ffffff' : '#dc2626',
                background: activeFilter === 'FAIL' ? '#dc2626' : '#fee2e2',
              }}
            >
              Needs Work ({audit.failedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('WARN')}
              style={{
                ...styles.filterPill,
                ...(activeFilter === 'WARN' ? styles.filterPillActive : {}),
                color: activeFilter === 'WARN' ? '#ffffff' : '#d97706',
                background: activeFilter === 'WARN' ? '#d97706' : '#fef3c7',
              }}
            >
              Warnings ({audit.warnedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('PASS')}
              style={{
                ...styles.filterPill,
                ...(activeFilter === 'PASS' ? styles.filterPillActive : {}),
                color: activeFilter === 'PASS' ? '#ffffff' : '#16a34a',
                background: activeFilter === 'PASS' ? '#16a34a' : '#dcfce7',
              }}
            >
              Passed ({audit.passedCount})
            </button>
          </div>

          {/* List of audit checks */}
          <div style={styles.checksGrid}>
            {filteredChecks.map((item) => {
              const isPass = item.status === 'pass';
              const isWarn = item.status === 'warn';
              const isFail = item.status === 'fail';

              const icon = isPass ? '✅' : isWarn ? '⚠️' : '❌';
              const borderLeft = isPass
                ? '3px solid #16a34a'
                : isWarn
                ? '3px solid #f59e0b'
                : '3px solid #ef4444';
              const bg = isPass ? '#f0fdf4' : isWarn ? '#fffbeb' : '#fef2f2';

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.checkItem,
                    borderLeft,
                    background: bg,
                  }}
                >
                  <div style={styles.checkTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <strong style={styles.checkTitle}>{item.title}</strong>
                    </div>
                    <span
                      style={{
                        ...styles.scoreTag,
                        color: isPass ? '#16a34a' : isWarn ? '#b45309' : '#dc2626',
                      }}
                    >
                      {item.score} / {item.maxScore} pts
                    </span>
                  </div>
                  <p style={styles.checkMsg}>{item.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    marginBottom: 20,
    transition: 'all 0.2s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  scoreBadgeCircle: {
    width: 58,
    height: 58,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2.5px solid',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1,
  },
  scoreOutOf: {
    fontSize: 9.5,
    fontWeight: 700,
    opacity: 0.75,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.2,
  },
  gradeBadge: {
    fontSize: 11,
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: 6,
    letterSpacing: '0.02em',
  },
  summaryText: {
    fontSize: 12.5,
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  toggleBtn: {
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 700,
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  progressBarWrapper: {
    width: '100%',
    height: 6,
    background: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  metricsBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    background: '#ffffff',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 120,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1e293b',
  },
  metricSub: {
    fontSize: 11,
    fontWeight: 500,
    color: '#64748b',
  },
  metricDivider: {
    width: 1,
    height: 28,
    background: '#e2e8f0',
  },
  expandedSection: {
    padding: '16px 20px 20px 20px',
    borderTop: '1px solid #f1f5f9',
    background: '#fafafa',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#475569',
    marginRight: 4,
  },
  filterPill: {
    border: 'none',
    padding: '4px 10px',
    borderRadius: 14,
    fontSize: 11.5,
    fontWeight: 700,
    cursor: 'pointer',
    background: '#e2e8f0',
    color: '#475569',
    transition: 'all 0.15s ease',
  },
  filterPillActive: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transform: 'scale(1.02)',
  },
  checksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 10,
  },
  checkItem: {
    borderRadius: 8,
    padding: '10px 12px',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  checkTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkTitle: {
    fontSize: 12.5,
    color: '#1e293b',
  },
  scoreTag: {
    fontSize: 11,
    fontWeight: 800,
  },
  checkMsg: {
    fontSize: 11.5,
    color: '#475569',
    margin: 0,
    lineHeight: 1.35,
  },
};
