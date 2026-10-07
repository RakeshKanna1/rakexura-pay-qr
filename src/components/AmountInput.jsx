import React from 'react';
import { IndianRupee, X, AlertCircle } from 'lucide-react';
import { numberToIndianRupeesWords } from '../utils/upi';

export default function AmountInput({ amount, setAmount, isDark = false }) {
  const words = numberToIndianRupeesWords(amount);
  const numVal = Number(amount);
  const isZeroOrNegative = amount !== '' && (!isNaN(numVal) && numVal < 1);

  return (
    <div
      className={`w-full max-w-[340px] sm:max-w-[380px] mx-auto p-3.5 sm:p-6 rounded-[22px] sm:rounded-[28px] border transition-colors space-y-2.5 sm:space-y-3 ${
        isDark
          ? 'bg-[#121824] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white'
          : 'bg-white border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-slate-900'
      }`}
    >
      {/* Price Input Header */}
      <div className="flex items-center justify-between">
        <label
          className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <IndianRupee className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span>Enter Price</span>
        </label>
        
        {amount && (
          <button
            type="button"
            onClick={() => setAmount('')}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
            }`}
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Main Currency Input Box */}
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-xl sm:text-3xl font-black transition-colors ${
            isZeroOrNegative
              ? 'text-amber-500'
              : isDark
              ? 'text-slate-500 group-focus-within:text-blue-400'
              : 'text-slate-400 group-focus-within:text-blue-600'
          }`}
        >
          ₹
        </div>
        <input
          type="number"
          min="1"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={`w-full min-w-0 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-xl sm:text-3xl font-black tracking-tight border font-mono transition-all focus:outline-none focus:ring-4 ${
            isZeroOrNegative
              ? 'border-amber-500/70 focus:border-amber-500 focus:ring-amber-500/15'
              : isDark
              ? 'bg-[#0c1019] border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/10'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-600 focus:ring-blue-500/10'
          }`}
        />
      </div>

      {/* Validation Message or Words Confirmation */}
      {isZeroOrNegative ? (
        <p className="text-[11px] sm:text-xs font-semibold text-amber-500 pt-0.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Minimum payment amount is ₹1</span>
        </p>
      ) : words ? (
        <p className={`text-[11px] sm:text-xs font-medium truncate pt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {words}
        </p>
      ) : null}
    </div>
  );
}
