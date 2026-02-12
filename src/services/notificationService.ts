import api from './apiConfig';
import { formatCurrency } from '@/utils/format';
import { debugLog } from '../lib/utils';

/**
 * Send booking confirmation email with fallback to alternative endpoints
 */
export async function sendBookingConfirmation(bookingId: number): Promise<boolean> {
  try {
    // Try standard endpoint first
    try {
      await api.post('/notifications/booking-confirmation', { booking_id: bookingId });
      return true;
    } catch (error: any) {
      debugLog('Primary endpoint failed for booking confirmation, trying alternatives...');
      
      // If the first attempt fails with 404, try alternative endpoints
      if (error.response?.status === 404) {
        try {
          // Try first alternative
          await api.post('/bookings/send-confirmation', { booking_id: bookingId });
          return true;
        } catch (altError) {
          // Try second alternative
          await api.post('/email/booking-confirmation', { booking_id: bookingId });
          return true;
        }
      }
      
      // Special case: if booking exists but email sending failed on the server
      // We still want to consider the booking successful
      if (error.response?.status === 500 || error.response?.status === 503) {
        console.warn('Email service appears to be down, but booking was successful');
        return false;
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    return false;
  }
}

/**
 * Send general notification email with fallback to alternative endpoints
 */
export interface EmailNotification {
  recipient: string;
  subject: string;
  message: string;
  template?: string;
  data?: Record<string, any>;
}

export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    // Try standard endpoint first
    try {
      await api.post('/notifications/email', notification);
      return true;
    } catch (error: any) {
      // If the first attempt fails with 404, try alternative endpoints
      if (error.response?.status === 404) {
        await api.post('/email/send', notification);
        return true;
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

/**
 * Format booking data for email templates
 */
export function formatBookingForEmail(booking: any) {
  return {
    bookingNumber: booking.booking_number,
    startDate: new Date(booking.start_date).toLocaleDateString(),
    endDate: new Date(booking.end_date).toLocaleDateString(),
    nights: calculateNights(booking.start_date, booking.end_date),
    totalPrice: formatCurrency(booking.total_price, 'IDR'),
    roomTitle: booking.room_title || 'Reserved Room',
    homestayName: booking.homestay_title || 'Homestay',
  };
}

/**
 * Helper function to calculate nights from date range
 */
function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

 