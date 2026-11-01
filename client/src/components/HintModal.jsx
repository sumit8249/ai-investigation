import React from 'react';
import { Lightbulb, AlertOctagon, X, Sparkles } from 'lucide-react';

export default function HintModal({ isOpen, onClose, hints, hintsRemaining, hintsUsed, onRequestHint, isRequesting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12131d] border border-amber-900/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl shadow-black">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2 text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-cinzel font-bold text-base text-zinc-100">Investigative Hints Dossier</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-amber-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Each unlocked hint applies a <strong>-10 point</strong> penalty to your final score.</span>
            </div>
            <span className="font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-amber-400 shrink-0">
              {hintsRemaining} remaining
            </span>
          </div>

          <div className="space-y-3">
            {hints.map((hint, idx) => (
              <div 
                key={hint.id || idx}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  hint.isRevealed 
                    ? 'bg-zinc-900/90 border-amber-500/40 text-zinc-200' 
                    : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                  <span className={hint.isRevealed ? 'text-amber-400 font-bold' : 'text-zinc-600'}>
                    Hint #{hint.order || idx + 1}
                  </span>
                  <span className="text-[10px] uppercase">
                    {hint.isRevealed ? 'Unlocked' : 'Encrypted'}
                  </span>
                </div>
                <p className={hint.isRevealed ? 'text-zinc-200' : 'text-zinc-600 italic'}>
                  {hint.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            Close
          </button>

          {hintsRemaining > 0 ? (
            <button
              type="button"
              onClick={onRequestHint}
              disabled={isRequesting}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRequesting ? 'Decrypting Hint...' : 'Request Hint (-10 pts)'}</span>
            </button>
          ) : (
            <span className="text-xs text-zinc-500 font-mono">No hints remaining</span>
          )}
        </div>
      </div>
    </div>
  );
}
