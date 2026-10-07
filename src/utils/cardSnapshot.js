// High-Performance Native Canvas Card Snapshot Engine
// Renders the merchant standee card directly onto a 2D Canvas.
// Exact 1:1 match with Google Pay standee proportions (1152 x 1600).

export async function generateCardSnapshotBlob({
  payeeName = 'Rakexura',
  avatarUrl = '/logos/rakexura-logo-256.png',
  amount = '',
  upiId = '12k21rakeshkannam@oksbi',
  qrElement,
  isDark = false,
}) {
  const canvasWidth = 1152;
  const canvasHeight = 1600;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Fill Entire Canvas with solid background (Flat rectangular image - no outer rounded cutout)
  const bgColor = isDark ? '#0d131d' : '#f3f6fb';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Helper: Smooth Rounded Rectangle Path
  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // 2. Centered Header: Avatar + Payee Name
  const avatarSize = 88;
  const headerCenterY = 205;
  const gap = 20;

  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const nameWidth = ctx.measureText(payeeName).width;
  const totalHeaderWidth = avatarSize + gap + nameWidth;
  const headerStartX = (canvasWidth - totalHeaderWidth) / 2;

  // Draw circular avatar
  try {
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      avatarImg.onload = resolve;
      avatarImg.onerror = resolve;
      avatarImg.src = avatarUrl;
    });

    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        headerStartX + avatarSize / 2,
        headerCenterY,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        headerStartX,
        headerCenterY - avatarSize / 2,
        avatarSize,
        avatarSize
      );
      ctx.restore();

      // Avatar subtle ring
      ctx.beginPath();
      ctx.arc(
        headerStartX + avatarSize / 2,
        headerCenterY,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
      ctx.stroke();
    }
  } catch (_) {}

  // Draw Payee Name
  ctx.fillStyle = isDark ? '#ffffff' : '#1f2937';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(payeeName, headerStartX + avatarSize + gap, headerCenterY);

  // 3. Inner White Card
  const cardWidth = 832;
  const cardLeft = (canvasWidth - cardWidth) / 2;
  const cardTop = 315;

  const numAmount = Number(amount);
  const hasAmount = !isNaN(numAmount) && numAmount >= 1;
  const formattedAmount = hasAmount
    ? `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : null;

  const cardHeight = hasAmount ? 1010 : 935;
  const cardRadius = 64;

  // Subtle Card Shadow & Fill
  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(cardLeft, cardTop, cardWidth, cardHeight, cardRadius);
  ctx.fillStyle = isDark ? '#090d16' : '#ffffff';
  ctx.fill();
  ctx.restore();

  // Card Border
  ctx.lineWidth = 2;
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)';
  ctx.stroke();

  // 4. Center QR Code inside White Card
  const qrDisplaySize = 712;
  const qrX = cardLeft + (cardWidth - qrDisplaySize) / 2;
  const qrY = cardTop + 55;

  if (qrElement) {
    if (qrElement instanceof HTMLCanvasElement) {
      ctx.drawImage(qrElement, qrX, qrY, qrDisplaySize, qrDisplaySize);
    } else if (qrElement instanceof HTMLImageElement && qrElement.complete) {
      ctx.drawImage(qrElement, qrX, qrY, qrDisplaySize, qrDisplaySize);
    } else if (qrElement.querySelector('canvas')) {
      const c = qrElement.querySelector('canvas');
      ctx.drawImage(c, qrX, qrY, qrDisplaySize, qrDisplaySize);
    }
  }

  // 5. Text Inside White Card (Below QR code)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (hasAmount) {
    // Formatted Amount
    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(formattedAmount, canvasWidth / 2, qrY + qrDisplaySize + 60);

    // UPI ID
    ctx.fillStyle = isDark ? '#94a3b8' : '#5f6368';
    ctx.font = '600 28px "SF Mono", Menlo, Consolas, monospace';
    ctx.fillText(`UPI ID: ${upiId}`, canvasWidth / 2, qrY + qrDisplaySize + 118);
  } else {
    // Only UPI ID
    ctx.fillStyle = isDark ? '#94a3b8' : '#5f6368';
    ctx.font = '600 32px "SF Mono", Menlo, Consolas, monospace';
    ctx.fillText(`UPI ID: ${upiId}`, canvasWidth / 2, qrY + qrDisplaySize + 75);
  }

  // 6. Bottom Helper Text (Below White Card on Canvas Background)
  const footerY = cardTop + cardHeight + 85;
  ctx.fillStyle = isDark ? '#94a3b8' : '#5f6368';
  ctx.font = '500 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Scan to pay with any UPI app', canvasWidth / 2, footerY);

  // Return PNG Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}
