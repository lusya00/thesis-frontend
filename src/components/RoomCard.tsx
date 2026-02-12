import { Room, RoomStatus, FeatureCategory } from '@/types/room';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { formatCurrency } from '@/utils/format';
import RoomFeatures from './RoomFeatures';
import RoomDetails from './RoomDetails';
import { useTranslation } from '@/hooks/useTranslation';

interface ExtendedRoom extends Room {
  image_url?: string;
}

interface RoomCardProps {
  room: ExtendedRoom;
  onBook: (roomId: number) => void;
  showAvailability?: boolean;
}

const findKeyFeature = (features: any[], category: FeatureCategory, limit: number = 1) => {
  if (!features) return [];
  
  return features
    .filter(feature => feature.category === category)
    .slice(0, limit);
};

export default function RoomCard({ room, onBook, showAvailability = false }: RoomCardProps) {
  const { t, language } = useTranslation();
  const hasAvailability = showAvailability && room.availability && room.availability.length > 0;
  
  // Get key features for quick display
  const bedFeatures = room.features ? findKeyFeature(room.features, FeatureCategory.Bedroom) : [];
  const bathFeatures = room.features ? findKeyFeature(room.features, FeatureCategory.Bathroom) : [];
  const comfortFeatures = room.features ? findKeyFeature(room.features, FeatureCategory.Comfort, 2) : [];

  return (
    <Card elevation={2} sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      }
    }}>
      <CardMedia
        component="img"
        sx={{ 
          width: { xs: '100%', md: 250 },
          height: { xs: 200, md: 'auto' },
          objectFit: 'cover'
        }}
        image={room.image_url || 'https://source.unsplash.com/random/?hotel,room'}
        alt={room.title}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        flexGrow: 1,
        position: 'relative'
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Use the RoomDetails component for consistent display */}
          <RoomDetails 
            room={room} 
            variant="compact" 
            showPrice={true} 
            showStatus={false} 
          />

          {room.features && room.features.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('room.highlights')}
              </Typography>
              <RoomFeatures features={room.features} compact={true} maxItems={8} />
            </Box>
          )}

          {hasAvailability && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('room.availability')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {room.availability!.map((day) => (
                  <Chip
                    key={day.date}
                    label={new Date(day.date).toLocaleDateString()}
                    color={day.is_available ? 'success' : 'error'}
                    size="small"
                    variant={day.is_available ? 'outlined' : 'filled'}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* ✅ SIMPLIFIED BOOKING BUTTONS */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {room.status === RoomStatus.Available ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onBook(room.id)}
                  size="large"
                  sx={{ 
                    borderRadius: 28,
                    px: 3,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    }
                  }}
                >
                  ✅ {t('room.book_now')}
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => onBook(room.id)}
                  size="medium"
                  sx={{ 
                    borderRadius: 28,
                    px: 3,
                  }}
                >
                  📅 {t('room.check_other_dates')}
                </Button>
              </>
            ) : room.status === RoomStatus.Occupied ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => onBook(room.id)}
                size="large"
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                }}
              >
                📅 {t('room.book_other_dates')}
              </Button>
            ) : room.status === RoomStatus.Maintenance ? (
              <Button
                variant="outlined"
                disabled
                size="large"
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                }}
              >
                🔧 {t('room.under_maintenance')}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => onBook(room.id)}
                size="large"
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                }}
              >
                📅 {t('room.check_availability')}
              </Button>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
} 