import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  value, 
  size = 128, 
  className = '', 
  alt = 'QR Code' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [value, size]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      aria-label={alt}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default QRCodeComponent;