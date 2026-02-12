import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Star, 
  ShoppingCart,
  AirVent, 
  Tv, 
  Bed, 
  Waves, 
  Utensils,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EnhancedNavbar from "../components/EnhancedNavbar";
import EnhancedRoomCard from "../components/EnhancedRoomCard";
import Footer from "../components/Footer";
import { homestayService, Homestay } from "@/lib/services/homestayService";
import { formatCurrency } from "@/utils/format";
import { useTranslation } from "@/hooks/useTranslation";
import { debugLog } from '../lib/utils';
import { 
  getRealTimeRoomStatus, 
  getEnhancedRoomAvailability,
  getRoomDynamicStatus 
} from '../lib/services/bookingService';

// Map amenity names to their icon components
const amenityIcons: Record<string, any> = {
  'AC': AirVent,
  'TV': Tv,
  'Double Bed': Bed,
  'Single Bed': Bed,
  'Twin Beds': Bed,
  'Sea View': Waves,
  'Beach View': Waves,
  'Garden View': Waves,
  'Ocean View': Waves,
  'Kitchen': Utensils,
  'Dining Area': Utensils
};

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
  // ✅ Enhanced status information using NEW backend endpoints
  nextAvailableDate?: string | null;
  statusDataSource?: 'real_time_api' | 'enhanced_availability' | 'database' | 'availability_check' | 'static';
  statusConfidence?: 'high' | 'medium' | 'low';
  is_bookable?: boolean;
  current_booking?: any;
  upcoming_bookings?: any[];
}

const HomestayDetailPage = () => {
  const { t, language } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchHomestayDetails = async () => {
      try {
        if (!id) {
          throw new Error("Homestay ID is missing");
        }
        
        // Validate that the ID is a valid number
        if (isNaN(Number(id))) {
          throw new Error("Invalid homestay ID format");
        }
        
        setLoading(true);
        const data = await homestayService.getHomestayById(parseInt(id), language);
        
        // ✅ NEW: Get enhanced room status using new backend endpoints
        if (data.rooms && data.rooms.length > 0) {
          const roomsWithStatus = await Promise.all(
            data.rooms.map(async (room) => {
              try {
                debugLog(`[ROOM STATUS] ✅ Getting enhanced status for room ${room.id} using NEW ENDPOINTS`);
                
                // Try real-time status first
                try {
                  const realTimeStatus = await getRealTimeRoomStatus(room.id);
                  debugLog(`[ROOM STATUS] ✅ Real-time status for room ${room.id}:`, realTimeStatus);
                  
                  return {
                    ...room,
                    status: realTimeStatus.dynamic_status,
                    nextAvailableDate: realTimeStatus.next_available_date,
                    is_bookable: realTimeStatus.is_bookable,
                    statusDataSource: 'real_time_api',
                    statusConfidence: 'high'
                  };
                  
                } catch (realTimeError) {
                  debugLog(`[ROOM STATUS] ⚠️ Real-time status failed, trying enhanced availability...`);
                  
                  // Fallback to enhanced availability
                  try {
                    const today = new Date().toISOString().split('T')[0];
                    const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    
                    const enhancedAvailability = await getEnhancedRoomAvailability(room.id, today, oneMonthFromNow);
                    debugLog(`[ROOM STATUS] ✅ Enhanced availability for room ${room.id}:`, enhancedAvailability);
                    
                    const status = enhancedAvailability.is_available ? 'available' : 
                                  (enhancedAvailability.current_booking ? 'occupied' : 'maintenance');
                    
                    return {
                      ...room,
                      status,
                      nextAvailableDate: enhancedAvailability.next_available_date,
                      is_bookable: enhancedAvailability.is_available,
                      current_booking: enhancedAvailability.current_booking,
                      upcoming_bookings: enhancedAvailability.upcoming_bookings,
                      statusDataSource: 'enhanced_availability',
                      statusConfidence: 'high'
                    };
                    
                  } catch (enhancedAvailabilityError) {
                    debugLog(`[ROOM STATUS] ⚠️ Enhanced availability failed, using legacy method...`);
                    
                    // Final fallback to legacy method
                    const dynamicStatus = await getRoomDynamicStatus(room.id);
                    debugLog(`[ROOM STATUS] ✅ Legacy status for room ${room.id}:`, dynamicStatus);
                    
                    return {
                      ...room,
                      status: dynamicStatus.status,
                      nextAvailableDate: dynamicStatus.nextAvailableDate,
                      statusDataSource: dynamicStatus.dataSource,
                      statusConfidence: dynamicStatus.confidence
                    };
                  }
                }
                
              } catch (error) {
                debugLog(`[ROOM STATUS] ❌ All methods failed for room ${room.id}:`, error);
                // Ultimate fallback to static room status
                return {
                  ...room,
                  status: room.status || 'available',
                  nextAvailableDate: null,
                  is_bookable: true,
                  statusDataSource: 'static',
                  statusConfidence: 'low'
                };
              }
            })
          );
          
          data.rooms = roomsWithStatus;
          setSelectedRoom(roomsWithStatus[0]);
        }
        
        setHomestay(data);
        setError(null);
      } catch (err) {
        debugLog("Error fetching homestay details:", err);
        setError("Failed to load homestay details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomestayDetails();
  }, [id, language]);

  if (loading) {
    return (
      <>
        <EnhancedNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-ocean mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading homestay details...</p>
          </motion.div>
        </div>
      </>
    );
  }

  if (error || !homestay) {
    return (
      <>
        <EnhancedNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-xl text-gray-600 mb-6">{error || "Homestay not found"}</p>
            <Button onClick={() => navigate("/homestays")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homestays
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  // Get primary image or first image, or use fallback
  const primaryImage = homestay.homestayImages && homestay.homestayImages.length > 0
    ? homestay.homestayImages.find(img => img.is_primary)?.img_url || homestay.homestayImages[0].img_url
    : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4';
  
  // Additional images (excluding primary)
  const additionalImages = homestay.homestayImages && homestay.homestayImages.length > 1
    ? homestay.homestayImages
        .filter(img => !img.is_primary)
        .map(img => img.img_url)
    : [];

  // If we need more images for the gallery, add some placeholder images
  while (additionalImages.length < 4) {
    additionalImages.push(`https://images.unsplash.com/photo-${1560000000000 + additionalImages.length}?w=500&h=500&fit=crop`);
  }

  return (
    <>
      <EnhancedNavbar />
      <motion.div 
        className="min-h-screen bg-gray-50 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <motion.div 
            className="flex items-center text-sm text-gray-500 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="hover:text-ocean transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/homestays" className="hover:text-ocean transition-colors">Homestays</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{homestay.title}</span>
          </motion.div>

          {/* Homestay Header */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4 font-playfair">
                {homestay.title}
              </h1>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-ocean mr-2" />
                  <span className="text-gray-600">{homestay.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-gray-600">4.8 (24 reviews)</span>
                </div>
                <Badge variant="outline" className={`
                  ${homestay.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' : 
                    homestay.status === 'inactive' ? 'bg-gray-50 text-gray-700 border-gray-300' : 
                    'bg-red-50 text-red-700 border-red-300'}
                `}>
                  {homestay.status.charAt(0).toUpperCase() + homestay.status.slice(1)}
                </Badge>
              </div>
            </div>
            <motion.div 
              className="mt-6 md:mt-0 md:ml-8"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-right mb-4">
                <div className="text-3xl font-bold text-ocean-dark font-playfair">
                                          {formatCurrency(homestay.base_price, 'IDR')}
                  <span className="text-lg font-normal text-gray-500">/night</span>
                </div>
                <p className="text-sm text-gray-500">{t('booking.starting_from')}</p>
              </div>
              <Link to={`/book?homestay=${homestay.id}${selectedRoom ? `&room=${selectedRoom.id}` : ''}`}>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group border-0">
                  <ShoppingCart className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Photo Gallery */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="md:col-span-1 aspect-[4/3] overflow-hidden">
              <motion.img 
                src={primaryImage} 
                alt={homestay.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {additionalImages.slice(0, 4).map((image, index) => (
                <motion.div 
                  key={index} 
                  className="aspect-square overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={image} 
                    alt={`${homestay.title} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Tabs Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="rooms" className="mb-12">
              <TabsList className="mb-8 bg-white/80 backdrop-blur-sm shadow-md">
                <TabsTrigger value="rooms" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
                  Available Rooms
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
                  Details
                </TabsTrigger>
                <TabsTrigger value="amenities" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
                  Amenities
                </TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
                  Location
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
                  Contact
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Rooms Tab with Direct Booking */}
              <TabsContent value="rooms" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ocean-dark font-playfair">Choose Your Room</h2>
                  <p className="text-gray-600">Click on any room to book directly</p>
                </div>
                
                {homestay.rooms && homestay.rooms.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  >
                    <AnimatePresence>
                      {homestay.rooms.map((room, index) => (
                        <motion.div
                          key={room.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <EnhancedRoomCard
                            room={room as Room}
                            homestayId={homestay.id}
                            isSelected={selectedRoom?.id === room.id}
                            onSelect={setSelectedRoom}
                            showDirectBooking={true}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No rooms available at the moment</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">Description</h2>
                    <div className="prose prose-ocean max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {homestay.description || "Experience authentic island living in this beautiful homestay. Located in the heart of Untung Jawa Island, our accommodation offers the perfect blend of comfort and local culture. Wake up to the sound of gentle waves and enjoy breathtaking sunrises over the Java Sea."}
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h2 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">Additional Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <motion.div 
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Users className="h-8 w-8 text-ocean mr-4" />
                        <div>
                          <p className="text-sm text-gray-500">Max Guests</p>
                          <p className="font-semibold text-lg">{homestay.max_guests} people</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Bed className="h-8 w-8 text-ocean mr-4" />
                        <div>
                          <p className="text-sm text-gray-500">Rooms</p>
                          <p className="font-semibold text-lg">
                            {homestay.has_rooms ? `${homestay.rooms?.length || 1} rooms` : "Single room"}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 text-ocean-dark">Owner Information</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.name || homestay.owner_name || "Owner"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.contact_number || homestay.contact_number || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.email || "Contact via phone"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Amenities Tab */}
              <TabsContent value="amenities">
                <h2 className="text-2xl font-bold text-ocean-dark mb-6 font-playfair">Amenities & Features</h2>
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {['AC', 'TV', 'Double Bed', 'Sea View', 'Kitchen', 'Wi-Fi', 'Parking', 'Hot Water', 'Swimming Pool', 'Garden', 'Refrigerator', 'Dining Area'].map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || Users;
                    return (
                      <motion.div 
                        key={amenity} 
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="bg-ocean/10 p-3 rounded-full mr-4">
                          <IconComponent className="h-6 w-6 text-ocean" />
                        </div>
                        <span className="font-medium">{amenity}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
              
              {/* Location Tab */}
              <TabsContent value="location">
                <h2 className="text-2xl font-bold text-ocean-dark mb-6 font-playfair">Location</h2>
                <motion.div 
                  className="bg-gradient-to-r from-ocean/5 to-tropical/5 rounded-lg p-6 mb-6"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="font-medium mb-2 text-ocean-dark">Address:</p>
                  <p className="text-gray-700">{homestay.address}</p>
                </motion.div>
                <div className="aspect-[16/9] bg-gradient-to-br from-ocean/20 to-tropical/20 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-ocean/50 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Interactive map will be displayed here</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Contact Tab */}
              <TabsContent value="contact">
                <h2 className="text-2xl font-bold text-ocean-dark mb-6 font-playfair">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 text-ocean-dark">Homestay Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium">Phone Number</p>
                              <p className="text-gray-700">{homestay.contact_number || "Not provided"}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium">Address</p>
                              <p className="text-gray-700">{homestay.address}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 text-ocean-dark">Owner Contact</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.name || homestay.owner_name || "Owner"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.email || "Contact via phone"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">
                              {homestay.admin_users?.[0]?.contact_number || homestay.contact_number || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default HomestayDetailPage; 