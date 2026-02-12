# Quick Start: Fix Same-Day Booking 404 Error (Node.js)

## Immediate Fix (5 minutes)

### Step 1: Add the Missing Route

**File**: Your main routes file (e.g., `routes/api.js` or `app.js`)

```javascript
// Add this single route to fix the 404 error
app.get('/api/bookings/room/:roomId/same-day-availability', async (req, res) => {
    try {
        const { roomId } = req.params;
        const date = req.query.date || new Date().toISOString().split('T')[0];
        
        console.log(`[QUICK-FIX] Same-day availability check for room ${roomId}`);
        
        // Simple response that will work with your frontend
        res.json({
            status: 'success',
            data: {
                is_available: true,
                early_checkout: false,
                message: 'Room availability check - backend endpoint now working'
            }
        });
        
    } catch (error) {
        console.error('Same-day availability error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error checking availability'
        });
    }
});
```

### Step 2: Test the Fix

1. **Restart your Node.js server**
2. **Test the endpoint**: `GET http://localhost:5000/api/bookings/room/1/same-day-availability`
3. **Try the same-day booking scenario** - no more 404 error!

---

## Next Steps (When Ready)

Once the immediate 404 is fixed, implement the full logic from `BACKEND_IMPLEMENTATION.md`:

### 1. **Install Required Packages**
```bash
npm install moment
# Optional: npm install sequelize node-cache
```

### 2. **Replace Simple Handler with Full Logic**

Replace the quick-fix handler above with this enhanced version:

```javascript
const moment = require('moment');

app.get('/api/bookings/room/:roomId/same-day-availability', async (req, res) => {
    try {
        const { roomId } = req.params;
        const date = req.query.date || moment().format('YYYY-MM-DD');
        
        // Query your bookings database (adjust based on your setup)
        const bookings = await YourBookingModel.find({
            room_id: roomId,
            $and: [
                { start_date: { $lte: date } },
                { end_date: { $gte: date } }
            ]
        });
        
        // Filter by status
        const completedToday = bookings.filter(booking => 
            booking.booking_status === 'completed' && 
            moment(booking.updated_at).format('YYYY-MM-DD') === date
        );
        
        const activeToday = bookings.filter(booking => 
            ['confirmed', 'pending'].includes(booking.booking_status)
        );
        
        if (activeToday.length === 0 && completedToday.length > 0) {
            // Early checkout scenario - room available after housekeeping
            const latestCheckout = completedToday[completedToday.length - 1];
            const checkoutTime = moment(latestCheckout.updated_at);
            const housekeepingComplete = moment().isAfter(checkoutTime.clone().add(2, 'hours'));
            
            return res.json({
                status: 'success',
                data: {
                    is_available: true,
                    early_checkout: true,
                    checkout_time: checkoutTime.format('HH:mm'),
                    housekeeping_status: housekeepingComplete ? 'completed' : 'in_progress',
                    message: housekeepingComplete 
                        ? 'Room available after early checkout'
                        : 'Room available after housekeeping completion'
                }
            });
        } else if (activeToday.length === 0) {
            // No bookings today
            return res.json({
                status: 'success',
                data: {
                    is_available: true,
                    early_checkout: false,
                    message: 'Room is available'
                }
            });
        } else {
            // Room is occupied
            return res.json({
                status: 'success',
                data: {
                    is_available: false,
                    early_checkout: false,
                    message: 'Room is currently occupied'
                }
            });
        }
        
    } catch (error) {
        console.error('Same-day availability check failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Unable to check same-day availability'
        });
    }
});
```

### 3. **Add Timestamp Tracking (Your Suggestion)**

When updating booking status to 'completed':

```javascript
// In your booking status update endpoint
app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const booking = await YourBookingModel.findById(req.params.id);
        const oldStatus = booking.booking_status;
        const newStatus = req.body.status;
        
        booking.booking_status = newStatus;
        
        // YOUR TIMESTAMP SUGGESTION - Record actual checkout time
        if (newStatus === 'completed' && oldStatus !== 'completed') {
            booking.actual_check_out_time = new Date();
            console.log(`[BOOKING] Room ${booking.room_id} checked out at ${booking.actual_check_out_time}`);
        }
        
        await booking.save();
        
        res.json({ status: 'success', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
```

## Quick Test Commands

```bash
# Test the endpoint directly
curl "http://localhost:5000/api/bookings/room/1/same-day-availability"

# Test with specific date
curl "http://localhost:5000/api/bookings/room/1/same-day-availability?date=2024-06-05"
```

**That's it! The 404 error should be resolved immediately with Step 1.** 