import React, { useState } from 'react';
import { User, Eye, AlertTriangle, ShieldCheck, MessageSquare } from 'lucide-react';

export default function SuspectCard({ suspect, isSelected, onSelect, selectable }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className={`rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col ${
        isSelected 
          ? 'bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-950/50' 
          : 'bg-[#13141f]/80 border-zinc-800 hover:border-zinc-700 hover:bg-[#161824]'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-amber-400/90 shrink-0 font-cinzel text-lg font-bold">
          {suspect.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-100 truncate text-base">{suspect.name}</h3>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {suspect.id}
            </span>
          </div>
          <p className="text-xs text-amber-400/90 font-medium tracking-wide mt-0.5">{suspect.role}</p>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 space-y-3 text-xs leading-relaxed">
        <div>
          <span className="text-zinc-300 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Stated Alibi:
          </span>
          <p className="text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50 italic">
            "{suspect.alibi}"
          </p>
        </div>

        <div>
          <span className="text-amber-300 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Potential Motive:
          </span>
          <p className="text-zinc-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
            {suspect.motive}
          </p>
        </div>

        <div>
          <span className="text-rose-300 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-400" /> Inconsistency / Observation:
          </span>
          <p className="text-zinc-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
            {suspect.suspiciousDetail}
          </p>
        </div>
      </div>

      {/* Accusation select action */}
      {selectable && (
        <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 mt-auto">
          <button
            type="button"
            onClick={() => onSelect(suspect.id)}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-950'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
          >
            {isSelected ? '✓ Suspect Selected' : 'Select for Accusation'}
          </button>
        </div>
      )}
    </div>
  );
}
