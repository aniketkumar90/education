import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'ENROLLED', 'REJECTED'];

export default function AdminInquiriesTable({ onViewAll, isFullPage = false, onStatsUpdate }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    subCourse: '',
    studyMode: 'Distance Learning',
    admissionPlanning: 'Immediate (2026 Batch)',
    source: 'Admin Manual Entry',
    notes: '',
  });
  const [addingLead, setAddingLead] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [selectedStatus]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const statusParam = selectedStatus !== 'ALL' ? `&status=${selectedStatus}` : '';
      const limitParam = isFullPage ? 100 : 10;
      const { data } = await axios.get(`/api/inquiries?limit=${limitParam}${statusParam}`, {
        withCredentials: true,
      });

      const list = data.inquiries || [];
      setInquiries(list);

      if (data.stats && onStatsUpdate) {
        onStatsUpdate(data.stats);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      setError('Failed to load inquiries from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(
        `/api/inquiries/${id}`,
        { status: nextStatus },
        { withCredentials: true }
      );
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lead status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete lead for "${name || 'Student'}"?`)) {
      return;
    }
    try {
      await axios.delete(`/api/inquiries/${id}`, { withCredentials: true });
      setInquiries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleAddLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      alert('Name and Phone number are required.');
      return;
    }

    setAddingLead(true);
    try {
      const { data } = await axios.post('/api/inquiries', newLead, { withCredentials: true });
      if (data.inquiry) {
        setInquiries((prev) => [data.inquiry, ...prev]);
      }
      setShowAddModal(false);
      setNewLead({
        name: '',
        phone: '',
        email: '',
        course: '',
        subCourse: '',
        studyMode: 'Distance Learning',
        admissionPlanning: 'Immediate (2026 Batch)',
        source: 'Admin Manual Entry',
        notes: '',
      });
      alert('New lead added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create lead.');
    } finally {
      setAddingLead(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUALIFIED':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'CONTACTED':
        return { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' };
      case 'ENROLLED':
        return { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' };
      case 'REJECTED':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
      case 'NEW':
      default:
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.course || '').toLowerCase().includes(q) ||
      (item.subCourse || '').toLowerCase().includes(q) ||
      (item.source || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={isFullPage ? styles.cardFull : styles.card}>
      {/* Header bar */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={styles.title}>
              {isFullPage ? '🎓 All Inquiries & Admission Leads' : 'Recent Inquiries & Leads'}
            </h3>
            <span style={styles.countBadge}>{filteredInquiries.length} Leads</span>
          </div>
          <p style={styles.desc}>
            Direct student inquiries received via website admission forms & counseling popups
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={styles.addLeadBtn}
          >
            + Add New Lead
          </button>

          <button
            type="button"
            onClick={fetchInquiries}
            title="Refresh Leads"
            style={styles.refreshBtn}
          >
            ↻ Refresh
          </button>

          {!isFullPage && onViewAll && (
            <button type="button" onClick={onViewAll} style={styles.viewAllBtn}>
              View All Leads →
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by student name, phone, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={styles.statusTabs}>
          {['ALL', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              style={{
                ...styles.statusTab,
                background: selectedStatus === status ? '#0f172a' : '#f1f5f9',
                color: selectedStatus === status ? '#ffffff' : '#475569',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
            <div className="skeleton" style={{ height: 40, marginBottom: 12, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 40, marginBottom: 12, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 40, borderRadius: 8 }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#ef4444' }}>
            <p style={{ fontWeight: 700 }}>{error}</p>
            <button type="button" onClick={fetchInquiries} style={styles.retryBtn}>
              Retry Loading
            </button>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>STUDENT NAME</th>
                <th style={styles.th}>CONTACT</th>
                <th style={styles.th}>COURSE & MODE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>SOURCE & TIMING</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>No leads match your filter</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                      Leads submitted from the website application forms will automatically appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const createdDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr key={item._id} style={styles.tr}>
                      {/* Name */}
                      <td style={styles.tdName}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                        {item.admissionPlanning && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            🗓 {item.admissionPlanning}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td style={styles.td}>
                        <div style={styles.contactPhone}>
                          <a
                            href={`tel:${item.phone}`}
                            style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}
                          >
                            📞 {item.phone}
                          </a>
                        </div>
                        {item.email && (
                          <div style={styles.contactEmail}>
                            <a
                              href={`mailto:${item.email}`}
                              style={{ color: '#64748b', textDecoration: 'none' }}
                            >
                              ✉️ {item.email}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Course & Mode */}
                      <td style={styles.tdCourse}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>
                          {item.course || 'General Admission'}
                        </div>
                        {item.subCourse && (
                          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 600 }}>
                            {item.subCourse}
                          </div>
                        )}
                        {item.studyMode && (
                          <span style={styles.modeTag}>
                            {item.studyMode}
                          </span>
                        )}
                      </td>

                      {/* Interactive Status Selector */}
                      <td style={styles.td}>
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          style={{
                            ...styles.statusSelect,
                            background: badge.bg,
                            color: badge.text,
                            borderColor: badge.border,
                          }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} style={{ background: '#fff', color: '#0f172a' }}>
                              ● {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Source & Date */}
                      <td style={styles.tdDate}>
                        <div style={{ fontWeight: 600, color: '#334155', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.source || 'Website'}>
                          {item.source || 'Website Application'}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                          {createdDate}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <a
                            href={`https://wa.me/91${(item.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${item.name}, thank you for inquiring about admission at DLEducationConnect.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.whatsappBtn}
                            title="Chat on WhatsApp"
                          >
                            WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, item.name)}
                            style={styles.deleteBtn}
                            title="Delete Lead"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add Manual Lead */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                ➕ Add New Admission Lead
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} style={styles.modalForm}>
              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Preferred Study Mode</label>
                  <select
                    value={newLead.studyMode}
                    onChange={(e) => setNewLead({ ...newLead, studyMode: e.target.value })}
                    style={styles.input}
                  >
                    <option value="Distance Learning">Distance Learning</option>
                    <option value="Online Learning">Online Learning</option>
                    <option value="Regular / Campus">Regular / Campus</option>
                    <option value="Part-Time / Hybrid">Part-Time / Hybrid</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Course / Stream</label>
                  <input
                    type="text"
                    placeholder="e.g. MBA / MCA / BCA"
                    value={newLead.course}
                    onChange={(e) => setNewLead({ ...newLead, course: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Finance / Data Science"
                    value={newLead.subCourse}
                    onChange={(e) => setNewLead({ ...newLead, subCourse: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Lead Source / Counselor Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes from initial conversation..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLead}
                  style={styles.saveLeadBtn}
                >
                  {addingLead ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  cardFull: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '24px 28px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: 800,
    background: '#eff6ff',
    color: '#2563eb',
    padding: '2px 8px',
    borderRadius: 12,
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    margin: '3px 0 0 0',
  },
  addLeadBtn: {
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  refreshBtn: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#475569',
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
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
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '6px 12px',
    minWidth: 260,
    flex: 1,
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 12.5,
    width: '100%',
    color: '#0f172a',
  },
  statusTabs: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusTab: {
    border: 'none',
    padding: '5px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.4,
    transition: 'all 0.15s ease',
  },
  tableWrap: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  },
  table: {
    width: '100%',
    minWidth: 700,
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
    verticalAlign: 'middle',
  },
  tdName: {
    padding: '12px 12px 12px 0',
    fontSize: 13,
    verticalAlign: 'middle',
  },
  contactPhone: {
    fontSize: 12.5,
    fontWeight: 600,
  },
  contactEmail: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  tdCourse: {
    padding: '12px 12px 12px 0',
    fontSize: 12.5,
    verticalAlign: 'middle',
  },
  modeTag: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    background: '#f1f5f9',
    color: '#475569',
    padding: '1px 6px',
    borderRadius: 4,
    marginTop: 3,
  },
  statusSelect: {
    border: '1px solid',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: 11,
    fontWeight: 800,
    cursor: 'pointer',
    outline: 'none',
  },
  tdDate: {
    padding: '12px 12px 12px 0',
    fontSize: 11.5,
    verticalAlign: 'middle',
  },
  whatsappBtn: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    background: '#25D366',
    color: '#ffffff',
    textDecoration: 'none',
  },
  deleteBtn: {
    background: '#fee2e2',
    border: 'none',
    color: '#dc2626',
    borderRadius: 6,
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: 12,
  },
  retryBtn: {
    marginTop: 10,
    background: '#0f172a',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modalBox: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '24px 28px',
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: '#94a3b8',
    cursor: 'pointer',
    fontWeight: 700,
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  label: {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  saveLeadBtn: {
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
