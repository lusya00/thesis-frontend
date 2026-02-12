import axios from 'axios';
import { debugError, debugLog } from '../utils';

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

export interface Statistics {
  total_homestays: number;
  total_guests: number;
  total_activities: number;
  authentic_experience_percentage: number;
}

export interface StatisticsResponse {
  status: 'success' | 'error';
  data?: Statistics;
  message?: string;
}

export const statisticsService = {
  // Get platform statistics
  getStatistics: async (): Promise<Statistics> => {
    try {
      debugLog('Fetching statistics from backend...');
      const response = await api.get('/statistics');
      const stats = response.data.data;

      debugLog('Statistics received:', stats);
      return stats;
    } catch (error) {
      debugError('Error fetching statistics:', error);

      // Return fallback statistics if backend fails
      debugLog('Using fallback statistics');
      return {
        total_homestays: 50,
        total_guests: 2500,
        total_activities: 15,
        authentic_experience_percentage: 100
      };
    }
  },

  // Format statistics for display
  formatStatistics: (stats: Statistics) => {
    return {
      homestays: `${stats.total_homestays}+`,
      guests: stats.total_guests >= 1000 ? `${(stats.total_guests / 1000).toFixed(1)}k+` : `${stats.total_guests}+`,
      activities: `${stats.total_activities}+`,
      experience: `${stats.authentic_experience_percentage}%`
    };
  }
};

export default statisticsService;
