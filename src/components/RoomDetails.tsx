import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Paper,
  Stack,
  Avatar,
  Tooltip
} from '@mui/material';
import { Room, RoomStatus } from '@/types/room';
import { formatCurrency } from '@/utils/format';
import RoomTypeBadge from './RoomTypeBadge';
import { useTranslation } from '@/hooks/useTranslation';

// Icons
import BedIcon from '@mui/icons-material/Bed';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';

interface RoomDetailsProps {
  room: Room;
  variant?: 'compact' | 'full';
  showPrice?: boolean;
  showStatus?: boolean;
}

/**
 * A comprehensive component for displaying room details from the database
 * This component ensures all key room properties are properly displayed
 */
export default function RoomDetails({ 
  room, 
  variant = 'full', 
  showPrice = true,
  showStatus = true
}: RoomDetailsProps) {
  const { t } = useTranslation();
  // Status display colors mapping
  const statusColors = {
    [RoomStatus.Available]: { color: 'success', label: 'Available' },
    [RoomStatus.Occupied]: { color: 'error', label: 'Occupied' },
    [RoomStatus.Maintenance]: { color: 'warning', label: 'Under Maintenance' },
  };

  const statusConfig = statusColors[room.status] || { color: 'default', label: room.status };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: variant === 'compact' ? 1.5 : 2.5, 
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant={variant === 'compact' ? 'h6' : 'h5'} component="h3" fontWeight="bold">
            {room.title}
          </Typography>
          {room.room_number && (
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Room #{room.room_number}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <RoomTypeBadge room={room} size={variant === 'compact' ? 'small' : 'medium'} />
          {showStatus && (
            <Chip 
              label={statusConfig.label} 
              color={statusConfig.color as any} 
              size={variant === 'compact' ? 'small' : 'medium'} 
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      {room.description && variant === 'full' && (
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            {room.description}
          </Typography>
        </Box>
      )}

      <Grid container spacing={variant === 'compact' ? 1.5 : 3} sx={{ my: 1 }}>
        {/* Standard Occupancy */}
        <Grid sx={{ width: { xs: '50%', sm: '25%' } }}>
          <RoomPropertyItem
            icon={<BedIcon />}
            label="Standard Occupancy"
            value={`${room.number_people} ${room.number_people > 1 ? 'guests' : 'guest'}`}
            color="primary.light"
            compact={variant === 'compact'}
          />
        </Grid>

        {/* Maximum Occupancy */}
        <Grid sx={{ width: { xs: '50%', sm: '25%' } }}>
          <RoomPropertyItem
            icon={<PeopleOutlineIcon />}
            label="Maximum Occupancy"
            value={`${room.max_occupancy} ${room.max_occupancy > 1 ? 'guests' : 'guest'}`}
            color="secondary.light"
            compact={variant === 'compact'}
          />
        </Grid>

        {/* Room Size */}
        <Grid sx={{ width: { xs: '50%', sm: '25%' } }}>
          <RoomPropertyItem
            icon={<SquareFootIcon />}
            label="Room Size"
            value={room.size || 'Not specified'}
            color="info.light"
            compact={variant === 'compact'}
          />
        </Grid>

        {/* Room Number */}
        <Grid sx={{ width: { xs: '50%', sm: '25%' } }}>
          <RoomPropertyItem
            icon={<DoorFrontIcon />}
            label="Room Number"
            value={room.room_number || 'Not assigned'}
            color="warning.light"
            compact={variant === 'compact'}
          />
        </Grid>
      </Grid>

      {showPrice && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <RoomPropertyItem
              icon={<AttachMoneyIcon />}
              label="Price per Night"
              value=""
              color="success.light"
              compact={variant === 'compact'}
            />
            <Typography variant={variant === 'compact' ? 'h6' : 'h5'} color="primary" fontWeight="bold">
              {formatCurrency(room.price, 'IDR')}
            </Typography>
          </Box>
        </>
      )}

      {/* Room specifications */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {room.max_occupancy || room.number_people} guests
          </Typography>
        </Box>
        
        {room.size && (
          <>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="text.secondary">
              {room.size}
            </Typography>
          </>
        )}
        
        {showPrice && room.price && (
          <>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachMoneyIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight="medium" color="primary.main">
                {formatCurrency(room.price, room.currency || 'IDR')}
              </Typography>
            </Box>
          </>
        )}
      </Stack>

      {/* Additional room information for full variant */}
      {variant === 'full' && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Room ID: {room.id} | Status: {room.status}
            {room.room_number && ` | Room Number: ${room.room_number}`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// Helper component for room properties
interface RoomPropertyItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  compact?: boolean;
}

function RoomPropertyItem({ icon, label, value, color, compact = false }: RoomPropertyItemProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar sx={{ bgcolor: color, width: compact ? 32 : 40, height: compact ? 32 : 40 }}>
        {React.cloneElement(icon as React.ReactElement, {
          fontSize: compact ? 'small' : 'medium'
        })}
      </Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant={compact ? 'body2' : 'body1'} fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Box>
  );
} 
