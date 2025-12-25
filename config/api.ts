/// <reference types="vite/client" />

// API Configuration
// In development: uses /api (proxied by Vite)
// In production: uses VITE_API_URL environment variable

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
// Ensure URL ends with /api
export const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
