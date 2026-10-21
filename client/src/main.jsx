import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './api/api.js'
import './index.css'
import App from './App.jsx'

// Ensure page always starts from the top on page refresh or reload
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
