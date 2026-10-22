import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ErrorBoundary from './components/ErrorBoundary';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // If not navigating with an explicit category on home page, scroll to top
    if (!location.search.includes('category')) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

// Sub-component to manage whether Navbar/Footer should show on Admin page if desired
function AppContent({ user, setUser, authLoading }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {!isAdminRoute && <Navbar user={user} setUser={setUser} />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login user={user} setUser={setUser} />} />
          <Route
            path="/admin"
            element={
              authLoading ? (
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: 14 }}>Loading...</div>
                </div>
              ) : user ? (
                <Admin user={user} setUser={setUser} />
              ) : localStorage.getItem('token') ? (
                // Token exists but auth check may have failed due to cold start — attempt to access Admin
                // The Admin page itself will redirect to login if the token is truly invalid
                <Admin user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via stored token or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = token && token !== 'null' && token !== 'undefined'
      ? { Authorization: `Bearer ${token}` }
      : {};

    axios
      .get('/api/auth/me', { withCredentials: true, headers })
      .then((res) => {
        if (res.data) setUser(res.data.user || res.data);
      })
      .catch((err) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || '';
        // Only clear token if server explicitly confirms token is expired/invalid, not when token was just omitted
        if (status === 401 && (msg.includes('invalid') || msg.includes('expired'))) {
          setUser(null);
          localStorage.removeItem('token');
        } else if (status === 403) {
          setUser(null);
        }
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AppContent user={user} setUser={setUser} authLoading={authLoading} />
      </Router>
    </ErrorBoundary>
  );
}
