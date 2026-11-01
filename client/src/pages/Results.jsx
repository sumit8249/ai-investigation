import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseApi } from '../services/api';
import { Award, CheckCircle, XCircle, Sparkles, RotateCcw, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await caseApi.getResult(id);
      if (res && res.success) {
        setResult(res);
      } else {
        throw new Error('Case result not ready or unavailable.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to retrieve verdict.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-zinc-400">Deciphering verdict and scoring criteria...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-400 text-sm mb-4">{error || 'Result unavailable.'}</p>
        <Link to="/create" className="text-xs font-mono text-amber-400 underline">Start New Case</Link>
      </div>
    );
  }

  const { isCorrect, score, culprit, accusedSuspect, difficulty, title, playerProgress = {} } = result;
  
  // Calculate detective rank
  const getRank = (finalScore) => {
    if (finalScore >= 180) return { title: 'Chief Detective Inspector', color: 'text-amber-400', badge: '⭐⭐⭐' };
    if (finalScore >= 120) return { title: 'Senior Sleuth', color: 'text-emerald-400', badge: '⭐⭐' };
    if (finalScore >= 60) return { title: 'Field Investigator', color: 'text-blue-400', badge: '⭐' };
    return { title: 'Rookie Constable', color: 'text-zinc-400', badge: '🔰' };
  };

  const rank = getRank(score);
  const basePoints = isCorrect ? (difficulty === 'hard' ? 200 : difficulty === 'medium' ? 150 : 100) : 0;
  const cluePoints = (playerProgress.cluesDiscoveredCount || 0) * 5;
  const hintPenalties = (playerProgress.hintsUsedCount || 0) * 10;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Verdict Hero Card */}
      <div className={`p-8 rounded-3xl border text-center shadow-2xl relative overflow-hidden ${
        isCorrect 
          ? 'bg-gradient-to-b from-[#112419] to-[#0c120e] border-emerald-500/50 shadow-emerald-950/40' 
          : 'bg-gradient-to-b from-[#251014] to-[#120a0d] border-rose-500/50 shadow-rose-950/40'
      }`}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border shadow-inner">
          {isCorrect ? (
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          ) : (
            <XCircle className="w-12 h-12 text-rose-400" />
          )}
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 block mb-1">
          Official Case Verdict
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight">
          {isCorrect ? 'CASE SOLVED: JUSTICE SERVED' : 'CASE COLD: WRONG ACCUSATION'}
        </h1>

        <p className="text-zinc-300 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
          {isCorrect 
            ? `Brilliant deduction! You correctly identified ${culprit.name} as the perpetrator and substantiated the forensic trail.`
            : `Alas, you indicted ${accusedSuspect?.name || 'an innocent party'}. The real culprit was ${culprit.name}.`}
        </p>

        {/* Score & Rank Badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-mono uppercase">Final Score:</span>
            <span className="text-3xl font-black text-amber-400 font-cinzel">{score}</span>
            <span className="text-xs text-zinc-500 font-mono">PTS</span>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Rank Awarded</span>
              <span className={`text-xs font-bold font-cinzel ${rank.color}`}>{rank.title} {rank.badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown Table */}
      <div className="bg-[#12131e] border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-cinzel font-bold text-lg text-zinc-200 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Point Breakdown</span>
        </h3>

        <div className="divide-y divide-zinc-800/80 text-xs font-mono">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-zinc-400">
              Accusation Accuracy ({difficulty.toUpperCase()} tier: {isCorrect ? 'Correct' : 'Incorrect'}):
            </span>
            <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
              +{basePoints} pts
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-zinc-400">
              Forensic Clues Uncovered ({playerProgress.cluesDiscoveredCount || 0} discovered × 5):
            </span>
            <span className="text-emerald-400 font-bold">
              +{cluePoints} pts
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-zinc-400">
              Investigation Hints Utilized ({playerProgress.hintsUsedCount || 0} hints × -10):
            </span>
            <span className="text-rose-400 font-bold">
              -{hintPenalties} pts
            </span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm font-bold border-t-2 border-zinc-700">
            <span className="text-zinc-200 font-cinzel">Total Verified Score:</span>
            <span className="text-amber-400 text-lg">{score} pts</span>
          </div>
        </div>
      </div>

      {/* The Culprit's Confession / Forensic Explanation */}
      <div className="bg-[#12131e] border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <FileText className="w-5 h-5" />
          <h3 className="font-cinzel font-bold text-xl text-zinc-100">The Unvarnished Truth & Solution</h3>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Culprit Identified:</span>
            <span className="text-amber-400 font-bold text-sm">{culprit.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Culprit ID:</span>
            <span className="text-zinc-300">{culprit.id}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">
            Investigative Timeline & Deductive Chain:
          </span>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-950/40 p-5 rounded-xl border border-zinc-800/80">
            {culprit.explanation}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/create"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Investigate Another Case</span>
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center"
        >
          Return to HQ
        </Link>
      </div>
    </div>
  );
}
