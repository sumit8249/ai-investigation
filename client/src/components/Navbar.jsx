import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShieldAlert, FileText, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b border-amber-900/30 bg-[#0c0d14]/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-lg shadow-amber-950/40">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-lg font-bold tracking-wider text-amber-100 group-hover:text-amber-400 transition-colors">
                AI MYSTERY ROOM
              </span>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase">
                Gemini v1.5
              </span>
            </div>
            <p className="text-xs text-zinc-400 tracking-wide font-mono">Deductive Crime Simulator</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/create"
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-900/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Mystery</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
