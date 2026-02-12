
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '@/types/room';
import { getUserBookings } from '@/services/userApi';
import { formatCurrency } from '@/utils/format';
import { getRoomDetails } from '@/services/roomApi';
import { bookingService } from '@/lib/services/bookingService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CalendarDays, 
  Users, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Loader2, 
  MapPin,
  ArrowRight,
  Home,
  Bed
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';

export default function UserBookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<(Booking & { room_title?: string; homestay_title?: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationDialogId, setCancellationDialogId] = useState<number | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookingsData = await getUserBookings();
        
        // Fetch additional details for each booking
        const bookingsWithDetails = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const roomDetails = await getRoomDetails(booking.room_id);
              return {
                ...booking,
                room_title: roomDetails.title,
                homestay_title: roomDetails.homestay?.title || 'Unknown Homestay'
              };
            } catch (err) {
              return {
                ...booking,
                room_title: 'Room information unavailable',
                homestay_title: 'Unknown Homestay'
              };
            }
          })
        );
        
        setBookings(bookingsWithDetails);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to get booking status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const handleCancelBooking = async (bookingId: number) => {
    setCancelling(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await axios.put(
        `/api/bookings/${bookingId}/status`,
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
        setBookings(bookings => bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        setCancellationDialogId(null);
        setCancellationReason('');
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

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 lg:py-24">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-ocean" />
          <h3 className="mt-4 text-xl font-medium text-gray-700">Loading your bookings...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 lg:py-24">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="mr-4"
          >
            Retry
          </Button>
          <Button onClick={() => navigate('/user/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 md:px-6 lg:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Bookings</h1>
          <div className="flex items-center mt-2">
            <div className="h-1 w-20 bg-ocean rounded"></div>
            <p className="ml-4 text-gray-500">Your travel journey with Untung Jawa Escapes</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You don't have any bookings yet. Start exploring our beautiful homestays to book your perfect island getaway!
            </p>
            <Button 
              onClick={() => navigate('/homestays')}
              className="bg-ocean hover:bg-ocean-dark text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Browse Homestays
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="bg-ocean/5 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-md bg-ocean/10">
                      <CalendarDays className="h-6 w-6 text-ocean" />
                    </div>
                    <div>
                      <h2 className="font-medium text-lg text-gray-900">{booking.homestay_title}</h2>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>Untung Jawa Island</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-white rounded-full px-3 py-1 text-xs uppercase`}>
                    {booking.status}
                  </Badge>
                </div>
                
                <CardContent className="px-6 py-5">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center mb-3">
                        <Bed className="h-4 w-4 text-ocean mr-2" />
                        <span className="text-gray-800 font-medium">
                          {booking.room_title || 'Room'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Booking #{booking.booking_number}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="text-sm">
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-medium text-gray-800 flex items-center mt-1">
                          {formatDate(booking.start_date)}
                        </p>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-medium text-gray-800 flex items-center mt-1">
                          {formatDate(booking.end_date)}
                        </p>
                      </div>
                      
                      <div className="text-sm col-span-2 md:col-span-1">
                        <p className="text-gray-500">Guests</p>
                        <p className="font-medium text-gray-800 flex items-center mt-1">
                          <Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {booking.number_of_guests} {booking.number_of_guests > 1 ? 'persons' : 'person'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime() > 0 
                          ? Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)) 
                          : 1} nights
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm mr-2">Total:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(booking.total_price, 'IDR')}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      booking.status.toLowerCase() === 'confirmed' ? 'bg-green-500' :
                      booking.status.toLowerCase() === 'pending' ? 'bg-yellow-500' :
                      booking.status.toLowerCase() === 'cancelled' ? 'bg-red-500' :
                      'bg-blue-500'
                    } mr-2`}></div>
                    <span className="text-sm text-gray-600">
                      {booking.status === 'confirmed' ? 'Your booking is confirmed' :
                      booking.status === 'pending' ? 'Waiting for confirmation' :
                      booking.status === 'cancelled' ? 'This booking was cancelled' :
                      'Your stay is completed'}
                    </span>
                  </div>
                  <div className="flex">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/booking/${booking.id}`)}
                      className="group"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    
                    {(booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase() === 'confirmed') && (
                      <>
                        <Dialog open={cancellationDialogId === booking.id} onOpenChange={open => setCancellationDialogId(open ? booking.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="ml-2 text-red-600 border-red-200 hover:bg-red-50">
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Booking</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Label htmlFor="cancellation-reason">Reason (optional)</Label>
                              <Textarea
                                id="cancellation-reason"
                                value={cancellationReason}
                                onChange={e => setCancellationReason(e.target.value)}
                                placeholder="Let us know why you're cancelling..."
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setCancellationDialogId(null)} disabled={cancelling}>
                                Close
                              </Button>
                              <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)} disabled={cancelling}>
                                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {bookings.length > 0 && (
          <div className="mt-8 flex justify-end">
            <Button 
              variant="default" 
              onClick={() => navigate('/homestays')}
              className="bg-ocean hover:bg-ocean-dark"
            >
              Book Another Stay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
