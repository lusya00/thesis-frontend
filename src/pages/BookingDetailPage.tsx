import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Calendar, 
  Users, 
  Clock, 
  CreditCard, 
  MapPin, 
  ArrowLeft, 
  Home,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Bed
} from "lucide-react";
import { format, addDays, isSameDay, isWithinInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { bookingService, Booking } from "@/lib/services/bookingService";
import { authService } from "@/lib/services/authService";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";
import { homestayService } from "@/lib/services/homestayService";
import axios from 'axios';

const BookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [cancellationDialog, setCancellationDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchBookingDetails = async () => {
    try {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }

      setLoading(true);
      const bookingData = await bookingService.getBookingById(parseInt(bookingId));
      
      // Fetch room details if available
      if (bookingData.room_id) {
        try {
          const roomDetails = await homestayService.getRoomById(bookingData.room_id);
          bookingData.room = roomDetails;
        } catch (roomError) {
          console.error("Error fetching room details:", roomError);
        }
      }
      
      setBooking(bookingData);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details. Please try again.",
        variant: "destructive",
      });
      // Redirect to the dashboard if the booking couldn't be loaded
      navigate("/user/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, navigate, toast]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await axios.put(
        `/api/bookings/${booking.id}/status`,
        {
          status: 'cancelled',
          cancellation_reason: cancellationReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'success') {
        toast({
          title: 'Booking Cancelled',
          description: 'Your booking has been cancelled.',
          variant: 'default',
        });
        // Optionally update booking status in UI
        setBooking({ ...booking, booking_status: 'cancelled' });
        setCancellationDialog(false);
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Could not cancel your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };



  const calculateNights = (booking: any) => {
    try {
      const checkIn = new Date(booking.check_in || booking.start_date || new Date());
      const checkOut = new Date(booking.check_out || booking.end_date || new Date());
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch (error) {
      console.error("Error calculating nights:", error);
      return 1;
    }
  };

  const getStatusBadge = (status: string, type: 'booking' | 'payment') => {
    // Add default if status is undefined or empty
    if (!status) {
      status = type === 'booking' ? 'pending' : 'pending';
    }
    
    let color = "";
    
    if (type === 'booking') {
      switch (status) {
        case "confirmed":
          color = "bg-green-500";
          break;
        case "pending":
          color = "bg-yellow-500";
          break;
        case "cancelled":
          color = "bg-red-500";
          break;
        case "completed":
          color = "bg-blue-500";
          break;
        default:
          color = "bg-gray-500";
      }
    } else {
      switch (status) {
        case "paid":
          color = "bg-green-500";
          break;
        case "pending":
          color = "bg-yellow-500";
          break;
        case "cancelled":
          color = "bg-red-500";
          break;
        default:
          color = "bg-gray-500";
      }
    }
    
    return (
      <Badge className={`${color} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-ocean mx-auto" />
          <p className="ml-4 text-lg text-gray-600">Loading booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedNavbar />
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-2xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-8">
              The booking you are looking for does not exist or you don't have permission to view it.
            </p>
            <Link to="/user/dashboard">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedNavbar />
      
      <main className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex gap-4 mb-4">
              <Link to="/user/dashboard" className="text-ocean hover:text-ocean-dark inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <Link to="/user/bookings" className="text-ocean hover:text-ocean-dark inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                View All Bookings
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
            <p className="text-gray-500">Booking #{booking.booking_number || 'N/A'}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main booking details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.homestay?.title || "Homestay"}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {booking.homestay?.location || "Location unavailable"}
                      </CardDescription>
                      {booking.room && (
                        <div className="mt-2 flex items-center gap-1">
                          <Bed className="h-4 w-4 text-ocean" />
                          <span className="text-sm font-medium">
                            {booking.room.title || booking.room.room_number || `Room #${booking.room_id}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(booking.booking_status || booking.status || '', 'booking')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-in</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-ocean" />
                        {format(new Date(booking.check_in || booking.start_date || new Date()), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-out</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-ocean" />
                        {format(new Date(booking.check_out || booking.end_date || new Date()), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Guests</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-4 w-4 text-ocean" />
                        {booking.guests || booking.number_of_guests || 1} {(booking.guests || booking.number_of_guests || 1) > 1 ? 'people' : 'person'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4 text-ocean" />
                        {booking.nights || calculateNights(booking)} {(booking.nights || calculateNights(booking)) > 1 ? 'nights' : 'night'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="font-semibold mb-4">Special Requests</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {booking.special_requests || "No special requests provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Remove Payment Information section and any payment status logic */}
              {/* Only show booking details and cancel booking button for pending/confirmed bookings */}
              
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Price per night</p>
                      <p>{formatCurrency(booking.total_price / (booking.nights || calculateNights(booking)), 'IDR')}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">{booking.nights || calculateNights(booking)} nights</p>
                      <p>{formatCurrency(booking.total_price, 'IDR')}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>{formatCurrency(booking.total_price, 'IDR')}</p>
                    </div>
                  </div>
                  
                  {/* Visual booking calendar */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-ocean/5 to-blue-50 rounded-lg">
                    <h4 className="font-medium text-ocean-dark mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Your Stay Period
                    </h4>
                    <div className="space-y-2">
                      {/* Booking period visualization */}
                      <div className="grid grid-cols-7 gap-1 text-xs">
                        {(() => {
                          const checkInDate = new Date(booking.check_in || booking.start_date || new Date());
                          const checkOutDate = new Date(booking.check_out || booking.end_date || new Date());
                          const startOfWeek = new Date(checkInDate);
                          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                          
                          const days = [];
                          for (let i = 0; i < 14; i++) {
                            const currentDate = addDays(startOfWeek, i);
                            const isCheckIn = isSameDay(currentDate, checkInDate);
                            const isCheckOut = isSameDay(currentDate, checkOutDate);
                            const isStayPeriod = isWithinInterval(currentDate, { start: checkInDate, end: checkOutDate });
                            
                            days.push(
                              <div
                                key={i}
                                className={`aspect-square flex items-center justify-center rounded text-xs font-medium ${
                                  isCheckIn ? 'bg-green-500 text-white' :
                                  isCheckOut ? 'bg-red-500 text-white' :
                                  isStayPeriod ? 'bg-ocean text-white' :
                                  'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {currentDate.getDate()}
                              </div>
                            );
                          }
                          return days;
                        })()}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Check-in</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-ocean rounded"></div>
                            <span>Stay</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>Check-out</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  {(booking.booking_status === 'pending' || booking.booking_status === 'confirmed') && (
                    <Dialog open={cancellationDialog} onOpenChange={setCancellationDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Booking</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Cancellation policy: You may be subject to cancellation fees depending on how close to the check-in date you are cancelling.
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="font-medium">Booking #{booking.booking_number}</p>
                            <p className="text-sm text-gray-600">{booking.homestay?.title}</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(booking.check_in), "MMM dd")} - {format(new Date(booking.check_out), "MMM dd, yyyy")}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cancellation-reason">Reason (optional)</Label>
                            <Textarea 
                              id="cancellation-reason"
                              value={cancellationReason}
                              onChange={e => setCancellationReason(e.target.value)}
                              placeholder="Let us know why you're cancelling..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCancellationDialog(false)} disabled={cancelling}>
                            Close
                          </Button>
                          <Button variant="destructive" onClick={handleCancelBooking} disabled={cancelling}>
                            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {booking.booking_status === 'cancelled' && (
                    <div className="w-full p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                      <p className="text-red-600 flex justify-center items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        This booking has been cancelled
                      </p>
                    </div>
                  )}
                  
                  {booking.booking_status === 'completed' && (
                    <div className="w-full p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                      <p className="text-green-600 flex justify-center items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        This booking has been completed
                      </p>
                    </div>
                  )}
                  
                  {booking.homestay_id || booking.homestay?.id ? (
                    <Link to={`/homestay/${booking.homestay_id || booking.homestay?.id}`} className="w-full mt-4">
                      <Button variant="secondary" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        View Homestay
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" className="w-full mt-4" disabled>
                      <Home className="h-4 w-4 mr-2" />
                      Homestay Unavailable
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-ocean mt-0.5" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-gray-600">+62 838 1234 5678</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-ocean mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">support@untungjawa.com</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-ocean mt-0.5" />
                      <div>
                        <p className="font-medium">Documents</p>
                        <Button variant="link" className="p-0 h-auto text-ocean">
                          Download Booking Receipt
                        </Button>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingDetailPage; 