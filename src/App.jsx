import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import AmountInput from './components/AmountInput';
import DeviceQrCard from './components/DeviceQrCard';
import { buildUpiUrl } from './utils/upi';

export default function App() {
  // Amount State (empty by default so user enters fresh amount)
  const [amount, setAmount] = useState('');

  // Dark Theme State (persisted & synced with documentElement)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rakexura_theme');
      if (saved) return saved === 'dark';
      return false;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('rakexura_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('rakexura_theme', 'light');
    }
  }, [isDark]);

  // Static user config matching the WhatsApp image
  const upiId = '12k21rakeshkannam@oksbi';
  const payeeName = 'Rakexura';
  const activeLogoUrl = '/logos/rakexura-logo-256.png'; // Rakexura logo in QR center (no GPay, no sparkles)

  // NPCI UPI Deep Link
  const upiUrl = buildUpiUrl({
    upiId,
    payeeName,
    amount,
  });

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#0c1017] text-white' : 'bg-[#f4f6fa] text-slate-900'
      } flex flex-col font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white`}
    >
      {/* Simple, Clean Header */}
      <header
        className={`w-full border-b transition-colors py-2 sm:py-3 ${
          isDark
            ? 'bg-[#121824]/90 border-slate-800 text-white'
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}
      >
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo & Clean Title */}
          <div className="flex items-center gap-2">
            <img
              src="/logos/rakexura-logo-256.png"
              alt="Rakexura"
              className="w-7 h-7 rounded-lg object-contain border border-slate-200 dark:border-slate-700/80 p-0.5 bg-white dark:bg-slate-900 shadow-2xs shrink-0"
            />
            <span className="text-sm font-bold tracking-tight">Rakexura PayQR</span>
          </div>

          {/* Simple Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all active:scale-95 shrink-0 ${
              isDark
                ? 'bg-[#151c2a] hover:bg-slate-800 border-slate-700/80 text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </header>

      {/* Main Focus Workspace: Side-by-Side on PC & Stacked on Mobile */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 py-2.5 sm:py-8 md:py-10 flex flex-col justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 md:gap-8 items-center md:items-start justify-items-center">
          
          {/* 1. Price Putting Box */}
          <div className="w-full flex justify-center">
            <AmountInput
              amount={amount}
              setAmount={setAmount}
              isDark={isDark}
            />
          </div>

          {/* 2. Customer QR Card */}
          <div className="w-full flex justify-center">
            <DeviceQrCard
              upiUrl={upiUrl}
              amount={amount}
              upiId={upiId}
              payeeName={payeeName}
              logoUrl={activeLogoUrl}
              isDark={isDark}
            />
          </div>

        </div>
      </main>

      {/* Simple Minimal Footer */}
      <footer
        className={`w-full py-2.5 sm:py-3.5 text-center text-xs transition-colors px-4 ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        <p className="max-w-xs sm:max-w-md mx-auto break-words leading-relaxed">
          <span>Rakexura PayQR &bull; </span>
          <span>Settlement to <span className="font-mono">{upiId}</span></span>
        </p>
      </footer>

    </div>
  );
}
