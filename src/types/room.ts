
export enum RoomStatus {
  Available = 'available',
  Occupied = 'occupied',
  Maintenance = 'maintenance'
}

export enum FeatureCategory {
  Bedroom = 'bedroom',
  Bathroom = 'bathroom',
  Kitchen = 'kitchen',
  Entertainment = 'entertainment',
  Comfort = 'comfort',
  Safety = 'safety',
  Accessibility = 'accessibility',
  Outdoor = 'outdoor',
  Service = 'service',
  Storage = 'storage',
  View = 'view',
  Dining = 'dining',
  Business = 'business',
  Wellness = 'wellness',
  Transportation = 'transportation'
}

export interface RoomFeature {
  id: number;
  title: string;
  description: string | null;
  symbol: string | null;
  category: FeatureCategory;
  created_at?: Date;
  updated_at?: Date;
}

export interface Room {
  id: number;
  homestay_id: number;
  title: string;
  description: string | null;
  status: RoomStatus;
  room_number: string | null;
  number_people: number;
  max_occupancy: number;
  price: number;
  currency: string;
  size: string | null;
  created_at?: Date;
  updated_at?: Date;
  features?: RoomFeature[];
  availability?: DailyAvailability[];
  room_id?: number; // Added for compatibility
  name?: string; // Added for compatibility
  room?: Room; // Added for nested references
  homestay?: Homestay; // Added for nested references
}

export interface DailyAvailability {
  date: string;
  is_available: boolean;
}

export interface Homestay {
  id: number;
  title: string;
  description: string;
  status: string;
  has_rooms: boolean;
  location: string;
  address: string;
  base_price: number;
  max_guests: number;
  contact_number: string;
  user_id: number;
  owner_name: string;
  created_at?: Date;
  updated_at?: Date;
  images: HomestayImage[];
  rooms: Room[];
  is_active?: boolean; // Added for compatibility
  admin_users?: {
    id: number;
    name: string;
    owner_name: string;
    contact_number: string;
  }[]; // Added for compatibility
}

export interface HomestayImage {
  id: number;
  img_url: string;
  is_primary: boolean;
  order: number;
}

export interface BookingCreateInput {
  room_id: number;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  number_of_guests: number;
  user_id?: number; // Optional if booking for a guest
  special_requests?: string;
  notes?: string;
}

export interface Booking {
  id: number;
  booking_number: string;
  room_id: number;
  start_date: string;
  end_date: string;
  status: string;
  booking_status?: string;
  is_paid: boolean;
  number_of_guests: number;
  total_price: number;
  payment_method: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  room?: Room & {
    name: string;
  }; // Added for room details
  homestay?: Homestay; // Added for homestay details
  check_in?: string; // Compatibility alias for start_date
  check_out?: string; // Compatibility alias for end_date
  nights?: number; // Added for convenience
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: 'user' | 'guest' | 'admin' | 'super_admin';
  role?: string; // For backward compatibility
  created_at: string;
  phone_number?: string;
  country?: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  username?: string; // For backward compatibility
}
