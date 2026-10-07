// UPI Protocol Builder and Helper Utilities

export const UPI_LOGOS = {
  rakexura: {
    id: 'rakexura',
    name: 'Rakexura Official',
    dataUrl: '/logos/rakexura-logo-256.png'
  },
  rakexuraShield: {
    id: 'rakexuraShield',
    name: 'Rakexura Shield',
    dataUrl: '/logos/rakexura-shield-256.png'
  },
  gpayRibbon: {
    id: 'gpayRibbon',
    name: 'Google Pay Ribbon',
    dataUrl: '/logos/google-pay-ribbon.png'
  },
  bhim: {
    id: 'bhim',
    name: 'BHIM UPI',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%23ffffff"/><path d="M30 75L50 25L70 75L50 63L30 75Z" fill="%23097938"/><path d="M50 25L70 75L50 63V25Z" fill="%23ed7524"/></svg>'
  },
  phonepe: {
    id: 'phonepe',
    name: 'PhonePe',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%235f259f"/><circle cx="50" cy="50" r="32" fill="%23ffffff"/><path d="M58 35C48 35 40 43 40 53C40 60 44 66 50 69V75H56V69C62 67 66 60 66 53C66 43 58 35 58 35ZM53 63C47 63 43 59 43 53C43 47 47 43 53 43C59 43 63 47 63 53C63 59 59 63 53 63Z" fill="%235f259f"/></svg>'
  },
  paytm: {
    id: 'paytm',
    name: 'Paytm',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%2300b9f5"/><path d="M22 45H34V65H22V45ZM40 35H52V65H40V35ZM58 52H70V65H58V52ZM76 40H88V65H76V40Z" fill="%23ffffff"/></svg>'
  },
  none: {
    id: 'none',
    name: 'None (Plain QR)',
    dataUrl: null
  }
};

export const COLOR_THEMES = [
  {
    id: 'cyber-violet',
    name: 'Cyber Violet',
    badge: 'Signature',
    bg: '#090a12',
    dotColor1: '#8b5cf6',
    dotColor2: '#c299ff',
    cornerSquare: '#a78bfa',
    cornerDot: '#c299ff',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'fintech-emerald',
    name: 'Emerald UPI',
    badge: 'Popular',
    bg: '#06130d',
    dotColor1: '#00d68f',
    dotColor2: '#25d366',
    cornerSquare: '#00d68f',
    cornerDot: '#58e98d',
    glow: 'rgba(0, 214, 143, 0.4)',
  },
  {
    id: 'imperial-gold',
    name: 'Imperial Gold',
    badge: 'Luxury',
    bg: '#140f06',
    dotColor1: '#facc15',
    dotColor2: '#f59e0b',
    cornerSquare: '#facc15',
    cornerDot: '#fde047',
    glow: 'rgba(250, 204, 21, 0.4)',
  },
  {
    id: 'nopan-cobalt',
    name: 'Cobalt Horizon',
    badge: 'Fintech',
    bg: '#060d19',
    dotColor1: '#237bf6',
    dotColor2: '#60a5fa',
    cornerSquare: '#3b82f6',
    cornerDot: '#93c5fd',
    glow: 'rgba(35, 123, 246, 0.4)',
  },
  {
    id: 'classic-white',
    name: 'Merchant Counter',
    badge: 'Print Friendly',
    bg: '#ffffff',
    dotColor1: '#111827',
    dotColor2: '#000000',
    cornerSquare: '#111827',
    cornerDot: '#374151',
    glow: 'rgba(0, 0, 0, 0.1)',
  }
];

export const DOT_STYLES = [
  { id: 'rounded', label: 'Smooth Squircle' },
  { id: 'dots', label: 'Classy Dots' },
  { id: 'classy-rounded', label: 'Tech Rounded' },
  { id: 'square', label: 'Crisp Standard' },
];

export const CORNER_STYLES = [
  { id: 'extra-rounded', label: 'Soft Pill' },
  { id: 'dot', label: 'Circle Eye' },
  { id: 'square', label: 'Solid Box' },
];

/**
 * Builds the official NPCI UPI Deep Link specification URL
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
 */
export function buildUpiUrl({ upiId, payeeName, amount, note, refId }) {
  if (!upiId) return '';
  
  const params = new URLSearchParams();
  params.append('pa', upiId.trim());
  
  if (payeeName && payeeName.trim()) {
    params.append('pn', payeeName.trim());
  }
  
  if (amount && Number(amount) > 0) {
    // Format to 2 decimal places as required by banking gateways
    params.append('am', Number(amount).toFixed(2));
  }
  
  params.append('cu', 'INR');
  
  if (note && note.trim()) {
    params.append('tn', note.trim());
  }
  
  if (refId && refId.trim()) {
    params.append('tr', refId.trim());
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Validates UPI VPA format (e.g., name@bank, phone@upi)
 */
export function isValidUpiId(id) {
  if (!id) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(id.trim());
}

/**
 * Converts numeric Rupees to English Words (Indian numbering format)
 */
export function numberToIndianRupeesWords(num) {
  if (!num || isNaN(num) || num <= 0) return '';
  
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
             'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  }

  const [rupees, paise] = Number(num).toFixed(2).split('.');
  let result = inWords(parseInt(rupees)).trim();
  
  if (result) {
    result += ' Rupees';
  }
  
  if (parseInt(paise) > 0) {
    const paiseWords = inWords(parseInt(paise)).trim();
    result += (result ? ' and ' : '') + paiseWords + ' Paise';
  }
  
  return result ? `${result} Only` : '';
}
