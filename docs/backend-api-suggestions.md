# Backend API Improvements for Room Booking System

## Current Limitation
The frontend cannot get accurate booking dates because the `/bookings/room/{roomId}` endpoint doesn't exist.

## Recommended Backend Enhancements

### 1. Enhanced Room Availability Endpoint

**Endpoint**: `GET /api/bookings/room/{roomId}/availability`

**Current Response**:
```json
{
  "data": {
    "is_available": boolean,
    "room_status": string,
    "has_bookings": boolean
  }
}
```

**Suggested Enhanced Response**:
```json
{
  "data": {
    "is_available": boolean,
    "room_status": string,
    "has_bookings": boolean,
    "current_booking": {
      "id": number,
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "booking_number": string
    } | null,
    "next_available_date": "YYYY-MM-DD" | null,
    "upcoming_bookings": [
      {
        "id": number,
        "start_date": "YYYY-MM-DD", 
        "end_date": "YYYY-MM-DD",
        "booking_number": string
      }
    ]
  }
}
```

### 2. Room Bookings Endpoint

**Endpoint**: `GET /api/bookings/room/{roomId}`

**Parameters**:
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD
- `include_cancelled` (optional): boolean, default false

**Response**:
```json
{
  "data": [
    {
      "id": number,
      "booking_number": string,
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "status": "confirmed|pending|cancelled|completed",
      "number_of_guests": number,
      "guest_name": string | null,
      "user_id": number | null
    }
  ]
}
```

### 3. Dynamic Room Status Endpoint

**Endpoint**: `GET /api/rooms/{roomId}/status`

**Response**:
```json
{
  "data": {
    "room_id": number,
    "static_status": "available|occupied|maintenance",
    "dynamic_status": "available|occupied|maintenance",
    "is_bookable": boolean,
    "reason": string,
    "next_available_date": "YYYY-MM-DD" | null,
    "maintenance_end_date": "YYYY-MM-DD" | null
  }
}
```

### 4. Bulk Room Status Endpoint

**Endpoint**: `GET /api/homestays/{homestayId}/rooms/status`

**Response**:
```json
{
  "data": [
    {
      "room_id": number,
      "room_number": string,
      "static_status": "available|occupied|maintenance", 
      "dynamic_status": "available|occupied|maintenance",
      "is_bookable": boolean,
      "next_available_date": "YYYY-MM-DD" | null,
      "current_booking_end": "YYYY-MM-DD" | null
    }
  ]
}
```

## Database Query Examples

### For Enhanced Availability:
```sql
-- Get current booking for room
SELECT id, start_date, end_date, booking_number, status
FROM bookings 
WHERE room_id = ? 
  AND start_date <= CURDATE() 
  AND end_date >= CURDATE()
  AND status IN ('confirmed', 'pending')
ORDER BY start_date ASC 
LIMIT 1;

-- Get next available date
SELECT MIN(end_date + INTERVAL 1 DAY) as next_available
FROM bookings
WHERE room_id = ?
  AND end_date >= CURDATE()
  AND status IN ('confirmed', 'pending');
```

### For Dynamic Room Status:
```sql
-- Check if room is currently occupied
SELECT 
  r.id,
  r.status as static_status,
  CASE 
    WHEN r.status = 'maintenance' THEN 'maintenance'
    WHEN EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.room_id = r.id 
        AND b.start_date <= CURDATE() 
        AND b.end_date >= CURDATE()
        AND b.status IN ('confirmed', 'pending')
    ) THEN 'occupied'
    ELSE 'available'
  END as dynamic_status
FROM rooms r 
WHERE r.id = ?;
```

## Implementation Priority

1. **High Priority**: Enhanced availability endpoint (#1)
2. **Medium Priority**: Room bookings endpoint (#2) 
3. **Low Priority**: Dedicated status endpoints (#3, #4)

These improvements would give the frontend:
- ✅ Real booking dates instead of guesswork
- ✅ Dynamic room status from database
- ✅ Accurate next available dates
- ✅ Better user experience with real data
- ✅ Reduced API calls (no more day-by-day checking) 