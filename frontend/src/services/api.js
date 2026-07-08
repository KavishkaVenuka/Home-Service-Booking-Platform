import axios from 'axios';

/**
 * Pre-configured Axios instance for the HomeServe API.
 *
 * - baseURL points to /api (proxied to backend via Vite in dev)
 * - Automatically attaches the JWT from localStorage to every request
 * - Handles 401 responses by clearing auth state
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach JWT ────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle Auth Errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth data and redirect to login
      localStorage.removeItem('hs_token');
      localStorage.removeItem('hs_user');
      // Avoid redirect loops on the login page itself
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
