import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../services/api';
import SuspectCard from '../components/SuspectCard';
import ClueCard from '../components/ClueCard';
import HintModal from '../components/HintModal';
import { 
  ShieldAlert, Clock, MapPin, UserX, Lightbulb, 
  Search, ArrowRight, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';

export default function InvestigationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discoveringId, setDiscoveringId] = useState(null);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isRequestingHint, setIsRequestingHint] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'suspects', 'clues'

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await caseApi.getCase(id);
      if (response && response.case) {
        setCaseData(response.case);
        if (response.case.playerProgress?.isAccused) {
          navigate(`/case/${id}/result`);
        }
      } else {
        throw new Error('Case data not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Unable to load case file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringId(clueId);
      const res = await caseApi.discoverClue(id, clueId);
      if (res && res.clue) {
        setCaseData(prev => ({
          ...prev,
          clues: prev.clues.map(c => c.id === clueId ? { ...c, ...res.clue } : c),
          playerProgress: {
            ...prev.playerProgress,
            cluesDiscoveredCount: res.playerProgress?.cluesDiscoveredCount || (prev.playerProgress.cluesDiscoveredCount + 1)
          }
        }));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to inspect clue.');
    } finally {
      setDiscoveringId(null);
    }
  };

  const handleRequestHint = async () => {
    try {
      setIsRequestingHint(true);
      const res = await caseApi.requestHint(id);
      if (res && res.hint) {
        setCaseData(prev => ({
          ...prev,
          hints: prev.hints.map(h => h.id === res.hint.id ? { ...h, ...res.hint } : h),
          playerProgress: {
            ...prev.playerProgress,
            hintsUsedCount: res.hintsUsed
          }
        }));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to unlock hint.');
    } finally {
      setIsRequestingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-zinc-400">Opening secure case archives...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="font-cinzel text-xl font-bold text-zinc-100">Archive Retrieval Failure</h2>
        <p className="text-xs text-zinc-400 mt-2 mb-6">{error || 'Case file does not exist.'}</p>
        <Link to="/create" className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-xs uppercase">
          Create Fresh Mystery
        </Link>
      </div>
    );
  }

  const { story, suspects = [], clues = [], hints = [], playerProgress = {} } = caseData;
  const discoveredCluesCount = clues.filter(c => c.isDiscovered).length;
  const hintsUsedCount = playerProgress.hintsUsedCount || 0;
  const maxHints = playerProgress.maxHints || hints.length;
  const hintsRemaining = Math.max(0, maxHints - hintsUsedCount);

  // Projected clues bonus
  const cluePoints = discoveredCluesCount * 5;
  const hintPenalties = hintsUsedCount * 10;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-8 space-y-8">
      {/* Case Header Card */}
      <div className="bg-[#12131e]/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                CASE #{caseData._id ? caseData._id.toString().slice(-6) : 'ARCHIVE'}
              </span>
              <span className={`font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                caseData.difficulty === 'hard' 
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800/40' 
                  : caseData.difficulty === 'medium'
                    ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
              }`}>
                {caseData.difficulty}
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-zinc-100">{caseData.title}</h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsHintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-900/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Hints ({hintsRemaining} Left)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/case/${id}/accuse`)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
            >
              <span>Accuse Suspect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story & Incident Dossier */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase text-amber-400 tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Incident Synopsis
              </h3>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed bg-[#0a0a10]/60 p-4 rounded-xl border border-zinc-800/80 font-mono">
                {story.incidentSummary}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-mono">Setting / Scene</span>
                  <span className="text-zinc-200 font-medium truncate block">{story.setting}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-mono">Incident Time</span>
                  <span className="text-zinc-200 font-medium truncate block">{story.timeOfCrime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investigation Stats */}
          <div className="bg-[#0b0c14] p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-3">
                Investigative Scorecard
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Clues Discovered:</span>
                  <span className="font-mono text-zinc-200 font-semibold">{discoveredCluesCount} / {clues.length} (+{cluePoints} pts)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Hints Requested:</span>
                  <span className="font-mono text-rose-400 font-semibold">{hintsUsedCount} used (-{hintPenalties} pts)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Correct Accusation Award:</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    +{caseData.difficulty === 'hard' ? 200 : caseData.difficulty === 'medium' ? 150 : 100} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono italic">
              * The culprit and solution are cryptographically locked on the server until formal accusation.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          All Dossiers ({suspects.length + clues.length})
        </button>
        <button
          onClick={() => setActiveTab('suspects')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'suspects' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          Suspects ({suspects.length})
        </button>
        <button
          onClick={() => setActiveTab('clues')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'clues' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          Forensic Clues ({discoveredCluesCount}/{clues.length})
        </button>
      </div>

      {/* Suspects Section */}
      {(activeTab === 'all' || activeTab === 'suspects') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-xl font-bold text-zinc-100 flex items-center gap-2">
              <UserX className="w-5 h-5 text-amber-400" />
              <span>Suspect Roster ({suspects.length})</span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Review alibis and inconsistencies carefully</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suspects.map(suspect => (
              <SuspectCard key={suspect.id} suspect={suspect} selectable={false} />
            ))}
          </div>
        </div>
      )}

      {/* Clues Section */}
      {(activeTab === 'all' || activeTab === 'clues') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>Forensic Clues & Crime Scene Evidence ({clues.length})</span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Inspect each location to discover forensic trace</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clues.map(clue => (
              <ClueCard 
                key={clue.id} 
                clue={clue} 
                onDiscover={handleDiscoverClue} 
                isDiscovering={discoveringId === clue.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Bar */}
      <div className="sticky bottom-4 bg-[#0e0f18]/95 backdrop-blur border border-amber-900/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">Ready to Close the Case?</h4>
            <p className="text-[11px] text-zinc-400 font-mono">Assemble your deduction and name the true culprit.</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/case/${id}/accuse`)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950 transition-all shrink-0"
        >
          <span>Submit Final Accusation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={hints}
        hintsRemaining={hintsRemaining}
        hintsUsed={hintsUsedCount}
        onRequestHint={handleRequestHint}
        isRequesting={isRequestingHint}
      />
    </div>
  );
}
