import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Modular Admin Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminStatCards from '../components/admin/AdminStatCards';
import AdminQuickActions from '../components/admin/AdminQuickActions';
import AdminInquiriesTable from '../components/admin/AdminInquiriesTable';
import AdminLatestArticlesWidget from '../components/admin/AdminLatestArticlesWidget';
import AdminBlogList from '../components/admin/AdminBlogList';
import SeoBlogForm from '../components/admin/SeoBlogForm';

const CATEGORIES = ['University', 'Courses', 'SEO Basics', 'IT', 'Education', 'Technology', 'Digital Marketing'];

export default function Admin({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'blogs' | 'create-blog' | 'inquiries' | 'users' | 'profile'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);

  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    enrolled: 0,
  });

  // Default fallback user if not logged in
  const currentUser = user || {
    name: 'Admin',
    email: 'admin@dleducationconnect.in',
    role: 'admin',
  };

  // Fetch blogs data and inquiry stats
  useEffect(() => {
    // If user prop is null but token exists (e.g. cold-start auth failure), re-attempt profile fetch
    const token = localStorage.getItem('token');
    if (!user && token && setUser) {
      axios
        .get('/api/auth/me', { withCredentials: true })
        .then((res) => {
          if (res.data) setUser(res.data.user || res.data);
        })
        .catch((err) => {
          // If 401 — token is truly invalid, redirect to login
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
          }
        });
    }
    fetchBlogs();
    fetchInquiryStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInquiryStats = async () => {
    try {
      const { data } = await axios.get('/api/inquiries/stats', { withCredentials: true });
      if (data) {
        setInquiryStats({
          total: data.total || 0,
          new: data.new || 0,
          contacted: data.contacted || 0,
          qualified: data.qualified || 0,
          enrolled: data.enrolled || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch inquiry stats:', err);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const { data } = await axios.get('/api/blogs?status=all&limit=200', { withCredentials: true, headers });
      setBlogs(Array.isArray(data?.blogs) ? data.blogs.filter(Boolean) : []);
    } catch (err) {
      console.error('Failed to fetch blogs from database:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    const nextStatus = blog.status === 'Draft' ? 'Published' : 'Draft';
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.put(
        `/api/blogs/${blog._id}`,
        { status: nextStatus, published: nextStatus === 'Published' },
        { withCredentials: true, headers }
      );
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id
            ? { ...b, status: nextStatus, published: nextStatus === 'Published' }
            : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update post status.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      await axios.delete(`/api/blogs/${id}`, { withCredentials: true, headers });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog post.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    navigate('/login');
  };

  const handleAddNewPost = () => {
    setEditingBlog(null);
    setActiveTab('create-blog');
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setActiveTab('create-blog');
  };

  // Compute live stats safely
  const safeBlogs = Array.isArray(blogs) ? blogs.filter(Boolean) : [];
  const stats = {
    totalBlogs: safeBlogs.length,
    publishedBlogs: safeBlogs.filter((b) => b && b.status !== 'Draft').length,
    universityCount: safeBlogs.filter((b) => b && (b.category || '').toLowerCase().includes('univ')).length,
    coursesCount: safeBlogs.filter((b) => b && (b.category || '').toLowerCase().includes('course')).length,
    totalInquiries: inquiryStats?.total || 0,
    newLeads: inquiryStats?.new || 0,
    userCount: 1,
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'blogs':
        return 'Articles & Blogs Management';
      case 'create-blog':
        return editingBlog ? `Edit Article: ${editingBlog.title}` : 'Add New SEO Education Article';
      case 'inquiries':
        return 'Inquiries & Admission Leads';
      case 'users':
        return 'Admin User Accounts';
      case 'profile':
        return 'Admin Profile & Settings';
      default:
        return 'Admin Suite';
    }
  };

  return (
    <div className="admin-layout" style={styles.layout}>
      {/* 1. Dark Navy Sidebar (matching SPM Admin Suite in screenshot) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="admin-main-container" style={styles.mainContainer}>
        {/* Top Header Bar */}
        <AdminHeader
          user={currentUser}
          title={getPageTitle()}
          onAddNewPost={handleAddNewPost}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable View Area */}
        <div className="admin-content-area" style={styles.contentArea}>
          {/* TAB 1: DASHBOARD OVERVIEW (Matches user screenshot exactly) */}
          {activeTab === 'dashboard' && (
            <div>
              {/* 4 Stat Cards */}
              <AdminStatCards stats={stats} />

              {/* Quick Actions Strip */}
              <AdminQuickActions
                onAddPost={handleAddNewPost}
                onManageBlogs={() => setActiveTab('blogs')}
                onViewInquiries={() => setActiveTab('inquiries')}
              />

              {/* Two Column Grid: Recent Inquiries Table & Latest Articles Widget */}
              <div style={styles.dashboardTwoCol}>
                <AdminInquiriesTable
                  onViewAll={() => setActiveTab('inquiries')}
                  onStatsUpdate={(s) => setInquiryStats((prev) => ({ ...prev, ...s }))}
                />
                <AdminLatestArticlesWidget
                  blogs={blogs}
                  onManage={() => setActiveTab('blogs')}
                  onEditBlog={handleEditBlog}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            </div>
          )}

          {/* TAB 2: ALL ARTICLES & BLOGS */}
          {activeTab === 'blogs' && (
            <AdminBlogList
              blogs={blogs}
              loading={loading}
              onAddNewPost={handleAddNewPost}
              onDeleteBlog={handleDeleteBlog}
              onToggleStatus={handleToggleStatus}
              onEditBlog={handleEditBlog}
            />
          )}

          {/* TAB 3: ADD NEW POST (14 SEO Fields Form with Rich selection toolbar) */}
          {activeTab === 'create-blog' && (
            <div className="admin-form-container" style={styles.formContainer}>
              <div className="admin-form-header" style={styles.formHeader}>
                <div>
                  <h2 style={styles.formTitle}>
                    {editingBlog ? '✏️ Edit Education Blog' : '📝 Add New SEO Education Blog'}
                  </h2>
                  <p style={styles.formSubtitle}>
                    {editingBlog
                      ? `Editing: "${editingBlog.title}"`
                      : 'Fill in all 14 SEO fields to maximize Google ranking, CTR, and search traffic'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setActiveTab('dashboard');
                  }}
                  style={styles.backBtn}
                >
                  ← Back to Dashboard
                </button>
              </div>

              <SeoBlogForm
                blogToEdit={editingBlog}
                categories={CATEGORIES}
                onSuccess={() => {
                  setEditingBlog(null);
                  fetchBlogs();
                  setActiveTab('blogs');
                }}
                onCancel={() => {
                  setEditingBlog(null);
                  setActiveTab('dashboard');
                }}
              />
            </div>
          )}

          {/* TAB 4: INQUIRIES & LEADS */}
          {activeTab === 'inquiries' && (
            <div>
              <AdminInquiriesTable
                isFullPage={true}
                onStatsUpdate={(s) => setInquiryStats((prev) => ({ ...prev, ...s }))}
              />
            </div>
          )}

          {/* TAB 5: USER ACCOUNTS */}
          {activeTab === 'users' && (
            <div style={styles.cardBox}>
              <h3 style={styles.cardBoxTitle}>Registered Administrator Accounts</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                Manage team members who have permission to publish content.
              </p>
              <div style={styles.userRow}>
                <div style={styles.userAvatarBig}>{user?.name?.charAt(0) || 'A'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{user?.name || 'Administrator'}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email || 'admin@dleducationconnect.in'}</div>
                </div>
                <span style={styles.activeRoleBadge}>SUPER ADMIN</span>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN PROFILE */}
          {activeTab === 'profile' && (
            <div style={styles.cardBox}>
              <h3 style={styles.cardBoxTitle}>Admin Profile & Credentials</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                Your administrative profile and session details.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 450 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Name</label>
                  <input type="text" readOnly value={user?.name || 'Aniket Kumar'} style={styles.readInput} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Email</label>
                  <input type="text" readOnly value={user?.email || 'admin@dleducationconnect.in'} style={styles.readInput} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Role</label>
                  <input type="text" readOnly value="System Administrator" style={styles.readInput} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8fafc',
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
  },
  contentArea: {
    padding: '28px 32px',
    flex: 1,
  },
  dashboardTwoCol: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  formContainer: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '28px 32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: '3px 0 0 0',
  },
  backBtn: {
    background: '#ffffff',
    border: '1.5px solid #cbd5e1',
    color: '#334155',
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  cardBox: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '28px 32px',
    border: '1px solid #e2e8f0',
    maxWidth: 800,
  },
  cardBoxTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px',
    background: '#f8fafc',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  },
  userAvatarBig: {
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: '#d97706',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 18,
  },
  activeRoleBadge: {
    fontSize: 11,
    fontWeight: 800,
    background: '#ecfdf5',
    color: '#059669',
    padding: '4px 12px',
    borderRadius: 20,
    letterSpacing: 0.5,
  },
  readInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 6,
    border: '1.5px solid #e2e8f0',
    background: '#f1f5f9',
    color: '#334155',
    fontSize: 13,
    fontWeight: 600,
    marginTop: 4,
  },
};
