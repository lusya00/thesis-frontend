import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { bookingService } from '../lib/services/bookingService';
import { debugLog } from '../lib/utils';

interface SameDayBookingStatusProps {
  roomId: number;
  selectedDate: string;
  onStatusChange?: (canBook: boolean) => void;
}

const SameDayBookingStatus: React.FC<SameDayBookingStatusProps> = ({ 
  roomId, 
  selectedDate, 
  onStatusChange 
}) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState('');

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isToday) {
      setAvailability(null);
      onStatusChange?.(true); // Assume available for future dates
      return;
    }

    const checkAvailability = async () => {
      setLoading(true);
      try {
        debugLog(`[SAME-DAY] Checking availability for room ${roomId} on ${selectedDate}`);
        const data = await bookingService.checkSameDayAvailability(roomId, selectedDate);
        debugLog(`[SAME-DAY] Availability result:`, data);
        setAvailability(data);
        onStatusChange?.(data.can_book_today);
        
        // Set up countdown for housekeeping completion
        if (data.early_checkout && data.housekeeping_status === 'in_progress' && data.housekeeping_complete_time) {
          startCountdown(data.housekeeping_complete_time);
        }
      } catch (error) {
        console.error('[SAME-DAY] Failed to check same-day availability:', error);
        // Assume available on error for better UX
        onStatusChange?.(true);
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
    
    // Poll every 5 minutes for updates
    const interval = setInterval(checkAvailability, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [roomId, selectedDate, isToday]);

  const startCountdown = (targetTime: string) => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      const [hours, minutes] = targetTime.split(':');
      target.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown('Available now!');
        // Refresh availability
        bookingService.checkSameDayAvailability(roomId, selectedDate).then(data => {
          setAvailability(data);
          onStatusChange?.(data.can_book_today);
        });
        return;
      }
      
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`Available in ${hoursLeft}h ${minutesLeft}m`);
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 60000); // Update every minute
    
    // Cleanup function
    return () => clearInterval(countdownInterval);
  };

  if (!isToday) {
    return null; // Don't show for future dates
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-blue-800">Checking same-day availability...</span>
        </div>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 ${
      availability.can_book_today 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {availability.can_book_today ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className={`font-semibold mb-2 ${
            availability.can_book_today ? 'text-green-800' : 'text-red-800'
          }`}>
            Same-Day Booking Status
          </h3>
          
          <p className={`mb-3 ${
            availability.can_book_today ? 'text-green-700' : 'text-red-700'
          }`}>
            {availability.message}
          </p>
          
          {availability.early_checkout && (
            <div className="bg-white rounded-md p-3 mb-3 border border-opacity-20">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Early Checkout Detected</span>
              </div>
              
              {availability.checkout_time && (
                <p className="text-sm text-gray-600 mb-2">
                  Previous guest checked out at: <strong>{availability.checkout_time}</strong>
                </p>
              )}
              
              {availability.previous_booking && (
                <p className="text-sm text-gray-600 mb-2">
                  Booking: {availability.previous_booking.booking_number}
                </p>
              )}
              
              {availability.housekeeping_status === 'in_progress' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Housekeeping in Progress</span>
                  </div>
                  
                  {countdown && (
                    <p className="text-sm text-yellow-700 font-medium">{countdown}</p>
                  )}
                  
                  {availability.housekeeping_complete_time && (
                    <p className="text-sm text-yellow-600">
                      Expected completion: {availability.housekeeping_complete_time}
                    </p>
                  )}
                  
                  <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}
              
              {availability.housekeeping_status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      🎉 Room Ready for Immediate Booking!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!availability.can_book_today && availability.current_booking && (
            <div className="bg-white rounded-md p-3 mb-3 border border-opacity-20">
              <h4 className="font-medium text-red-800 mb-2">Currently Occupied</h4>
              <p className="text-sm text-gray-600 mb-1">
                Booking: <strong>{availability.current_booking.booking_number}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="capitalize">{availability.current_booking.status}</span>
              </p>
              {availability.earliest_booking_time && availability.earliest_booking_time !== 'unknown' && (
                <p className="text-sm text-red-600 mt-2">
                  Available after: <strong>{availability.earliest_booking_time}</strong>
                </p>
              )}
            </div>
          )}
          
          {availability.can_book_today && (
            <div className="bg-white rounded-md p-3 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  {availability.earliest_booking_time === 'now' 
                    ? '✅ Ready to Book Now' 
                    : `📅 Available from ${availability.earliest_booking_time}`
                  }
                </span>
                
                {availability.earliest_booking_time === 'now' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    IMMEDIATE
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SameDayBookingStatus; 