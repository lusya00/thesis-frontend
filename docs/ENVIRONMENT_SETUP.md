# Environment Setup for Untung Jawa Escapes

## Updated Booking Service

Your booking service has been successfully updated with the following improvements:

### ✅ What's Been Fixed

1. **URL Construction Issues** - Fixed API endpoint construction and removed hardcoded URLs
2. **Environment Variable Usage** - Properly uses `VITE_API_BASE_URL` from environment
3. **Better Error Handling** - Comprehensive error messages and status code handling
4. **Debugging Features** - Extensive logging for troubleshooting API issues
5. **Data Validation** - Input validation for guest bookings
6. **Backward Compatibility** - Existing components continue to work without changes

### 🔧 Key Features

- **Guest Bookings**: No authentication required
- **Authenticated Bookings**: For logged-in users
- **Room Availability Checking**: Real-time availability validation
- **Comprehensive Error Handling**: User-friendly error messages
- **Debug Logging**: Detailed console logs for development

## Environment Configuration

### Current Setup

Your project currently uses `env.txt` with these values:
```
VITE_API_BASE_URL=https://untung-jawa-backend.onrender.com/api
VITE_DEBUG_API=true
VITE_GEMINI_API_KEY=AIzaSyD_WrlaKqvECuuDKEWujDYVP4ag9Dl4kkI
NODE_ENV=development
```

### Recommended Setup

For better environment management, create these files:

#### 1. `.env` (Main environment file)
```env
# API Configuration
VITE_API_BASE_URL=https://untung-jawa-backend.onrender.com/api

# Debug mode for API calls
VITE_DEBUG_API=true

# Gemini API Key for Chatbot
VITE_GEMINI_API_KEY=AIzaSyD_WrlaKqvECuuDKEWujDYVP4ag9Dl4kkI

# Environment
NODE_ENV=development
```

#### 2. `.env.development` (Development environment)
```env
# Development API URL (for local development)
VITE_API_BASE_URL=http://localhost:5000/api

# Debug mode for API calls
VITE_DEBUG_API=true

# Environment
NODE_ENV=development
```

#### 3. `.env.production` (Production environment)
```env
# Production API URL
VITE_API_BASE_URL=https://untung-jawa-backend.onrender.com/api

# Disable debug in production
VITE_DEBUG_API=false

# Environment
NODE_ENV=production
```

### How to Set Up

1. **Copy your current `env.txt` values** to a new `.env` file
2. **Add `.env*` to your `.gitignore`** (if not already there)
3. **Restart your development server** after creating .env files

## API Endpoints

The updated service uses these endpoints:

- **Guest Booking**: `POST /bookings/guest`
- **Authenticated Booking**: `POST /bookings`
- **Get User Bookings**: `GET /bookings/my`
- **Get All Bookings** (Admin): `GET /bookings`
- **Room Availability**: `GET /bookings/room/{id}/availability`
- **Booking Details**: `GET /bookings/{id}`
- **Update Status**: `PUT /bookings/{id}/status`

## Usage Examples

### Guest Booking
```javascript
import { createGuestBooking } from '@/lib/services/bookingService';

const guestBookingData = {
  start_date: '2024-01-15',
  end_date: '2024-01-20',
  room_id: 5,
  number_of_guests: 2,
  guest_name: 'John Doe',
  guest_email: 'john.doe@example.com',
  guest_phone: '+1234567890',
  special_requests: 'Need extra pillows',
  payment_method: 'credit_card'
};

try {
  const result = await createGuestBooking(guestBookingData);
  console.log('Booking created:', result);
} catch (error) {
  console.error('Booking failed:', error.message);
}
```

### Legacy Usage (Still Works)
```javascript
import { bookingService } from '@/lib/services/bookingService';

// This still works with existing components
const bookings = await bookingService.getUserBookings();
const booking = await bookingService.createBooking(bookingData);
```

## Debugging

### Console Logs
The service provides detailed logging:
- API URLs being called
- Request/response data
- Error details
- Environment configuration

### Debug Mode
Set `VITE_DEBUG_API=true` to enable detailed API logging.

### Checking Configuration
```javascript
import { getApiConfig } from '@/lib/services/bookingService';

const config = getApiConfig();
console.log('Current environment:', config);
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if `VITE_API_BASE_URL` is correct
   - Verify backend server is running
   - Check network connectivity

2. **Environment Variables Not Working**
   - Restart the development server
   - Ensure variables start with `VITE_`
   - Check `.env` file is in project root

3. **Booking Validation Errors**
   - Check date formats (YYYY-MM-DD)
   - Ensure all required fields are provided
   - Verify email format is correct

### Testing Connection
```javascript
import { bookingService } from '@/lib/services/bookingService';

// Check API endpoints
bookingService.checkApiEndpoints();
```

## Security Notes

- Environment files are blocked from editing in this environment for security
- Never commit `.env` files to version control
- Use different API keys for development and production
- Validate all user inputs on both frontend and backend

## Next Steps

1. Test the booking functionality with the chatbot
2. Verify all existing booking features still work
3. Monitor console logs for any remaining issues
4. Consider setting up proper environment files as described above

The updated booking service should now work much more reliably with your backend API! 