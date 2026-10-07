// High-Performance Native Canvas Card Snapshot Engine
// Renders the merchant standee card directly onto a 2D Canvas.
// Sleek, modern card design with subtle modern corners (no bulky/ugly bubble curves).

export async function generateCardSnapshotBlob({
  payeeName = 'Rakexura',
  avatarUrl = '/logos/rakexura-logo-256.png',
  amount = '499',
  upiId = '12k21rakeshkannam@oksbi',
  qrElement,
  isDark = false,
}) {
  const scale = 2.5; // High definition retina scaling
  const cardWidth = 340 * scale;
  const cardHeight = 440 * scale;

  const canvas = document.createElement('canvas');
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Helper: Sleek Rounded Rectangle Path
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

  // 1. Draw Clean Single Standee Card (Sleek 14px modern radius)
  const cardRadius = 14 * scale;
  roundRect(0, 0, cardWidth, cardHeight, cardRadius);
  ctx.fillStyle = isDark ? '#0e1420' : '#ffffff';
  ctx.fill();

  // Subtle Card Border
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(226, 232, 240, 0.95)';
  ctx.stroke();

  // 2. Load and Draw Brand Logo
  const logoSize = 34 * scale;
  const headerX = 22 * scale;
  const headerY = 20 * scale;

  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
      logoImg.src = avatarUrl;
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, headerX, headerY, logoSize, logoSize);
    }
  } catch (_) {}

  // 3. Draw Brand / Payee Name
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = `bold ${18 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(payeeName, headerX + logoSize + 10 * scale, headerY + logoSize / 2);

  // Subtle Header Divider line
  const dividerY = headerY + logoSize + 14 * scale;
  ctx.beginPath();
  ctx.moveTo(headerX, dividerY);
  ctx.lineTo(cardWidth - headerX, dividerY);
  ctx.lineWidth = 1 * scale;
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.45)' : 'rgba(241, 245, 249, 0.95)';
  ctx.stroke();

  // 4. Draw QR Code in Center
  const qrDisplaySize = 210 * scale;
  const qrX = (cardWidth - qrDisplaySize) / 2;
  const qrY = dividerY + 16 * scale;

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

  // 5. Draw Formatted Amount
  const numAmount = Number(amount);
  const formattedAmount =
    !isNaN(numAmount) && numAmount >= 1
      ? `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '₹0.00';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = `800 ${24 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(formattedAmount, cardWidth / 2, qrY + qrDisplaySize + 26 * scale);

  // 6. Draw UPI ID
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `600 ${11 * scale}px "SF Mono", Menlo, Consolas, monospace`;
  ctx.fillText(`UPI ID: ${upiId}`, cardWidth / 2, qrY + qrDisplaySize + 50 * scale);

  // 7. Draw Bottom Helper Text
  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.font = `500 ${10.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('Scan to pay with any UPI app', cardWidth / 2, cardHeight - 16 * scale);

  // Return PNG Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}
