import React, { useRef, useState, useEffect } from 'react';
import { Download, MessageCircle, ExternalLink, QrCode, Check, Copy, AlertCircle, SunMedium, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import QrCanvas from './QrCanvas';

export default function DeviceQrCard({
  upiUrl,
  amount,
  upiId = '12k21rakeshkannam@oksbi',
  payeeName = 'Rakesh',
  logoUrl = '/logos/rakexura-logo-256.png',
  isDark = false,
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [clipboardToast, setClipboardToast] = useState(false);
  const [highContrastQr, setHighContrastQr] = useState(false);
  
  // Responsive QR Size (Consistent across both light & dark modes)
  const [qrSize, setQrSize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 480) return 180;
      if (window.innerWidth < 768) return 200;
    }
    return 220;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setQrSize(180);
      } else if (window.innerWidth < 768) {
        setQrSize(200);
      } else {
        setQrSize(220);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardContainerRef = useRef(null);

  // Validation: Amount must be >= ₹1 to generate an actual payment QR
  const numAmount = Number(amount);
  const hasValidAmount = Boolean(amount && !isNaN(numAmount) && numAmount >= 1);
  const isZeroOrNegative = amount !== '' && (!isNaN(numAmount) && numAmount < 1);

  // Formatted bill amount
  const formattedAmount = hasValidAmount
    ? `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : null;

  // Dedicated QR Theme Design for Light vs Dark mode
  const qrTheme = isDark && !highContrastQr
    ? {
        bg: '#0a0e17',
        dotColor1: '#ffffff',
        dotColor2: '#c299ff',
        cornerSquare: '#c299ff',
        cornerDot: '#ffffff',
        glow: 'rgba(194, 153, 255, 0.25)',
      }
    : {
        bg: '#ffffff',
        dotColor1: '#000000',
        dotColor2: '#000000',
        cornerSquare: '#000000',
        cornerDot: '#000000',
        glow: 'transparent',
      };

  const qrDotStyle = isDark && !highContrastQr ? 'rounded' : 'square';
  const qrCornerStyle = isDark && !highContrastQr ? 'extra-rounded' : 'square';

  // Pre-formatted WhatsApp message for customers
  const generateCustomerMessage = () => {
    let msg = `*Payment Request from ${payeeName}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (formattedAmount) {
      msg += `💰 *Amount Due:* ${formattedAmount}\n`;
    }
    msg += `👤 *Payee:* ${payeeName}\n`;
    msg += `🆔 *UPI ID:* ${upiId}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `⚡ *Tap link to pay with any UPI App (GPay, PhonePe, Paytm):*\n`;
    msg += `${upiUrl}\n\n`;
    msg += `Scan QR code or click link above to complete payment. Thank you!`;
    return msg;
  };

  // Generate Image Blob of the Card
  const captureCardBlob = async () => {
    if (!cardContainerRef.current) return null;
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
    await new Promise((r) => setTimeout(r, 120));
    const dataUrl = await toPng(cardContainerRef.current, {
      pixelRatio: 2.5,
      backgroundColor: isDark ? '#121824' : '#ffffff',
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  // Smart WhatsApp Share: Sends image file on Mobile, copies to clipboard on Desktop
  const handleWhatsAppShare = async (phone = '') => {
    if (!hasValidAmount) return;
    setIsExporting(true);

    try {
      const blob = await captureCardBlob();
      const captionText = generateCustomerMessage();
      const fileName = `Rakesh-Pay-${amount}INR.png`;

      // 1. Check if native Web Share with Files is supported (Android Chrome, iOS Safari)
      if (blob && navigator.canShare && window.File) {
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Payment Request from ${payeeName}`,
              text: captionText,
            });
            setShowWaModal(false);
            confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
            return;
          } catch (shareErr) {
            if (shareErr.name === 'AbortError') return;
            console.warn('Native share error, falling back:', shareErr);
          }
        }
      }

      // 2. Desktop WhatsApp Web Fallback:
      if (blob && navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setClipboardToast(true);
          setTimeout(() => setClipboardToast(false), 8000);
        } catch (clipErr) {
          console.warn('Clipboard write error:', clipErr);
        }
      }

      const text = encodeURIComponent(captionText);
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      let url = `https://wa.me/?text=${text}`;
      if (cleanPhone) {
        const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
        url = `https://wa.me/${fullPhone}?text=${text}`;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
      setShowWaModal(false);
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      console.warn('WhatsApp share fallback error:', err);
      const text = encodeURIComponent(generateCustomerMessage());
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const url = cleanPhone
        ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${text}`
        : `https://wa.me/?text=${text}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setShowWaModal(false);
    } finally {
      setIsExporting(false);
    }
  };

  // Download Card as High-Resolution PNG
  const handleDownloadCard = async () => {
    if (!cardContainerRef.current || !hasValidAmount) return;
    setIsExporting(true);

    try {
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      await new Promise((r) => setTimeout(r, 120));

      const dataUrl = await toPng(cardContainerRef.current, {
        pixelRatio: 3,
        backgroundColor: isDark ? '#121824' : '#ffffff',
      });

      const filename = `Rakesh-Pay-${amount ? amount + 'INR' : 'QR'}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.warn('html-to-image capture fallback to svg:', err);
      const svg = cardContainerRef.current?.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.download = `Rakesh-Pay-${amount ? amount : 'QR'}.svg`;
        link.href = svgUrl;
        link.click();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      
      {/* Clipboard Toast Banner for Desktop WhatsApp Paste */}
      {clipboardToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-emerald-400">
          <Check className="w-5 h-5 shrink-0 bg-white/20 rounded-full p-1" />
          <div className="text-xs">
            <p className="font-bold">QR Image Copied to Clipboard!</p>
            <p className="opacity-90">Press <kbd className="bg-black/30 px-1 py-0.5 rounded font-mono font-bold">Ctrl + V</kbd> in your WhatsApp chat to paste the QR image.</p>
          </div>
          <button
            type="button"
            onClick={() => setClipboardToast(false)}
            className="ml-auto text-white/80 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* 
        ============================================================
        THE EXACT CARD CONTAINER AS IN USER'S WHATSAPP IMAGE
        ============================================================
      */}
      <div
        ref={cardContainerRef}
        className={`w-full max-w-[340px] sm:max-w-[380px] p-3.5 sm:p-6 rounded-[22px] sm:rounded-[28px] flex flex-col items-center select-none border transition-colors ${
          isDark
            ? 'bg-[#121824] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-[#edf2f7] border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* Top: Avatar + Payee Name Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-5">
          <div
            className={`w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-0.5 bg-white shadow-xs shrink-0 flex items-center justify-center ring-1 ${
              isDark ? 'ring-white/10' : 'ring-slate-200'
            }`}
          >
            <img
              src="/avatar.png"
              alt="Avatar"
              className="w-full h-full rounded-full object-cover shrink-0"
              onError={(e) => {
                e.target.src = '/logos/rakexura-logo-256.png';
              }}
            />
          </div>

          <h2
            className={`text-lg sm:text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {payeeName}
          </h2>
        </div>

        {/* Center: Inner Rounded Card with QR Code or Placeholder (Theme-aware) */}
        <div
          className={`w-full rounded-[18px] sm:rounded-[24px] p-3 sm:p-5 shadow-sm border flex flex-col items-center transition-colors ${
            isDark
              ? 'bg-[#0a0e17] border-slate-800/80 text-white'
              : 'bg-white border-slate-100 text-slate-900'
          }`}
        >
          
          {/* QR Code Canvas (When valid amount) or Placeholder (When 0 or blank) */}
          <div className="w-full flex items-center justify-center overflow-hidden">
            {hasValidAmount ? (
              <div
                className={`overflow-hidden flex items-center justify-center rounded-2xl transition-all ${
                  isDark && highContrastQr
                    ? 'p-2 bg-white rounded-2xl shadow-xs'
                    : 'p-1 rounded-2xl'
                }`}
              >
                <QrCanvas
                  data={upiUrl}
                  theme={qrTheme}
                  dotStyle={qrDotStyle}
                  cornerStyle={qrCornerStyle}
                  logoUrl={logoUrl}
                  size={qrSize}
                />
              </div>
            ) : (
              /* Clean Placeholder when ₹0 or empty */
              <div
                style={{ width: qrSize, height: qrSize }}
                className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center select-none transition-colors ${
                  isDark
                    ? 'border-slate-800 bg-[#0f1524]/60 text-slate-300'
                    : 'border-slate-200 bg-slate-50/70 text-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <QrCode className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  {isZeroOrNegative ? 'Invalid Amount' : 'Enter Price'}
                </p>
                <p
                  className={`text-[11px] mt-0.5 leading-tight max-w-[160px] ${
                    isDark ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {isZeroOrNegative
                    ? 'Payment amount must be at least ₹1'
                    : 'Enter an amount above to generate payment QR'}
                </p>
              </div>
            )}
          </div>

          {/* Amount & UPI ID text */}
          <div className="mt-2.5 sm:mt-4 text-center w-full">
            {hasValidAmount ? (
              <div
                className={`text-xl sm:text-3xl font-extrabold font-sans tracking-tight mb-0.5 sm:mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {formattedAmount}
              </div>
            ) : (
              <div
                className={`text-base sm:text-xl font-bold font-mono mb-0.5 sm:mb-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {isZeroOrNegative ? '₹0.00' : '₹ —'}
              </div>
            )}
            <p
              className={`text-[11px] sm:text-sm font-medium font-mono tracking-tight truncate select-all px-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              UPI ID: {upiId}
            </p>
          </div>

        </div>

        {/* Bottom Text + Dark Mode High-Contrast QR Option */}
        <div className="w-full flex items-center justify-center gap-2 mt-2.5 sm:mt-4 text-[11px] sm:text-sm font-medium text-center">
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {hasValidAmount ? 'Scan to pay with any UPI app' : 'Ready for payment'}
          </p>

          {isDark && hasValidAmount && (
            <button
              type="button"
              onClick={() => setHighContrastQr((prev) => !prev)}
              title={highContrastQr ? 'Switch to Cyber Dark QR' : 'Switch to High-Contrast White Tile'}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1 shrink-0"
            >
              {highContrastQr ? <Moon className="w-2.5 h-2.5" /> : <SunMedium className="w-2.5 h-2.5 text-amber-400" />}
              <span>{highContrastQr ? 'Cyber QR' : 'White Tile'}</span>
            </button>
          )}
        </div>

      </div>

      {/* 
        ============================================================
        CUSTOMER SHARING ACTIONS
        ============================================================
      */}
      <div className="w-full max-w-[340px] sm:max-w-[380px] mt-2.5 sm:mt-4 flex items-center gap-2">
        {/* Main Action: Send to Customer on WhatsApp */}
        <button
          type="button"
          onClick={() => setShowWaModal(true)}
          disabled={!hasValidAmount}
          title={!hasValidAmount ? 'Enter a valid amount to share' : 'Send to customer on WhatsApp'}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba59] text-black shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          <MessageCircle className="w-4 h-4 fill-black shrink-0" />
          <span className="truncate">Send on WhatsApp</span>
        </button>

        {/* Save Image (HD PNG) */}
        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={!hasValidAmount || isExporting}
          title={!hasValidAmount ? 'Enter a valid amount to save' : 'Download QR image exactly as shown above'}
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none shadow-sm shrink-0 ${
            isDark
              ? 'bg-white hover:bg-slate-100 text-slate-900'
              : 'bg-slate-900 hover:bg-black text-white'
          }`}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{isExporting ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      {/* WhatsApp Modal with Customer Number Option */}
      {showWaModal && hasValidAmount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`border rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl ${
              isDark
                ? 'bg-[#121824] border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Send to Customer</h3>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Share QR code & payment request
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Customer Number Input */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Customer Mobile Number (Optional)
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-2 border rounded-xl text-xs font-mono ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210 (or blank)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#25D366] ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Leaving blank opens WhatsApp contact selector directly.
              </p>
            </div>

            {/* Bill Summary */}
            <div
              className={`p-3 rounded-xl border space-y-1 text-xs ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between font-bold">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Amount:</span>
                <span className="font-mono">{formattedAmount || 'Open'}</span>
              </div>
              <div className={`flex justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Payee:</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>{payeeName}</span>
              </div>
              <div className={`flex justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>UPI ID:</span>
                <span className="font-mono truncate max-w-[180px]">{upiId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleWhatsAppShare(customerPhone)}
                disabled={isExporting}
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Preparing Image...' : 'Share on WhatsApp'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
