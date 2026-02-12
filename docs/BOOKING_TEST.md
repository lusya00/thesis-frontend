# Booking Service Test Guide

## Quick Test Steps

### 1. Open Browser Console
1. Navigate to your website in development mode
2. Open Developer Tools (F12)
3. Go to the Console tab

### 2. Test Environment Configuration
```javascript
// Check environment variables
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Development mode:', import.meta.env.DEV);

// Test booking service configuration
import { getApiConfig, checkApiEndpoints } from '@/lib/services/bookingService';
console.log('API Config:', getApiConfig());
checkApiEndpoints();
```

### 3. Test Guest Booking (Console Test)
```javascript
// Import the booking service
import { createGuestBooking } from '@/lib/services/bookingService';

// Test data
const testBookingData = {
  start_date: '2024-01-15',
  end_date: '2024-01-17',
  room_id: 1, // Use a valid room ID from your system
  number_of_guests: 2,
  guest_name: 'Test User',
  guest_email: 'test@example.com',
  guest_phone: '+1234567890',
  special_requests: 'Test booking from console',
  notes: 'This is a test booking',
  check_in_time: '14:00',
  check_out_time: '11:00',
  payment_method: 'cash'
};

// Create the booking
createGuestBooking(testBookingData)
  .then(result => {
    console.log('✅ Booking successful!', result);
  })
  .catch(error => {
    console.error('❌ Booking failed:', error.message);
  });
```

### 4. Test Via BookNow Page
1. Navigate to `/book-now?homestay=1` (replace 1 with a valid homestay ID)
2. Fill out the booking form with test data
3. Submit the form
4. Watch the console for detailed logs

### 5. Expected Console Output
```
[BOOKING] Using API Base URL: https://untung-jawa-backend.onrender.com/api
[BOOKING] Environment variables: { VITE_API_BASE_URL: "...", ... }
[BOOKING] createBooking called with data: { ... }
[BOOKING] Detected legacy data format, converting...
[BOOKING] Converted to guest booking format: { ... }
[BOOKING] Creating guest booking with data: { ... }
[API] Request to: https://untung-jawa-backend.onrender.com/api/bookings
[API] Method: POST
[API] Data: { room_id: 1, start_date: "2024-01-15", ... }
[API] Response from: /bookings { status: "success", data: { ... } }
[BOOKING] Guest booking created successfully: { ... }
```

## Troubleshooting

### Common Error Messages

#### 1. "Validation failed: ..."
- **Cause**: Invalid input data
- **Fix**: Check date formats (YYYY-MM-DD), ensure all required fields are provided

#### 2. "Failed to create booking: 404"
- **Cause**: Backend endpoint not found
- **Fix**: Verify API_BASE_URL is correct and backend is running

#### 3. "Failed to create booking: 400"
- **Cause**: Invalid data format sent to backend
- **Fix**: Check console logs for detailed error from backend

#### 4. "Cannot connect to booking service"
- **Cause**: Network/connectivity issue
- **Fix**: Check internet connection and backend availability

### Debug Commands

```javascript
// Check if API is reachable
fetch('https://untung-jawa-backend.onrender.com/api/homestays')
  .then(response => response.json())
  .then(data => console.log('API is working:', data))
  .catch(error => console.error('API not reachable:', error));

// Test room availability
import { checkRoomAvailability } from '@/lib/services/bookingService';
checkRoomAvailability(1, '2024-01-15', '2024-01-17')
  .then(result => console.log('Room availability:', result))
  .catch(error => console.error('Availability check failed:', error));
```

## Backend Requirements

The updated booking service expects the backend to accept bookings at:
- **Endpoint**: `POST /bookings`
- **Format**: BookingCreateInput interface
- **Fields**:
  - `room_id`: number
  - `start_date`: string (YYYY-MM-DD)
  - `end_date`: string (YYYY-MM-DD)  
  - `number_of_guests`: number
  - `special_requests`: string (optional)
  - `notes`: string (optional, contains guest info for guest bookings)

## Success Indicators

✅ Environment variables loaded correctly  
✅ API Base URL points to correct backend  
✅ No console errors during booking process  
✅ Backend responds with success status  
✅ Booking data contains valid booking_number  
✅ User sees success message on UI  

## Next Steps After Successful Test

1. Test with real homestay/room data
2. Verify booking appears in admin dashboard
3. Test email confirmations (if implemented)
4. Test with different payment methods
5. Test booking cancellation functionality 