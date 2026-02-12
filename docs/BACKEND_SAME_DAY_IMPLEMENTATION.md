# Backend Implementation Guide: Same-Day Booking System

## Required Backend Changes

### 1. **Create Missing API Endpoint**

**File**: `routes/api.php` or your booking routes file

```php
Route::get('/bookings/room/{roomId}/same-day-availability', [BookingController::class, 'checkSameDayAvailability']);
```

### 2. **Add Method to BookingController**

```php
<?php

use Carbon\Carbon;

public function checkSameDayAvailability(Request $request, $roomId)
{
    try {
        $date = $request->query('date', Carbon::today()->toDateString());
        
        // Get today's bookings for this room
        $bookings = Booking::where('room_id', $roomId)
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->with(['room'])
            ->get();
        
        // Separate completed vs active bookings
        $completedToday = $bookings->where('booking_status', 'completed')
            ->whereDate('updated_at', $date);
            
        $activeToday = $bookings->whereIn('booking_status', ['confirmed', 'pending']);
        
        Log::info("Same-day availability check", [
            'room_id' => $roomId,
            'date' => $date,
            'total_bookings' => $bookings->count(),
            'completed_today' => $completedToday->count(),
            'active_today' => $activeToday->count()
        ]);
        
        if ($activeToday->isEmpty() && $completedToday->isNotEmpty()) {
            // Early checkout scenario
            $latestCheckout = $completedToday->sortByDesc('updated_at')->first();
            $checkoutTime = Carbon::parse($latestCheckout->updated_at);
            $housekeepingCompleteTime = $checkoutTime->copy()->addHours(2);
            $isHousekeepingComplete = Carbon::now()->gte($housekeepingCompleteTime);
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'is_available' => true,
                    'early_checkout' => true,
                    'checkout_time' => $checkoutTime->format('H:i'),
                    'housekeeping_status' => $isHousekeepingComplete ? 'completed' : 'in_progress',
                    'earliest_booking_time' => $isHousekeepingComplete ? 'now' : $housekeepingCompleteTime->format('H:i'),
                    'message' => $isHousekeepingComplete 
                        ? 'Room available after early checkout - housekeeping completed'
                        : 'Room available after housekeeping completion'
                ]
            ]);
            
        } elseif ($activeToday->isEmpty()) {
            // No bookings today
            return response()->json([
                'status' => 'success',
                'data' => [
                    'is_available' => true,
                    'early_checkout' => false,
                    'message' => 'Room is available'
                ]
            ]);
            
        } else {
            // Has active bookings
            $nextCheckout = $activeToday->min('end_date');
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'is_available' => false,
                    'early_checkout' => false,
                    'earliest_booking_time' => Carbon::parse($nextCheckout)->format('H:i'),
                    'message' => 'Room is currently occupied'
                ]
            ]);
        }
        
    } catch (\Exception $e) {
        Log::error('Same-day availability check failed', [
            'room_id' => $roomId,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'status' => 'error',
            'message' => 'Unable to check same-day availability'
        ], 500);
    }
}
```

### 3. **Enhance Booking Model (Optional but Recommended)**

Add these columns to your `bookings` table:

```php
// Migration file
Schema::table('bookings', function (Blueprint $table) {
    $table->timestamp('actual_check_in_time')->nullable();
    $table->timestamp('actual_check_out_time')->nullable();
    $table->timestamp('housekeeping_completed_at')->nullable();
    $table->enum('housekeeping_status', ['pending', 'in_progress', 'completed'])->default('pending');
});
```

### 4. **Update Booking Status Change Logic**

```php
public function updateBookingStatus(Request $request, $bookingId)
{
    $booking = Booking::findOrFail($bookingId);
    $oldStatus = $booking->booking_status;
    $newStatus = $request->input('status');
    
    $booking->booking_status = $newStatus;
    
    // Record actual times
    if ($newStatus === 'confirmed' && $oldStatus !== 'confirmed') {
        $booking->actual_check_in_time = now();
    }
    
    if ($newStatus === 'completed' && $oldStatus !== 'completed') {
        $booking->actual_check_out_time = now();
        $booking->housekeeping_status = 'pending';
        
        // Schedule housekeeping completion (2 hours later)
        $booking->housekeeping_completed_at = now()->addHours(2);
    }
    
    $booking->save();
    
    // Clear availability cache for this room
    Cache::forget("room_availability_{$booking->room_id}");
    Cache::forget("room_bookings_{$booking->room_id}");
    
    // Log the status change
    Log::info('Booking status updated', [
        'booking_id' => $bookingId,
        'room_id' => $booking->room_id,
        'old_status' => $oldStatus,
        'new_status' => $newStatus,
        'actual_check_out_time' => $booking->actual_check_out_time
    ]);
    
    return response()->json([
        'status' => 'success',
        'data' => $booking
    ]);
}
```

### 5. **Add Cache Invalidation**

```php
// When any booking status changes, clear related caches
private function clearRoomAvailabilityCache($roomId)
{
    $cacheKeys = [
        "room_availability_{$roomId}",
        "room_bookings_{$roomId}",
        "room_status_{$roomId}",
        "homestay_rooms_status"
    ];
    
    foreach ($cacheKeys as $key) {
        Cache::forget($key);
    }
    
    Log::info('Room availability cache cleared', ['room_id' => $roomId]);
}
```

### 6. **Housekeeping Status Update Endpoint (Optional)**

```php
Route::post('/bookings/{bookingId}/housekeeping-complete', [BookingController::class, 'markHousekeepingComplete']);

public function markHousekeepingComplete($bookingId)
{
    $booking = Booking::findOrFail($bookingId);
    
    $booking->update([
        'housekeeping_status' => 'completed',
        'housekeeping_completed_at' => now()
    ]);
    
    // Clear cache to make room available immediately
    $this->clearRoomAvailabilityCache($booking->room_id);
    
    return response()->json([
        'status' => 'success',
        'message' => 'Housekeeping marked as complete'
    ]);
}
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

## **Configuration Options**

You can make these configurable:

```php
// config/booking.php
return [
    'housekeeping_duration_hours' => env('HOUSEKEEPING_DURATION_HOURS', 2),
    'same_day_booking_enabled' => env('SAME_DAY_BOOKING_ENABLED', true),
    'auto_complete_housekeeping' => env('AUTO_COMPLETE_HOUSEKEEPING', true),
];
```

## **Benefits of This Approach**

✅ **Immediate Availability**: Rooms become bookable as soon as housekeeping is done  
✅ **Accurate Timestamps**: Real checkout times, not just scheduled dates  
✅ **Cache Management**: Automatic cache clearing when status changes  
✅ **Configurable**: Adjustable housekeeping times per property  
✅ **Logging**: Full audit trail of status changes  
✅ **Frontend Ready**: Works with existing frontend code

## **Implementation Priority**

1. **Step 1**: Add the missing endpoint (`checkSameDayAvailability`) - **This fixes the 404 error immediately**
2. **Step 2**: Update status change logic to record actual times
3. **Step 3**: Add cache invalidation 
4. **Step 4**: Add optional database columns for better tracking
5. **Step 5**: Add housekeeping management features

**The first step alone will solve your immediate problem!** 