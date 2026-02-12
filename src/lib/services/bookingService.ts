import axios from 'axios';
import api from '../../services/apiConfig';
import { debugLog, debugError, debugWarn } from '../utils';

// API Configuration using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 20000;

// Log the API URL being used (for debugging)
debugLog('[BOOKING] Using API Base URL:', API_BASE_URL);

// Create axios instance with proper configuration (NO default auth headers)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging (but don't add auth automatically)
apiClient.interceptors.request.use(
  (config) => {
    debugLog(`[API] Request to: ${config.baseURL}${config.url}`);
    debugLog(`[API] Method: ${config.method?.toUpperCase()}`);
    if (config.data) {
      debugLog(`[API] Data:`, config.data);
    }
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    if (token) {
      debugLog(`[API] Auth: Token present`);
    } else {
      debugLog(`[API] Auth: No token (public endpoint)`);
    }
    return config;
  },
  (error) => {
    debugError('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    debugLog(`[API] Response from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    debugError('Response interceptor error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for booking data
interface GuestBookingData {
  start_date: string;        // YYYY-MM-DD format
  end_date: string;          // YYYY-MM-DD format
  room_id: number;
  number_of_guests: number;
  guest_name: string;        // Required for guest bookings
  guest_email: string;       // Required for guest bookings
  guest_phone: string;       // Required for guest bookings
  special_requests?: string;
  notes?: string;
  check_in_time?: string;    // HH:MM format
  check_out_time?: string;   // HH:MM format
  payment_method?: string;
}

interface AuthenticatedBookingData {
  start_date: string;        // YYYY-MM-DD format
  end_date: string;          // YYYY-MM-DD format
  room_id: number;
  number_of_guests: number;
  special_requests?: string;
  notes?: string;
  check_in_time?: string;    // HH:MM format
  check_out_time?: string;   // HH:MM format
  payment_method?: string;
}

interface BookingResponse {
  status: string;
  data: {
    id: number;
    booking_number: string;
    start_date: string;
    end_date: string;
    room_id: number;
    status: string;
    total_price: number;
    number_of_guests: number;
    room: {
      id: number;
      title: string;
      room_number: string;
    };
    homestay: {
      id: number;
      title: string;
    };
    guest?: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

// Validate booking data
const validateGuestBookingData = (data: GuestBookingData): string[] => {
  const errors: string[] = [];
  
  if (!data.start_date) errors.push('Start date is required');
  if (!data.end_date) errors.push('End date is required');
  if (!data.room_id) errors.push('Room ID is required');
  if (!data.number_of_guests || data.number_of_guests <= 0) errors.push('Number of guests must be greater than 0');
  if (!data.guest_name?.trim()) errors.push('Guest name is required');
  if (!data.guest_email?.trim()) errors.push('Guest email is required');
  if (!data.guest_phone?.trim()) errors.push('Guest phone is required');
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.guest_email && !emailRegex.test(data.guest_email)) {
    errors.push('Valid email address is required');
  }
  
  // Validate dates
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (startDate < today) {
    errors.push('Start date cannot be in the past');
  }
  
  if (endDate <= startDate) {
    errors.push('End date must be after start date');
  }
  
  return errors;
};

// Create guest booking (NO AUTHENTICATION REQUIRED)
export const createGuestBooking = async (bookingData: GuestBookingData): Promise<BookingResponse> => {
  debugLog('[BOOKING] Creating guest booking (NO AUTH) with data:', bookingData);
  
  // Validate data
  const validationErrors = validateGuestBookingData(bookingData);
  if (validationErrors.length > 0) {
    debugError('[BOOKING] Validation failed:', validationErrors);
    throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
  }
  
  try {
    // Clean and format the data
    const cleanData = {
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      room_id: Number(bookingData.room_id),
      number_of_guests: Number(bookingData.number_of_guests),
      guest_name: bookingData.guest_name.trim(),
      guest_email: bookingData.guest_email.trim().toLowerCase(),
      guest_phone: bookingData.guest_phone.trim(),
      special_requests: bookingData.special_requests?.trim() || '',
      notes: bookingData.notes?.trim() || '',
      check_in_time: bookingData.check_in_time || '14:00',
      check_out_time: bookingData.check_out_time || '11:00',
      payment_method: bookingData.payment_method || 'cash'
    };
    
    debugLog('[BOOKING] Sending cleaned data to API (NO TOKEN):', cleanData);
    
    // Make the API call WITHOUT any authorization headers
    const response = await apiClient.post<BookingResponse>('/bookings/guest', cleanData);
    
    debugLog('[BOOKING] Guest booking created successfully:', response.data);
    return response.data;
    
  } catch (error: any) {
    debugError('[BOOKING] Guest booking failed:', error);
    debugError('[BOOKING] Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 404) {
      throw new Error('Booking service not available. Please check the endpoint URL.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Invalid booking data. Please check your information.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication error. This should not happen for guest bookings - check your API configuration.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to booking service. Please check your internet connection.');
    } else {
      throw new Error('Failed to create booking. Please try again.');
    }
  }
};

// Create authenticated user booking (REQUIRES TOKEN)
export const createAuthenticatedBooking = async (
  bookingData: AuthenticatedBookingData,
  authToken: string
): Promise<BookingResponse> => {
  debugLog('[BOOKING] Creating authenticated booking with data:', bookingData);
  
  if (!authToken) {
    throw new Error('Authentication token is required for authenticated bookings');
  }
  
  try {
    const response = await apiClient.post<BookingResponse>(
      '/bookings', // Note: endpoint is /bookings (with 's')
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    
    debugLog('[BOOKING] Authenticated booking created successfully:', response.data);
    return response.data;
    
  } catch (error: any) {
    debugError('[BOOKING] Authenticated booking failed:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to create booking. Please try again.');
    }
  }
};

// Check room availability (NO AUTH REQUIRED)
export const checkRoomAvailability = async (
  roomId: number,
  startDate: string,
  endDate: string
): Promise<{ is_available: boolean; room_status: string; has_bookings: boolean; same_day_checkout?: boolean; checkout_time?: string }> => {
  try {
    debugLog(`[BOOKING] Checking availability for room ${roomId} from ${startDate} to ${endDate}`);
    
    const response = await apiClient.get(
      `/bookings/room/${roomId}/availability`,
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          include_completed: true, // Include completed bookings to check for same-day checkouts
          real_time: true // Request real-time data
        },
      }
    );
    
    debugLog('[BOOKING] Room availability response:', response.data);
    return response.data.data;
  } catch (error: any) {
    debugError('[BOOKING] Room availability check failed:', error);
    throw new Error('Failed to check room availability');
  }
};

// Get booking by ID (MAY REQUIRE AUTH)
export const getBookingById = async (
  bookingId: number,
  authToken?: string
): Promise<any> => {
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await apiClient.get(`/bookings/${bookingId}`, { headers });
    return response.data.data;
  } catch (error: any) {
    debugError('[BOOKING] Get booking by ID failed:', error);
    throw new Error('Failed to get booking details');
  }
};

// Update booking status (REQUIRES AUTH - admin only)
export const updateBookingStatus = async (
  bookingId: number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  authToken: string,
  cancellationReason?: string
): Promise<any> => {
  if (!authToken) {
    throw new Error('Authentication token is required for updating booking status');
  }
  
  try {
    const response = await apiClient.put(
      `/bookings/${bookingId}/status`,
      {
        status,
        cancellation_reason: cancellationReason,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    
    return response.data.data;
  } catch (error: any) {
    debugError('[BOOKING] Update booking status failed:', error);
    throw new Error('Failed to update booking status');
  }
};

// Get user's bookings (REQUIRES AUTH)
export const getUserBookings = async (authToken: string): Promise<any[]> => {
  if (!authToken) {
    throw new Error('Authentication token is required for getting user bookings');
  }
  
  try {
    const response = await apiClient.get('/bookings/my', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    debugError('[BOOKING] Get user bookings failed:', error);
    throw new Error('Failed to get user bookings');
  }
};

// Get room bookings for a specific date range (IMPROVED FALLBACK)
export const getRoomBookings = async (
  roomId: number,
  startDate: string,
  endDate: string
): Promise<any[]> => {
  try {
    debugLog(`[BOOKING] Getting room ${roomId} bookings from ${startDate} to ${endDate} using NEW ENDPOINTS`);
    
    // ✅ NEW: Use the dedicated room booking endpoint
    try {
      const response = await apiClient.get(`/bookings/room/${roomId}`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          include_cancelled: false
        }
      });
      
      const roomBookings = response.data.data || [];
      debugLog(`[BOOKING] ✅ Got ${roomBookings.length} real bookings from room endpoint`);
      return roomBookings;
      
    } catch (roomEndpointError: any) {
      debugWarn('[BOOKING] ⚠️ Room booking endpoint failed, trying fallback:', roomEndpointError.response?.status);
      
      // Fallback: Try admin access to all bookings
      const token = localStorage.getItem('jwt_token');
      
      if (token) {
        try {
          debugLog('[BOOKING] Attempting fallback to all bookings (admin access)...');
          const allBookingsResponse = await apiClient.get('/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const allBookings = allBookingsResponse.data.data || [];
          
          // Filter bookings for this specific room and date range
          const roomBookings = allBookings.filter((booking: any) => {
            const bookingRoomId = booking.room_id || booking.room?.id;
            const bookingStart = new Date(booking.start_date || booking.check_in);
            const bookingEnd = new Date(booking.end_date || booking.check_out);
            const rangeStart = new Date(startDate);
            const rangeEnd = new Date(endDate);
            
            return bookingRoomId === roomId && 
                   booking.status !== 'cancelled' &&
                   (bookingStart <= rangeEnd && bookingEnd >= rangeStart);
          });
          
          debugLog(`[BOOKING] ✅ Found ${roomBookings.length} bookings via admin fallback`);
          return roomBookings;
          
        } catch (authError) {
          debugWarn('[BOOKING] ❌ Admin fallback failed, using availability only');
        }
      }
      
      // Final fallback: availability check only
      try {
        const availabilityResponse = await checkRoomAvailability(roomId, startDate, endDate);
        
        debugLog(`[BOOKING] Room ${roomId} availability:`, availabilityResponse);
        
        if (!availabilityResponse.is_available && availabilityResponse.has_bookings) {
          debugWarn(`[BOOKING] ⚠️ Room ${roomId} is occupied, returning placeholder`);
          
          return [{
            id: `placeholder-${roomId}`,
            room_id: roomId,
            start_date: startDate,
            end_date: endDate,
            status: 'confirmed',
            booking_status: 'confirmed',
            placeholder: true,
            note: 'Exact booking dates unavailable - placeholder based on availability check'
          }];
        } else {
          debugLog(`[BOOKING] ✅ Room ${roomId} appears to be available`);
          return [];
        }
      } catch (availabilityError) {
        debugError('[BOOKING] ❌ Availability check failed:', availabilityError);
        return [];
      }
    }
    
  } catch (error: any) {
    debugError('[BOOKING] ❌ Complete failure getting room booking info:', error);
    return [];
  }
};

// NEW: More honest approach for finding next available date
export const findNextAvailableDate = async (
  roomId: number,
  maxDaysToCheck: number = 14
): Promise<string | null> => {
  try {
    debugLog(`[BOOKING] Finding next available date for room ${roomId} (checking ${maxDaysToCheck} days)`);
    
    const today = new Date();
    
    // Check availability in 2-day chunks for efficiency
    for (let i = 0; i < maxDaysToCheck; i += 2) {
      const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const endCheckDate = new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      
      const startDateStr = checkDate.toISOString().split('T')[0];
      const endDateStr = endCheckDate.toISOString().split('T')[0];
      
      try {
        const availability = await checkRoomAvailability(roomId, startDateStr, endDateStr);
        
        if (availability.is_available) {
          debugLog(`[BOOKING] ✅ Room ${roomId} available from ${startDateStr}`);
          return startDateStr;
        }
      } catch (error) {
        debugWarn(`[BOOKING] ⚠️ Could not check availability for ${startDateStr}`);
        // Continue checking other dates
      }
    }
    
    debugLog(`[BOOKING] ❌ No availability found for room ${roomId} in next ${maxDaysToCheck} days`);
    return null;
  } catch (error) {
    debugError('[BOOKING] Error finding next available date:', error);
    return null;
  }
};

// NEW: Get room status from database (if possible) or fallback to static
export const getRoomDynamicStatus = async (
  roomId: number
): Promise<{
  status: 'available' | 'occupied' | 'maintenance';
  nextAvailableDate: string | null;
  dataSource: 'database' | 'availability_check' | 'static';
  confidence: 'high' | 'medium' | 'low';
}> => {
  try {
    debugLog(`[BOOKING] Getting dynamic status for room ${roomId} using NEW ENHANCED ENDPOINTS`);
    
    // ✅ NEW: Try the real-time room status endpoint first
    try {
      const statusResponse = await apiClient.get(`/rooms/${roomId}/status`);
      const statusData = statusResponse.data.data;
      
      debugLog(`[BOOKING] ✅ Got real-time status from /rooms/${roomId}/status:`, statusData);
      
      return {
        status: statusData.dynamic_status || statusData.status || 'available',
        nextAvailableDate: statusData.next_available_date || null,
        dataSource: 'database',
        confidence: 'high'
      };
      
    } catch (statusError: any) {
      debugWarn('[BOOKING] ⚠️ Room status endpoint failed, trying enhanced availability:', statusError.response?.status);
      
      // ✅ NEW: Try the enhanced availability endpoint
      try {
        const today = new Date().toISOString().split('T')[0];
        const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const availabilityResponse = await apiClient.get(`/bookings/room/${roomId}/availability`, {
          params: {
            start_date: today,
            end_date: oneMonthFromNow
          }
        });
        
        const availabilityData = availabilityResponse.data.data;
        debugLog(`[BOOKING] ✅ Got enhanced availability data:`, availabilityData);
        
        // Determine status based on enhanced availability data
        let status: 'available' | 'occupied' | 'maintenance' = 'available';
        
        if (!availabilityData.is_available) {
          // Check if there's a current booking
          if (availabilityData.current_booking) {
            status = 'occupied';
          } else {
            // Might be maintenance or other reason
            status = 'maintenance';
          }
        }
        
        return {
          status,
          nextAvailableDate: availabilityData.next_available_date || null,
          dataSource: 'database',
          confidence: 'high'
        };
        
      } catch (enhancedAvailabilityError: any) {
        debugWarn('[BOOKING] ⚠️ Enhanced availability failed, falling back to basic methods:', enhancedAvailabilityError.response?.status);
        
        // Fallback to the old booking-based approach
        const today = new Date().toISOString().split('T')[0];
        const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const bookings = await getRoomBookings(roomId, today, oneWeekFromNow);
        
        // If we have real booking data (not placeholder)
        if (bookings.length > 0 && !bookings[0].placeholder) {
          debugLog(`[BOOKING] ✅ Using real database booking data for room ${roomId}`);
          
          const currentBooking = bookings.find(booking => {
            const start = new Date(booking.start_date);
            const end = new Date(booking.end_date);
            const now = new Date();
            return start <= now && end >= now;
          });
          
          if (currentBooking) {
            const nextAvailable = await findNextAvailableDate(roomId, 14);
            return {
              status: 'occupied',
              nextAvailableDate: nextAvailable,
              dataSource: 'database',
              confidence: 'high'
            };
          } else {
            return {
              status: 'available',
              nextAvailableDate: null,
              dataSource: 'database',
              confidence: 'high'
            };
          }
        }
        
        // Final fallback to basic availability check
        const availability = await checkRoomAvailability(roomId, today, oneWeekFromNow);
        
        if (!availability.is_available) {
          const nextAvailable = await findNextAvailableDate(roomId, 7);
          return {
            status: 'occupied',
            nextAvailableDate: nextAvailable,
            dataSource: 'availability_check', 
            confidence: 'medium'
          };
        } else {
          return {
            status: 'available',
            nextAvailableDate: null,
            dataSource: 'availability_check',
            confidence: 'medium'
          };
        }
      }
    }
    
  } catch (error) {
    debugError(`[BOOKING] Error getting dynamic status for room ${roomId}:`, error);
    
    // Final fallback - we don't really know
    return {
      status: 'available', // Assume available if we can't determine
      nextAvailableDate: null,
      dataSource: 'static',
      confidence: 'low'
    };
  }
};

// Export the API client for other uses
export { apiClient };

// Helper function to format dates for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Helper function to format time for API
export const formatTimeForAPI = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Environment configuration helper
export const getApiConfig = () => {
  return {
    baseURL: API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  };
};

// Debug helper to test connectivity
export const testApiConnection = async (): Promise<boolean> => {
  try {
    debugLog('[BOOKING] Testing API connection to:', API_BASE_URL);
    // You can add a simple health check endpoint here if available
    return true;
  } catch (error) {
    debugError('[BOOKING] API connection test failed:', error);
    return false;
  }
};

// Additional methods for compatibility with existing components

// Get all bookings (admin only)
export const getAllBookings = async (authToken: string): Promise<any[]> => {
  try {
    const response = await apiClient.get('/bookings', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    debugError('[BOOKING] Get all bookings failed:', error);
    throw new Error('Failed to get all bookings');
  }
};

// Cancel booking
export const cancelBooking = async (
  bookingId: number,
  cancellationReason: string,
  authToken?: string
): Promise<any> => {
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await apiClient.put(
      `/bookings/${bookingId}/status`,
      {
        status: 'cancelled',
        cancellation_reason: cancellationReason,
      },
      { headers }
    );
    
    return response.data;
  } catch (error: any) {
    debugError('[BOOKING] Cancel booking failed:', error);
    throw new Error('Failed to cancel booking');
  }
};

// ✅ NEW: Enhanced Room Availability Check (uses new backend endpoint)
export const getEnhancedRoomAvailability = async (
  roomId: number,
  startDate: string,
  endDate: string
): Promise<{
  is_available: boolean;
  current_booking?: any;
  next_available_date?: string;
  upcoming_bookings?: any[];
}> => {
  try {
    debugLog(`[BOOKING] Getting enhanced availability for room ${roomId} from ${startDate} to ${endDate}`);
    
    const response = await apiClient.get(`/bookings/room/${roomId}/availability`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    
    const data = response.data.data;
    debugLog(`[BOOKING] ✅ Enhanced availability data:`, data);
    
    return {
      is_available: data.is_available,
      current_booking: data.current_booking || null,
      next_available_date: data.next_available_date || null,
      upcoming_bookings: data.upcoming_bookings || []
    };
    
  } catch (error: any) {
    debugError(`[BOOKING] Enhanced availability check failed for room ${roomId}:`, error);
    throw error;
  }
};

// ✅ NEW: Get Real-time Room Status (uses new backend endpoint)
export const getRealTimeRoomStatus = async (
  roomId: number
): Promise<{
  dynamic_status: 'available' | 'occupied' | 'maintenance';
  is_bookable: boolean;
  next_available_date?: string;
}> => {
  try {
    debugLog(`[BOOKING] Getting real-time status for room ${roomId}`);
    
    const response = await apiClient.get(`/rooms/${roomId}/status`);
    const data = response.data.data;
    
    debugLog(`[BOOKING] ✅ Real-time room status:`, data);
    
    return {
      dynamic_status: data.dynamic_status || data.status || 'available',
      is_bookable: data.is_bookable !== undefined ? data.is_bookable : true,
      next_available_date: data.next_available_date || null
    };
    
  } catch (error: any) {
    debugError(`[BOOKING] Real-time status check failed for room ${roomId}:`, error);
    throw error;
  }
};

// ✅ NEW: Get Homestay Room Status Overview (uses new backend endpoint)
export const getHomestayRoomsStatus = async (
  homestayId: number
): Promise<Array<{
  id: number;
  dynamic_status: 'available' | 'occupied' | 'maintenance';
  is_bookable: boolean;
  next_available_date?: string;
}>> => {
  try {
    debugLog(`[BOOKING] Getting room status overview for homestay ${homestayId}`);
    
    const response = await apiClient.get(`/rooms/homestay/${homestayId}/status`);
    const data = response.data.data;
    
    debugLog(`[BOOKING] ✅ Homestay room status overview:`, data);
    
    return data || [];
    
  } catch (error: any) {
    debugError(`[BOOKING] Homestay room status overview failed for homestay ${homestayId}:`, error);
    throw error;
  }
};

// Check API endpoints (for debugging)
export const checkApiEndpoints = () => {
  debugLog('[BOOKING] API Endpoints Check (✅ UPDATED WITH NEW ENDPOINTS):');
  debugLog('- Base URL:', API_BASE_URL);
  debugLog('- Guest Booking:', `${API_BASE_URL}/bookings/guest`);
  debugLog('- Authenticated Booking:', `${API_BASE_URL}/bookings`);
  debugLog('- ✅ Enhanced Room Availability:', `${API_BASE_URL}/bookings/room/{id}/availability`);
  debugLog('- ✅ Room Booking History:', `${API_BASE_URL}/bookings/room/{id}`);
  debugLog('- ✅ Real-time Room Status:', `${API_BASE_URL}/rooms/{id}/status`);
  debugLog('- ✅ Homestay Dashboard:', `${API_BASE_URL}/rooms/homestay/{id}/status`);
  debugLog('- User Bookings:', `${API_BASE_URL}/bookings/my`);
  debugLog('- All Bookings (Admin):', `${API_BASE_URL}/bookings`);
};

// Legacy interfaces for backward compatibility
export interface Booking {
  id: number;
  homestay_id: number;
  user_id?: number;
  booking_number: string;
  check_in?: string;        // legacy format
  check_out?: string;       // legacy format
  start_date?: string;      // new format
  end_date?: string;        // new format
  guests?: number;          // legacy format
  number_of_guests?: number; // new format
  nights?: number;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_method: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  status?: string;          // new format
  special_requests?: string;
  created_at: string;
  updated_at: string;
  room_number?: string | number;
  room_id?: number;
  homestay?: {
    id: number;
    title: string;
    location: string;
    image_url?: string;
  };
  room?: {
    id: number;
    title: string;
    room_number: string;
  };
  guest?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface BookingRequest {
  start_date: string;
  end_date: string;
  room_id: number;
  homestay_id?: number;
  number_of_guests: number;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  special_requests?: string;
  notes?: string;
  check_in_time?: string;
  check_out_time?: string;
  payment_method?: string;
  room_number?: string | number;
}

export interface BookingStatusUpdateRequest {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellation_reason?: string;
}

// Create a booking with automatic detection of guest vs authenticated
export const createBooking = async (bookingData: BookingRequest | GuestBookingData): Promise<BookingResponse> => {
  debugLog('[BOOKING] createBooking called with data:', bookingData);
  
  const token = localStorage.getItem('jwt_token');
  
  // Check if this is legacy data format from BookNow.tsx
  const isLegacyFormat = 'homestay_id' in bookingData || 'nights' in bookingData || 'total_price' in bookingData;
  
  if (isLegacyFormat) {
    debugLog('[BOOKING] Detected legacy data format, converting...');
    
    // Convert legacy format to new format
    const legacyData = bookingData as any;
    
    // Determine if it's a guest booking - ONLY if explicitly flagged as guest booking OR no token available
    const isGuestBooking = legacyData.is_guest_booking || !token;
    
    if (isGuestBooking) {
      // Convert to GuestBookingData format
      const guestBookingData: GuestBookingData = {
        start_date: legacyData.start_date,
        end_date: legacyData.end_date,
        room_id: Number(legacyData.room_id),
        number_of_guests: Number(legacyData.number_of_guests),
        guest_name: legacyData.guest_name,
        guest_email: legacyData.guest_email,
        guest_phone: legacyData.guest_phone,
        special_requests: legacyData.special_requests || '',
        notes: legacyData.notes || '',
        check_in_time: legacyData.check_in_time || '14:00',
        check_out_time: legacyData.check_out_time || '11:00',
        payment_method: legacyData.payment_method || 'cash'
      };
      
      debugLog('[BOOKING] Converted to guest booking format:', guestBookingData);
      return createGuestBooking(guestBookingData);
    } else {
      // Convert to AuthenticatedBookingData format
      const authBookingData: AuthenticatedBookingData = {
        start_date: legacyData.start_date,
        end_date: legacyData.end_date,
        room_id: Number(legacyData.room_id),
        number_of_guests: Number(legacyData.number_of_guests),
        special_requests: legacyData.special_requests || '',
        notes: legacyData.notes || '',
        check_in_time: legacyData.check_in_time || '14:00',
        check_out_time: legacyData.check_out_time || '11:00',
        payment_method: legacyData.payment_method || 'cash'
      };
      
      debugLog('[BOOKING] Converted to authenticated booking format:', authBookingData);
      return createAuthenticatedBooking(authBookingData, token!);
    }
  }
  
  // Original logic for new format
  // Only use guest booking if no token OR explicit guest booking fields are provided
  if (!token) {
    return createGuestBooking(bookingData as GuestBookingData);
  } else if ('guest_name' in bookingData && 'guest_email' in bookingData && 'guest_phone' in bookingData) {
    // If token exists but guest data is provided, still prefer authenticated booking for logged-in users
    return createAuthenticatedBooking(bookingData as AuthenticatedBookingData, token);
  } else {
    return createAuthenticatedBooking(bookingData as AuthenticatedBookingData, token);
  }
};

// ✅ NEW: Check if same-day booking is possible after early checkout
// ✅ NEW: Updated interface to match backend response
interface SameDayAvailabilityResponse {
  is_available: boolean;
  early_checkout: boolean;
  earliest_booking_time: string;
  can_book_today: boolean;
  message: string;
  checkout_time?: string;
  housekeeping_status?: 'completed' | 'in_progress';
  housekeeping_complete_time?: string;
  current_booking?: {
    id: number;
    booking_number: string;
    end_date: string;
    status: string;
  };
  previous_booking?: {
    id: number;
    booking_number: string;
    checkout_time: string;
  };
}

export const checkSameDayAvailability = async (
  roomId: number,
  requestedDate: string
): Promise<SameDayAvailabilityResponse> => {
  try {
    debugLog(`[BOOKING] Checking same-day availability for room ${roomId} on ${requestedDate}`);
    
    // ✅ NEW: Use the implemented backend endpoint
    const response = await apiClient.get(`/bookings/room/${roomId}/same-day-availability`, {
      params: { date: requestedDate }
    });
    
    debugLog(`[BOOKING] ✅ Backend same-day availability result:`, response.data.data);
    return response.data.data;
    
  } catch (error: any) {
    debugWarn(`[BOOKING] Backend endpoint error, using fallback...`, error.message);
    
    // Simplified fallback for compatibility
    try {
      const roomBookings = await getRoomBookings(roomId, requestedDate, requestedDate);
      
      const completedToday = roomBookings.filter(booking => 
        booking.booking_status === 'completed' && 
        new Date(booking.end_date || booking.check_out).toISOString().split('T')[0] === requestedDate
      );
      
      const activeToday = roomBookings.filter(booking => 
        ['confirmed', 'pending'].includes(booking.booking_status) && 
        new Date(booking.start_date || booking.check_in).toISOString().split('T')[0] <= requestedDate &&
        new Date(booking.end_date || booking.check_out).toISOString().split('T')[0] >= requestedDate
      );
      
      if (activeToday.length === 0 && completedToday.length > 0) {
        // Likely early checkout scenario
        return {
          is_available: true,
          early_checkout: true,
          earliest_booking_time: 'now',
          can_book_today: true,
          message: 'Room had checkout today - backend verification recommended'
        };
      } else if (activeToday.length === 0) {
        // No bookings
        return {
          is_available: true,
          early_checkout: false,
          earliest_booking_time: 'now',
          can_book_today: true,
          message: 'Room appears available'
        };
      } else {
        // Has active bookings
        return {
          is_available: false,
          early_checkout: false,
          earliest_booking_time: 'later',
          can_book_today: false,
          message: 'Room is currently occupied'
        };
      }
    } catch (fallbackError) {
      debugError(`[BOOKING] Fallback check failed:`, fallbackError);
      return {
        is_available: false,
        early_checkout: false,
        earliest_booking_time: 'unknown',
        can_book_today: false,
        message: 'Unable to check same-day availability'
      };
    }
  }
};

// ✅ NEW: Force refresh room availability cache
export const refreshRoomAvailability = async (
  roomId: number
): Promise<{
  status: 'available' | 'occupied' | 'maintenance';
  updated_at: string;
  cache_cleared: boolean;
}> => {
  try {
    debugLog(`[BOOKING] Force refreshing availability cache for room ${roomId}`);
    
    const response = await apiClient.post(`/rooms/${roomId}/refresh-availability`);
    const data = response.data.data;
    
    debugLog(`[BOOKING] ✅ Cache refreshed for room ${roomId}:`, data);
    return data;
  } catch (error: any) {
    debugError(`[BOOKING] Failed to refresh room ${roomId} availability:`, error);
    throw error;
  }
};

// ✅ NEW: QRIS Payment Interfaces
export interface QRISPaymentData {
  booking_id: number;
  customer_name: string;
  customer_email: string;
}

export interface QRISPaymentResponse {
  status: string;
  data: {
    id: number;
    booking_id: number;
    amount: number;
    qr_code: string;
    payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
    expires_at: string;
    is_test_mode: boolean;
    xendit_invoice_id?: string;
  };
}

export interface PaymentStatusResponse {
  status: string;
  data: {
    payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
    payment_completed_at?: string;
    booking_status?: string;
  };
}

// ✅ NEW: Create QRIS payment after booking
export const createQRISPayment = async (
  paymentData: QRISPaymentData,
  authToken?: string
): Promise<QRISPaymentResponse> => {
  try {
    debugLog(`[QRIS] Creating QRIS payment for booking ${paymentData.booking_id}`);
    
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.post('/qris/create', paymentData, { headers });
    
    debugLog(`[QRIS] ✅ QRIS payment created:`, response.data);
    return response.data;
    
  } catch (error: any) {
    debugError('[QRIS] Failed to create QRIS payment:', error);
    throw error;
  }
};

// ✅ NEW: Check payment status
export const checkPaymentStatus = async (
  bookingId: number,
  authToken?: string
): Promise<PaymentStatusResponse> => {
  try {
    debugLog(`[QRIS] Checking payment status for booking ${bookingId}`);
    
    const headers: any = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.get(`/qris/status/${bookingId}`, { headers });
    
    // ✅ FIX: Add detailed debugging as requested
    debugLog('[QRIS] Raw response:', response);
    debugLog('[QRIS] Response data:', response.data);
    debugLog('[QRIS] Response status code:', response.status);
    
    // ✅ FIX: Proper response parsing for backend format
    if (response.data && response.data.status === 'success' && response.data.data) {
      const paymentData = response.data.data;
      debugLog('[QRIS] Payment status:', paymentData.payment_status);
      debugLog('[QRIS] Should stop polling?', paymentData.payment_status === 'COMPLETED');
      
      // Return the properly formatted response that matches PaymentStatusResponse interface
      return {
        status: response.data.status,
        data: {
          payment_status: paymentData.payment_status,
          payment_completed_at: paymentData.payment_completed_at,
          booking_status: paymentData.booking_status
        }
      };
    } else {
      debugError('[QRIS] Unexpected response format:', response.data);
      throw new Error('Unexpected response format from backend');
    }
    
  } catch (error: any) {
    debugError('[QRIS] Failed to check payment status:', error);
    debugError('[QRIS] Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // ✅ FIX: Only throw error for actual failures, not for successful pending responses
    if (error.response?.status >= 500) {
      throw error;
    } else if (error.response?.status === 404) {
      throw new Error('Payment not found');
    } else if (error.response?.status >= 400) {
      throw new Error('Bad request - check booking ID');
    } else {
      // For network errors or other issues, re-throw
      throw error;
    }
  }
};

// ✅ NEW: Simulate payment (for testing only)
export const simulatePayment = async (bookingId: number): Promise<PaymentStatusResponse> => {
  try {
    debugLog(`[QRIS] Simulating payment for booking ${bookingId}`);
    
    const response = await apiClient.post(`/qris/simulate/${bookingId}`);
    
    debugLog(`[QRIS] ✅ Payment simulated:`, response.data);
    return response.data;
    
  } catch (error: any) {
    debugError('[QRIS] Failed to simulate payment:', error);
    throw error;
  }
};

// Backward compatibility object that mimics the old bookingService structure
export const bookingService = {
  createBooking,
  createGuestBooking,
  createAuthenticatedBooking,
  getUserBookings: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Authentication required');
    return getUserBookings(token);
  },
  getAllBookings: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Authentication required');
    return getAllBookings(token);
  },
  getBookingById: async (bookingId: number) => {
    const token = localStorage.getItem('jwt_token');
    return getBookingById(bookingId, token);
  },
  updateBookingStatus: async (bookingId: number, statusUpdate: BookingStatusUpdateRequest) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Authentication required');
    return updateBookingStatus(bookingId, statusUpdate.status, token, statusUpdate.cancellation_reason);
  },
  cancelBooking: async (bookingId: number, cancellationReason: string) => {
    const token = localStorage.getItem('jwt_token');
    return cancelBooking(bookingId, cancellationReason, token);
  },
  checkRoomAvailability,
  getRoomBookings,
  findNextAvailableDate,
  checkApiEndpoints,
  // ✅ NEW: Same-day booking support
  checkSameDayAvailability,
  refreshRoomAvailability,
  // ✅ NEW: QRIS Payment support
  createQRISPayment,
  checkPaymentStatus,
  simulatePayment,
  // ✅ NEW: Real-time status functions
  getRealTimeRoomStatus,
  getEnhancedRoomAvailability,
  getHomestayRoomsStatus,
  checkEnhancedRoomAvailability: async (roomId: number, startDate: string, endDate: string) => {
    try {
      debugLog(`[BOOKING] Enhanced availability check for room ${roomId}: ${startDate} to ${endDate}`);
      
      // First check basic availability
      const basicAvailability = await checkRoomAvailability(roomId, startDate, endDate);
      
      // Get room bookings for context
      const roomBookings = await getRoomBookings(roomId, startDate, endDate);
      
      // Check if there are any completed bookings that might affect same-day availability
      const hasRecentCheckout = roomBookings.some(booking => {
        const checkoutDate = new Date(booking.end_date || booking.check_out);
        const requestedCheckIn = new Date(startDate);
        return booking.booking_status === 'completed' && 
               checkoutDate.toDateString() === requestedCheckIn.toDateString();
      });
      
      // ✅ NEW: If it's a same-day request, check same-day availability
      const today = new Date().toISOString().split('T')[0];
      let sameDayInfo = null;
      if (startDate === today) {
        try {
          sameDayInfo = await checkSameDayAvailability(roomId, startDate);
          debugLog(`[BOOKING] ✅ Same-day availability info:`, sameDayInfo);
        } catch (sameDayError) {
          debugWarn(`[BOOKING] ⚠️ Same-day check failed:`, sameDayError);
        }
      }
      
      return {
        ...basicAvailability,
        room_bookings: roomBookings,
        has_recent_checkout: hasRecentCheckout,
        same_day_info: sameDayInfo,
        same_day_booking_note: hasRecentCheckout ? 
          'Room had a checkout today. Please verify housekeeping completion before confirming.' : null
      };
    } catch (error) {
      debugError(`[BOOKING] Enhanced availability check failed:`, error);
      throw error;
    }
  },
};

// Usage example:
/*
// For guest booking (NO TOKEN NEEDED):
const guestBookingData = {
  start_date: '2024-01-15',
  end_date: '2024-01-20',
  room_id: 5,
  number_of_guests: 2,
  guest_name: 'John Doe',
  guest_email: 'john.doe@example.com',
  guest_phone: '+1234567890',
  special_requests: 'Need extra pillows',
  notes: 'Anniversary trip',
  check_in_time: '14:00',
  check_out_time: '11:00',
  payment_method: 'credit_card'
};

try {
  const result = await createGuestBooking(guestBookingData);
  debugLog('Guest booking created:', result);
} catch (error) {
  debugError('Guest booking failed:', error.message);
}

// For authenticated booking (TOKEN REQUIRED):
const authBookingData = {
  start_date: '2024-01-15',
  end_date: '2024-01-20',
  room_id: 5,
  number_of_guests: 2,
  special_requests: 'Need extra pillows'
};

try {
  const token = 'your-auth-token-here';
  const result = await createAuthenticatedBooking(authBookingData, token);
  debugLog('Authenticated booking created:', result);
} catch (error) {
  debugError('Authenticated booking failed:', error.message);
}
*/

/*
=== IMPORTANT NOTES ===

1. Guest bookings DO NOT require authentication tokens
2. The createGuestBooking function explicitly does NOT send any Authorization headers
3. If you're getting "No token provided" errors, check:
   - Your backend routes are correctly set up
   - The /bookings/guest endpoint is not protected by authentication middleware
   - Your axios interceptors are not automatically adding auth headers

4. Environment variables:
   - .env.development: VITE_API_BASE_URL=http://localhost:5000/api
   - .env.production: VITE_API_BASE_URL=https://your-production-domain.com/api
*/



