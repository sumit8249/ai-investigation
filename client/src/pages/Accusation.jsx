import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../services/api';
import SuspectCard from '../components/SuspectCard';
import { ShieldAlert, AlertTriangle, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function Accusation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await caseApi.getCase(id);
      if (res && res.case) {
        setCaseData(res.case);
        if (res.case.playerProgress?.isAccused) {
          navigate(`/case/${id}/result`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load case.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccuse = async (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      alert('Please select a suspect to accuse.');
      return;
    }

    const confirmAccuse = window.confirm(
      'Are you confident in your deduction? Once submitted, the case file will close permanently and the true verdict will be unveiled.'
    );
    if (!confirmAccuse) return;

    try {
      setSubmitting(true);
      const res = await caseApi.submitAccusation(id, selectedSuspectId, notes);
      if (res && res.success) {
        navigate(`/case/${id}/result`);
      } else {
        throw new Error('Failed to record accusation.');
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error submitting accusation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-zinc-400">Summoning courtroom records...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-400 text-sm mb-4">{error || 'Case unavailable.'}</p>
        <Link to="/create" className="text-xs font-mono text-amber-400 underline">Start New Case</Link>
      </div>
    );
  }

  const { suspects = [] } = caseData;
  const selectedSuspect = suspects.find(s => s.id === selectedSuspectId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <button
          onClick={() => navigate(`/case/${id}`)}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Crime Scene</span>
        </button>
        <span className="font-mono text-xs text-amber-500/80 uppercase">
          Final Judgment Chamber
        </span>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-cinzel text-3xl md:text-4xl font-black text-zinc-100">
          Make Your Formal Accusation
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2">
          Review the suspects below and click to indict the individual whose alibi contradicts the forensic evidence.
        </p>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold">Irreversible Action:</span> Selecting a suspect will trigger the server-side verdict check, calculate your score, and reveal the true crime narrative.
        </div>
      </div>

      {/* Suspect Roster Selection */}
      <div className="space-y-4">
        <h3 className="font-cinzel font-bold text-lg text-zinc-200">
          Step 1: Select The Culprit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suspects.map(suspect => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              selectable={true}
              isSelected={selectedSuspectId === suspect.id}
              onSelect={(suspectId) => setSelectedSuspectId(suspectId)}
            />
          ))}
        </div>
      </div>

      {/* Rationale and Submit Section */}
      <form onSubmit={handleAccuse} className="bg-[#12131e] p-6 rounded-2xl border border-zinc-800 space-y-6">
        <div>
          <h3 className="font-cinzel font-bold text-lg text-zinc-200 mb-2">
            Step 2: State Your Deductive Rationale (Optional)
          </h3>
          <p className="text-xs text-zinc-400 mb-3 font-mono">
            How do the discovered clues connect to this suspect? State your forensic reasoning for the case archive.
          </p>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., The fiber evidence at the lock mechanism matches Elena's cardigan, and her alibi in the lab is refuted by the security terminal logs..."
            className="w-full bg-[#0a0a10] border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {selectedSuspect && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Indicting: <strong>{selectedSuspect.name}</strong> ({selectedSuspect.role})</span>
            </div>
            <span className="font-mono text-zinc-400">ID: {selectedSuspect.id}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedSuspectId || submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying With Backend Dossier...</span>
            </div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Seal Indictment & Reveal Verdict</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
