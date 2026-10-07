import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

export default function QrCanvas({
  data,
  theme,
  dotStyle,
  cornerStyle,
  logoUrl,
  size = 300,
  onQrInstanceReady,
}) {
  const containerRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the QRCodeStyling instance if not exists
    if (!qrCodeRef.current) {
      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'canvas',
        data: data || 'upi://pay?pa=rakexura@upi',
        image: logoUrl || undefined,
        dotsOptions: {
          type: dotStyle || 'rounded',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: theme.dotColor1 },
              { offset: 1, color: theme.dotColor2 },
            ],
          },
        },
        backgroundOptions: {
          color: theme.bg || '#090a12',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 8,
          imageSize: 0.28,
          hideBackgroundDots: true,
        },
        cornersSquareOptions: {
          color: theme.cornerSquare || theme.dotColor1,
          type: cornerStyle || 'extra-rounded',
        },
        cornersDotOptions: {
          color: theme.cornerDot || theme.dotColor2,
          type: 'dot',
        },
      });

      qrCode.append(containerRef.current);
      qrCodeRef.current = qrCode;

      if (onQrInstanceReady) {
        onQrInstanceReady(qrCode);
      }
    } else {
      // Update existing instance dynamically
      qrCodeRef.current.update({
        width: size,
        height: size,
        data: data || 'upi://pay?pa=rakexura@upi',
        image: logoUrl || undefined,
        dotsOptions: {
          type: dotStyle || 'rounded',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: theme.dotColor1 },
              { offset: 1, color: theme.dotColor2 },
            ],
          },
        },
        backgroundOptions: {
          color: theme.bg || '#090a12',
        },
        cornersSquareOptions: {
          color: theme.cornerSquare || theme.dotColor1,
          type: cornerStyle || 'extra-rounded',
        },
        cornersDotOptions: {
          color: theme.cornerDot || theme.dotColor2,
          type: 'dot',
        },
      });
    }
  }, [data, theme, dotStyle, cornerStyle, logoUrl, size]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center rounded-2xl overflow-hidden [&>canvas]:max-w-full [&>canvas]:h-auto transition-all"
      style={{
        boxShadow: `0 0 35px -5px ${theme.glow}`,
        backgroundColor: theme.bg,
      }}
    />
  );
}
