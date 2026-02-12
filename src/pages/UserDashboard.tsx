import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Loader2, UserCircle, CalendarDays, Clock, CreditCard, ChevronRight, LogOut, Settings, Home, Bed, Star, MapPin, User, Edit, Bell, Lock, Waves, Sun } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { authService } from "@/lib/services/authService";
import { bookingService, Booking } from "@/lib/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { homestayService } from "@/lib/services/homestayService";
import ProfileInformation from "@/components/profile/ProfileInformation";
import ChangePassword from "@/components/profile/ChangePassword";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import { formatCurrency } from "@/utils/format";
import { debugLog } from "@/lib/utils";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);

  // Determine which tab should be active based on the current URL
  const getActiveTab = () => {
    const path = location.pathname;
    debugLog('[DASHBOARD] Current path:', path);
    if (path.includes('/dashboard')) return "profile";
    if (path.includes('/bookings')) return "bookings";
    if (path.includes('/profile')) return "profile";
    if (path.includes('/settings')) return "settings";
    return "profile";
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        debugLog('[DASHBOARD] Environment check:');
        debugLog('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
        debugLog('- NODE_ENV:', import.meta.env.NODE_ENV);
        
        debugLog('[DASHBOARD] Testing API connection...');
        const isApiConnected = await authService.testConnection();
        if (!isApiConnected) {
          debugLog('[DASHBOARD] Cannot connect to backend API');
        }

        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        debugLog('[DASHBOARD] Current user data:', currentUser);
        debugLog('[DASHBOARD] User type:', currentUser.type);

        if (currentUser.type === 'guest') {
          debugLog('[DASHBOARD] User is marked as guest, attempting to fix user type...');
          const fixResult = await authService.fixUserType();
          if (fixResult) {
            debugLog('[DASHBOARD] Successfully updated user type');
          }
        }

        const isTokenValid = await authService.validateToken();
        if (!isTokenValid) {
          debugLog('Token validation failed, redirecting to login');
          authService.logout();
          navigate("/login");
          return;
        }

        setUser(currentUser);
        
        try {
          debugLog('[DASHBOARD] Fetching fresh booking data...');
          const userBookings = await bookingService.getUserBookings();
          
          const bookingsWithRoomDetails = await Promise.all(userBookings.map(async (booking) => {
            try {
              if (booking.room_id) {
                const roomDetails = await homestayService.getRoomById(booking.room_id);
                return {
                  ...booking,
                  room: roomDetails
                };
              }
            } catch (err) {
              debugLog(`Could not fetch room details for booking ${booking.id}:`, err);
            }
            return booking;
          }));
          
          debugLog('[DASHBOARD] Loaded bookings with payment status:', 
            bookingsWithRoomDetails.map(b => ({
              id: b.id, 
              booking_status: b.booking_status || b.status,
              payment_status: b.payment_status,
              is_paid: b.is_paid,
              payment_method: b.payment_method,
              // Log ALL payment-related fields to debug the mapping
              all_payment_fields: {
                payment_status: b.payment_status,
                is_paid: b.is_paid,
                payment_method: b.payment_method,
                status: b.status,
                booking_status: b.booking_status
              }
            }))
          );
          
          setBookings(bookingsWithRoomDetails);
        } catch (bookingError) {
          debugLog("Error fetching user bookings:", bookingError);
          setBookings([]);
          toast({
            title: "Notice",
            description: "Could not load your bookings at this time. This might be due to backend connectivity issues.",
            variant: "default",
          });
        }
      } catch (error) {
        debugLog("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your account data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  // ✅ NEW: Add refresh function for manual booking data refresh
  const refreshBookings = async () => {
    try {
      debugLog('[DASHBOARD] Manually refreshing booking data...');
      const userBookings = await bookingService.getUserBookings();
      
      const bookingsWithRoomDetails = await Promise.all(userBookings.map(async (booking) => {
        try {
          if (booking.room_id) {
            const roomDetails = await homestayService.getRoomById(booking.room_id);
            return {
              ...booking,
              room: roomDetails
            };
          }
        } catch (err) {
          debugLog(`Could not fetch room details for booking ${booking.id}:`, err);
        }
        return booking;
      }));
      
      debugLog('[DASHBOARD] Refreshed bookings:', 
        bookingsWithRoomDetails.map(b => ({
          id: b.id, 
          booking_status: b.booking_status || b.status,
          payment_status: b.payment_status
        }))
      );
      
      setBookings(bookingsWithRoomDetails);
      
      toast({
        title: "Bookings Refreshed",
        description: "Your booking data has been updated with the latest information.",
        variant: "default",
      });
    } catch (error) {
      debugLog("Error refreshing bookings:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh booking data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ✅ NEW: Listen for navigation back to dashboard (especially after payment)
  useEffect(() => {
    const handleFocus = () => {
      // When user returns to dashboard tab/window, refresh booking data
      debugLog('[DASHBOARD] Page focus detected, refreshing booking data...');
      refreshBookings();
    };

    // Check if there's a payment completion flag in sessionStorage
    const paymentCompleted = sessionStorage.getItem('payment_completed');
    if (paymentCompleted) {
      debugLog('[DASHBOARD] Payment completion detected, refreshing booking data...');
      sessionStorage.removeItem('payment_completed'); // Clear the flag
      refreshBookings();
    }

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // ✅ NEW: Helper function to get the correct payment status from backend data
  const getPaymentStatus = (booking: any): string => {
    // Check if backend has payment_status field
    if (booking.payment_status) {
      return booking.payment_status;
    }
    
    // Fallback: Map is_paid boolean to status string
    if (booking.is_paid === true) {
      return 'paid';
    } else if (booking.is_paid === false) {
      return 'pending';
    }
    
    // Double fallback: Default to pending
    return 'pending';
  };

  const calculateNights = (booking: any) => {
    try {
      const checkIn = new Date(booking.check_in || booking.start_date);
      const checkOut = new Date(booking.check_out || booking.end_date);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch (error) {
      debugLog("Error calculating nights:", error);
      return 1;
    }
  };

  // Get full user name
  const getFullUserName = () => {
    if (user?.name && user?.last_name) {
      return `${user.name} ${user.last_name}`;
    }
    return user?.name || user?.first_name || 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const fullName = getFullUserName();
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-[80vh]">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-ocean" />
            <p className="text-lg text-ocean-dark font-medium">Loading your paradise dashboard...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-sand-light/15 to-sand-dark/15 rounded-full blur-3xl"
        />
      </div>

      <EnhancedNavbar />
      
      <main className="container mx-auto px-4 py-32 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Enhanced Sidebar */}
            <motion.div 
              className="w-full lg:w-1/3 xl:w-1/4 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* User Profile Card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden">
                {/* Decorative elements */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-ocean/20 to-tropical/20 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full"
                />

                <div className="relative flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="h-32 w-32 mb-6 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getFullUserName())}&background=0D8ABC&color=fff&size=128`} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-ocean to-tropical text-white text-2xl font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl font-bold text-ocean-dark mb-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {getFullUserName()}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-ocean/80 text-center mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {user?.email}
                  </motion.p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-ocean/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Star className="h-4 w-4 text-sand-dark" />
                    <span>Member since {format(new Date(user?.created_at || new Date()), "MMMM yyyy")}</span>
                  </motion.div>
                </div>
              </div>

              {/* Navigation Card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <nav className="flex flex-col p-2">
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link 
                      to="/user/profile" 
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl m-2 transition-all duration-300 ${
                        activeTab === 'profile' 
                          ? 'bg-gradient-to-r from-ocean/10 to-tropical/10 text-ocean font-medium shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-ocean/5 hover:to-tropical/5 text-ocean-dark'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>My Profile</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link 
                      to="/user/bookings" 
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl m-2 transition-all duration-300 ${
                        activeTab === 'bookings' 
                          ? 'bg-gradient-to-r from-ocean/10 to-tropical/10 text-ocean font-medium shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-ocean/5 hover:to-tropical/5 text-ocean-dark'
                      }`}
                    >
                      <CalendarDays className="h-5 w-5" />
                      <span>My Bookings</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link 
                      to="/user/settings" 
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl m-2 transition-all duration-300 ${
                        activeTab === 'settings' 
                          ? 'bg-gradient-to-r from-ocean/10 to-tropical/10 text-ocean font-medium shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-ocean/5 hover:to-tropical/5 text-ocean-dark'
                      }`}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Account Settings</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 px-6 py-4 rounded-2xl m-2 text-left transition-all duration-300 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
            
            {/* Enhanced Main Content */}
            <motion.div 
              className="w-full lg:w-2/3 xl:w-3/4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => navigate(`/user/${value}`)}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TabsList className="grid grid-cols-3 mb-8 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/50">
                    <TabsTrigger 
                      value="bookings" 
                      className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean data-[state=active]:to-tropical data-[state=active]:text-white transition-all duration-300"
                    >
                      My Bookings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="profile" 
                      className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean data-[state=active]:to-tropical data-[state=active]:text-white transition-all duration-300"
                    >
                      Profile Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean data-[state=active]:to-tropical data-[state=active]:text-white transition-all duration-300"
                    >
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
                
                <TabsContent value="bookings" className="space-y-6">
                  <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-ocean-dark font-playfair">Your Bookings</h3>
                      <p className="text-ocean/70 mt-1">Manage your island getaway reservations</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/homestays">
                        <Button className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-medium rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                          <Waves className="h-4 w-4" />
                          Book New Stay
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {bookings.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 overflow-hidden">
                          <div className="flex flex-col items-center justify-center text-center">
                            <motion.div
                              animate={{
                                y: [0, -10, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <CalendarDays className="h-24 w-24 text-ocean/30 mb-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-ocean-dark mb-3 font-playfair">No bookings yet</h3>
                            <p className="text-ocean/70 mb-8 text-center max-w-md leading-relaxed">
                              You haven't made any bookings yet. Explore our beautiful homestays and book your perfect island getaway!
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link to="/homestays">
                                <Button className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-medium rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                                  <Home className="h-5 w-5" />
                                  Browse Homestays
                                </Button>
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        {bookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-300"
                          >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean/5 to-tropical/5 rounded-full -translate-y-16 translate-x-16"></div>
                            
                            <div className="p-8">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <h4 className="text-2xl font-bold text-ocean-dark font-playfair mb-2">
                                    {booking.homestay?.title || "Paradiso Homestay"}
                                  </h4>
                                  <div className="flex items-center gap-2 text-ocean/70 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{booking.homestay?.location || "Location unavailable"}</span>
                                  </div>
                                  {booking.room && (
                                    <div className="flex items-center gap-2 text-ocean font-medium">
                                      <Bed className="h-4 w-4" />
                                      <span>{booking.room?.title || `Family Suite`}</span>
                                    </div>
                                  )}
                                </div>
                                <Badge className={`${getStatusColor(booking.booking_status || booking.status || 'pending')} text-white px-4 py-2 rounded-full font-medium`}>
                                  {(booking.booking_status || booking.status || 'completed').charAt(0).toUpperCase() + 
                                   (booking.booking_status || booking.status || 'completed').slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div className="text-center p-4 bg-gradient-to-br from-ocean/5 to-transparent rounded-2xl">
                                  <CalendarDays className="h-6 w-6 text-ocean mx-auto mb-2" />
                                  <p className="text-sm text-ocean/70 mb-1">Check-in</p>
                                  <p className="font-bold text-ocean-dark">
                                    {format(new Date(booking.check_in || booking.start_date || 'Jun 07, 2025'), "MMM dd, yyyy")}
                                  </p>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-tropical/5 to-transparent rounded-2xl">
                                  <CalendarDays className="h-6 w-6 text-tropical mx-auto mb-2" />
                                  <p className="text-sm text-ocean/70 mb-1">Check-out</p>
                                  <p className="font-bold text-ocean-dark">
                                    {format(new Date(booking.check_out || booking.end_date || 'Jun 17, 2025'), "MMM dd, yyyy")}
                                  </p>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-sand-light/20 to-transparent rounded-2xl">
                                  <Clock className="h-6 w-6 text-sand-dark mx-auto mb-2" />
                                  <p className="text-sm text-ocean/70 mb-1">Duration</p>
                                  <p className="font-bold text-ocean-dark">
                                    {booking.nights || calculateNights(booking) || 10} nights
                                  </p>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl">
                                  <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                  <p className="text-sm text-ocean/70 mb-1">Payment</p>
                                  <p className="font-bold text-ocean-dark capitalize">
                                    {getPaymentStatus(booking)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-ocean/70 mb-1">Total Price</p>
                                  <p className="text-3xl font-bold text-ocean-dark">
                                    {formatCurrency(booking.total_price || 6000000, 'IDR')}
                                  </p>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Link to={`/booking/${booking.id}`}>
                                    <Button 
                                      variant="outline" 
                                      className="gap-2 border-ocean/20 text-ocean hover:bg-ocean hover:text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300"
                                    >
                                      View Details 
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </TabsContent>
                
                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-20 translate-x-20"></div>
                    
                    <div className="p-8">
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-ocean-dark font-playfair mb-2">Profile Information</h3>
                        <p className="text-ocean/70">Your personal details and preferences</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Full Name</h4>
                          <p className="text-xl font-semibold text-ocean-dark">{getFullUserName()}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Email</h4>
                          <p className="text-xl font-semibold text-ocean-dark">{user?.email}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Phone Number</h4>
                          <p className="text-xl font-semibold text-ocean-dark">{user?.phone_number || "-"}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Country</h4>
                          <p className="text-xl font-semibold text-ocean-dark">{user?.country || "-"}</p>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Address</h4>
                          <p className="text-xl font-semibold text-ocean-dark">{user?.address || "-"}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-ocean/60 uppercase tracking-wide">Account Type</h4>
                          <Badge className="bg-gradient-to-r from-ocean to-tropical text-white px-4 py-2 rounded-full">
                            {(user?.type || "User").charAt(0).toUpperCase() + (user?.type || "User").slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-12">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link to="/user/settings">
                            <Button className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-medium rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Profile
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="mb-8 text-center">
                      <h3 className="text-3xl font-bold text-ocean-dark font-playfair mb-2">Account Settings</h3>
                      <p className="text-ocean/70">Manage your profile, security, and notification preferences</p>
                    </div>
                    
                    <ProfileInformation user={user} onProfileUpdate={(updatedUser) => setUser(updatedUser)} />
                    <ChangePassword />
                    <NotificationPreferences />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard; 