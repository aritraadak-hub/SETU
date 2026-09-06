import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
let baseURL = '/api';

if (rawApiUrl) {
  // Normalize URL to prevent duplicate or missing /api and remove trailing slashes
  baseURL = rawApiUrl.replace(/\/+$/, '');
  if (!baseURL.endsWith('/api') && !baseURL.includes('/api/')) {
    baseURL = `${baseURL}/api`;
  }
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token from localStorage for cross-origin and cookie-fallback auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('setu_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
