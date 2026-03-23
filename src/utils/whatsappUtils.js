// WhatsApp utility for payment instructions
export function getWhatsAppLink(booking) {
  const rusliNumber = '6287774640097';
  const message = encodeURIComponent(
    `Halo, saya telah melakukan pemesanan.\n` +
    `Nomor pemesanan: ${booking.booking_number}\n` +
    (booking.guest_name ? `Nama: ${booking.guest_name}\n` : '') +
    (booking.homestay?.title ? `Homestay: ${booking.homestay.title}\n` : '') +
    (booking.room?.title ? `Kamar: ${booking.room.title}\n` : '') +
    (booking.start_date ? `Check-in: ${booking.start_date}\n` : '') +
    (booking.end_date ? `Check-out: ${booking.end_date}\n` : '') +
    (booking.total_price ? `Total: IDR ${booking.total_price}\n` : '') +
    `Mohon informasi mengenai pembayaran.`
  );
  return `https://wa.me/${rusliNumber}?text=${message}`;
}