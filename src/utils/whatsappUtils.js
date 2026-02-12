// WhatsApp utility for payment instructions
export function getWhatsAppLink(booking) {
  const rusliNumber = '6281519835694';
  const message = encodeURIComponent(
    `Hello, I have made a booking.\n` +
    `Booking number: ${booking.booking_number}\n` +
    (booking.guest_name ? `Name: ${booking.guest_name}\n` : '') +
    (booking.start_date ? `Check-in: ${booking.start_date}\n` : '') +
    (booking.end_date ? `Check-out: ${booking.end_date}\n` : '') +
    (booking.total_price ? `Total: IDR ${booking.total_price}\n` : '') +
    `Please advise on payment.`
  );
  return `https://wa.me/${rusliNumber}?text=${message}`;
} 