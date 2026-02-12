import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getWhatsAppLink } from '@/utils/whatsappUtils';
import { checkPaymentStatus } from '@/lib/services/bookingService';
import type { QRISPaymentResponse } from '@/lib/services/bookingService';
import { formatCurrency } from '@/utils/format';
import { debugLog } from '@/lib/utils';
import { QRCodeComponent } from '@/components/ui/qr-code';

interface PaymentPageProps {
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
  };
  paymentData?: QRISPaymentResponse['data']; // Now optional
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  bookingData, 
  onBack 
}) => {
  const whatsappLink = getWhatsAppLink(bookingData);
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Booking Submitted</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Next Step: Confirm via WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 font-medium">Please contact Mr. Rusli via WhatsApp to confirm your booking and receive payment instructions.</p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg mb-4"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              Contact Mr. Rusli via WhatsApp
            </Button>
            
            {/* WhatsApp QR Code */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 mb-3 font-medium">Or scan QR code to open WhatsApp</p>
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <QRCodeComponent 
                    value={whatsappLink}
                    size={120}
                    alt="WhatsApp QR Code for booking contact"
                  />
                </div>
              </div>
              <p className="text-xs text-green-600">Scan with your phone camera to open WhatsApp</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="font-medium">Booking Number:</span> <span className="font-mono">{bookingData.booking_number}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage; 