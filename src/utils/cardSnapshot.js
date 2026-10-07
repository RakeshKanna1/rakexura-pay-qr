// High-Performance Native Canvas Card Snapshot Engine
// Renders the merchant standee card directly onto a 2D Canvas.
// Bypasses html-to-image to guarantee 100% reliable, zero-hang, razor-sharp PNG export in every browser.

export async function generateCardSnapshotBlob({
  payeeName = 'Rakexura',
  avatarUrl = '/logos/rakexura-logo-256.png',
  amount = '499',
  upiId = '12k21rakeshkannam@oksbi',
  qrElement, // <canvas> or <svg> or <img> DOM element
  isDark = false,
}) {
  const scale = 2.5; // High definition retina scaling
  const cardWidth = 360 * scale;
  const cardHeight = 490 * scale;

  const canvas = document.createElement('canvas');
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Helper: Rounded Rectangle Path
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

  // 1. Draw Outer Standee Card
  const outerRadius = 28 * scale;
  roundRect(0, 0, cardWidth, cardHeight, outerRadius);
  ctx.fillStyle = isDark ? '#121824' : '#edf2f7';
  ctx.fill();

  // Outer Border
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.9)';
  ctx.stroke();

  // 2. Load and Draw Avatar (Circular)
  const avatarSize = 44 * scale;
  const avatarX = 24 * scale;
  const avatarY = 22 * scale;

  try {
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      avatarImg.onload = resolve;
      avatarImg.onerror = resolve; // Continue even if avatar fails
      avatarImg.src = avatarUrl;
    });

    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Avatar Ring
      ctx.beginPath();
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : '#ffffff';
      ctx.stroke();
    }
  } catch (_) {}

  // 3. Draw Payee Name
  ctx.fillStyle = isDark ? '#ffffff' : '#1e293b';
  ctx.font = `bold ${22 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(payeeName, avatarX + avatarSize + 14 * scale, avatarY + avatarSize / 2);

  // 4. Draw Inner Card Box (Where QR sits)
  const innerMarginX = 20 * scale;
  const innerY = avatarY + avatarSize + 18 * scale;
  const innerWidth = cardWidth - innerMarginX * 2;
  const innerHeight = 330 * scale;
  const innerRadius = 20 * scale;

  roundRect(innerMarginX, innerY, innerWidth, innerHeight, innerRadius);
  ctx.fillStyle = isDark ? '#0a0e17' : '#ffffff';
  ctx.fill();

  ctx.lineWidth = 1 * scale;
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.9)';
  ctx.stroke();

  // 5. Draw QR Code in the Inner Box
  const qrDisplaySize = 205 * scale;
  const qrX = innerMarginX + (innerWidth - qrDisplaySize) / 2;
  const qrY = innerY + 16 * scale;

  if (qrElement) {
    if (qrElement instanceof HTMLCanvasElement) {
      ctx.drawImage(qrElement, qrX, qrY, qrDisplaySize, qrDisplaySize);
    } else if (qrElement instanceof HTMLImageElement && qrElement.complete) {
      ctx.drawImage(qrElement, qrX, qrY, qrDisplaySize, qrDisplaySize);
    } else if (qrElement instanceof SVGElement || qrElement.querySelector('svg')) {
      const svgEl = qrElement instanceof SVGElement ? qrElement : qrElement.querySelector('svg');
      if (svgEl) {
        const svgString = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = svgUrl;
        });
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, qrX, qrY, qrDisplaySize, qrDisplaySize);
        }
        URL.revokeObjectURL(svgUrl);
      }
    }
  }

  // 6. Draw Formatted Amount
  const numAmount = Number(amount);
  const formattedAmount =
    !isNaN(numAmount) && numAmount >= 1
      ? `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '₹0.00';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = `800 ${26 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(formattedAmount, innerMarginX + innerWidth / 2, qrY + qrDisplaySize + 28 * scale);

  // 7. Draw UPI ID
  ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
  ctx.font = `600 ${12 * scale}px "SF Mono", Menlo, Consolas, monospace`;
  ctx.fillText(`UPI ID: ${upiId}`, innerMarginX + innerWidth / 2, qrY + qrDisplaySize + 56 * scale);

  // 8. Draw Bottom Helper Text
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `500 ${12 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('Scan to pay with any UPI app', cardWidth / 2, cardHeight - 20 * scale);

  // Return PNG Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}
