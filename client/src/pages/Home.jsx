import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Brain, ShieldAlert, KeyRound, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between">
      {/* Hero section */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Google Gemini Generative AI</span>
        </div>

        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-100 max-w-4xl mx-auto leading-tight">
          Step Inside The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">AI Mystery Room</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Solve procedurally constructed, logically airtight detective cases. Interrogate suspects, inspect crime scene evidence, request encrypted hints, and expose the culprit before time runs out.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-wider text-sm transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 group"
          >
            <span>Launch New Case</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-semibold text-sm transition-all flex items-center justify-center"
          >
            How It Works
          </a>
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-left">
            <span className="text-2xl font-black text-amber-400 font-cinzel">3 Tiers</span>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Easy • Medium • Hard</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-left">
            <span className="text-2xl font-black text-amber-400 font-cinzel">100% Secure</span>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Backend Sealed Solution</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-left">
            <span className="text-2xl font-black text-amber-400 font-cinzel">Dynamic</span>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Infinite Custom Plots</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-left">
            <span className="text-2xl font-black text-amber-400 font-cinzel">Scored</span>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Strict Deductive Formula</p>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="border-t border-zinc-900 bg-[#0e0f18]/60 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-100">
              The Forensic Workflow
            </h2>
            <p className="text-zinc-400 text-sm mt-2">Engineered strictly against the official project build specification</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-100 mb-2">1. AI Case Generation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gemini constructs the victim background, time of incident, multiple suspects with competing motives, physical clues, and hidden red herrings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-100 mb-2">2. Investigation & Hints</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inspect crime scene zones to discover forensic clues (+5 pts each). When stuck, unlock hints at the cost of a calibrated penalty (-10 pts each).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-100 mb-2">3. Accusation & Verdict</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Single out the culprit. The backend unlocks the sequestered solution, validates your deduction, calculates your official score, and reveals the narrative.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80 py-6 px-4 text-center text-xs text-zinc-500 font-mono">
        AI Mystery Room • Full-Stack Vite + React + Node.js + Express + MongoDB + Gemini
      </footer>
    </div>
  );
}
