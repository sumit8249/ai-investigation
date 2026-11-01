import React from 'react';
import { Search, MapPin, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function ClueCard({ clue, onDiscover, isDiscovering }) {
  const isDiscovered = clue.isDiscovered;

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
      isDiscovered 
        ? 'bg-[#151724] border-emerald-500/40 shadow-lg shadow-emerald-950/20' 
        : 'bg-[#11121c]/90 border-zinc-800 hover:border-amber-600/50'
    }`}>
      <div className="p-4 flex items-start justify-between gap-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isDiscovered 
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
          }`}>
            {isDiscovered ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-semibold text-zinc-100 text-sm leading-snug">{clue.title}</h4>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>{clue.location}</span>
            </div>
          </div>
        </div>
        
        {isDiscovered && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
            +5 PTS
          </span>
        )}
      </div>

      <div className="p-4">
        {isDiscovered ? (
          <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/80">
            {clue.description}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 italic">
              Forensic evidence hidden at this location. Inspect to uncover forensic analysis.
            </p>
            <button
              type="button"
              onClick={() => onDiscover(clue.id)}
              disabled={isDiscovering}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-amber-600 hover:text-black text-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-zinc-700 hover:border-amber-500"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isDiscovering ? 'Analyzing Scene...' : 'Inspect Clue (+5 pts)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
