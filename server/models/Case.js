import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  suspiciousDetail: { type: String, required: true }
}, { _id: false });

const clueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  isDiscovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null }
}, { _id: false });

const hintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: true },
  text: { type: String, required: true },
  isRevealed: { type: Boolean, default: false }
}, { _id: false });

const solutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true, select: false },
  culpritName: { type: String, required: true, select: false },
  fullExplanation: { type: String, required: true, select: false },
  keyEvidence: [{ type: String, select: false }]
}, { _id: false });

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  story: {
    setting: String,
    victim: String,
    incidentSummary: String,
    timeOfCrime: String
  },
  suspects: [suspectSchema],
  clues: [clueSchema],
  hints: [hintSchema],
  solution: { type: solutionSchema, required: true, select: false },
  playerProgress: {
    cluesDiscoveredCount: { type: Number, default: 0 },
    hintsUsedCount: { type: Number, default: 0 },
    maxHints: { type: Number, default: 3 },
    isAccused: { type: Boolean, default: false },
    accusedSuspectId: { type: String, default: null },
    isCorrect: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Case = mongoose.models.Case || mongoose.model('Case', caseSchema);
export default Case;
