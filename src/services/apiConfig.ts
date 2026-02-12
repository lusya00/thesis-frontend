import axios from 'axios';
import { debugLog, debugError, debugWarn } from '../lib/utils';

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Debug flag - only enable when explicitly set to 'true'
const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true';

// Get auth token from local storage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // First try to get token directly
    let token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    
    // If no token found, try to get it from user object
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || user.accessToken || null;
      }
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Create a custom axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Changed from true to avoid CORS issues
  headers: {
    'Content-Type': 'application/json'
  },
  // Increased timeout for slow connections
  timeout: 15000, // 15 seconds
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    // Debug log for requests
    if (DEBUG_API) {
      debugLog(`🌐 API Request [${config.method?.toUpperCase()}]:`, config.url, {
        params: config.params,
        data: config.data
      });
    }
    
    // Add JWT token to header if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (DEBUG_API) debugLog('🔑 Adding token to request');
    } else if (DEBUG_API) {
      debugWarn('⚠️ No auth token available for request');
    }
    
    return config;
  },
  error => {
    debugError('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Debug log for successful responses
    if (DEBUG_API) {
      debugLog(`✅ API Response [${response.status}]:`, response.config.url, {
        headers: response.headers,
        data: response.data
      });
    }
    
    // Normalize response structure
    // Some APIs return { data: {...} }, others return data directly
    if (response.data && response.data.hasOwnProperty('data')) {
      const originalData = response.data;
      response.data = response.data.data;
      // Preserve other properties like status, message, etc.
      Object.keys(originalData).forEach(key => {
        if (key !== 'data') {
          response.data[key] = originalData[key];
        }
      });
    }
    
    return response;
  },
  async error => {
    // Enhanced error logging
    if (DEBUG_API) {
      console.error('❌ API Response Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        stack: error.stack
      });
    }
    
    const originalRequest = error.config;
    
    // Handle network errors or server not reachable
    if (!error.response) {
      console.error('Network error or server not reachable');
      // You could implement retry logic here
      return Promise.reject(new Error('Network error: The server is not reachable. Please check your internet connection.'));
    }
    
    // Handle 401 (Unauthorized) errors - redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        debugLog('Clearing invalid auth tokens');
        localStorage.removeItem('token');
        
        // Also try to remove token from user object if it exists
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.token) {
              delete user.token;
              localStorage.setItem('user', JSON.stringify(user));
            }
          } catch (e) {
            console.error('Error updating user object:', e);
          }
        }
      }
      
      // Check if we're already on the login page to avoid redirect loop
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        debugLog('Redirecting to login page due to authentication error');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
    
    // Handle 403 (Forbidden) errors
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data.message || 'You do not have permission to access this resource');
    }
    
    // Handle 500 (Server Error) errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data.message || 'An unexpected server error occurred');
    }
    
    // Special case for handling JSON parsing errors in response
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML instead of JSON response');
      error.response.data = { message: 'The server returned an invalid response' };
    }
    
    return Promise.reject(error);
  }
);

export default api; 