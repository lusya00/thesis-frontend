# Backend Implementation Guide: Same-Day Booking System (Node.js + Express.js)

## Required Backend Changes

### 1. **Create Missing API Endpoint**

**File**: `routes/bookings.js` or your main routes file

```javascript
const express = require('express');
const router = express.Router();

// Add this route
router.get('/bookings/room/:roomId/same-day-availability', checkSameDayAvailability);

module.exports = router;
```

### 2. **Add Controller Function**

**File**: `controllers/bookingController.js`

```javascript
const moment = require('moment');
const Booking = require('../models/Booking'); // Adjust path as needed
const { Op } = require('sequelize'); // If using Sequelize
// const NodeCache = require('node-cache'); // For caching
// const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

const checkSameDayAvailability = async (req, res) => {
    try {
        const { roomId } = req.params;
        const date = req.query.date || moment().format('YYYY-MM-DD');
        
        console.log(`[BOOKING] Same-day availability check for room ${roomId} on ${date}`);
        
        // Get today's bookings for this room
        const bookings = await Booking.findAll({
            where: {
                room_id: roomId,
                [Op.and]: [
                    { start_date: { [Op.lte]: date } },
                    { end_date: { [Op.gte]: date } }
                ]
            },
            include: ['room'] // If you have associations
        });
        
        // Separate completed vs active bookings
        const completedToday = bookings.filter(booking => 
            booking.booking_status === 'completed' && 
            moment(booking.updated_at).format('YYYY-MM-DD') === date
        );
        
        const activeToday = bookings.filter(booking => 
            ['confirmed', 'pending'].includes(booking.booking_status)
        );
        
        console.log(`[BOOKING] Found ${bookings.length} total bookings, ${completedToday.length} completed today, ${activeToday.length} active`);
        
        if (activeToday.length === 0 && completedToday.length > 0) {
            // Early checkout scenario
            const latestCheckout = completedToday.reduce((latest, booking) => 
                moment(booking.updated_at).isAfter(moment(latest.updated_at)) ? booking : latest
            );
            
            const checkoutTime = moment(latestCheckout.updated_at);
            const housekeepingCompleteTime = checkoutTime.clone().add(2, 'hours');
            const isHousekeepingComplete = moment().isAfter(housekeepingCompleteTime);
            
            return res.json({
                status: 'success',
                data: {
                    is_available: true,
                    early_checkout: true,
                    checkout_time: checkoutTime.format('HH:mm'),
                    housekeeping_status: isHousekeepingComplete ? 'completed' : 'in_progress',
                    earliest_booking_time: isHousekeepingComplete ? 'now' : housekeepingCompleteTime.format('HH:mm'),
                    message: isHousekeepingComplete 
                        ? 'Room available after early checkout - housekeeping completed'
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
            // Has active bookings
            const nextCheckout = activeToday.reduce((earliest, booking) => 
                moment(booking.end_date).isBefore(moment(earliest.end_date)) ? booking : earliest
            );
            
            return res.json({
                status: 'success',
                data: {
                    is_available: false,
                    early_checkout: false,
                    earliest_booking_time: moment(nextCheckout.end_date).format('HH:mm'),
                    message: 'Room is currently occupied'
                }
            });
        }
        
    } catch (error) {
        console.error('Same-day availability check failed:', error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Unable to check same-day availability',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    checkSameDayAvailability,
    // ... other controller methods
};
```

### 3. **Enhance Booking Model (Sequelize Example)**

**File**: `models/Booking.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    // ... existing fields
    booking_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
    },
    // NEW FIELDS for timestamp tracking
    actual_check_in_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actual_check_out_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    housekeeping_completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    housekeeping_status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking;
```

### 4. **Database Migration (if needed)**

**File**: `migrations/add_same_day_booking_fields.js`

```javascript
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('bookings', 'actual_check_in_time', {
            type: Sequelize.DATE,
            allowNull: true
        });
        
        await queryInterface.addColumn('bookings', 'actual_check_out_time', {
            type: Sequelize.DATE,
            allowNull: true
        });
        
        await queryInterface.addColumn('bookings', 'housekeeping_completed_at', {
            type: Sequelize.DATE,
            allowNull: true
        });
        
        await queryInterface.addColumn('bookings', 'housekeeping_status', {
            type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
            defaultValue: 'pending'
        });
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('bookings', 'actual_check_in_time');
        await queryInterface.removeColumn('bookings', 'actual_check_out_time');
        await queryInterface.removeColumn('bookings', 'housekeeping_completed_at');
        await queryInterface.removeColumn('bookings', 'housekeeping_status');
    }
};
```

### 5. **Update Booking Status Change Logic**

```javascript
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, cancellation_reason } = req.body;
        
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }
        
        const oldStatus = booking.booking_status;
        booking.booking_status = status;
        
        // Record actual times based on your timestamp suggestion
        if (status === 'confirmed' && oldStatus !== 'confirmed') {
            booking.actual_check_in_time = new Date();
        }
        
        if (status === 'completed' && oldStatus !== 'completed') {
            booking.actual_check_out_time = new Date();
            booking.housekeeping_status = 'pending';
            
            // Schedule housekeeping completion (2 hours later)
            booking.housekeeping_completed_at = moment().add(2, 'hours').toDate();
        }
        
        if (cancellation_reason) {
            booking.cancellation_reason = cancellation_reason;
        }
        
        await booking.save();
        
        // Clear availability cache for this room
        clearRoomAvailabilityCache(booking.room_id);
        
        // Log the status change
        console.log(`[BOOKING] Status updated: Booking ${bookingId} from ${oldStatus} to ${status}`);
        
        return res.json({
            status: 'success',
            data: booking
        });
        
    } catch (error) {
        console.error('Error updating booking status:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update booking status'
        });
    }
};
```

### 6. **Add Cache Invalidation (Node-Cache Example)**

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache();

const clearRoomAvailabilityCache = (roomId) => {
    const cacheKeys = [
        `room_availability_${roomId}`,
        `room_bookings_${roomId}`,
        `room_status_${roomId}`,
        'homestay_rooms_status'
    ];
    
    cacheKeys.forEach(key => {
        cache.del(key);
    });
    
    console.log(`[CACHE] Cleared availability cache for room ${roomId}`);
};

// Optional: Cache availability results
const getCachedRoomAvailability = (roomId, date) => {
    const cacheKey = `room_availability_${roomId}_${date}`;
    return cache.get(cacheKey);
};

const setCachedRoomAvailability = (roomId, date, data) => {
    const cacheKey = `room_availability_${roomId}_${date}`;
    cache.set(cacheKey, data, 300); // 5 minute cache
};
```

## **Testing Your Implementation**

### Test Scenario:
1. **Book a room for today** (status: `confirmed`)
2. **Mark booking as completed** via admin dashboard 
3. **Check same-day availability**: `GET /api/bookings/room/{roomId}/same-day-availability?date=2024-06-05`
4. **Try booking same room again** - should now work!

### Expected API Response:
```json
{
  "status": "success",
  "data": {
    "is_available": true,
    "early_checkout": true,
    "checkout_time": "14:30",
    "housekeeping_status": "completed",
    "earliest_booking_time": "now",
    "message": "Room available after early checkout - housekeeping completed"
  }
}
```

## **Required NPM Packages**

```bash
npm install moment sequelize node-cache
# OR if using TypeScript
npm install moment sequelize node-cache @types/node
```

## **Implementation Priority**

1. **Step 1**: Add the missing endpoint (`checkSameDayAvailability`) - **This fixes the 404 error immediately**
2. **Step 2**: Update status change logic to record actual times
3. **Step 3**: Add cache invalidation 
4. **Step 4**: Add optional database columns for better tracking

**The first step alone will solve your immediate problem!** 