import axios from 'axios';

// Get API Base URL from environment variable, stripping any trailing slash
// If VITE_API_URL is empty (e.g. in local Vite development), relative paths like /api/... work with the Vite dev proxy
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : '';

// Configure global axios defaults so all existing axios calls throughout the app use the correct base URL and send cookies
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}
axios.defaults.withCredentials = true;

// Pre-configured axios instance for explicit use
export const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';

/**
 * Universal image URL resolver.
 * Replaces hardcoded localhost:5000 references and supports:
 * - Direct Cloudinary URLs (https://res.cloudinary.com/...)
 * - External image URLs (https://images.unsplash.com/...)
 * - Local /uploads/... paths (prepends API_BASE_URL in production, or uses dev proxy)
 * - Object formats: { url: '...' }
 */
export const getImageUrl = (coverImage) => {
  if (!coverImage) return DEFAULT_FALLBACK_IMAGE;

  let url = '';
  if (typeof coverImage === 'string') {
    url = coverImage;
  } else if (typeof coverImage === 'object' && coverImage.url) {
    url = coverImage.url;
  }

  if (!url) return DEFAULT_FALLBACK_IMAGE;

  // Already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    // If it was inadvertently saved with localhost:5000 in DB, rewrite to API_BASE_URL or relative
    if (url.includes('localhost:5000')) {
      const pathPart = url.split('localhost:5000')[1];
      return API_BASE_URL ? `${API_BASE_URL}${pathPart}` : pathPart;
    }
    return url;
  }

  // Relative path (like /uploads/...)
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export default api;
