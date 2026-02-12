import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider,
  Chip,
  ImageList,
  ImageListItem,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Homestay, Room } from '@/types/room';
import { getHomestay } from '@/services/roomApi';
import RoomList from '@/components/RoomList';
import BookingForm from '@/components/BookingForm';

export default function HomestayDetailPage() {
  const { id } = useParams();
  
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch homestay data
  useEffect(() => {
    if (!id) return;

    const fetchHomestay = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHomestay(Number(id));
        setHomestay(data);
      } catch (err: any) {
        console.error('Error fetching homestay:', err);
        setError(err.response?.data?.message || 'Failed to load homestay details');
      } finally {
        setLoading(false);
      }
    };

    fetchHomestay();
  }, [id]);

  // Handle booking room
  const handleBookRoom = (roomId: number) => {
    if (!homestay) return;
    const room = homestay.rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle successful booking
  const handleBookingSuccess = (bookingId: number) => {
    setSelectedRoom(null);
    setNotification(`Booking successful! Your booking ID is: ${bookingId}`);
  };

  // Handle booking cancellation
  const handleCancelBooking = () => {
    setSelectedRoom(null);
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading homestay details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!homestay) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Homestay not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {selectedRoom ? (
        <BookingForm 
          room={selectedRoom} 
          onSuccess={handleBookingSuccess} 
          onCancel={handleCancelBooking} 
        />
      ) : (
        <>
          <Paper sx={{ mb: 4, p: 3, position: 'relative' }}>
            {homestay.status !== 'active' && (
              <Chip 
                label={homestay.status.toUpperCase()} 
                color="warning" 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16 
                }} 
              />
            )}

            <Typography variant="h4" component="h1" gutterBottom>
              {homestay.title}
            </Typography>

            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Location: ${homestay.location}`} variant="outlined" />
              <Chip label={`Max Guests: ${homestay.max_guests}`} variant="outlined" />
              <Chip label={`Owner: ${homestay.owner_name}`} variant="outlined" />
            </Box>

            {homestay.images && homestay.images.length > 0 && (
              <Box sx={{ mb: 3, mt: 2 }}>
                <ImageList
                  sx={{ maxHeight: 400, overflowY: 'auto' }}
                  cols={homestay.images.length === 1 ? 1 : 3}
                  gap={8}
                >
                  {homestay.images.sort((a, b) => (a.is_primary ? -1 : 1)).map((image) => (
                    <ImageListItem key={image.id}>
                      <img
                        src={image.img_url}
                        alt={homestay.title}
                        loading="lazy"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            <Typography variant="body1" paragraph>
              {homestay.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div>
                <Typography variant="subtitle1">Address:</Typography>
                <Typography variant="body2">{homestay.address}</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">Contact:</Typography>
                <Typography variant="body2">{homestay.contact_number}</Typography>
              </div>
            </div>
          </Paper>

          <Box sx={{ mb: 4 }}>
            <RoomList 
              rooms={homestay.rooms} 
              onBookRoom={handleBookRoom} 
              showFilters={homestay.rooms.length > 3}
            />
          </Box>
        </>
      )}

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification}
        action={
          <Button color="secondary" size="small" onClick={handleCloseNotification}>
            CLOSE
          </Button>
        }
      />
    </Container>
  );
} 