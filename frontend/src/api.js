import axios from 'axios';

// Smart environment fallback: in dev use localhost:5000, in production use live Render URL
const defaultUrl = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://complaint-tracker-project.onrender.com';

const rawUrl = (import.meta.env.VITE_API_URL || defaultUrl).trim().replace(/\/+$/, '');
const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const api = axios.create({
  baseURL
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

