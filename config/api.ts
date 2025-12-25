// API Configuration
// In development: uses /api (proxied by Vite)
// In production: uses VITE_API_URL environment variable

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
