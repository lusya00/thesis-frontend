import { useState, useEffect } from 'react';
import { Room, RoomStatus } from '@/types/room';
import { 
  Grid, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  Chip,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from '@mui/material';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: Room[];
  onBookRoom: (roomId: number) => void;
  showFilters?: boolean;
}

export default function RoomList({ rooms, onBookRoom, showFilters = false }: RoomListProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [occupancy, setOccupancy] = useState<number | ''>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Extract all available features from rooms
  const allFeatures = Array.from(
    new Set(
      rooms
        .flatMap(room => room.features || [])
        .map(feature => feature.category as string)
    )
  );

  // Handle filter changes
  const handleFilterChange = () => {
    let result = [...rooms];
    
    // Filter by availability
    if (showAvailableOnly) {
      result = result.filter(room => room.status === RoomStatus.Available);
    }

    // Filter by price range
    if (minPrice !== '') {
      result = result.filter(room => room.price >= minPrice);
    }
    if (maxPrice !== '') {
      result = result.filter(room => room.price <= maxPrice);
    }

    // Filter by occupancy
    if (occupancy !== '') {
      result = result.filter(room => room.number_people >= occupancy);
    }

    // Filter by selected features
    if (selectedFeatures.length > 0) {
      result = result.filter(room => 
        room.features?.some(feature => 
          selectedFeatures.includes(feature.category as string)
        )
      );
    }

    setFilteredRooms(result);
  };

  // Reset filters
  const resetFilters = () => {
    setShowAvailableOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setOccupancy('');
    setSelectedFeatures([]);
    setFilteredRooms(rooms);
  };

  // Handle feature selection
  const handleFeaturesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedFeatures(typeof value === 'string' ? value.split(',') : value);
  };

  // Effect to update filtered rooms when filters change or rooms prop changes
  useEffect(() => {
    handleFilterChange();
  }, [showAvailableOnly, minPrice, maxPrice, occupancy, selectedFeatures, rooms]);

  if (rooms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No rooms available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Available Rooms
      </Typography>

      {showFilters && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Filter Rooms
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  />
                }
                label="Show available only"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%', md: '16.666%' } }}>
              <TextField
                label="Min Price"
                type="number"
                fullWidth
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%', md: '16.666%' } }}>
              <TextField
                label="Max Price"
                type="number"
                fullWidth
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%', md: '16.666%' } }}>
              <TextField
                label="Min Occupancy"
                type="number"
                fullWidth
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value === '' ? '' : Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', md: '25%' } }}>
              <FormControl fullWidth>
                <InputLabel id="features-label">Features</InputLabel>
                <Select<string[]>
                  labelId="features-label"
                  multiple
                  value={selectedFeatures}
                  onChange={handleFeaturesChange}
                  input={<OutlinedInput label="Features" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value: string) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allFeatures.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      {feature}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetFilters}
                sx={{ mr: 1 }}
              >
                Reset
              </Button>
              <Button variant="contained" onClick={handleFilterChange}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Grid sx={{ width: '100%' }} key={room.id}>
              <RoomCard room={room} onBook={onBookRoom} showAvailability />
            </Grid>
          ))
        ) : (
          <Grid sx={{ width: '100%' }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No rooms match your filters
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
