import axios from 'axios';
import { googleOAuthService } from './googleOAuthService';
import { debugLog, debugError, debugWarn } from '../utils';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone_number: string;
  type?: 'user' | 'guest';
  passport?: string;
  country?: string;
  address?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  last_name: string;
  phone_number: string;
  type: 'user' | 'guest' | 'admin';
  role?: string; // For admin users
  country?: string;
  address?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // OAuth related fields
  oauth_provider?: string;
  oauth_id?: string;
  oauth_picture?: string;
  auth_methods?: string[];
}

export interface AuthResponse {
  status: 'success' | 'fail' | 'error';
  data?: {
    token: string;
    user: User;
    is_new?: boolean;
  };
  message?: string;
}

// Helper functions for token management
const getToken = (): string | null => localStorage.getItem('jwt_token');
const setToken = (token: string): void => localStorage.setItem('jwt_token', token);
const removeToken = (): void => localStorage.removeItem('jwt_token');

const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const setUser = (user: User): void => localStorage.setItem('user', JSON.stringify(user));
const removeUser = (): void => localStorage.removeItem('user');

export const authService = {
  // Login user (for landing page users)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/login`, credentials);
      
      if (response.data.status === 'success' && response.data.data?.token) {
        setToken(response.data.data.token);
        
        // Handle different possible ID field names from backend
        let userData = response.data.data.user;
        debugLog('[AUTH] Raw login user data:', userData);
        
        // Check if user data is nested under a "user" field
        if (userData && userData.user && typeof userData.user === 'object') {
          debugLog('[AUTH] Found nested user data in login, extracting...');
          userData = userData.user;
          debugLog('[AUTH] Extracted login user data:', userData);
        }
        
        if (!userData.id && userData.user_id) {
          userData.id = userData.user_id;
        }
        if (!userData.id && userData.userId) {
          userData.id = userData.userId;
        }
        
        debugLog('[AUTH] Login successful, user data:', userData);
        debugLog('[AUTH] Login user fields:', Object.keys(userData));
        setUser(userData);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  // Register new user (for landing page users)
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/register`, userData);
      
      if (response.data.status === 'success' && response.data.data?.token) {
        setToken(response.data.data.token);
        
        // Handle different possible ID field names from backend
        let user = response.data.data.user;
        debugLog('[AUTH] Raw signup user data:', user);
        
        // Check if user data is nested under a "user" field
        if (user && user.user && typeof user.user === 'object') {
          debugLog('[AUTH] Found nested user data in signup, extracting...');
          user = user.user;
          debugLog('[AUTH] Extracted signup user data:', user);
        }
        
        if (!user.id && user.user_id) {
          user.id = user.user_id;
        }
        if (!user.id && user.userId) {
          user.id = user.userId;
        }
        
        debugLog('[AUTH] Signup successful, user data:', user);
        debugLog('[AUTH] Signup user fields:', Object.keys(user));
        setUser(user);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  // Google OAuth login/signup
  googleAuth: async (token: string): Promise<AuthResponse> => {
    try {
      // Store the token first
      setToken(token);
      
      // Validate the token and get user data
      const isValid = await authService.validateToken();
      
      if (isValid) {
        const user = authService.getCurrentUser();
        return {
          status: 'success',
          data: {
            token,
            user: user!
          }
        };
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      debugError('Google OAuth error:', error);
      authService.logout();
      throw error;
    }
  },

  // Get OAuth status for current user
  getOAuthStatus: async (): Promise<any> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      return await googleOAuthService.getOAuthStatus(token);
    } catch (error) {
      debugError('Error getting OAuth status:', error);
      throw error;
    }
  },

  // Link Google account to current user
  linkGoogleAccount: async (code: string, state: string): Promise<any> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await googleOAuthService.linkGoogleAccount(token, code, state);
      
      if (response.status === 'success') {
        // Refresh user data
        await authService.validateToken();
      }
      
      return response;
    } catch (error) {
      debugError('Error linking Google account:', error);
      throw error;
    }
  },

  // Unlink Google account from current user
  unlinkGoogleAccount: async (): Promise<any> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await googleOAuthService.unlinkGoogleAccount(token);
      
      if (response.status === 'success') {
        // Refresh user data
        await authService.validateToken();
      }
      
      return response;
    } catch (error) {
      debugError('Error unlinking Google account:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: (): void => {
    removeToken();
    removeUser();
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    return getUser();
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.put(`${API_BASE_URL}/profile/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success' && response.data.data?.user) {
        setUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async (): Promise<User | null> => {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }
      
      const response = await axios.get(`${API_BASE_URL}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success' && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      debugError('Error fetching user profile:', error);
      return null;
    }
  },
  
  // Get authentication token
  getAuthToken: (): string | null => {
    return getToken();
  },
  
  // Check if current user has specific role
  hasRole: (roles: string[]): boolean => {
    const user = getUser();
    if (!user) return false;
    return roles.includes(user.type);
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = getUser();
    if (!user) return false;
    return user.type === 'admin' || user.role === 'admin';
  },
  
  // Validate if the current token is still valid
  validateToken: async (): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) {
        debugLog('[AUTH] No token found');
        return false;
      }
      
      debugLog('[AUTH] Validating token...');
      const response = await axios.get(`${API_BASE_URL}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        debugLog('[AUTH] Token is valid');
        // Update user data with fresh data from server
        if (response.data.data) {
          let userData = response.data.data;
          debugLog('[AUTH] Raw user data from server:', userData);
          
          // Check if user data is nested under a "user" field
          if (userData.user && typeof userData.user === 'object') {
            debugLog('[AUTH] Found nested user data, extracting...');
            userData = userData.user;
            debugLog('[AUTH] Extracted user data:', userData);
          }
          
          // Handle different possible ID field names from backend
          if (!userData.id && userData.user_id) {
            userData.id = userData.user_id;
          }
          if (!userData.id && userData.userId) {
            userData.id = userData.userId;
          }
          
          debugLog('[AUTH] Processed user data with ID:', userData.id);
          debugLog('[AUTH] Final user object fields:', Object.keys(userData));
          setUser(userData);
          debugLog('[AUTH] Updated user data:', userData);
        }
        return true;
      } else {
        debugLog('[AUTH] Token validation failed:', response.data);
        return false;
      }
    } catch (error) {
      debugError('[AUTH] Token validation error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token is invalid, clear it
        removeToken();
        removeUser();
      }
      return false;
    }
  },
  
  // Fix user type if needed
  fixUserType: async (): Promise<boolean> => {
    try {
      const currentUser = getUser();
      if (!currentUser) return false;
      
      debugLog('[AUTH] Current user type:', currentUser.type);
      
      // If user type is missing or 'guest', try to update to 'user'
      if (!currentUser.type || currentUser.type === 'guest') {
        debugLog('[AUTH] Attempting to update user type to "user"');
        const updateResult = await authService.updateProfile({ type: 'user' });
        if (updateResult.status === 'success') {
          debugLog('[AUTH] Successfully updated user type');
          return true;
        }
      }
      
      return true;
    } catch (error) {
      debugError('[AUTH] Error fixing user type:', error);
      return false;
    }
  },

  // Test API connection
  testConnection: async (): Promise<boolean> => {
    try {
      debugLog('[AUTH] Testing API connection to:', API_BASE_URL);
      // Instead of /health, try to use the profile endpoint which we know exists
      const token = getToken();
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/profile/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5 second timeout
        });
        debugLog('[AUTH] API connection test successful via profile endpoint:', response.status);
        return true;
      } else {
        // If no token, just try a general endpoint to check if server is responding
        debugLog('[AUTH] No token available, skipping API connection test');
        return true; // Assume it's working for now
      }
    } catch (error) {
      debugWarn('[AUTH] API connection test failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        debugError('[AUTH] Backend server is not running or not reachable');
      } else if (error.code === 'ETIMEDOUT') {
        debugError('[AUTH] Connection timed out - backend might be slow to respond');
      }
      // Don't fail hard on connection test - just warn
      return false;
    }
  }
}; 