// src/lib/services/activityService.ts
import axios from 'axios';
import { debugLog, debugWarn } from '../utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://untung-jawa-api.onrender.com/api';

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
export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  participants: string;
  price: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityResponse {
  status: 'success' | 'error';
  data?: Activity[];
  message?: string;
}

// Mock data for activities until backend endpoint is implemented
const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Island Snorkeling Adventure",
    description: "Explore the vibrant underwater world of Pulau Pal with our guided snorkeling tour. Discover colorful coral reefs, tropical fish, and marine life in crystal-clear waters.",
    category: "water",
    difficulty: "easy",
    duration: "3 hours",
    participants: "2-8 people",
    price: "IDR 250,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Mangrove Forest Kayaking",
    description: "Paddle through the serene mangrove forests and learn about this unique ecosystem. Experience the tranquility of nature and spot local wildlife.",
    category: "nature",
    difficulty: "medium",
    duration: "2 hours",
    participants: "2-6 people",
    price: "IDR 180,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Conservation Volunteer Day",
    description: "Join our conservation efforts to protect Pulau Pal's unique ecosystem. Help with beach cleanup, tree planting, and wildlife monitoring.",
    category: "conservation",
    difficulty: "easy",
    duration: "4 hours",
    participants: "1-10 people",
    price: "IDR 150,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Sunset Photography Tour",
    description: "Capture the breathtaking beauty of Pulau Pal at golden hour. Learn photography techniques and discover the best viewpoints on the island.",
    category: "photography",
    difficulty: "easy",
    duration: "2 hours",
    participants: "1-4 people",
    price: "IDR 200,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Traditional Fishing Experience",
    description: "Learn traditional fishing methods with local fishermen. Experience authentic island life and enjoy fresh seafood prepared by locals.",
    category: "cultural",
    difficulty: "medium",
    duration: "5 hours",
    participants: "2-6 people",
    price: "IDR 300,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Island Hiking Adventure",
    description: "Trek through lush forests and discover hidden viewpoints. Experience the natural beauty and biodiversity of Pulau Pal's interior.",
    category: "adventure",
    difficulty: "hard",
    duration: "6 hours",
    participants: "2-8 people",
    price: "IDR 350,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const activityService = {
  // Get all activities
  getAllActivities: async (language: string = 'en') => {
    try {
      const response = await api.get('/public/activities', {
        params: { lang: language }
      });
      if (response.data.success && response.data.data) {
        // Transform API data to match frontend expectations
        return response.data.data.map(activity => ({
          id: activity.id,
          title: activity.title,
          description: activity.description || activity.short_description || '',
          category: activity.category,
          difficulty: activity.difficulty_level,
          duration: activity.duration_minutes ? `${activity.duration_minutes} minutes` : 'Duration not specified',
          participants: `${activity.min_participants}-${activity.max_participants} people`,
          price: `IDR ${activity.price.toLocaleString()}`,
          image: activity.activity_images?.find(img => img.is_primary)?.img_url ||
                 activity.activity_images?.[0]?.img_url ||
                 "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }));
      }
      return [];
    } catch (error) {
      debugWarn('Activities API not available, using mock data:', error.message);
      // Return mock data if API fails
      return mockActivities;
    }
  },

  // Get a single activity by ID
  getActivityById: async (id: number, language: string = 'en') => {
    try {
      const response = await api.get(`/public/activities/${id}`, {
        params: { lang: language }
      });
      if (response.data.success && response.data.data) {
        const activity = response.data.data;
        return {
          id: activity.id,
          title: activity.title,
          description: activity.description || activity.short_description || '',
          category: activity.category,
          difficulty: activity.difficulty_level,
          duration: activity.duration_minutes ? `${activity.duration_minutes} minutes` : 'Duration not specified',
          participants: `${activity.min_participants}-${activity.max_participants} people`,
          price: `IDR ${activity.price.toLocaleString()}`,
          image: activity.activity_images?.find(img => img.is_primary)?.img_url ||
                 activity.activity_images?.[0]?.img_url ||
                 "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        };
      }
      return null;
    } catch (error) {
      debugWarn('Activity API not available, using mock data for ID:', id);
      // Return mock data if API fails
      return mockActivities.find(activity => activity.id === id) || null;
    }
  }
};

export default activityService;
