import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Room } from '@/types/room';
import { getAvailableRooms } from '@/services/roomApi';
import RoomList from '@/components/RoomList';

export default function AvailableRoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for query params on load
  useEffect(() => {
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const guestsParam = searchParams.get('guests');
    
    if (start_date) {
      setStartDate(new Date(start_date));
    }
    
    if (end_date) {
      setEndDate(new Date(end_date));
    }
    
    if (guestsParam) {
      setGuests(parseInt(guestsParam, 10));
    }
    
    // If we have all the required params, perform search automatically
    if (start_date && end_date) {
      handleSearch();
    }
  }, []);

  // Form validation
  const isStartDateValid = startDate ? startDate >= new Date() : false;
  const isEndDateValid = endDate && startDate ? endDate > startDate : false;
  const isGuestsValid = guests >= 1;
  const isFormValid = isStartDateValid && isEndDateValid && isGuestsValid;

  // Handle search
  const handleSearch = async () => {
    if (!isFormValid || !startDate || !endDate) {
      setError('Please fill in all fields correctly');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const availableRooms = await getAvailableRooms(startDateStr, endDateStr, guests);
      setRooms(availableRooms);
      setSearchPerformed(true);
      
      // Update URL with search params
      setSearchParams({
        start_date: startDateStr,
        end_date: endDateStr,
        guests: guests.toString()
      });
    } catch (err: any) {
      console.error('Error fetching available rooms:', err);
      setError(err.response?.data?.message || 'Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  // Handle room booking
  const handleBookRoom = (roomId: number) => {
    if (!startDate || !endDate) return;
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Navigate to room details with booking info
    window.location.href = `/rooms/${roomId}?start_date=${startDateStr}&end_date=${endDateStr}&guests=${guests}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find Available Rooms
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <DatePicker
              label="Check-in Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              disablePast
              sx={{ width: '100%' }}
            />
            <DatePicker
              label="Check-out Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              disablePast
              minDate={startDate || undefined}
              sx={{ width: '100%' }}
            />
            <TextField
              fullWidth
              type="number"
              label="Number of Guests"
              InputProps={{ inputProps: { min: 1 } }}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleSearch}
              disabled={loading || !isFormValid}
            >
              {loading ? <CircularProgress size={24} /> : 'Search Rooms'}
            </Button>
          </div>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </LocalizationProvider>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Searching for available rooms...</Typography>
        </Box>
      )}

      {!loading && searchPerformed && (
        <Box>
          {rooms.length > 0 ? (
            <RoomList rooms={rooms} onBookRoom={handleBookRoom} showFilters />
          ) : (
            <Alert severity="info">
              No rooms available for the selected dates and number of guests.
            </Alert>
          )}
        </Box>
      )}
    </Container>
  );
} 