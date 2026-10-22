import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy & Educational Disclaimer | DL Education Connect';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={styles.badge}>LEGAL &amp; COMPLIANCE</div>
          <h1 style={styles.title}>Privacy Policy &amp; Educational Disclaimer</h1>
          <p style={styles.lastUpdated}>Last updated: October 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={styles.contentWrap}>
        <div style={styles.card}>
          {/* Section 1: Educational Disclaimer */}
          <section id="disclaimer" style={styles.section}>
            <div style={styles.disclaimerCallout}>
              <div style={styles.calloutHeader}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2 style={styles.calloutTitle}>Educational Blog Disclaimer &amp; Verification Notice</h2>
              </div>
              <p style={styles.calloutText}>
                <strong>DL Education Connect</strong> (referred to as &quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) operates as an independent informational educational blog and career counseling guidance website. We provide articles, reviews, guides, and overviews regarding distance education, universities, and courses for general educational reference.
              </p>
              <ul style={styles.calloutList}>
                <li><strong>No Claim to 100% Accuracy:</strong> While our editorial team makes sincere efforts to keep all content updated and accurate, <strong>we do not claim or guarantee 100% official correctness</strong> of any university notification, fee structure, eligibility criteria, admission dates, or syllabus.</li>
                <li><strong>Mandatory Official Verification:</strong> All admission guidelines, fees, and rules are subject to change by the respective universities, UGC-DEB, and AICTE. <strong>Students and prospective candidates are strictly advised to cross-check all details directly on the respective university&apos;s official website</strong> or admission brochure before taking any admission decision or making financial payments.</li>
                <li><strong>Non-Affiliation:</strong> DL Education Connect is an independent education portal and is not an official representative or administrative unit of any government or private university unless expressly specified.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Privacy Policy */}
          <section id="privacy" style={styles.section}>
            <h2 style={styles.sectionHeading}>1. Privacy Policy &amp; Data Collection</h2>
            <p style={styles.para}>
              We value your privacy. We collect only necessary contact details (such as name, phone number, and email) when you voluntarily submit a query or counseling request on our website.
            </p>
            <p style={styles.para}>
              Your information is used solely to respond to your educational queries and provide counseling support. We do not sell or rent your personal information to third-party commercial marketing entities.
            </p>
          </section>

          {/* Section 3: Cookies & Analytics */}
          <section style={styles.section}>
            <h2 style={styles.sectionHeading}>2. Cookies &amp; Website Analytics</h2>
            <p style={styles.para}>
              We use standard cookies and analytics to understand user behavior, monitor traffic trends, and improve website navigation. You can disable cookies in your web browser at any time.
            </p>
          </section>

          {/* Section 4: Terms of Use */}
          <section id="terms" style={styles.section}>
            <h2 style={styles.sectionHeading}>3. Terms of Use &amp; External Links</h2>
            <p style={styles.para}>
              Our articles may include external links to official university websites and government education portals. We are not responsible for the privacy practices, content, or availability of external third-party sites.
            </p>
          </section>

          {/* Section 5: Contact Information */}
          <section style={{ ...styles.section, borderBottom: 'none' }}>
            <h2 style={styles.sectionHeading}>4. Questions &amp; Contact Information</h2>
            <p style={styles.para}>
              If you have any questions or feedback regarding this disclaimer, data practices, or need clarification, please contact:
            </p>
            <div style={styles.contactBox}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#1e293b' }}>DL Education Connect Editorial Team</p>
              <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>Email: <strong>dleducationconnect@gmail.com</strong></p>
            </div>
          </section>

          <div style={styles.backWrap}>
            <Link to="/" style={styles.backBtn}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    background: '#f8fafc',
    paddingBottom: 60,
  },
  header: {
    background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)',
    color: '#ffffff',
    padding: '48px 0 40px 0',
  },
  headerInner: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 20,
    background: 'rgba(188, 143, 143, 0.22)',
    color: '#fbcfe8',
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '1px',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: '0 0 8px 0',
    color: '#ffffff',
  },
  lastUpdated: {
    fontSize: 13,
    color: '#94a3b8',
    margin: 0,
  },
  contentWrap: {
    maxWidth: 860,
    margin: '-24px auto 0 auto',
    padding: '0 16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: 12,
    padding: '36px 32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
  },
  section: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottom: '1px solid #f1f5f9',
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 12,
  },
  para: {
    fontSize: 14.5,
    lineHeight: 1.7,
    color: '#334155',
    margin: '0 0 12px 0',
  },
  disclaimerCallout: {
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderLeft: '4px solid #2563eb',
    borderRadius: 8,
    padding: '20px 22px',
  },
  calloutHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  calloutText: {
    fontSize: 14.5,
    lineHeight: 1.65,
    color: '#334155',
    margin: '0 0 12px 0',
  },
  calloutList: {
    margin: 0,
    paddingLeft: 20,
    color: '#334155',
    lineHeight: 1.65,
    fontSize: 14,
  },
  contactBox: {
    background: '#f1f5f9',
    padding: '14px 18px',
    borderRadius: 8,
    marginTop: 10,
  },
  backWrap: {
    marginTop: 20,
    textAlign: 'center',
  },
  backBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#0a192f',
    color: '#ffffff',
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    transition: 'background 0.2s',
  },
};
