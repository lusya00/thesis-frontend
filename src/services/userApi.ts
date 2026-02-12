import { Booking } from '@/types/room';
import api, { API_BASE_URL } from './apiConfig';
import axios from 'axios';
import { debugLog } from '../lib/utils';

// Function to get the current user ID from localStorage
const getCurrentUserId = (): number | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
    const user = JSON.parse(userStr);
      return user.id || user.user_id || null;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Get user bookings with fallback to alternative endpoints
 */
export const getUserBookings = async (): Promise<Booking[]> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.error('No user ID available. User might not be logged in.');
      throw new Error('You must be logged in to view your bookings');
    }
    
    debugLog(`Fetching bookings for user ID: ${userId}`);
    debugLog(`Token available: ${localStorage.getItem('jwt_token') ? 'Yes' : 'No'}`);
    debugLog(`API Base URL: ${API_BASE_URL}`);
    
    // Primary endpoint: specific user bookings
    try {
      debugLog(`Trying endpoint: /bookings/user/${userId}`);
      const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        }
      });
      debugLog('Response received:', response.data);
      
      // Check if response has the expected structure
      if (response.data && response.data.status === 'success') {
        return response.data.data || [];
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data || [];
      }
    } catch (primaryError) {
      // If primary endpoint fails, try fallback
      debugLog('Primary endpoint failed, trying fallback...');
      
      try {
        debugLog('Trying fallback endpoint: /bookings/user');
        const fallbackResponse = await axios.get(`${API_BASE_URL}/bookings/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json'
          }
        });
        debugLog('Fallback response received:', fallbackResponse.data);
        
        if (fallbackResponse.data && fallbackResponse.data.status === 'success') {
          return fallbackResponse.data.data || [];
        } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
          return fallbackResponse.data;
        } else {
          return fallbackResponse.data || [];
    }
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

/**
 * Get user bookings by specific user ID (for admin use)
 */
export const getUserBookingsByUserId = async (userId: number): Promise<Booking[]> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  
  try {
    debugLog(`Fetching bookings for user ID: ${userId}`);
    debugLog(`Token available: ${localStorage.getItem('jwt_token') ? 'Yes' : 'No'}`);
    debugLog(`API Base URL: ${API_BASE_URL}`);
    
    // Primary endpoint: specific user bookings
    try {
      debugLog(`Trying endpoint: /bookings/user/${userId}`);
      const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        }
      });
      debugLog('Response received:', response.data);
      
      // Check if response has the expected structure
      if (response.data && response.data.status === 'success') {
        return response.data.data || [];
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data || [];
      }
    } catch (primaryError) {
      // If primary endpoint fails, try fallback
      debugLog('Primary endpoint failed, trying fallback...');
      
      try {
        debugLog('Trying fallback endpoint: /bookings/user');
        const fallbackResponse = await axios.get(`${API_BASE_URL}/bookings/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json'
          }
        });
        debugLog('Fallback response received:', fallbackResponse.data);
        
        if (fallbackResponse.data && fallbackResponse.data.status === 'success') {
          return fallbackResponse.data.data || [];
        } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
          return fallbackResponse.data;
        } else {
          return fallbackResponse.data || [];
        }
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

/**
 * Get user profile data with fallback to alternative endpoints
 */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImg?: string;
  joinedDate: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.error('No user ID available. User might not be logged in.');
      throw new Error('You must be logged in to view your profile');
    }
    
    // Use the correct endpoint format with the profile API
    const response = await api.get(`/profile/profile`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    
    // If it's a 401/403 error, provide a more helpful message
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Authentication error: Please log in again to view your profile');
    }
    
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userData: any): Promise<any> {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Change user password
 */
export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export async function changePassword(passwordData: ChangePasswordData): Promise<void> {
  try {
    await api.put('/profile/change-password', {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

/**
 * Notification preferences interface and functions
 */
export interface NotificationPreferences {
  email_bookings: boolean;
  email_promotions: boolean;
  email_reminders: boolean;
  sms_bookings: boolean;
  sms_reminders: boolean;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const response = await api.get('/profile/notification-preferences');
    return response.data.preferences || response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
}

export async function updateNotificationPreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
  try {
    const response = await api.put('/profile/notification-preferences', preferences);
    return response.data.preferences || response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
} 