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
    // Check if user is logged in
    axios
      .get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        if (res.data) setUser(res.data.user || res.data);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('token');
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} authLoading={authLoading} />
    </Router>
  );
}
