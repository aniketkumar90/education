import { useState } from 'react';

const INITIAL_INQUIRIES = [];

export default function AdminInquiriesTable({ onViewAll }) {
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUALIFIED':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'CONTACTED':
        return { bg: '#dbeafe', text: '#1d4ed8' };
      default:
        return { bg: '#fef3c7', text: '#b45309' };
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Recent Inquiries & Leads</h3>
          <p style={styles.desc}>Latest leads submitted via website contact & admission forms</p>
        </div>
        {onViewAll && (
          <button type="button" onClick={onViewAll} style={styles.viewAllBtn}>
            View All Leads →
          </button>
        )}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>CONTACT</th>
              <th style={styles.th}>TARGET PROGRAM / COURSE</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
                  <p style={{ margin: 0, fontWeight: 600 }}>No inquiries yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>New admission leads and inquiries will appear here.</p>
                </td>
              </tr>
            ) : (
              inquiries.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.tdName}>{item.name}</td>
                    <td style={styles.td}>
                      <div style={styles.contactPhone}>{item.phone}</div>
                      <div style={styles.contactEmail}>{item.email}</div>
                    </td>
                    <td style={styles.tdCourse}>{item.course}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: badge.bg, color: badge.text }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.tdDate}>{item.date}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    flex: 1.6,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    margin: '3px 0 0 0',
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#d97706',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },
  tableWrap: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  },
  table: {
    width: '100%',
    minWidth: 600,
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  th: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: 0.6,
    padding: '10px 12px 10px 0',
  },
  tr: {
    borderBottom: '1px solid #f8fafc',
    transition: 'background 0.12s ease',
  },
  td: {
    padding: '12px 12px 12px 0',
    fontSize: 12.5,
  },
  tdName: {
    padding: '12px 12px 12px 0',
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  contactPhone: {
    fontSize: 12.5,
    fontWeight: 600,
    color: '#1e293b',
  },
  contactEmail: {
    fontSize: 11,
    color: '#94a3b8',
  },
  tdCourse: {
    padding: '12px 12px 12px 0',
    fontSize: 12.5,
    color: '#334155',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  tdDate: {
    padding: '12px 0',
    fontSize: 11.5,
    color: '#94a3b8',
  },
};
