import axios from 'axios';
import { debugLog, debugError } from '../utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface GoogleOAuthResponse {
  status: 'success' | 'fail' | 'error';
  data?: {
    auth_url: string;
  };
  message?: string;
}

export interface GoogleOAuthStatus {
  status: 'success' | 'fail' | 'error';
  data?: {
    has_google_linked: boolean;
    can_unlink_google: boolean;
    oauth_picture?: string;
    auth_methods: string[];
  };
  message?: string;
}

export interface GoogleLinkResponse {
  status: 'success' | 'fail' | 'error';
  data?: {
    token: string;
    user: any;
    is_new?: boolean;
  };
  message?: string;
}

export const googleOAuthService = {
  // Get Google OAuth URL for popup or redirect
  getGoogleAuthURL: async (userType: 'landing' | 'admin' = 'landing'): Promise<GoogleOAuthResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/oauth/google/url?type=${userType}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as GoogleOAuthResponse;
      }
      throw error;
    }
  },

  // Initiate Google OAuth via redirect
  initiateGoogleAuth: (userType: 'landing' | 'admin' = 'landing') => {
    window.location.href = `${API_BASE_URL}/oauth/google?type=${userType}`;
  },

  // Get OAuth status for current user (requires authentication)
  getOAuthStatus: async (token: string): Promise<GoogleOAuthStatus> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/oauth/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as GoogleOAuthStatus;
      }
      throw error;
    }
  },

  // Link Google account to existing user
  linkGoogleAccount: async (token: string, code: string, state: string): Promise<GoogleLinkResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/google/link`, 
        { code, state },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as GoogleLinkResponse;
      }
      throw error;
    }
  },

  // Unlink Google account from current user
  unlinkGoogleAccount: async (token: string): Promise<{ status: string; message?: string }> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/oauth/google/unlink`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Handle OAuth success callback (parse URL parameters)
  handleOAuthCallback: () => {
    debugLog('[GOOGLE_OAUTH] Handling OAuth callback...');
    debugLog('[GOOGLE_OAUTH] Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    debugLog('[GOOGLE_OAUTH] All URL parameters:', Array.from(urlParams.entries()));
    
    const token = urlParams.get('token');
    const isNew = urlParams.get('is_new') === 'true';
    const error = urlParams.get('error');
    
    debugLog('[GOOGLE_OAUTH] Extracted values:', { token, isNew, error });
    
    // Clean URL after processing
    window.history.replaceState({}, document.title, window.location.pathname);
    debugLog('[GOOGLE_OAUTH] URL cleaned, returning values');
    
    return { token, isNew, error };
  },

  // Open Google OAuth in popup window
  openGoogleAuthPopup: async (userType: 'landing' | 'admin' = 'landing'): Promise<{ token?: string; isNew?: boolean; error?: string }> => {
    try {
      // Get the OAuth URL
      const urlResponse = await googleOAuthService.getGoogleAuthURL(userType);
      
      if (urlResponse.status !== 'success' || !urlResponse.data?.auth_url) {
        throw new Error(urlResponse.message || 'Failed to get OAuth URL');
      }

      // Open popup
      const popup = window.open(
        urlResponse.data.auth_url,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Wait for popup to complete
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            
            // Check if we received any OAuth data via localStorage or other means
            // This is a simplified version - in a real implementation you might use
            // postMessage communication between popup and parent window
            const oauthResult = localStorage.getItem('oauth_result');
            if (oauthResult) {
              localStorage.removeItem('oauth_result');
              resolve(JSON.parse(oauthResult));
            } else {
              resolve({ error: 'oauth_cancelled' });
            }
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error('OAuth timeout'));
        }, 300000);
      });
    } catch (error) {
      debugError('Google OAuth popup error:', error);
      throw error;
    }
  }
}; 