// src/lib/services/homestayService.ts
import axios from 'axios';
import { AirVent, Tv, Bed, Waves, Utensils } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { Homestay as AccommodationHomestay, Amenity } from '@/components/accommodation/types';
import { debugLog, debugWarn, debugError } from '../utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if it's an authentication error from a booking attempt
      if (error.config.url.includes('/booking')) {
        debugLog('Authentication error when attempting booking, guest booking might be required');
        // Let the calling code handle this - don't redirect yet
        return Promise.reject(error);
      }
      
      // For other authentication errors, clear token and redirect
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Local types for this service
export interface Room {
  id: number;
  homestay_id: number;
  room_id?: number;
  name: string;
  title?: string;
  description?: string;
  price_per_night: number;
  max_guests: number;
  max_occupancy?: number;
  number_people: number;
  status: 'available' | 'occupied' | 'maintenance';
  room_number?: string;
  displayName?: string;
}

export interface Homestay {
  id: number;
  title: string;
  description: string;
  base_price: number;
  max_guests: number;
  status: 'active' | 'inactive';
  location?: string;
  address?: string;
  contact_number?: string;
  owner_name?: string;
  has_rooms?: boolean;
  admin_users?: {
    id: number;
    name: string;
    owner_name: string;
    contact_number: string;
    email?: string;
  }[];
  homestayImages?: {
    id: number;
    img_url: string;
    is_primary: boolean;
    order: number;
  }[];
  rooms?: Room[];
}

export interface HomestayResponse {
  status: 'success' | 'error';
  data?: Homestay;
  message?: string;
}

// Adapt the backend homestay format to frontend display format
export const adaptHomestayForDisplay = (homestay: Homestay): AccommodationHomestay => {
  return {
    id: homestay.id,
    name: homestay.title,
    description: homestay.description || '',
    price: formatCurrency(homestay.base_price, 'IDR'),
    rating: 4.7,
    image: homestay.homestayImages && homestay.homestayImages.length > 0 
      ? homestay.homestayImages.find(img => img.is_primary)?.img_url || homestay.homestayImages[0].img_url
      : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    capacity: `${homestay.max_guests ? `1-${homestay.max_guests}` : '2-4'} guests`,
    amenities: [
      { icon: AirVent, name: 'homestay.ac', translationKey: 'homestay.ac' },
      { icon: Tv, name: 'homestay.tv', translationKey: 'homestay.tv' },
      { icon: Bed, name: 'homestay.bed', translationKey: 'homestay.bed' },
      { icon: Waves, name: 'homestay.sea_view', translationKey: 'homestay.sea_view' },
      { icon: Utensils, name: 'homestay.kitchen', translationKey: 'homestay.kitchen' }
    ]
  };
};

export const homestayService = {
  // Get all active homestays
  getAllHomestays: async (language: string = 'en') => {
    try {
      const response = await api.get('/homestays', {
        params: { lang: language }
      });
      return response.data.data;
    } catch (error) {
      debugError('Error fetching homestays:', error);
      throw error;
    }
  },

  // Get a single homestay by ID
  getHomestayById: async (id: number, language: string = 'en') => {
    try {
      const response = await api.get(`/homestays/${id}`, {
        params: { lang: language }
      });
      const homestay = response.data.data;
      
      // Check if rooms data is missing but needed
      if (!homestay.rooms || homestay.rooms.length === 0) {
        debugLog("No rooms found in homestay data, creating fallback room");
        homestay.rooms = [{
          id: homestay.id * 1000,
          homestay_id: homestay.id,
          room_id: homestay.id * 1000,
          name: `Room at ${homestay.title}`,
          description: homestay.description,
          price_per_night: homestay.base_price,
          max_guests: homestay.max_guests,
          number_people: homestay.max_guests,
          status: 'available'
        }];
      }
      
      // Ensure each room has a consistent ID field, preserving original IDs
      if (homestay.rooms && homestay.rooms.length > 0) {
        homestay.rooms = homestay.rooms.map(room => {
          debugLog(`Room from API: ID=${room.id}, room_id=${room.room_id}, room_number=${room.room_number}, name=${room.name}`);
          
          if (room.room_id && !room.id) {
            room.id = room.room_id;
          } else if (!room.room_id && room.id) {
            room.room_id = room.id;
          } else if (!room.id && !room.room_id) {
            const generatedId = homestay.id * 1000 + (Math.floor(Math.random() * 100));
            room.id = generatedId;
            room.room_id = generatedId;
          }

          if (!room.number_people) {
            room.number_people = room.max_guests || homestay.max_guests || 2;
          }
          
          if (room.room_number) {
            room.displayName = `Room ${room.room_number}`;
          } else if (typeof room.name === 'string' && room.name.match(/[A-Za-z]\d+-\d+/)) {
            const match = room.name.match(/.*?(\d+)$/);
            if (match && match[1]) {
              room.room_number = room.name;
              room.displayName = `Room ${match[1]}`;
            }
          }
          
          return room;
        });
      }
      
      return homestay;
    } catch (error) {
      debugError('Error fetching homestay:', error);
      throw error;
    }
  },

  // Get room details by ID
  getRoomById: async (roomId: number, language: string = 'en') => {
    try {
      debugLog(`Room endpoint not found for room ${roomId}, searching through homestays...`);
      
      // Fallback: search through all homestays to find the room
      const homestays = await homestayService.getAllHomestays(language);
      for (const homestay of homestays) {
        const room = homestay.rooms?.find(r => r.id === roomId);
        if (room) {
          debugLog(`Found room ${roomId} in homestay ${homestay.id}`);
          return {
            ...room,
            homestay_name: homestay.title,
            homestay_image: homestay.homestayImages?.[0]?.img_url || ''
          };
        }
      }
      
      debugLog(`Room ${roomId} not found, creating fallback`);
      return {
        id: roomId,
        homestay_id: 0,
        name: `Room ${roomId}`,
        description: 'Room details not available',
        price_per_night: 500000,
        max_guests: 2,
        number_people: 2,
        status: 'available' as const,
        homestay_name: 'Unknown Homestay',
        homestay_image: ''
      };
    } catch (error) {
      debugError('Error in fallback room lookup:', error);
      throw new Error(`Room ${roomId} not found`);
    }
  }
};

export default homestayService; 