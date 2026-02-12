import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeComponent } from '@/components/ui/qr-code';
import { MessageCircle, Phone } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/whatsappUtils';

interface WhatsAppQRCardProps {
  homestay: {
    id: number;
    title: string;
  };
  className?: string;
}

export const WhatsAppQRCard: React.FC<WhatsAppQRCardProps> = ({ 
  homestay, 
  className = '' 
}) => {
  // Create a basic booking object for WhatsApp link
  const bookingData = {
    booking_number: `INQUIRY-${homestay.id}`,
    homestay_name: homestay.title,
    guest_name: '',
    start_date: '',
    end_date: '', 
    total_price: ''
  };

  const whatsappLink = getWhatsAppLink(bookingData);

  return (
    <Card className={`${className} bg-gradient-to-br from-green-50 to-emerald-50 border-green-200`}>
      <CardHeader className="text-center pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-green-700">
          <MessageCircle className="h-5 w-5" />
          Contact via WhatsApp
        </CardTitle>
        <p className="text-sm text-green-600">
          Scan QR code or tap to message directly
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <QRCodeComponent 
              value={whatsappLink}
              size={120}
              alt="WhatsApp QR Code"
            />
          </div>
        </div>
        <div className="text-xs text-green-600 space-y-1">
          <p className="font-medium">Quick Contact</p>
          <p>Scan to inquire about {homestay.title}</p>
        </div>
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Phone className="h-4 w-4" />
          Open WhatsApp
        </a>
      </CardContent>
    </Card>
  );
};

export default WhatsAppQRCard;