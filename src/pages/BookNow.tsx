import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CreditCard, Home, ArrowLeft, Loader2, CheckCircle, Bed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, differenceInDays, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedNavbar from "../components/EnhancedNavbar";
import LoadingAnimation from "../components/LoadingAnimation";
import Footer from "../components/Footer";
import SameDayBookingStatus from "../components/SameDayBookingStatus";
import EnhancedDatePicker from "../components/EnhancedDatePicker";
import { homestayService, Homestay } from "@/lib/services/homestayService";
import { authService } from "@/lib/services/authService";
import { bookingService, BookingRequest, checkRoomAvailability } from "@/lib/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';
import { debugLog } from '@/lib/utils';
// ✅ NEW: Payment components
import PaymentPage from '@/components/payment/PaymentPage';
import PaymentSuccess from '@/components/payment/PaymentSuccess';

// Helper function to determine if a room should be shown as available
const isRoomAvailable = (room: any): boolean => {
  // If room is undefined or null, it's not available
  if (!room) return false;

  // Convert status to string and lowercase for consistent comparison
  const roomStatus = String(room.status || 'available').toLowerCase();
  
  // Show rooms that are available OR have no explicit status (default to available)
  // Only hide rooms that are explicitly marked as 'occupied' or 'maintenance'
  return roomStatus !== 'occupied' && roomStatus !== 'maintenance';
};

// Function to get query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Define the booking form schema
const bookingFormSchema = z.object({
  check_in: z.string().nonempty("Check-in date is required"),
  check_out: z.string().nonempty("Check-out date is required"),
  guests: z.string().nonempty("Number of guests is required"),
  name: z.string().nonempty("Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().nonempty("Phone number is required"),
  special_requests: z.string().optional(),
  payment_method: z.enum(["qris"]).default("qris"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const BookNow = () => {
  const query = useQuery();
  const homestayId = query.get("homestay");
  const roomId = query.get("room");
  const fromDate = query.get("from"); // Date when room becomes available
  const occupied = query.get("occupied"); // Flag indicating room is occupied, show enhanced date picker
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useTranslation();
  

  
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nights, setNights] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sameDayBookingAllowed, setSameDayBookingAllowed] = useState(true);
  const [showEnhancedDatePicker, setShowEnhancedDatePicker] = useState(false);
  const [roomAvailabilityStatus, setRoomAvailabilityStatus] = useState<Record<number, { status: 'available' | 'occupied' | 'maintenance' }>>({});
  const [dateSpecificAvailability, setDateSpecificAvailability] = useState<Record<number, { is_available: boolean; checking: boolean }>>({});
  const [initialAvailabilityCheck, setInitialAvailabilityCheck] = useState(false);
  
  // ✅ NEW: Payment flow states
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment' | 'success'>('booking');
  const [bookingData, setBookingData] = useState<any>(null);
  
  // Memoize available rooms based on date-specific availability
  const availableRooms = useMemo(() => {
    if (!homestay?.rooms) return [];
    
    // If we haven't done the initial availability check yet, don't filter rooms
    // This prevents the "Not Available" flash on page load
    if (!initialAvailabilityCheck) {
      return homestay.rooms.filter(room => room != null);
    }
    
    return homestay.rooms.filter(room => {
      if (!room) return false;
      
      // Check date-specific availability first
      const dateAvailability = dateSpecificAvailability[room.id];
      if (dateAvailability !== undefined) {
        return dateAvailability.is_available;
      }
      
      // Fallback to static room status
      return isRoomAvailable(room);
    });
  }, [homestay?.rooms, dateSpecificAvailability, initialAvailabilityCheck]);
  
  // Memoize occupied rooms that might be available for different dates
  const occupiedRooms = useMemo(() => {
    if (!homestay?.rooms) return [];
    
    // If we haven't done the initial availability check yet, don't show occupied rooms
    // This prevents the "Not Available" flash on page load
    if (!initialAvailabilityCheck) {
      return [];
    }
    
    return homestay.rooms.filter(room => {
      if (!room) return false;
      
      // Check date-specific availability first
      const dateAvailability = dateSpecificAvailability[room.id];
      if (dateAvailability !== undefined) {
        return !dateAvailability.is_available;
      }
      
      // Fallback to static room status
      const roomStatus = String(room.status || 'available').toLowerCase();
      return roomStatus === 'occupied';
    });
  }, [homestay?.rooms, dateSpecificAvailability, initialAvailabilityCheck]);
  
  // Page loading effect
  useEffect(() => {
    const pageLoadingTimer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => setContentLoaded(true), 300);
    }, 2000);

    return () => clearTimeout(pageLoadingTimer);
  }, []);
  
  // Show enhanced date picker if room is occupied
  useEffect(() => {
    if (occupied === 'true') {
      setShowEnhancedDatePicker(true);
    }
  }, [occupied]);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      check_in: fromDate || format(new Date(), 'yyyy-MM-dd'),
      check_out: format(addDays(new Date(fromDate || new Date()), 1), 'yyyy-MM-dd'),
      guests: "1", // Default to 1, will be updated based on selected room
      name: "",
      email: "",
      phone: "",
      special_requests: "",
      payment_method: "qris",
    },
  });
  
  useEffect(() => {
    // If user is logged in, pre-fill the form
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      form.setValue('name', currentUser.name);
      form.setValue('email', currentUser.email);
      if (currentUser.phone_number) {
        form.setValue('phone', currentUser.phone_number);
      }
    }
  }, [form]);
  
  // Calculate nights when check-in or check-out dates change
  useEffect(() => {
    const checkIn = form.watch('check_in');
    const checkOut = form.watch('check_out');
    
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const days = differenceInDays(endDate, startDate);
      
      if (days > 0) {
        setNights(days);
      } else {
        // If check-out is before check-in, set check-out to day after check-in
        const newCheckOut = format(addDays(startDate, 1), 'yyyy-MM-dd');
        form.setValue('check_out', newCheckOut);
        setNights(1);
      }
    }
  }, [form.watch('check_in'), form.watch('check_out'), form]);

  // Check date-specific availability when dates change
  useEffect(() => {
    const checkIn = form.watch('check_in');
    const checkOut = form.watch('check_out');
    
    if (checkIn && checkOut && homestay?.rooms) {
      // Reset the initial availability check flag when dates change
      setInitialAvailabilityCheck(false);
      
      // Add a small delay to avoid excessive API calls while user is typing/selecting dates
      const timeoutId = setTimeout(() => {
        checkDateSpecificAvailability(checkIn, checkOut);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [form.watch('check_in'), form.watch('check_out'), homestay?.rooms]);

  // Initialize selected room based on URL or default to first room
  useEffect(() => {
    if (roomId && homestay?.rooms) {
      const parsedRoomId = parseInt(roomId);
      const room = homestay.rooms.find(r => r.id === parsedRoomId);
      if (room) {
        setSelectedRoomId(parsedRoomId);
        // Update guest count based on room capacity
        const guestCount = (room.max_occupancy || room.max_guests) === 1 ? "1" : Math.min(room.number_people || 2, room.max_occupancy || room.max_guests || 2).toString();
        form.setValue('guests', guestCount);
      } else {
        setSelectedRoomId(homestay.rooms[0]?.id || null);
        const firstRoom = homestay.rooms[0];
        if (firstRoom) {
          const guestCount = (firstRoom.max_occupancy || firstRoom.max_guests) === 1 ? "1" : Math.min(firstRoom.number_people || 2, firstRoom.max_occupancy || firstRoom.max_guests || 2).toString();
          form.setValue('guests', guestCount);
        }
      }
    } else if (homestay?.rooms && homestay.rooms.length > 0) {
      setSelectedRoomId(homestay.rooms[0].id);
      const firstRoom = homestay.rooms[0];
      const guestCount = (firstRoom.max_occupancy || firstRoom.max_guests) === 1 ? "1" : Math.min(firstRoom.number_people || 2, firstRoom.max_occupancy || firstRoom.max_guests || 2).toString();
      form.setValue('guests', guestCount);
    } else {
      setSelectedRoomId(null);
    }
  }, [homestay, roomId, form]);

  // Function to check date-specific availability for all rooms
  const checkDateSpecificAvailability = async (checkInDate: string, checkOutDate: string) => {
    if (!homestay?.rooms || homestay.rooms.length === 0) return;
    
    try {
      debugLog(`[BOOKING] Checking date-specific availability for ${homestay.rooms.length} rooms from ${checkInDate} to ${checkOutDate}`);
      
      // Set all rooms to checking state
      const checkingState: Record<number, { is_available: boolean; checking: boolean }> = {};
      homestay.rooms.forEach(room => {
        checkingState[room.id] = { is_available: false, checking: true };
      });
      setDateSpecificAvailability(checkingState);
      
      // Check availability for each room
      const availabilityPromises = homestay.rooms.map(async (room) => {
        try {
          const availability = await checkRoomAvailability(room.id, checkInDate, checkOutDate);
          return {
            roomId: room.id,
            is_available: availability.is_available,
            checking: false
          };
        } catch (error) {
          console.error(`[BOOKING] Failed to check availability for room ${room.id}:`, error);
          // If check fails, assume not available to be safe
          return {
            roomId: room.id,
            is_available: false,
            checking: false
          };
        }
      });
      
      try {
        const results = await Promise.all(availabilityPromises);
        
        // Update state with results
        const newAvailability: Record<number, { is_available: boolean; checking: boolean }> = {};
        results.forEach(result => {
          newAvailability[result.roomId] = {
            is_available: result.is_available,
            checking: false
          };
        });
        
        setDateSpecificAvailability(newAvailability);
        setInitialAvailabilityCheck(true); // Mark that we've completed the initial check
        
        const availableCount = results.filter(r => r.is_available).length;
        debugLog(`[BOOKING] Date-specific availability check complete: ${availableCount}/${results.length} rooms available`);
        
      } catch (error) {
        console.error('[BOOKING] Failed to check room availability:', error);
        // Reset checking state on error
        const errorState: Record<number, { is_available: boolean; checking: boolean }> = {};
        homestay.rooms.forEach(room => {
          errorState[room.id] = { is_available: false, checking: false };
        });
        setDateSpecificAvailability(errorState);
        setInitialAvailabilityCheck(true); // Mark as complete even on error
      }
    } catch (error) {
      console.error('[BOOKING] Failed to check room availability:', error);
      // Reset checking state on error
      const errorState: Record<number, { is_available: boolean; checking: boolean }> = {};
      homestay.rooms.forEach(room => {
        errorState[room.id] = { is_available: false, checking: false };
      });
      setDateSpecificAvailability(errorState);
      setInitialAvailabilityCheck(true); // Mark as complete even on error
    }
  };

  // Define fetchHomestay as a state function so we can reference it elsewhere
  const fetchHomestayData = async () => {
    try {
      debugLog(`[BOOKING] Fetching homestay ID: ${homestayId} with language: ${language} and dates: ${form.getValues('check_in')} to ${form.getValues('check_out')}`);
      
      const fetchedHomestay = await homestayService.getHomestayById(parseInt(homestayId!), language);
      debugLog("[BOOKING] Fetched homestay:", fetchedHomestay);
        
        // Check for requested room
        if (roomId && fetchedHomestay.rooms) {
          const requestedRoomId = parseInt(roomId);
          const selectedRoom = fetchedHomestay.rooms.find(r => r.id === requestedRoomId);
          if (selectedRoom) {
          debugLog(`[BOOKING] Found requested room: ${selectedRoom.name || selectedRoom.id}`);
            setSelectedRoomId(selectedRoom.id);
          } else {
          debugLog(`[BOOKING] Requested room ${roomId} not found in homestay rooms`);
          }
        } 
        // Otherwise, select first room by default if available
        else if (fetchedHomestay.rooms && fetchedHomestay.rooms.length > 0) {
        debugLog(`[BOOKING] Setting default room: ${fetchedHomestay.rooms[0].name || fetchedHomestay.rooms[0].id}`);
          setSelectedRoomId(fetchedHomestay.rooms[0].id);
        }
        
      // If there are rooms, use their status from the database
        if (fetchedHomestay.rooms && fetchedHomestay.rooms.length > 0) {
        debugLog(`[BOOKING] Using room status from database for ${fetchedHomestay.rooms.length} rooms...`);
        
        // Use room status directly from database - no additional API calls needed
        const availabilityStatus: Record<number, { status: 'available' | 'occupied' | 'maintenance' }> = {};
        fetchedHomestay.rooms.forEach(room => {
          // Use the room status that comes from the database
          const roomStatus = String(room.status || 'available').toLowerCase();
          availabilityStatus[room.id] = { 
            status: roomStatus as 'available' | 'occupied' | 'maintenance' 
          };
        });
        setRoomAvailabilityStatus(availabilityStatus);
        
            setHomestay(fetchedHomestay);
        } else {
        debugLog('[BOOKING] No rooms found');
          setHomestay(fetchedHomestay);
        // Initialize empty availability status for homestays without rooms
        setRoomAvailabilityStatus({});
        }
      } catch (error) {
        console.error('[BOOKING] Error fetching homestay:', error);
        toast({
          title: "Error",
          description: "Failed to load homestay details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
  // Fetch homestay details if ID is provided
  useEffect(() => {
    fetchHomestayData();
  }, [homestayId, roomId]);

  // Re-fetch homestay data when language changes
  useEffect(() => {
    if (homestayId) {
      fetchHomestayData();
    }
  }, [language]);

  // ✅ NEW: Helper function for standard availability error handling
  const handleStandardAvailabilityError = () => {
    toast({
      title: "Room No Longer Available",
      description: "This room was just booked by another guest. We'll refresh the availability and suggest alternatives.",
      variant: "destructive",
    });
    
    // Refresh the homestay data to get updated room availability
    setTimeout(() => {
      fetchHomestayData();
    }, 1000);
    
    // Try to find alternative dates
    if (selectedRoomId) {
      bookingService.findNextAvailableDate(selectedRoomId, 14)
        .then(nextDate => {
          if (nextDate) {
            toast({
              title: "Alternative Available",
              description: `This room is available starting ${new Date(nextDate).toLocaleDateString()}. Would you like to try different dates?`,
              variant: "default",
            });
          }
        })
        .catch(err => console.log('Could not find alternative dates:', err));
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!homestay || !homestay.id) {
      toast({
        title: "Booking Failed",
        description: "Please select a homestay before booking.",
        variant: "destructive",
      });
      return;
    }

    // Check if selected room is available before proceeding
    if (selectedRoomId && roomAvailabilityStatus[selectedRoomId]) {
      const roomStatus = roomAvailabilityStatus[selectedRoomId].status;
      if (roomStatus !== 'available') {
        toast({
          title: "Room Not Available",
          description: `This room is currently ${roomStatus}. Please select different dates or choose another room.`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Get the effective room ID with multiple fallbacks
      let effectiveRoomId = null;
      let selectedRoom = null;
      
      // First check if a room is manually selected
      if (selectedRoomId && homestay.rooms) {
        selectedRoom = homestay.rooms.find(r => r.id === selectedRoomId);
        if (selectedRoom) {
          effectiveRoomId = selectedRoomId;
          debugLog(`[BOOKING] Selected room: ${selectedRoom.displayName || selectedRoom.name || selectedRoomId}`);
        }
      } 
      // Then check if there are rooms available in the homestay
      else if (homestay.rooms && homestay.rooms.length > 0) {
        // If there's a match for the URL room parameter
        if (roomId) {
          const parsedRoomId = parseInt(roomId);
          selectedRoom = homestay.rooms.find(r => r.id === parsedRoomId);
          if (selectedRoom) {
            effectiveRoomId = selectedRoom.id;
            debugLog(`[BOOKING] Using URL room parameter: ${selectedRoom.displayName || selectedRoom.name || parsedRoomId}`);
          } else {
            selectedRoom = homestay.rooms[0];
            effectiveRoomId = selectedRoom.id;
            debugLog(`[BOOKING] Room from URL not found, using first room: ${selectedRoom.displayName || selectedRoom.name || selectedRoom.id}`);
          }
        } else {
          // Otherwise use the first room
          selectedRoom = homestay.rooms[0];
          effectiveRoomId = selectedRoom.id;
          debugLog(`[BOOKING] No room specified, using first room: ${selectedRoom.displayName || selectedRoom.name || selectedRoom.id}`);
        }
      }
      // Last resort, use the homestay ID itself
      else {
        effectiveRoomId = homestay.id;
        debugLog(`[BOOKING] No rooms found, using homestay ID: ${homestay.id}`);
      }
      
      // Check if user is logged in
      const isLoggedIn = authService.isAuthenticated();
      
      // If not logged in, check if we should proceed as guest
      if (!isLoggedIn) {
        // Validate email format for non-authenticated users
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          toast({
            title: "Email Required",
            description: "Please provide a valid email address for booking confirmation.",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
        
        // Validate guest name
        if (!data.name || data.name.trim().length < 3) {
          toast({
            title: "Name Required",
            description: "Please provide your full name for the booking.",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
      }
      
      // Extract actual room number from the selectedRoom (important for database consistency)
      const actualRoomNumber = selectedRoom?.room_number;
      
      // Log extra details for debugging
      debugLog(`[BOOKING] Room details:`, {
        selectedRoomId,
        name: selectedRoom?.name,
        room_number: selectedRoom?.room_number,
        displayName: selectedRoom?.displayName
      });
      
      // Debug output
      debugLog("Booking with:", {
        homestay_id: homestay.id,
        room_id: effectiveRoomId,
        room_number: actualRoomNumber,
        room_details: selectedRoom ? {
          id: selectedRoom.id,
          room_id: selectedRoom.room_id,
          room_number: selectedRoom.room_number,
          name: selectedRoom.name,
          displayName: selectedRoom.displayName
        } : 'No room details',
        hasRooms: !!homestay.rooms,
        roomsLength: homestay.rooms?.length,
        urlRoomId: roomId,
        isLoggedIn: isLoggedIn
      });
      
      // Prepare booking data in the format expected by the API
      const bookingData = {
        // API required fields
        start_date: data.check_in,
        end_date: data.check_out,
        room_id: effectiveRoomId,
        homestay_id: homestay.id,
        number_of_guests: parseInt(data.guests),
        
        // Include room details for accurate booking
        room_number: actualRoomNumber, // Use actual room number from database
        room_data: {
          id: effectiveRoomId,
          room_number: actualRoomNumber,
          name: selectedRoom?.name || selectedRoom?.displayName
        },
        
        // Guest information
        guest_name: data.name,
        guest_email: data.email,
        guest_phone: data.phone,
        
        // Additional booking details
        special_requests: data.special_requests,
        notes: "Booked through website",
        check_in_time: "14:00",
        check_out_time: "11:00",
        payment_method: data.payment_method,
        
        // For price calculation
        nights: nights,
        total_price: homestay.base_price * nights,
        
        // Debug information for room tracking
        room_debug: {
          original_room_id: effectiveRoomId,
          room_number: actualRoomNumber,
          room_name: selectedRoom?.displayName || selectedRoom?.name || 'Unknown Room'
        },
        
        // Authentication mode: guest or authenticated user
        is_guest_booking: !isLoggedIn
      };
      
      debugLog("Sending booking data:", bookingData);
      
      // ✅ FIX: Create booking with PENDING status first (no emails should be sent yet)
      // Add payment_status as pending to indicate this booking needs payment
      const pendingBookingData = {
        ...bookingData,
        booking_status: 'pending',  // Explicitly set as pending
        payment_status: 'pending',  // Indicate payment is required
        notes: bookingData.notes ? `${bookingData.notes} | PAYMENT_REQUIRED` : 'PAYMENT_REQUIRED'
      };
      
      debugLog("Creating PENDING booking (no emails yet):", pendingBookingData);
      const response = await bookingService.createBooking(pendingBookingData);
      
      if (response.status === 'success' && response.data) {
        // ✅ NEW: Successful booking - show WhatsApp payment instructions
        debugLog(`[BOOKING] ✅ Booking created successfully, proceeding to WhatsApp/manual payment...`);
        setBookingData(response.data);
        setCurrentStep('payment');
        toast({
          title: "Booking Pending Payment",
          description: "Your booking is reserved. Please contact Mr. Rusli via WhatsApp to complete payment.",
          variant: "default",
        });
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Check if error is an authentication issue
      if (errorMessage.includes('authentication')) {
        // Prompt user to login
        toast({
          title: "Login Required",
          description: "Please login to continue with your booking",
          variant: "destructive",
        });
        
        // Remember booking details in sessionStorage for after login
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          homestayId: homestay.id,
          roomId: selectedRoomId,
          checkIn: data.check_in,
          checkOut: data.check_out,
          guests: data.guests
        }));
        
        // Redirect to login page with return URL
        navigate(`/auth/login?returnUrl=${encodeURIComponent(`/book-now?homestay=${homestay.id}&room=${selectedRoomId}`)}`);
      } 
      // Check if error is availability-related
      else if (errorMessage.toLowerCase().includes('not available') || 
               errorMessage.toLowerCase().includes('no longer available') ||
               errorMessage.toLowerCase().includes('already booked')) {
        
        debugLog(`[BOOKING] ⚠️ Availability error detected for room ${selectedRoomId}, checking same-day availability...`);
        
        // ✅ NEW: Check if this is a same-day booking issue
        const today = new Date().toISOString().split('T')[0];
        if (selectedRoomId && data.check_in === today) {
          try {
            const sameDayInfo = await bookingService.checkSameDayAvailability(selectedRoomId, today);
            debugLog(`[BOOKING] Same-day availability info:`, sameDayInfo);
            
            if (sameDayInfo.can_book_today && sameDayInfo.early_checkout) {
              // ✅ NEW: Room available after early checkout with proper backend data
              if (sameDayInfo.housekeeping_status === 'completed') {
                toast({
                  title: "🎉 Same-Day Booking Available!",
                  description: `Room had early checkout${sameDayInfo.checkout_time ? ` at ${sameDayInfo.checkout_time}` : ''} and housekeeping is complete. You can book this room immediately!`,
                  variant: "default",
                });
              } else {
                toast({
                  title: "⏰ Room Available Soon",
                  description: `Room had early checkout${sameDayInfo.checkout_time ? ` at ${sameDayInfo.checkout_time}` : ''}. Housekeeping in progress${sameDayInfo.housekeeping_complete_time ? ` - available around ${sameDayInfo.housekeeping_complete_time}` : ''}. Please try again shortly.`,
                  variant: "default",
                });
              }
            } else if (sameDayInfo.can_book_today && !sameDayInfo.early_checkout) {
              // Room is normally available
              toast({
                title: "✅ Same-Day Booking Available",
                description: "Room is available for same-day booking. You can book immediately!",
                variant: "default",
              });
            } else if (!sameDayInfo.can_book_today) {
              // ✅ NEW: Room not available with detailed info
              const currentBookingInfo = sameDayInfo.current_booking 
                ? ` (Booking: ${sameDayInfo.current_booking.booking_number})` 
                : '';
              
              toast({
                title: "❌ Room Not Available Today",
                description: `${sameDayInfo.message}${currentBookingInfo}${sameDayInfo.earliest_booking_time && sameDayInfo.earliest_booking_time !== 'unknown' ? ` Available from ${sameDayInfo.earliest_booking_time}` : ''}`,
                variant: "destructive",
              });
              
              // Find next available date
              bookingService.findNextAvailableDate(selectedRoomId, 14)
                .then(nextDate => {
                  if (nextDate) {
                    toast({
                      title: "Alternative Available",
                      description: `This room is available starting ${new Date(nextDate).toLocaleDateString()}. Would you like to try different dates?`,
                      variant: "default",
                    });
                  }
                })
                .catch(err => console.log('Could not find alternative dates:', err));
            }
          } catch (sameDayError) {
            console.error('[BOOKING] Same-day availability check failed:', sameDayError);
            // Fall back to standard error handling
            handleStandardAvailabilityError();
          }
        } else {
          // Not a same-day booking, use standard error handling
          handleStandardAvailabilityError();
        }
        
      } else {
        toast({
          title: "Booking Failed",
          description: errorMessage || "There was an error processing your booking. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIXED: Payment flow handlers - confirm booking AFTER payment
  const handlePaymentSuccess = async () => {
    // ✅ FIXED: No manual booking status updates - backend handles this automatically when payment completes
    debugLog(`[BOOKING] Payment successful for booking ${bookingData?.id}! Backend automatically updated booking status.`);
    
    // Update local room status to occupied for immediate UI feedback
    if (selectedRoomId && homestay?.rooms) {
      const roomToUpdate = homestay.rooms.find(r => r.id === selectedRoomId);
      if (roomToUpdate) {
        debugLog(`[BOOKING] Setting selected room ${selectedRoomId} status to occupied in UI`);
        roomToUpdate.status = 'occupied';
      }
    }
    
    setCurrentStep('success');
    setBookingSuccess(true);
    setBookingReference(bookingData?.booking_number || '');
    
    // Set flag for dashboard to refresh booking data
    sessionStorage.setItem('payment_completed', 'true');
    
    toast({
      title: "Payment Successful! 🎉",
      description: "Your booking has been confirmed automatically by the system.",
      variant: "default",
    });
  };

  const handleBackToBooking = () => {
    setCurrentStep('booking');
    setBookingData(null);
  };

  const handleNewBooking = () => {
    setCurrentStep('booking');
    setBookingData(null);
    setBookingSuccess(false);
    setBookingReference('');
    
    // Reset form
    form.reset({
      check_in: format(new Date(), 'yyyy-MM-dd'),
      check_out: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      guests: "1",
      name: "",
      email: "",
      phone: "",
      special_requests: "",
      payment_method: "qris",
    });
  };



  if (loading) {
    return (
      <>
        <LoadingAnimation 
          isLoading={pageLoading} 
          onComplete={() => setContentLoaded(true)}
        />
        
        <motion.div 
          className="min-h-screen bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedNavbar />
          <div className="flex items-center justify-center h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-ocean mx-auto mb-4" />
              <p className="text-lg text-gray-600">{t('booknow.loading_booking_details')}</p>
            </motion.div>
          </div>
        </motion.div>
      </>
    );
  }

  if (bookingSuccess) {
    return (
      <>
        <LoadingAnimation 
          isLoading={pageLoading} 
          onComplete={() => setContentLoaded(true)}
        />
        
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-ocean-light/30 to-sand-light/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedNavbar />
          <div className="pt-32 pb-16 container mx-auto px-4">
            <motion.div 
              className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-ocean-light rounded-full opacity-20"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-tropical-light rounded-full opacity-20"></div>
              
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6"
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 font-playfair">{t('booknow.booking_confirmed')}</h1>
                <p className="text-lg text-gray-600 mb-6">
                  {t('booknow.booking_success_message')}
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-xl font-bold mb-8 border-l-4 border-ocean">
                  {bookingReference}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                  <h3 className="font-semibold text-blue-700 mb-2">{t('booknow.whats_next')}</h3>
                  <ul className="text-left text-blue-600 space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                      <span>{t('booknow.confirmation_email_sent')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                      <span>{t('booknow.save_reference').replace('{reference}', bookingReference)}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                      <span>{t('booknow.property_notified')}</span>
                    </li>
                    {authService.isAuthenticated() && (
                      <li className="flex gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                        <span>You can view your booking details in your <Link to="/user/dashboard" className="underline font-medium">dashboard</Link>.</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    type="button"
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="px-6"
                  >
                    {t('booknow.return_home')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate('/user/dashboard')}
                    className="px-6 bg-gradient-to-r from-ocean to-tropical"
                  >
                    {t('booknow.view_bookings')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          <Footer />
        </motion.div>
      </>
    );
  }

  // ✅ NEW: Handle payment flow steps
  if (currentStep === 'payment' && bookingData) {
    return (
      <>
        <LoadingAnimation 
          isLoading={pageLoading} 
          onComplete={() => setContentLoaded(true)}
        />
        <motion.div 
          className="min-h-screen bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedNavbar />
          <div className="pt-32 pb-16">
            <PaymentPage
              bookingData={bookingData}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBackToBooking}
            />
          </div>
          <Footer />
        </motion.div>
      </>
    );
  }

  if (currentStep === 'success' && bookingData) {
    return (
      <>
        <LoadingAnimation 
          isLoading={pageLoading} 
          onComplete={() => setContentLoaded(true)}
        />
        
        <motion.div 
          className="min-h-screen bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedNavbar />
          <div className="pt-32 pb-16">
            <PaymentSuccess
              bookingData={bookingData}
              onNewBooking={handleNewBooking}
            />
          </div>
          <Footer />
        </motion.div>
      </>
    );
  }

  return (
    <>
      <LoadingAnimation 
        isLoading={pageLoading} 
        onComplete={() => setContentLoaded(true)}
      />
      
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnhancedNavbar />
        
        {/* Enhanced Header Section with Island Paradise Theme */}
        <motion.section 
          className="relative pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-tropical-light/30 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [360, 180, 0],
                opacity: [0.08, 0.15, 0.08]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-tr from-tropical to-sand-light rounded-full blur-xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-ocean via-tropical to-ocean-dark bg-clip-text text-transparent mb-4 sm:mb-6 font-playfair leading-tight">
                {t('booknow.page_title')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                {homestay 
                  ? t('booknow.page_subtitle').replace('{homestay}', homestay.title)
                  : t('booknow.page_subtitle_default')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-ocean-dark">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm">🏝️</span>
                  </div>
                </motion.div>
                <span className="text-sm sm:text-base md:text-lg font-medium text-center">{t('booknow.secure_instant_magical')}</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Booking Form Section with Glass Morphism */}
        <motion.div 
          className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={showEnhancedDatePicker ? "flex flex-col lg:grid lg:grid-cols-[2fr,1fr] gap-6 lg:gap-8" : "flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12"}>
            {/* Enhanced Booking Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: contentLoaded ? 1 : 0, x: contentLoaded ? 0 : -50 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                {/* Sophisticated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 pointer-events-none" />
                
                <CardHeader className="relative z-10 pb-6 bg-gradient-to-r from-ocean/10 via-tropical/10 to-ocean/10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-ocean to-tropical bg-clip-text text-transparent mb-2 font-playfair">
                      {t('booknow.booking_details')}
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg text-gray-600">
                      {t('booknow.complete_reservation')}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="relative z-10 p-4 sm:p-6 md:p-8">
                  {/* Desktop Enhanced Date Picker */}
                  {showEnhancedDatePicker && (
                    <div className="hidden lg:block mb-8">
                      <EnhancedDatePicker
                        roomId={selectedRoomId || 0}
                        roomName={homestay?.rooms?.find(r => r.id === selectedRoomId)?.name}
                        onDateSelect={(startDate, endDate) => {
                          debugLog('[BOOKING] Visual calendar date selected:', { startDate, endDate });
                          form.setValue('check_in', startDate);
                          form.setValue('check_out', endDate);
                          setShowEnhancedDatePicker(false);
                          toast({
                            title: "✅ Dates Selected",
                            description: `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd')} selected successfully!`,
                            variant: "default",
                          });
                        }}
                        onClose={() => setShowEnhancedDatePicker(false)}
                        initialStartDate={form.getValues('check_in')}
                        initialEndDate={form.getValues('check_out')}
                        isEmbedded={true}
                      />
                    </div>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Enhanced Room Selection */}
                      {homestay && homestay.rooms && homestay.rooms.length > 0 && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-ocean-dark font-playfair">{t('booknow.select_room')}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              {!initialAvailabilityCheck ? (
                                <div className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                                  🔄 {t('booknow.checking_availability')}
                              </div>
                              ) : (
                                <>
                                  <div className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                                    {t('booknow.available_for_dates').replace('{count}', availableRooms.length.toString())}
                                  </div>
                                  {occupiedRooms.length > 0 && (
                                    <div className="bg-red-100 text-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                                      {t('booknow.not_available').replace('{count}', occupiedRooms.length.toString())}
                                    </div>
                                  )}
                                </>
                              )}
                              {Object.values(dateSpecificAvailability).some(status => status.checking) && (
                                <div className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                                  🔄 {t('booknow.checking')}
                                </div>
                              )}
                              <Button 
                                type="button"
                                onClick={() => {
                                  toast({
                                    title: t('booknow.refreshing_availability'),
                                    description: t('booknow.checking_latest_rooms'),
                                  });
                                  
                                  // ✅ NEW: Force refresh all room availability caches
                                  if (homestay.rooms && homestay.rooms.length > 0) {
                                    Promise.all(
                                      homestay.rooms.map(room => 
                                        bookingService.refreshRoomAvailability(room.id)
                                          .catch(err => debugLog(`Could not refresh room ${room.id}:`, err))
                                      )
                                    ).then(() => {
                                      fetchHomestayData();
                                      toast({
                                        title: t('booknow.availability_updated'),
                                        description: t('booknow.availability_refreshed'),
                                      });
                                    }).catch(err => {
                                      debugLog('Some room refreshes failed:', err);
                                      fetchHomestayData(); // Still fetch data even if some refreshes failed
                                    });
                                  } else {
                                    fetchHomestayData();
                                  }
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-ocean hover:bg-ocean/10 rounded-xl text-xs sm:text-sm px-2 sm:px-3"
                              >
                                <motion.span 
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="inline-block mr-1"
                                >
                                  ↻
                                </motion.span>
                                <span className="hidden sm:inline">{t('booknow.refresh_availability')}</span>
                                <span className="sm:hidden">Refresh</span>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid gap-4">
                            {/* Available Rooms */}
                            {availableRooms
                              .map((room, index) => (
                                <motion.div 
                                  key={room.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                                  onClick={() => setSelectedRoomId(room.id)}
                                  className={`group relative backdrop-blur-sm bg-white/70 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 border-2 ${
                                    selectedRoomId === room.id 
                                      ? 'border-ocean shadow-xl bg-gradient-to-r from-ocean/5 via-tropical/5 to-ocean/5 transform scale-[1.02]' 
                                      : 'border-gray-200/60 hover:border-ocean/50 hover:shadow-lg hover:bg-white/80'
                                  }`}
                                >
                                  {/* Magical selection indicator */}
                                  {selectedRoomId === room.id && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-ocean to-tropical rounded-full flex items-center justify-center shadow-lg"
                                    >
                                      <span className="text-white text-xs">✓</span>
                                    </motion.div>
                                  )}
                                  
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Bed className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-lg sm:text-xl font-bold text-ocean-dark truncate">
                                          {room.room_number ? `Room ${room.room_number}` : `Room ${room.id}`}
                                          {(room.name || room.title) && ` - ${room.name || room.title}`}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                          {(() => {
                                            const dateAvailability = dateSpecificAvailability[room.id];
                                            
                                            // Show loading state if we haven't completed initial availability check
                                            if (!initialAvailabilityCheck) {
                                              return (
                                                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                  🔄 Checking Availability...
                                                </span>
                                              );
                                            }
                                            
                                            if (dateAvailability?.checking) {
                                              return (
                                                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                  🔄 Checking Availability...
                                                </span>
                                              );
                                            } else if (dateAvailability?.is_available) {
                                              return (
                                                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                  ✨ Available for Selected Dates
                                                </span>
                                              );
                                            } else if (dateAvailability !== undefined) {
                                              return (
                                                <span className="bg-gradient-to-r from-red-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                  ❌ Not Available for Selected Dates
                                                </span>
                                              );
                                            } else {
                                              // Fallback to static status
                                              return roomAvailabilityStatus[room.id]?.status === 'available' ? (
                                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                            ✨ Available Now
                                          </span>
                                              ) : (
                                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                  ⏳ Check Available Dates
                                                </span>
                                              );
                                            }
                                          })()}
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {room.room_number || `ID: ${room.id}`}
                                          </span>
                                          {/* Only show static room status if no date-specific availability check has been done */}
                                          {!dateSpecificAvailability[room.id] && room.status && String(room.status).toLowerCase() !== 'available' && (
                                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">
                                              {String(room.status).charAt(0).toUpperCase() + String(room.status).slice(1)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right sm:text-right">
                                      <div className="text-xl sm:text-2xl font-bold text-ocean-dark">
                                        {formatCurrency(room.price_per_night || homestay.base_price, 'IDR')}
                                      </div>
                                      <span className="text-xs sm:text-sm text-gray-500">/night</span>
                                    </div>
                                  </div>
                                  
                                  {room.description && (
                                    <div className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">{room.description}</div>
                                  )}
                                  
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-ocean" />
                                      <span className="text-xs sm:text-sm">Max {room.max_guests || homestay.max_guests} guests</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-xs sm:text-sm">Island view</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            
                            {/* Not Available Rooms - Show with different styling */}
                            {occupiedRooms.map((room, index) => (
                              <motion.div 
                                key={`unavailable-${room.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.2 + (availableRooms.length + index) * 0.1 }}
                                onClick={() => {
                                  setSelectedRoomId(room.id);
                                  setShowEnhancedDatePicker(true);
                                  toast({
                                    title: "🗓️ Try Different Dates",
                                    description: `Room ${room.room_number} is not available for the selected dates. Try different dates to book this room.`,
                                    variant: "default",
                                  });
                                }}
                                className={`group relative backdrop-blur-sm bg-red-50/70 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                                  selectedRoomId === room.id 
                                    ? 'border-red-500 shadow-xl bg-gradient-to-r from-red-100/80 via-pink-50/80 to-red-100/80 transform scale-[1.02]' 
                                    : 'border-red-200/60 hover:border-red-400/50 hover:shadow-lg hover:bg-red-50/80'
                                } opacity-75`}
                              >
                                {/* Selection indicator for unavailable rooms */}
                                {selectedRoomId === room.id && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <span className="text-white text-xs">📅</span>
                                    </motion.div>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-lg">
                                        <Bed className="h-6 w-6 text-white" />
                                      </div>
                                      <div>
                                      <h4 className="text-xl font-bold text-red-800">
                                        {room.room_number ? `Room ${room.room_number}` : `Room ${room.id}`}
                                        {(room.name || room.title) && ` - ${room.name || room.title}`}
                                      </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                        {(() => {
                                          const dateAvailability = dateSpecificAvailability[room.id];
                                          if (dateAvailability?.checking) {
                                            return (
                                              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                🔄 Checking Availability...
                                          </span>
                                            );
                                          } else {
                                            return (
                                              <span className="bg-gradient-to-r from-red-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                ❌ Not Available for Selected Dates
                                              </span>
                                            );
                                          }
                                        })()}
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {room.room_number || `ID: ${room.id}`}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  <div className="text-right sm:text-right">
                                    <div className="text-xl sm:text-2xl font-bold text-red-800">
                                      {formatCurrency(room.price_per_night || homestay.base_price, 'IDR')}
                                      </div>
                                    <span className="text-xs sm:text-sm text-gray-500">/night</span>
                                    </div>
                                  </div>
                                  
                                  {room.description && (
                                  <div className="text-red-700 mb-4 leading-relaxed text-sm sm:text-base">{room.description}</div>
                                  )}
                                  
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-red-600">
                                    <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-red-500" />
                                    <span className="text-xs sm:text-sm">Max {room.max_guests || homestay.max_guests} guests</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span className="text-xs sm:text-sm">Island view</span>
                                    </div>
                                  </div>
                                
                                <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-200">
                                  <p className="text-sm text-red-700 font-medium">
                                    💡 Click to try different dates for this room
                                  </p>
                                </div>
                                </motion.div>
                              ))}
                            
                            {availableRooms.length === 0 && occupiedRooms.length === 0 && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl"
                              >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                                  <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-800 mb-2">No rooms available</h3>
                                <p className="text-amber-700 mb-4">These magical dates are fully booked. Try different dates for your island escape.</p>
                                <Button 
                                  type="button"
                                  onClick={() => {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const dayAfter = new Date();
                                    dayAfter.setDate(dayAfter.getDate() + 2);
                                    
                                    form.setValue('check_in', format(tomorrow, 'yyyy-MM-dd'));
                                    form.setValue('check_out', format(dayAfter, 'yyyy-MM-dd'));
                                    fetchHomestayData();
                                  }}
                                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
                                >
                                  Try Tomorrow? 🌅
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Date Selection */}
                      {showEnhancedDatePicker ? (
                        /* ✅ PHASE 2: Enhanced Date Picker - Landscape Layout for Desktop */
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.4 }}
                          className="my-8"
                        >
                          {/* Desktop: Landscape layout, Mobile: Stacked */}
                          <div className="lg:hidden">
                            {/* Mobile View: Full-width enhanced date picker */}
                            <EnhancedDatePicker
                              roomId={selectedRoomId || 0}
                              roomName={homestay?.rooms?.find(r => r.id === selectedRoomId)?.name}
                              onDateSelect={(startDate, endDate) => {
                                debugLog('[BOOKING] Mobile visual calendar date selected:', { startDate, endDate });
                                form.setValue('check_in', startDate);
                                form.setValue('check_out', endDate);
                                setShowEnhancedDatePicker(false);
                                toast({
                                  title: "✅ Dates Selected",
                                  description: `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd')} selected successfully!`,
                                  variant: "default",
                                });
                              }}
                              onClose={() => setShowEnhancedDatePicker(false)}
                              initialStartDate={form.getValues('check_in')}
                              initialEndDate={form.getValues('check_out')}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* Standard Date Selection */
                      <motion.div 
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                      >
                        <FormField
                          control={form.control}
                          name="check_in"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-ocean-dark">Check-in Date</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="date" 
                                    {...field} 
                                      min={new Date().toISOString().split('T')[0]}
                                    className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm text-lg font-medium"
                                  />
                                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ocean" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="check_out"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-ocean-dark">Check-out Date</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="date" 
                                    {...field} 
                                      min={form.watch('check_in') || new Date().toISOString().split('T')[0]}
                                    className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm text-lg font-medium"
                                  />
                                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ocean" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      )}

                      {/* Button to show enhanced date picker for available rooms */}
                      {!showEnhancedDatePicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.6 }}
                          className="text-center"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEnhancedDatePicker(true)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            📅 Use Visual Calendar
                          </Button>
                        </motion.div>
                      )}

                      {/* Enhanced Guests Selection */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                      >
                        <FormField
                          control={form.control}
                          name="guests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-ocean-dark">Number of Guests</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max={homestay?.max_guests || 10} 
                                    {...field} 
                                    className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm text-lg font-medium"
                                  />
                                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ocean" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Enhanced Guest Information Section */}
                      <motion.div 
                        className="space-y-6 pt-8 border-t-2 border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-ocean to-tropical flex items-center justify-center">
                            <span className="text-white text-sm">👤</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-ocean-dark font-playfair">
                            {t('booknow.guest_information')}
                        </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-ocean-dark">{t('booking.full_name')}</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm text-lg"
                                  placeholder={t('placeholder.enter_name')}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold text-ocean-dark">{t('booking.email_address')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    {...field} 
                                    className="h-14 rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm text-lg"
                                    placeholder={t('placeholder.enter_email')}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold text-ocean-dark">{t('booking.phone_number')}</FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t('placeholder.enter_phone')}
                                    size="lg"
                                    disabled={submitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="special_requests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-ocean-dark">{t('booking.special_requests')}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={t('placeholder.special_requests')}
                                  className="resize-none rounded-xl border-2 border-gray-200 focus:border-ocean bg-white/90 backdrop-blur-sm min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Enhanced Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.2 }}
                        className="pt-8"
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-ocean via-tropical to-ocean-dark hover:from-ocean-dark hover:to-tropical text-white rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                              <span className="hidden sm:inline">Processing Your Island Booking...</span>
                              <span className="sm:hidden">Processing...</span>
                            </>
                          ) : (
                            <>
                              <span className="mr-2 sm:mr-3">🏝️</span>
                              <span className="hidden sm:inline">Complete Booking</span>
                              <span className="sm:hidden">Book</span>
                              <span className="ml-2 sm:ml-3">✨</span>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Booking Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: contentLoaded ? 1 : 0, x: contentLoaded ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden lg:sticky lg:top-8 relative">
                {/* Sophisticated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-tropical/10 via-transparent to-ocean/10 pointer-events-none" />
                
                <CardHeader className="relative z-10 pb-4 sm:pb-6 bg-gradient-to-r from-tropical/10 via-ocean/10 to-tropical/10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-tropical to-ocean bg-clip-text text-transparent mb-2 font-playfair">
                      {t('booknow.booking_summary')}
                    </CardTitle>
                    {homestay && (
                      <div className="text-sm text-muted-foreground">
                        <Link 
                          to={`/homestay/${homestay.id}`} 
                          className="text-ocean hover:text-tropical transition-colors inline-block text-base sm:text-lg font-medium hover:underline"
                        >
                          <span className="inline-flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                            {t('booknow.back_to_homestay')}
                          </span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </CardHeader>
                
                <CardContent className="relative z-10 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                  {homestay ? (
                    <>
                      {/* Enhanced Homestay Display */}
                      <motion.div 
                        className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                      >
                        <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl mx-auto sm:mx-0">
                          {homestay.homestayImages && homestay.homestayImages.length > 0 ? (
                            <img 
                              src={homestay.homestayImages.find(img => img.is_primary)?.img_url || homestay.homestayImages[0].img_url} 
                              alt={homestay.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-cyan-200 to-blue-300 flex items-center justify-center">
                              <Home className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg sm:text-2xl font-bold text-ocean-dark mb-2">{homestay.title}</h3>
                          <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                            <span className="w-2 h-2 bg-tropical rounded-full"></span>
                            {homestay.location}
                          </p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(5)}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">{t('badge.island_paradise')}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Enhanced Booking Details Grid */}
                      <motion.div 
                        className="grid grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                      >
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-2xl border border-cyan-100">
                          <p className="text-sm text-cyan-600 font-medium mb-1">{t('booknow.checkin')}</p>
                          <p className="text-lg font-bold text-ocean-dark">{form.watch('check_in')}</p>
                        </div>
                        <div className="bg-gradient-to-br from-tropical-light to-sand-light p-4 rounded-2xl border border-orange-100">
                          <p className="text-sm text-orange-600 font-medium mb-1">{t('booknow.checkout')}</p>
                          <p className="text-lg font-bold text-ocean-dark">{form.watch('check_out')}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                          <p className="text-sm text-green-600 font-medium mb-1">{t('booknow.guests')}</p>
                          <p className="text-lg font-bold text-ocean-dark">{form.watch('guests')}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                          <p className="text-sm text-purple-600 font-medium mb-1">{t('booknow.nights')}</p>
                          <p className="text-lg font-bold text-ocean-dark">{nights}</p>
                        </div>
                      </motion.div>

                      {/* Enhanced Pricing Breakdown */}
                      <motion.div 
                        className="border-t-2 border-gray-100 pt-6 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                      >
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <p className="text-gray-700 font-medium">{t('booknow.price_per_night')}</p>
                          <p className="text-xl font-bold text-ocean">{formatCurrency(homestay.base_price, 'IDR')}</p>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                          <p className="text-gray-700 font-medium">{nights} {nights > 1 ? t('booknow.nights').toLowerCase() : t('booknow.nights').toLowerCase().slice(0, -1)}</p>
                          <p className="text-xl font-bold text-ocean">{formatCurrency(homestay.base_price * nights, 'IDR')}</p>
                        </div>
                        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-ocean via-tropical to-ocean-dark rounded-2xl text-white shadow-xl">
                          <p className="text-xl font-bold">{t('booknow.total')}</p>
                          <p className="text-3xl font-bold">{formatCurrency(homestay.base_price * nights, 'IDR')}</p>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">{t('booknow.no_homestay_selected')}</h3>
                      <p className="text-gray-500 mb-6">{t('booknow.start_adventure')}</p>
                      <Link to="/homestays">
                        <Button type="button" className="bg-gradient-to-r from-ocean to-tropical hover:from-ocean-dark hover:to-tropical text-white rounded-xl">
                          {t('booknow.browse_homestays')} 🏝️
                        </Button>
                      </Link>
                    </motion.div>
                  )}

                  {/* Enhanced What's Included Section */}
                  <motion.div 
                    className="border-t-2 border-gray-100 pt-6 sm:pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-ocean-dark mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      {t('included.whats_included')}
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { icon: '🏠', text: t('included.accommodation') },
                        { icon: '🍳', text: t('included.breakfast') },
                        { icon: '📶', text: t('included.wifi') },
                        { icon: '🏖️', text: t('included.beach_access') },
                        { icon: '🛟', text: t('included.support') },
                        { icon: '🌺', text: t('included.greeting') }
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 2 + index * 0.1 }}
                          className="flex items-center gap-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl"
                        >
                          <span className="text-base sm:text-lg">{item.icon}</span>
                          <span className="text-gray-700 font-medium text-sm sm:text-base">{item.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                    
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
        <Footer />
      </motion.div>
    </>
  );
};

export default BookNow;