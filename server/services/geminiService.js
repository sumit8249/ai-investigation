import { z } from 'zod';

export const MysteryCaseSchema = z.object({
  title: z.string().min(3),
  story: z.object({
    setting: z.string(),
    victim: z.string(),
    incidentSummary: z.string(),
    timeOfCrime: z.string()
  }),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    alibi: z.string(),
    motive: z.string(),
    suspiciousDetail: z.string()
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    description: z.string(),
    isDiscovered: z.boolean().default(false)
  })),
  hints: z.array(z.object({
    id: z.string(),
    order: z.number(),
    text: z.string(),
    isRevealed: z.boolean().default(false)
  })),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    fullExplanation: z.string(),
    keyEvidence: z.array(z.string())
  })
});

const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, clues: 5, hints: 2, basePoints: 100 },
  medium: { suspects: 4, clues: 7, hints: 3, basePoints: 150 },
  hard: { suspects: 5, clues: 9, hints: 3, basePoints: 200 }
};

export async function generateMysteryCase(premise, difficulty = 'medium') {
  const diff = difficulty.toLowerCase();
  const config = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 15) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a fair-play mystery case JSON for premise "${premise}", difficulty ${diff}. Exactly ${config.suspects} suspects, ${config.clues} clues, ${config.hints} hints.` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        return { ...MysteryCaseSchema.parse(parsed), difficulty: diff, playerProgress: { cluesDiscoveredCount: 0, hintsUsedCount: 0, maxHints: config.hints, isAccused: false, score: 0 } };
      }
    } catch (e) {
      console.warn('Gemini API call failed, using procedural fallback:', e.message);
    }
  }

  // Procedural generator fallback
  return generateProceduralMystery(premise, diff, config);
}

function generateProceduralMystery(userPremise, diff, config) {
  const suspectsPool = [
    { id: "suspect-1", name: "Elena Rostova", role: "Senior Conservator", alibi: "Cataloging restoration chemicals in the lab.", motive: "Facing debt collection demands from auction creditors.", suspiciousDetail: "Traces of rare brass-dissolving solvent detected on her cuffs." },
    { id: "suspect-2", name: "Marcus Thorne", role: "Head of Facility Security", alibi: "Patrolling outer perimeter gardens.", motive: "Recently passed over for directorship.", suspiciousDetail: "Security camera 4B was placed on a loop at 10:50 PM." },
    { id: "suspect-3", name: "Dr. Arthur Pendelton", role: "Visiting Historian", alibi: "Resting in guest quarters with door locked.", motive: "Controversial claim that artifact belongs to his museum.", suspiciousDetail: "Wet footprint impressions matching his Italian loafers near ventilation." },
    { id: "suspect-4", name: "Beatrix Sinclair", role: "Gala Benefactor", alibi: "Mingling with high-profile donors in ballroom.", motive: "Private collector syndicate ties.", suspiciousDetail: "Disappeared from gala for 25 minutes claiming a migraine." },
    { id: "suspect-5", name: "Jonah Reed", role: "Janitorial Supervisor", alibi: "Disposing of gala recycling cartons.", motive: "Critical family debt obligations.", suspiciousDetail: "Seen hauling heavy canvas sack near service exit." }
  ];

  const cluesPool = [
    { id: "clue-1", title: "Looped Security Terminal", location: "Security Operations Room", description: "Camera feed 4B frozen on a 15-minute loop starting at 10:50 PM." },
    { id: "clue-2", title: "Dissolved Tumbler Mechanism", location: "Vault Showcase Door", description: "Specialized brass-cutting solvent was directly injected into the lock tumbler." },
    { id: "clue-3", title: "Blue Cashmere Thread", location: "Showcase Latch", description: "Microscopic blue cashmere fibers caught inside the lock plate." },
    { id: "clue-4", title: "Sub-Level Keycard Swipe", location: "Service Elevator Door", description: "Master conservator badge swiped into lower vault corridor at 10:48 PM." },
    { id: "clue-5", title: "Final Debt Notice", location: "Conservator Office Desk", description: "Legal foreclosure letter addressed to Elena Rostova demanding payment by week's end." },
    { id: "clue-6", title: "Muddy Loafer Impression", location: "Courtyard Intake Grate", description: "Herringbone tread pattern impressed into damp flowerbed clay." },
    { id: "clue-7", title: "Discarded Solvent Vial", location: "Waste Chute B-3", description: "Glass vial wrapped in monogrammed silk, containing industrial restoration solvent." },
    { id: "clue-8", title: "Anonymous Encrypted Pager", location: "Staff Wardrobe", description: "Received SMS: 'Courier is stationed at rear pier. Move before midnight.'" },
    { id: "clue-9", title: "Sedative Needle Wrapper", location: "Archivist Office Carpet", description: "Packaging of fast-acting veterinary tranquilizer." }
  ];

  const hintsPool = [
    { id: "hint-1", order: 1, text: "Focus on the specific chemical solvent used on the showcase tumbler lock." },
    { id: "hint-2", order: 2, text: "Check which suspect had verified access to conservation chemicals and wore cashmere." },
    { id: "hint-3", order: 3, text: "Cross-reference the financial debt notice with the sub-level elevator access log." }
  ];

  const suspects = suspectsPool.slice(0, config.suspects);
  const clues = cluesPool.slice(0, config.clues);
  const hints = hintsPool.slice(0, config.hints);

  return {
    title: userPremise ? `The Mystery of: ${userPremise.slice(0, 40)}` : "The Case of the Whispering Vault",
    premise: userPremise || "A rare gilded astrolabe disappears from a locked guild vault.",
    difficulty: diff,
    story: {
      setting: "Ravencrest Antiquities Guild Archive Vault",
      victim: "Julian Vance (Senior Archivist, bound and sedated)",
      incidentSummary: `At 11:15 PM, the pneumatic alarm tripped. The Guild's prized 14th-century astrolabe was removed from a steel showcase with zero forced entry marks. Inspired by: "${userPremise || 'The Whispering Vault'}"`,
      timeOfCrime: "10:45 PM – 11:10 PM"
    },
    suspects,
    clues,
    hints,
    solution: {
      culpritId: "suspect-1",
      culpritName: "Elena Rostova",
      fullExplanation: "Senior Conservator Elena Rostova utilized her specialized knowledge of antiquities solvents to quietly dissolve the vault tumbler without triggering acoustic alarms. Crushed by mounting debt, she wore a blue cashmere cardigan, swiped into the sub-level at 10:48 PM, and sedated the archivist. Her alibi in the lab collapsed once solvent traces on her sleeve and cashmere threads in the lock matched forensic findings.",
      keyEvidence: ["clue-2", "clue-3", "clue-4"]
    },
    playerProgress: {
      cluesDiscoveredCount: 0,
      hintsUsedCount: 0,
      maxHints: config.hints,
      isAccused: false,
      accusedSuspectId: null,
      isCorrect: false,
      score: 0
    }
  };
}
