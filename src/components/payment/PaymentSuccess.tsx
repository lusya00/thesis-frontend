import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Phone, Printer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';

interface PaymentSuccessProps {
  bookingData: {
    id: number;
    booking_number: string;
    total_price: number;
    start_date: string;
    end_date: string;
    room?: {
      title: string;
    };
    homestay?: {
      title: string;
    };
    guest?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  onNewBooking?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  bookingData, 
  onNewBooking 
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    if (onNewBooking) {
      onNewBooking();
    } else {
      navigate('/');
    }
  };

  const handleViewDashboard = () => {
    navigate('/user/dashboard');
  };

  const getWhatsAppLink = (booking: PaymentSuccessProps['bookingData']) => {
    const message = `
📝 Booking Confirmation

Booking Number: ${booking.booking_number}
Homestay: ${booking.homestay?.title}
Room: ${booking.room?.title || 'N/A'}
Check-in: ${formatDate(booking.start_date)}
Check-out: ${formatDate(booking.end_date)}
Total Paid: ${formatCurrency(booking.total_price)}

Please contact Mr. Rusli via WhatsApp to confirm your booking and receive payment instructions.
`;
    return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Submitted</h1>
        <p className="text-lg text-gray-600">Please contact Mr. Rusli via WhatsApp to confirm your booking and receive payment instructions.</p>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg mt-4"
          onClick={() => window.open(getWhatsAppLink(bookingData), '_blank')}
        >
          Contact Mr. Rusli via WhatsApp
        </Button>
        <div className="mt-4">
          <span className="font-medium">Booking Number:</span> <span className="font-mono">{bookingData.booking_number}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button 
          onClick={handleNewBooking}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Book Again
        </Button>
        <Button 
          onClick={handleViewDashboard}
          variant="outline"
          className="flex-1"
        >
          View My Bookings
        </Button>
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="flex-1"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Confirmation
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 