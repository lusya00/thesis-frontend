import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import { Room } from '@/types/room';

// Icons for different room types
import KingBedIcon from '@mui/icons-material/KingBed';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HotelIcon from '@mui/icons-material/Hotel';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WeekendIcon from '@mui/icons-material/Weekend';
import StarIcon from '@mui/icons-material/Star';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

interface RoomTypeBadgeProps {
  room: Room;
  showLabel?: boolean;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

/**
 * Determine the room type based on room properties and characteristics
 */
const getRoomTypeInfo = (room: Room) => {
  const title = room.title.toLowerCase();
  const maxPeople = room.max_occupancy;
  
  if (title.includes('suite') || title.includes('premium')) {
    return {
      type: 'suite',
      label: 'Suite',
      color: 'secondary',
      icon: <StarIcon />,
      description: 'Luxury suite with premium amenities'
    };
  } else if (title.includes('deluxe')) {
    return {
      type: 'deluxe',
      label: 'Deluxe',
      color: 'primary',
      icon: <KingBedIcon />,
      description: 'Enhanced comfort with extra amenities'
    };
  } else if (title.includes('family') || maxPeople >= 5) {
    return {
      type: 'family',
      label: 'Family',
      color: 'success',
      icon: <FamilyRestroomIcon />,
      description: 'Spacious room for families'
    };
  } else if (title.includes('apartment') || title.includes('villa')) {
    return {
      type: 'apartment',
      label: 'Apartment',
      color: 'info',
      icon: <ApartmentIcon />,
      description: 'Self-contained accommodation with kitchen facilities'
    };
  } else if (title.includes('studio')) {
    return {
      type: 'studio',
      label: 'Studio',
      color: 'info',
      icon: <WeekendIcon />,
      description: 'Compact room with living and sleeping areas combined'
    };
  } else if (maxPeople >= 3) {
    return {
      type: 'group',
      label: 'Group',
      color: 'warning',
      icon: <HotelIcon />,
      description: 'Room suitable for small groups'
    };
  } else if (maxPeople === 1) {
    return {
      type: 'single',
      label: 'Single',
      color: 'default',
      icon: <VpnKeyIcon />,
      description: 'Comfortable room for one person'
    };
  } else {
    return {
      type: 'standard',
      label: 'Standard',
      color: 'default',
      icon: <MeetingRoomIcon />,
      description: 'Classic room with essential amenities'
    };
  }
};

/**
 * Component for displaying room type as a stylized badge/chip
 */
export default function RoomTypeBadge({ room, showLabel = true, size = 'small', variant = 'filled' }: RoomTypeBadgeProps) {
  const typeInfo = getRoomTypeInfo(room);
  
  if (!showLabel) {
    return (
      <Tooltip title={`${typeInfo.label}: ${typeInfo.description}`} arrow>
        <Box 
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: size === 'small' ? 24 : 32,
            height: size === 'small' ? 24 : 32,
            bgcolor: variant === 'filled' ? `${typeInfo.color}.main` : 'transparent',
            border: variant === 'outlined' ? `1px solid ${typeInfo.color}.main` : 'none',
            color: variant === 'filled' ? 'white' : `${typeInfo.color}.main`,
            '& svg': {
              fontSize: size === 'small' ? 16 : 20,
            }
          }}
        >
          {React.cloneElement(typeInfo.icon, {
            fontSize: size === 'small' ? 'small' : 'medium'
          })}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={typeInfo.description} arrow>
      <Chip
        icon={typeInfo.icon}
        label={typeInfo.label}
        color={typeInfo.color as any}
        size={size}
        variant={variant}
      />
    </Tooltip>
  );
} 