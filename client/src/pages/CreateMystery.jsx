import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseApi } from '../services/api';
import { Sparkles, Shield, AlertCircle, Compass, Zap, Flame } from 'lucide-react';

const PRESETS = [
  {
    title: "The Stolen Ravencrest Astrolabe",
    premise: "A prized 14th-century gilded astrolabe disappears from a locked guild vault during an upscale charity gala.",
    genre: "Classic Victorian Heist"
  },
  {
    title: "The Neo-Tokyo Biotech Sabotage",
    premise: "The lead researcher of a neural-interface laboratory is discovered trapped in the cryo-cleanroom after hours.",
    genre: "Cyberpunk Noir"
  },
  {
    title: "The Orient Alpine Express Poisoning",
    premise: "A reclusive gemstone magnate collapses over dinner while the passenger train is snowbound in a mountain pass.",
    genre: "Locked-Room Train Mystery"
  },
  {
    title: "The Midnight Gallery Arson",
    premise: "A priceless Renaissance portrait is replaced by an ash counterfeit moments before an international collector auction.",
    genre: "High-Stakes Art Theft"
  }
];

export default function CreateMystery() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!premise.trim()) {
      setError('Please provide a mystery premise or pick one of the case presets below.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setLoadingStep('Calling Gemini AI mystery architect...');
      
      const timer1 = setTimeout(() => setLoadingStep('Drafting suspect motives and alibis...'), 1200);
      const timer2 = setTimeout(() => setLoadingStep('Hiding forensic clues and securing backend solution...'), 2400);

      const response = await caseApi.createCase(premise, difficulty);
      
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (response && response.case && (response.case._id || response.case.id)) {
        const caseId = response.case._id || response.case.id;
        navigate(`/case/${caseId}`);
      } else {
        throw new Error('Invalid case response payload from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to generate mystery case. Ensure server is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-zinc-100">
          Commission A New Case
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl mx-auto">
          Set the scene for your next investigation. Google Gemini will generate the narrative, suspects, and forensic evidence.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-[#12131e]/90 p-6 md:p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        {/* Premise Input */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Mystery Premise / Core Crime Scenario
          </label>
          <textarea
            rows={4}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder="Describe the crime scene, setting, victim, or incident (e.g., 'A rare diamond is stolen from an art collector's penthouse during a thunderstorm...')"
            className="w-full bg-[#0a0a10] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono leading-relaxed"
            disabled={loading}
          />

          {/* Preset Buttons */}
          <div className="mt-3">
            <span className="text-[11px] font-mono text-zinc-500 block mb-2">Quick Presets:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPremise(p.premise)}
                  className="text-left p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-amber-900/40 transition-all group"
                >
                  <span className="text-[10px] font-mono text-amber-400/80 block uppercase">{p.genre}</span>
                  <span className="text-xs text-zinc-300 font-medium group-hover:text-amber-200 line-clamp-1">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
            Investigation Difficulty Tier
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Easy */}
            <div
              onClick={() => setDifficulty('easy')}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                difficulty === 'easy'
                  ? 'bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Easy
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  100 Base Pts
                </span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                <li>• 3 Suspects</li>
                <li>• 5 Forensic Clues</li>
                <li>• 2 Guided Hints</li>
              </ul>
            </div>

            {/* Medium */}
            <div
              onClick={() => setDifficulty('medium')}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                difficulty === 'medium'
                  ? 'bg-amber-950/20 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/30'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Medium
                </span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                  150 Base Pts
                </span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                <li>• 4 Suspects</li>
                <li>• 7 Forensic Clues</li>
                <li>• 3 Guided Hints</li>
              </ul>
            </div>

            {/* Hard */}
            <div
              onClick={() => setDifficulty('hard')}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                difficulty === 'hard'
                  ? 'bg-rose-950/20 border-rose-500/80 ring-1 ring-rose-500/40 shadow-lg shadow-rose-950/30'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel font-bold text-rose-400 text-sm flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Hard
                </span>
                <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
                  200 Base Pts
                </span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                <li>• 5 Suspects</li>
                <li>• 9 Forensic Clues</li>
                <li>• 3 Guided Hints</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-wider text-sm transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>{loadingStep || 'Synthesizing Case File...'}</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Case File</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
