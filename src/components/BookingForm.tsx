import { useState } from 'react';
import { Room, BookingCreateInput, RoomFeature, FeatureCategory } from '@/types/room';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  FormHelperText,
  CircularProgress,
  Divider,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/format';
import { createBooking } from '@/services/roomApi';
import { sendBookingConfirmation } from '@/services/notificationService';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BedIcon from '@mui/icons-material/Bed';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RoomFeatures from './RoomFeatures';
import RoomTypeBadge from './RoomTypeBadge';
import RoomDetails from './RoomDetails';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// For debugging purposes
const DEBUG_BOOKING = false;

// Extend Room type to include image_url
interface ExtendedRoom extends Room {
  image_url?: string;
}

interface BookingFormProps {
  room: ExtendedRoom;
  onSuccess: (bookingId: number) => void;
  onCancel: () => void;
}

// Helper to group features by category
const groupFeaturesByCategory = (features: RoomFeature[] | undefined) => {
  if (!features || features.length === 0) return {};
  
  return features.reduce((acc, feature) => {
    const category = feature.category as string;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, RoomFeature[]>);
};

export default function BookingForm({ room, onSuccess, onCancel }: BookingFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Use the minimum capacity for single occupancy rooms, otherwise use number_people
  const [guests, setGuests] = useState<number>(
    room.max_occupancy === 1 ? 1 : Math.min(room.number_people, room.max_occupancy)
  );
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<'pending' | 'sent' | 'failed'>('pending');

  // Calculate nights and total price
  const nights = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalPrice = nights * room.price;

  // Check if form is valid
  const isFormValid = Boolean(
    startDate &&
    endDate &&
    startDate < endDate &&
    guests > 0 &&
    guests <= room.max_occupancy
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !startDate || !endDate) {
      setError('Please correct the form errors before submitting.');
      return;
    }

    if (DEBUG_BOOKING) console.log('🔍 Starting booking process for room:', room);
    
    setLoading(true);
    setError(null);
    setNotificationStatus('pending');

    const bookingData: BookingCreateInput = {
      room_id: room.id,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      number_of_guests: guests,
      special_requests: specialRequests || undefined,
      notes: notes || undefined,
    };

    if (DEBUG_BOOKING) console.log('📤 Sending booking data:', bookingData);

    try {
      const bookingResult = await createBooking(bookingData);
      
      if (DEBUG_BOOKING) console.log('📥 Booking result:', bookingResult);
      
      if (bookingResult && bookingResult.id) {
        // Try to send confirmation email
        try {
          await sendBookingConfirmation(bookingResult.id);
          setNotificationStatus('sent');
        } catch (notifError) {
          console.error('Failed to send confirmation notification:', notifError);
          setNotificationStatus('failed');
        }
        
        onSuccess(bookingResult.id);
      } else {
        throw new Error('Booking failed: No booking ID returned');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get grouped features for display  
  const groupedFeatures = groupFeaturesByCategory(room.features);  
  const primaryFeatures = Object.entries(groupedFeatures)    
    .flatMap(([_category, features]) => features)    
    .slice(0, 4);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '41.66%' } }}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="200"
              image={room.image_url || "https://source.unsplash.com/random/?hotel,room"}
              alt={room.title}
            />
            <CardContent>
              {/* Use our new RoomDetails component for comprehensive room information */}
              <RoomDetails room={room} variant="full" showPrice={true} showStatus={true} />
              
              {primaryFeatures.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Key Features</Typography>
                  <RoomFeatures features={primaryFeatures} compact maxItems={4} />
                  
                  {room.features && room.features.length > 4 && (
                    <Button 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 1 }}
                      onClick={() => {
                        // This could open a dialog with all features
                        console.log("Show all features");
                      }}
                    >
                      View all {room.features.length} features
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '58.33%' } }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Book Your Stay
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {notificationStatus === 'sent' && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Booking confirmed! A confirmation email has been sent to your registered email address.
              </Alert>
            )}

            {notificationStatus === 'failed' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your booking was successful, but we couldn't send a confirmation email. You can view your booking details in "My Bookings".
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Typography variant="subtitle2" gutterBottom>Check-in Date</Typography>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        className="justify-start text-left"
                        sx={{ height: '56px' }}
                      >
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        {startDate ? format(startDate, 'PPP') : 'Select check-in date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {endDate && startDate && startDate >= endDate && (
                    <FormHelperText error>Check-in must be before check-out</FormHelperText>
                  )}
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Typography variant="subtitle2" gutterBottom>Check-out Date</Typography>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        className="justify-start text-left"
                        sx={{ height: '56px' }}
                      >
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        {endDate ? format(endDate, 'PPP') : 'Select check-out date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date < (startDate || new Date())}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {endDate && startDate && startDate >= endDate && (
                    <FormHelperText error>Check-out must be after check-in</FormHelperText>
                  )}
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <TextField
                    type="number"
                    label="Number of Guests"
                    fullWidth
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
                    InputProps={{ inputProps: { min: 1, max: room.max_occupancy } }}
                    required
                    error={guests < 1 || guests > room.max_occupancy}
                    helperText={guests > room.max_occupancy 
                      ? `Maximum allowed guests is ${room.max_occupancy}`
                      : `This room accommodates up to ${room.max_occupancy} guests`
                    }
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Special Requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Early check-in, late check-out, etc."
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Booking Summary</Typography>
                
                <Grid container spacing={2}>
                  <Grid sx={{ width: '50%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BedIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Room Type:</Typography>
                    </Box>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="body2" fontWeight="medium">{room.title}</Typography>
                  </Grid>
                  
                  {startDate && endDate && (
                    <>
                      <Grid sx={{ width: '50%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">Duration:</Typography>
                        </Box>
                      </Grid>
                      <Grid sx={{ width: '50%' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {nights} {nights === 1 ? 'night' : 'nights'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid sx={{ width: '50%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Guests:</Typography>
                    </Box>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="body2" fontWeight="medium">{guests}</Typography>
                  </Grid>
                  
                  <Grid sx={{ width: '50%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Room Rate:</Typography>
                    </Box>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(room.price, 'IDR')} per night
                    </Typography>
                  </Grid>
                  
                  <Grid sx={{ width: '100%' }}><Divider sx={{ my: 1 }} /></Grid>
                  
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="subtitle1">Total Price:</Typography>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {formatCurrency(totalPrice, 'IDR')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={onCancel} 
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!isFormValid || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Processing...' : 'Complete Booking'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
