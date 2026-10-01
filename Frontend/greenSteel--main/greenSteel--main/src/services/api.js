import axios from 'axios';
import { clearAuth, getToken } from '../utils/authStorage';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        // Optional: you can implement global logout or token refresh logic here
        // For now, we will let the components handle the exact logic
        // or just clear the token and force a reload if appropriate.
        const isAuthCall = String(error.config?.url || '').includes('/auth/');
        if (error.response.status === 401 && !isAuthCall) {
           clearAuth();
           // Session expired: send the user to sign in again (once)
           if (!['/login', '/'].includes(window.location.pathname)) {
             window.location.href = '/login?expired=1';
           }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const unwrapApiResponse = (payload) => {
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')
      && (Object.prototype.hasOwnProperty.call(payload, 'success')
        || Object.prototype.hasOwnProperty.call(payload, 'message'))) {
    return payload.data;
  }
  return payload;
};

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const response = error?.response?.data;
  if (typeof response === 'string') return response;
  return response?.message || error?.message || fallback;
};
