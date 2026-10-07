import React, { useState } from 'react';
import { AtSign, User, FileText, BookmarkPlus, Check, Trash2, Dices, AlertCircle } from 'lucide-react';
import { isValidUpiId } from '../utils/upi';

export default function UpiConfig({
  upiId,
  setUpiId,
  payeeName,
  setPayeeName,
  note,
  setNote,
  refId,
  setRefId,
  savedProfiles,
  onSaveProfile,
  onDeleteProfile
}) {
  const [profileLabel, setProfileLabel] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const isUpiValid = isValidUpiId(upiId);

  const generateRandomRef = () => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    setRefId(`RKX-${timestamp}-${randomHex}`);
  };

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (!profileLabel.trim() || !upiId.trim()) return;
    onSaveProfile({
      id: Date.now().toString(),
      label: profileLabel.trim(),
      upiId: upiId.trim(),
      payeeName: payeeName.trim()
    });
    setProfileLabel('');
    setShowSaveModal(false);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <AtSign className="w-3.5 h-3.5 text-upi-green" />
          <span>Payee VPA & Profile</span>
        </label>

        {savedProfiles && savedProfiles.length > 0 && (
          <span className="text-[11px] text-text-muted font-medium">
            {savedProfiles.length} saved accounts
          </span>
        )}
      </div>

      {/* Quick Saved Accounts Chips */}
      {savedProfiles && savedProfiles.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {savedProfiles.map((p) => {
            const isActive = upiId.toLowerCase() === p.upiId.toLowerCase();
            return (
              <div
                key={p.id}
                className={`group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-upi-green/15 text-upi-green border-upi-green/30 shadow-glow-upi'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setUpiId(p.upiId);
                    if (p.payeeName) setPayeeName(p.payeeName);
                  }}
                  className="flex items-center gap-1"
                >
                  <span>{p.label}</span>
                  <span className="text-[10px] opacity-60 font-mono">({p.upiId.split('@')[0]})</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(p.id);
                  }}
                  title="Remove profile"
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main UPI ID Input */}
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <AtSign className="w-4 h-4 text-upi-green" />
          </div>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. rakeshkanna@oksbi or 9876543210@paytm"
            className={`w-full pl-10 pr-24 py-3 bg-black/40 border rounded-xl text-sm font-bold text-white placeholder:text-text-muted/40 focus:outline-none transition-all font-mono ${
              upiId
                ? isUpiValid
                  ? 'border-upi-green/50 focus:border-upi-green focus:ring-2 focus:ring-upi-green/20'
                  : 'border-amber-500/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {isUpiValid ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-upi-green bg-upi-green/15 px-2 py-0.5 rounded-md border border-upi-green/20">
                <Check className="w-3 h-3" /> Valid
              </span>
            ) : upiId ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                <AlertCircle className="w-3 h-3" /> Check
              </span>
            ) : null}

            {upiId && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                title="Save this UPI ID"
                className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
              >
                <BookmarkPlus className="w-4 h-4 text-accent" />
              </button>
            )}
          </div>
        </div>

        {!isUpiValid && upiId && (
          <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> UPI ID should look like `username@bank` (e.g. @oksbi, @ybl, @upi, @okaxis).
          </p>
        )}
      </div>

      {/* Save Profile Inline Box */}
      {showSaveModal && (
        <form onSubmit={handleSaveCurrent} className="p-3 bg-primary/10 border border-primary/20 rounded-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent">Save to Quick Accounts</span>
            <button
              type="button"
              onClick={() => setShowSaveModal(false)}
              className="text-[11px] text-text-muted hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={profileLabel}
              onChange={(e) => setProfileLabel(e.target.value)}
              placeholder="Nickname (e.g. My Business, SBI Current, Store)"
              className="flex-1 px-3 py-1.5 text-xs bg-black/60 border border-white/10 rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Payee Name & Transaction Note Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        
        {/* Payee Name */}
        <div>
          <label className="text-[11px] font-bold text-text-muted block mb-1.5 flex items-center gap-1">
            <User className="w-3 h-3 text-accent" /> Payee / Merchant Name
          </label>
          <input
            type="text"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            placeholder="e.g. Rakexura Store"
            className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-text-muted/40 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Transaction Note */}
        <div>
          <label className="text-[11px] font-bold text-text-muted block mb-1.5 flex items-center gap-1">
            <FileText className="w-3 h-3 text-gold" /> Transaction Note / Bill
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Game License #RKX"
            className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-text-muted/40 focus:outline-none focus:border-accent"
          />
        </div>

      </div>

      {/* Optional Reference ID Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold text-text-muted">
            Order / Transaction Ref (Optional)
          </label>
          <button
            type="button"
            onClick={generateRandomRef}
            className="text-[10px] text-accent hover:underline flex items-center gap-1"
          >
            <Dices className="w-3 h-3" /> Auto Generate ID
          </button>
        </div>
        <input
          type="text"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          placeholder="Leave blank or use custom reference"
          className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/5 rounded-xl text-text-muted font-mono focus:text-white focus:outline-none focus:border-accent"
        />
      </div>

    </div>
  );
}
