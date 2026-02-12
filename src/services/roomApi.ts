import { Homestay, Room, BookingCreateInput, Booking, RoomStatus } from '@/types/room';
import api from './apiConfig';

/**
 * Get a homestay with all its rooms
 */
export async function getHomestay(id: number): Promise<Homestay> {
  try {
    const response = await api.get(`/homestays/${id}`);
    // Ensure room status is properly mapped to enum
    const data = response.data.data;
    
    if (data.rooms && Array.isArray(data.rooms)) {
      data.rooms = data.rooms.map((room: Room) => ({
        ...room,
        status: mapStatusString(room.status as string)
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching homestay:', error);
    throw error;
  }
}

/**
 * Get all active homestays
 */
export async function getAllHomestays(): Promise<Homestay[]> {
  try {
    const response = await api.get('/homestays');
    
    // Some APIs return { data: [...] } and others return directly [...]
    const homestays = Array.isArray(response.data) ? response.data : response.data.data;
    
    // Process rooms in each homestay
    return homestays.map((homestay: Homestay) => {
      if (homestay.rooms && Array.isArray(homestay.rooms)) {
        homestay.rooms = homestay.rooms.map((room: Room) => ({
          ...room,
          status: mapStatusString(room.status as string)
        }));
      }
      return homestay;
    });
  } catch (error) {
    console.error('Error fetching homestays:', error);
    throw error;
  }
}

/**
 * Get available rooms for booking
 */
export async function getAvailableRooms(
  startDate: string, 
  endDate: string, 
  guests: number = 1
): Promise<Room[]> {
  try {
    const response = await api.get(
      '/rooms/available',
      { 
        params: {
          start_date: startDate,
          end_date: endDate,
          guests
        }
      }
    );
    
    // Some APIs return { data: [...] } and others return directly [...]
    const roomsData = Array.isArray(response.data) ? response.data : response.data.data;
    
    // Map status strings to enum values
    const rooms = roomsData.map((room: Room) => ({
      ...room,
      status: mapStatusString(room.status as string)
    }));
    
    return rooms;
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    throw error;
  }
}

/**
 * Get details of a specific room
 */
export async function getRoomDetails(id: number): Promise<Room> {
  try {
    const response = await api.get(`/rooms/${id}`);
    const roomData = response.data.data;
    
    // Handle different API response structures
    const room = typeof roomData === 'object' ? roomData : response.data;
    
    // Map status string to enum value
    return {
      ...room,
      status: mapStatusString(room.status as string)
    };
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
}

/**
 * Create a booking for a room
 */
export async function createBooking(bookingData: BookingCreateInput): Promise<Booking> {
  try {
    const response = await api.post('/bookings', bookingData);
    
    // Some APIs return the created booking directly, others wrap it in a data property
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Helper function to map status strings to RoomStatus enum values
 * Handles various possible formats from backend
 */
function mapStatusString(status: string | number | any): RoomStatus {
  // If it's already a valid enum value, return it
  if (Object.values(RoomStatus).includes(status as RoomStatus)) {
    return status as RoomStatus;
  }
  
  // If status is not provided or is null, default to available
  if (!status) {
    console.warn('Room status not provided, defaulting to available');
    return RoomStatus.Available;
  }
  
  // Convert to string and lowercase for consistent comparison
  const statusStr = String(status).toLowerCase();
  
  switch (statusStr) {
    case 'available':
    case 'active':
    case 'vacant':
    case 'free':
    case '1':
    case 'true':
      return RoomStatus.Available;
      
    case 'occupied':
    case 'booked':
    case 'reserved':
    case 'busy':
    case '0':
    case 'false':
      return RoomStatus.Occupied;
      
    case 'maintenance':
    case 'under_maintenance':
    case 'undergoing_maintenance':
    case 'repair':
    case 'cleaning':
    case '2':
      return RoomStatus.Maintenance;
      
    default:
      console.warn(`Unknown room status: "${status}", defaulting to available`);
      return RoomStatus.Available;
  }
} 