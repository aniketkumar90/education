export default function Hero() {
  return (
    <section style={styles.hero}>
      <div className="container" style={styles.inner}>
        <h1 style={styles.title}>
          Fast. Secure. SEO-Ready Education Blogs.
        </h1>
        <p style={styles.subtitle}>
          Optimized visuals for fast performance and SEO.
        </p>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    background: '#f8fafc',
    padding: '48px 0 36px',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    fontSize: 'clamp(26px, 3.8vw, 36px)',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    lineHeight: 1.25,
    marginBottom: 10,
    fontFamily: 'var(--font)',
  },
  subtitle: {
    fontSize: 'clamp(14px, 1.8vw, 16px)',
    color: '#64748b',
    fontWeight: 400,
    margin: 0,
    fontFamily: 'var(--font)',
  },
};
