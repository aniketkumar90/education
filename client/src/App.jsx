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
import ErrorBoundary from './components/ErrorBoundary';

// Sub-component to manage whether Navbar/Footer should show on Admin page if desired
function AppContent({ user, setUser, authLoading }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar user={user} setUser={setUser} />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
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
    // Only clear the token on explicit 401 (unauthorized) — NOT on network errors or cold-start failures
    axios
      .get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        if (res.data) setUser(res.data.user || res.data);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // Only clear token if server explicitly rejects the session
          setUser(null);
          localStorage.removeItem('token');
        }
        // For network errors, DB cold starts, 5xx — keep token, allow retry on next navigation
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
