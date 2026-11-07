import axios from 'axios';

// Base URL from env or fallback to local backend
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

