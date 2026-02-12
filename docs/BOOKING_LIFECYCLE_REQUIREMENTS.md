# Booking Lifecycle & Early Checkout Requirements

## Problem Statement

Currently, there's a disconnect between booking completion and room availability that causes issues:

1. **Admin marks booking as "completed"** → Room should become available
2. **New guest tries to book** → Shows available initially  
3. **Booking submission fails** → Says room only available from next day after checkout
4. **Early checkout scenario** → Guest checks out early, but room isn't immediately available for new bookings

## Strategic Solution

### 1. Enhanced Booking Status Management

#### Current Status Flow:
- `pending` → `confirmed` → `completed`

#### Required Enhancement:
- Add `actual_checkout_date` field to bookings table
- Add `checkout_reason` field for early checkout tracking
- Add `enable_same_day_booking` flag for room availability control

#### Database Schema Changes:
```sql
ALTER TABLE bookings ADD COLUMN actual_checkout_date DATE;
ALTER TABLE bookings ADD COLUMN checkout_reason TEXT;
ALTER TABLE bookings ADD COLUMN enable_same_day_booking BOOLEAN DEFAULT FALSE;
```

### 2. Enhanced Booking Status Update Endpoint

#### New Endpoint: `PUT /api/bookings/{id}/enhanced-status`

```json
{
  "booking_status": "completed",
  "room_status_action": "make_available", // auto, make_available, make_available_immediately
  "actual_checkout_date": "2025-01-15", // if different from original checkout
  "checkout_reason": "Guest emergency",
  "enable_same_day_booking": true // allows booking same day as checkout
}
```

#### Backend Logic:
```python
def update_booking_enhanced_status(booking_id, request_data):
    booking = get_booking(booking_id)
    
    # Update booking status
    booking.booking_status = request_data['booking_status']
    
    # Handle actual checkout date
    if request_data.get('actual_checkout_date'):
        booking.actual_checkout_date = request_data['actual_checkout_date']
        booking.checkout_reason = request_data.get('checkout_reason', '')
    
    # Handle room availability based on action
    if request_data['booking_status'] == 'completed':
        room = get_room(booking.room_id)
        
        if request_data.get('room_status_action') == 'make_available_immediately':
            room.status = 'available'
            room.available_from = datetime.now().date()
            
        elif request_data.get('room_status_action') == 'make_available':
            room.status = 'available'
            # If early checkout, available immediately
            if request_data.get('actual_checkout_date'):
                room.available_from = request_data['actual_checkout_date']
            else:
                # Regular checkout - available next day (for housekeeping)
                room.available_from = booking.end_date + timedelta(days=1)
        
        # Set same-day booking flag
        booking.enable_same_day_booking = request_data.get('enable_same_day_booking', False)
    
    save_booking(booking)
    save_room(room)
```

### 3. Enhanced Room Availability Logic

#### Current Issue:
Room availability checks don't consider:
- Completed bookings vs current occupancy
- Early checkout scenarios  
- Same-day booking capabilities after housekeeping

#### Required Enhancement: 
Update `/api/bookings/room/{id}/availability` to include:

```json
{
  "is_available": true,
  "room_status": "available",
  "has_bookings": false,
  "current_booking": null,
  "next_available_date": "2025-01-16",
  "has_recent_checkout": true,
  "same_day_booking_allowed": true,
  "housekeeping_status": "completed", // pending, in_progress, completed
  "availability_notes": "Room had early checkout today. Housekeeping completed."
}
```

#### Backend Logic:
```python
def check_room_availability(room_id, start_date, end_date):
    room = get_room(room_id)
    
    # Get all bookings for this room in date range
    bookings = get_room_bookings(room_id, start_date, end_date)
    
    # Filter out cancelled bookings
    active_bookings = [b for b in bookings if b.booking_status != 'cancelled']
    
    # Check for current occupancy (confirmed bookings within date range)
    current_bookings = [b for b in active_bookings 
                       if b.booking_status == 'confirmed' 
                       and dates_overlap(b.start_date, b.end_date, start_date, end_date)]
    
    # Check for recent checkouts that might affect same-day booking
    today = datetime.now().date()
    recent_checkouts = [b for b in active_bookings 
                       if b.booking_status == 'completed' 
                       and (b.actual_checkout_date or b.end_date) == today]
    
    # Determine availability
    is_available = len(current_bookings) == 0
    
    # Handle same-day booking after checkout
    if recent_checkouts and start_date == today:
        checkout_booking = recent_checkouts[0]
        if checkout_booking.enable_same_day_booking:
            # Check housekeeping status
            housekeeping_status = get_housekeeping_status(room_id, today)
            is_available = housekeeping_status == 'completed'
        else:
            is_available = False  # Not allowing same-day by default
    
    return {
        'is_available': is_available,
        'room_status': room.status,
        'has_bookings': len(active_bookings) > 0,
        'current_booking': current_bookings[0] if current_bookings else None,
        'has_recent_checkout': len(recent_checkouts) > 0,
        'same_day_booking_allowed': recent_checkouts[0].enable_same_day_booking if recent_checkouts else False,
        'housekeeping_status': get_housekeeping_status(room_id, today) if recent_checkouts else None
    }
```

### 4. Housekeeping Integration

#### New Table: `housekeeping_log`
```sql
CREATE TABLE housekeeping_log (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Auto-create housekeeping tasks on checkout:
```python
def on_booking_completed(booking):
    checkout_date = booking.actual_checkout_date or booking.end_date
    
    # Create housekeeping task
    create_housekeeping_task(
        room_id=booking.room_id,
        date=checkout_date,
        booking_id=booking.id
    )
```

### 5. Frontend Integration Points

#### Enhanced Admin Controls:
- ✅ Early checkout processing with date selection
- ✅ Same-day booking permission toggle  
- ✅ Housekeeping status integration
- ✅ Room availability impact preview

#### Booking Flow Enhancement:
- Enhanced availability checks with housekeeping status
- Same-day booking warnings and confirmations
- Alternative date suggestions when rooms unavailable due to housekeeping

## Implementation Priority

### Phase 1 (Critical - Fix Current Issue):
1. Add `actual_checkout_date` and `enable_same_day_booking` fields
2. Update booking status endpoint to handle room availability properly
3. Enhance room availability endpoint logic

### Phase 2 (Enhancement):
1. Add housekeeping management system
2. Implement automatic task creation
3. Add housekeeping status to availability checks

### Phase 3 (Advanced):
1. Housekeeping time estimation
2. Automated same-day booking rules
3. Integration with cleaning staff mobile app

## Testing Scenarios

### Scenario 1: Early Checkout
1. Guest books Room A for Jan 10-12
2. Admin confirms booking
3. Guest checks out Jan 11 (early)
4. Admin processes early checkout with same-day booking enabled
5. **Expected**: Room A available for booking Jan 11 onwards

### Scenario 2: Regular Checkout
1. Guest books Room B for Jan 10-12  
2. Admin confirms booking
3. Guest checks out Jan 12 (scheduled)
4. Admin marks booking complete
5. **Expected**: Room B available from Jan 13 (next day for housekeeping)

### Scenario 3: Same-Day Booking After Early Checkout
1. Guest 1 checks out early Jan 15 at 10 AM
2. Admin enables same-day booking
3. Guest 2 tries to book for Jan 15-16
4. **Expected**: Booking allowed with housekeeping verification

## Success Metrics

- ✅ No more "room available but booking fails" errors
- ✅ Same-day bookings possible after early checkout
- ✅ Clear admin interface for checkout management  
- ✅ Automated room status updates
- ✅ Housekeeping workflow integration 