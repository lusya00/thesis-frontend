
import { LucideIcon } from "lucide-react";

export interface Amenity {
  icon: LucideIcon;
  name: string;
  translationKey?: string;
}

export interface Homestay {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  capacity: string;
  amenities: Amenity[];
  status?: 'active' | 'inactive';
  is_active?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isAnimating?: boolean;
  suggestedReplies?: string[];
  images?: string[];
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  activity?: {
    id: string;
    name: string;
    price: string;
    duration: string;
    image: string;
  }[];
  homestays?: Homestay[];
  actionButtons?: ActionButton[];
  canStop?: boolean;
}

export interface ActionButton {
  label: string;
  action: 'book' | 'view' | 'filter' | 'external' | 'navigate';
  data?: any;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface QuickReply {
  label: string;
  action: string;
  icon?: LucideIcon;
}

export interface ChatBotConfig {
  botName: string;
  greeting: string;
  language: 'en' | 'id';
  theme: 'light' | 'dark' | 'ocean';
  avatarUrl?: string;
}
