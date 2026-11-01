import express from 'express';
import Case from '../models/Case.js';
import { generateMysteryCase } from '../services/geminiService.js';

const router = express.Router();
export const memoryStore = new Map();

const DIFFICULTY_BASE_POINTS = { easy: 100, medium: 150, hard: 200 };

function getCase(id) {
  return memoryStore.get(id) || null;
}

router.post('/', async (req, res, next) => {
  try {
    const { premise, difficulty = 'medium' } = req.body;
    const generated = await generateMysteryCase(premise, difficulty);
    const caseId = 'case_' + Date.now();
    const caseDoc = { ...generated, _id: caseId, id: caseId };
    memoryStore.set(caseId, caseDoc);

    const publicCase = JSON.parse(JSON.stringify(caseDoc));
    delete publicCase.solution;
    publicCase.clues = publicCase.clues.map(c => ({ ...c, description: c.isDiscovered ? c.description : 'Inspect to uncover forensic analysis.' }));
    publicCase.hints = publicCase.hints.map(h => ({ ...h, text: h.isRevealed ? h.text : 'Encrypted hint.' }));

    res.status(201).json({ success: true, case: publicCase });
  } catch (err) { next(err); }
});

router.get('/:id', (req, res) => {
  const caseDoc = getCase(req.params.id);
  if (!caseDoc) return res.status(404).json({ error: 'Case not found' });

  const publicCase = JSON.parse(JSON.stringify(caseDoc));
  if (!publicCase.playerProgress.isAccused) delete publicCase.solution;
  publicCase.clues = publicCase.clues.map(c => ({ ...c, description: c.isDiscovered ? c.description : 'Inspect to uncover forensic analysis.' }));
  publicCase.hints = publicCase.hints.map(h => ({ ...h, text: h.isRevealed ? h.text : 'Encrypted hint.' }));

  res.json({ success: true, case: publicCase });
});

router.post('/:id/clues/:clueId/discover', (req, res) => {
  const caseDoc = getCase(req.params.id);
  if (!caseDoc) return res.status(404).json({ error: 'Case not found' });
  if (caseDoc.playerProgress.isAccused) return res.status(400).json({ error: 'Case is closed' });

  const clue = caseDoc.clues.find(c => c.id === req.params.clueId);
  if (!clue) return res.status(404).json({ error: 'Clue not found' });

  if (!clue.isDiscovered) {
    clue.isDiscovered = true;
    caseDoc.playerProgress.cluesDiscoveredCount++;
  }

  res.json({
    success: true,
    clue,
    playerProgress: { cluesDiscoveredCount: caseDoc.playerProgress.cluesDiscoveredCount, totalClues: caseDoc.clues.length }
  });
});

router.post('/:id/hints', (req, res) => {
  const caseDoc = getCase(req.params.id);
  if (!caseDoc) return res.status(404).json({ error: 'Case not found' });
  if (caseDoc.playerProgress.isAccused) return res.status(400).json({ error: 'Case is closed' });

  if (caseDoc.playerProgress.hintsUsedCount >= caseDoc.playerProgress.maxHints) {
    return res.status(400).json({ error: 'No hints remaining' });
  }

  const nextHint = caseDoc.hints.find(h => !h.isRevealed);
  if (!nextHint) return res.status(400).json({ error: 'No more hints available' });

  nextHint.isRevealed = true;
  caseDoc.playerProgress.hintsUsedCount++;

  res.json({
    success: true,
    hint: nextHint,
    hintsUsed: caseDoc.playerProgress.hintsUsedCount,
    hintsRemaining: caseDoc.playerProgress.maxHints - caseDoc.playerProgress.hintsUsedCount
  });
});

router.post('/:id/accuse', (req, res) => {
  const { suspectId, notes = '' } = req.body;
  const caseDoc = getCase(req.params.id);
  if (!caseDoc) return res.status(404).json({ error: 'Case not found' });
  if (caseDoc.playerProgress.isAccused) return res.status(400).json({ error: 'Case is already closed' });

  const isCorrect = (suspectId === caseDoc.solution.culpritId);
  const basePoints = isCorrect ? (DIFFICULTY_BASE_POINTS[caseDoc.difficulty] || 150) : 0;
  const cluePoints = caseDoc.playerProgress.cluesDiscoveredCount * 5;
  const hintPenalties = caseDoc.playerProgress.hintsUsedCount * 10;
  const finalScore = Math.max(0, basePoints + cluePoints - hintPenalties);

  caseDoc.playerProgress.isAccused = true;
  caseDoc.playerProgress.accusedSuspectId = suspectId;
  caseDoc.playerProgress.isCorrect = isCorrect;
  caseDoc.playerProgress.score = finalScore;
  caseDoc.playerProgress.notes = notes;

  const accused = caseDoc.suspects.find(s => s.id === suspectId);

  res.json({
    success: true,
    verdict: isCorrect ? 'SOLVED' : 'UNSOLVED',
    isCorrect,
    score: finalScore,
    scoreBreakdown: { basePoints, clueDiscoveryPoints: cluePoints, hintPenaltyPoints: hintPenalties, totalScore: finalScore },
    accusedSuspect: accused || { id: suspectId, name: 'Unknown' },
    culprit: {
      id: caseDoc.solution.culpritId,
      name: caseDoc.solution.culpritName,
      explanation: caseDoc.solution.fullExplanation
    }
  });
});

router.get('/:id/result', (req, res) => {
  const caseDoc = getCase(req.params.id);
  if (!caseDoc) return res.status(404).json({ error: 'Case not found' });
  if (!caseDoc.playerProgress.isAccused) return res.status(403).json({ error: 'Case is not yet accused' });

  const accused = caseDoc.suspects.find(s => s.id === caseDoc.playerProgress.accusedSuspectId);

  res.json({
    success: true,
    caseId: caseDoc._id,
    title: caseDoc.title,
    difficulty: caseDoc.difficulty,
    verdict: caseDoc.playerProgress.isCorrect ? 'SOLVED' : 'UNSOLVED',
    isCorrect: caseDoc.playerProgress.isCorrect,
    score: caseDoc.playerProgress.score,
    playerProgress: caseDoc.playerProgress,
    accusedSuspect: accused,
    culprit: {
      id: caseDoc.solution.culpritId,
      name: caseDoc.solution.culpritName,
      explanation: caseDoc.solution.fullExplanation
    }
  });
});

export default router;
