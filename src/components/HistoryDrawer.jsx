import React from 'react';
import { X, Clock, Trash2, ArrowRight, IndianRupee, Sparkles } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0d0f17] border-l border-white/10 p-6 flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <h3 className="text-base font-black text-white">Generated Bills History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-16 text-text-muted space-y-2">
              <Sparkles className="w-8 h-8 text-primary mx-auto opacity-40" />
              <p className="text-sm font-semibold text-white/70">No generated bills yet</p>
              <p className="text-xs">Any amount or UPI ID you enter will be saved here automatically.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/40 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-base font-black text-white">
                      <IndianRupee className="w-3.5 h-3.5 text-accent" />
                      <span>{item.amount ? Number(item.amount).toLocaleString('en-IN') : 'Open Amount'}</span>
                    </div>
                    <p className="text-xs font-medium text-text-muted mt-0.5 truncate max-w-[200px]">
                      {item.payeeName || item.upiId}
                    </p>
                  </div>

                  <span className="text-[10px] text-text-muted font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {item.note && (
                  <div className="mt-2 text-[11px] text-accent/80 font-medium truncate">
                    Note: {item.note}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted font-mono pt-2 border-t border-white/5">
                  <span className="truncate max-w-[180px]">{item.upiId}</span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                    Load <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {history.length} recent {history.length === 1 ? 'bill' : 'bills'}
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
