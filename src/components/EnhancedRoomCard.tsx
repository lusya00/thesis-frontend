import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bed, 
  Users, 
  Calendar, 
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Wrench,
  ShoppingCart,
  ArrowRight,
  Wifi,
  Tv,
  AirVent,
  Coffee,
  Car,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';

interface Room {
  id: number;
  name?: string;
  title?: string;
  room_number?: string;
  number_people: number;
  max_guests?: number;
  max_occupancy?: number;
  price_per_night?: number;
  price?: number;
  size?: string;
  description?: string;
  status: 'available' | 'occupied' | 'maintenance';
  room_features?: string[];
  room_images?: Array<{ img_url: string; is_primary?: boolean }>;
  // Enhanced availability information
  nextAvailableDate?: string | null;
  availabilityDetails?: any;
}

interface EnhancedRoomCardProps {
  room: Room;
  homestayId: number;
  isSelected?: boolean;
  onSelect?: (room: Room) => void;
  showDirectBooking?: boolean;
}

const EnhancedRoomCard: React.FC<EnhancedRoomCardProps> = ({
  room,
  homestayId,
  isSelected = false,
  onSelect,
  showDirectBooking = true
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Room status configuration
  const statusConfig = {
    available: {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-300',
      label: 'Available',
      dotColor: 'bg-green-500'
    },
    occupied: {
      icon: Clock,
      color: 'bg-red-100 text-red-700 border-red-300',
      label: 'Occupied',
      dotColor: 'bg-red-500'
    },
    maintenance: {
      icon: Wrench,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      label: 'Maintenance',
      dotColor: 'bg-yellow-500'
    }
  };

  // Common amenity icons
  const amenityIcons: Record<string, any> = {
    'wifi': Wifi,
    'tv': Tv,
    'ac': AirVent,
    'coffee': Coffee,
    'parking': Car,
    'ocean_view': Waves,
    'sea_view': Waves,
    'beach_view': Waves
  };

  const status = statusConfig[room.status] || statusConfig.available;
  const StatusIcon = status.icon;
  
  // Get room price
  const price = room.price_per_night || room.price || 0;
  
  // Get room image
  const roomImage = room.room_images && room.room_images.length > 0
    ? room.room_images.find(img => img.is_primary)?.img_url || room.room_images[0].img_url
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop';

  // Room features with icons
  const features = room.room_features || ['wifi', 'tv', 'ac'];

  const handleBookNow = () => {
    // Navigate to booking page with pre-selected room
    window.location.href = `/book?homestay=${homestayId}&room=${room.id}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative group cursor-pointer ${onSelect ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(room)}
    >
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isSelected 
          ? 'ring-2 ring-ocean border-ocean shadow-lg' 
          : 'border-gray-200 hover:border-ocean/50'
      }`}>
        <div className="relative">
          {/* Room Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={roomImage}
              alt={room.name || room.title || `Room ${room.room_number}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 1.1, 
                opacity: imageLoaded ? 1 : 0 
              }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${status.color} border font-medium`}>
                <div className={`w-2 h-2 rounded-full ${status.dotColor} mr-1.5`} />
                {status.label}
              </Badge>
            </div>
            
            {/* Price tag */}
            <div className="absolute top-3 right-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md"
              >
                <div className="text-sm font-bold text-ocean-dark">
                  {formatCurrency(price, 'IDR')}
                  <span className="text-xs text-gray-600 font-normal">/night</span>
                </div>
              </motion.div>
            </div>

            {/* Room number */}
            {room.room_number && (
              <div className="absolute bottom-3 left-3">
                <div className="bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-white text-sm font-medium">
                    Room {room.room_number}
                  </span>
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            {/* Room title and rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-ocean-dark mb-1 line-clamp-1">
                  {room.name || room.title || `Room ${room.room_number}`}
                </h3>
                {room.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {room.description}
                  </p>
                )}
              </div>
              <div className="flex items-center ml-3">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700 ml-1">4.8</span>
              </div>
            </div>

            {/* Room specs */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-ocean/10 p-1.5 rounded-lg">
                  <Bed className="w-4 h-4 text-ocean" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Standard</div>
                  <div className="text-sm font-medium">{room.number_people} guests</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-tropical/10 p-1.5 rounded-lg">
                  <Users className="w-4 h-4 text-tropical-dark" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Max</div>
                  <div className="text-sm font-medium">
                    {room.max_guests || room.max_occupancy || room.number_people} guests
                  </div>
                </div>
              </div>
              
              {room.size && (
                <div className="flex items-center space-x-2">
                  <div className="bg-sand-dark/10 p-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-sand-dark" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Size</div>
                    <div className="text-sm font-medium">{room.size}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            {features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {features.slice(0, 4).map((feature, index) => {
                    const FeatureIcon = amenityIcons[feature.toLowerCase()] || CheckCircle;
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center space-x-1 bg-gray-50 rounded-full px-2 py-1"
                      >
                        <FeatureIcon className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-700 capitalize">
                          {feature.replace('_', ' ')}
                        </span>
                      </motion.div>
                    );
                  })}
                  {features.length > 4 && (
                    <div className="flex items-center justify-center bg-gray-100 rounded-full px-2 py-1">
                      <span className="text-xs text-gray-600">
                        +{features.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* ✅ SIMPLIFIED STATUS - No more confusing "Available from" text */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-4 h-4 ${
                  room.status === 'available' ? 'text-green-600' :
                  room.status === 'occupied' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {room.status === 'available' ? '✅ Available now' :
                   room.status === 'occupied' ? '❌ Occupied today' : '🔧 Under maintenance'}
                </span>
              </div>
              
              {/* Show maintenance info if applicable */}
              {room.status === 'maintenance' && (
                <div className="flex items-center space-x-2 text-xs">
                  <Wrench className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-700">Room maintenance in progress</span>
                </div>
              )}
            </div>

            {/* Smart booking buttons */}
            {showDirectBooking && (
              <motion.div 
                className="mt-4 space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {room.status === 'available' ? (
                  <>
                    {/* ✅ Room Available Today - Book Now */}
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300 group border-0"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    
                    <Link 
                      to={`/book?homestay=${homestayId}&room=${room.id}&quick=true`}
                      className="block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-ocean/30 text-ocean hover:bg-ocean/10 hover:border-ocean transition-all duration-300"
                        size="sm"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Check Other Dates
                      </Button>
                    </Link>
                  </>
                ) : room.status === 'occupied' ? (
                  /* ✅ Room Occupied Today - Book for Other Dates */
                  <Link 
                    to={`/book?homestay=${homestayId}&room=${room.id}&occupied=true`}
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book for other dates
                    </Button>
                  </Link>
                ) : room.status === 'maintenance' ? (
                  <Button 
                    disabled
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-500"
                    size="sm"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Under Maintenance
                  </Button>
                ) : (
                  /* ✅ Fallback - General Check Availability */
                  <Link 
                    to={`/book?homestay=${homestayId}&room=${room.id}`}
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-ocean/30 text-ocean hover:bg-ocean/5 hover:border-ocean transition-all duration-300"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Check Availability
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </CardContent>

          {/* Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-2 left-2 bg-ocean text-white rounded-full p-1"
              >
                <CheckCircle className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ocean/5 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedRoomCard; 