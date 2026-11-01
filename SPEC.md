# Project Specification: AI Mystery Room

## 1. Project Overview & Problem Statement

### 1.1 Overview

**AI Mystery Room** is an interactive, full-stack web application where users create, investigate, and solve dynamic detective murder mysteries generated using Google Gemini. Players investigate suspect dossiers, inspect crime scene locations to uncover physical and testimonial clues, strategically request hints, and indict the true culprit.

### 1.2 Problem Statement

Traditional mystery and puzzle games are static: once played or spoiled, replayability drops to zero. Handcrafted narrative games also require extensive writing cycles. Conversely, naive generative AI text games often suffer from hallucinations, contradictory plotlines, premature spoilers, and unpredictable output schemas.

AI Mystery Room addresses this by enforcing:

1. **Strict Structured Schema Generation**: Gemini output is validated via Zod and strict schema definitions.

2. **Server-Side Solution Security**: The culprit identity, motive, and definitive crime narrative are strictly sequestered on the backend database until an accusation is submitted.

3. **Deterministic Scoring Engine**: Player performance is scored via calibrated, server-validated criteria balancing investigative thoroughness (+5 pts per discovered clue), speed/independence (-10 pts per hint penalty), and deductive accuracy (100–200 pts for correct accusation).

## 2. Target Users & Expected Experience

### 2.1 Target Users

* **Mystery & Puzzle Enthusiasts**: Players who enjoy escape rooms, murder mystery games, whodunits, and deductive reasoning.

* **Casual Web Gamers**: Users seeking short, immersive 5–15 minute problem-solving sessions.

* **AI Developers & Evaluators**: Reviewers assessing full-stack LLM integration, schema validation, and secure game state orchestration.

### 2.2 Expected User Experience

* **Atmospheric & Immersive**: Dark noir detective aesthetic with high-contrast amber/gold accents, clean typography, typewriter/case-file styling, and atmospheric audio feedback.

* **Zero Friction Onboarding**: One-click preset generation (e.g., Victorian Manor, Cyberpunk Cleanroom, Alpine Express Train, Gallery Arson) or custom premise input with instant difficulty selection.

* **Fair Deductive Logic**: Clues provide consistent, interlocking forensic and alibi evidence pointing uniquely toward the true culprit and eliminating innocent suspects.

* **Responsive & Accessible**: Seamlessly playable across desktop, tablet, and mobile browsers.

## 3. Core Features & Architecture

### 3.1 Core Features

1. **Premise & Difficulty Configuration**:

   * Customizable premise prompt (or curated mystery starters).

   * Difficulty tiers (Easy, Medium, Hard) dictating suspect count, clue depth, and hint limits.

2. **Gemini AI Mystery Engine**:

   * Generates structured case file: title, synopsis, crime scene details, suspects, clues, and tiered hints.

   * Enforces backend-only isolation of `culpritId` and `solutionExplanation`.

3. **Interactive Investigation Room**:

   * Suspect dossier cards with alibis, motives, relationships, and suspicious behaviors.

   * Clue discovery board: inspect crime scene locations, examine evidence items, and reveal hidden clues.

   * Dynamic progress tracker: clues uncovered count, hints remaining indicator, and real-time score projection.

4. **Strategic Hint System**:

   * Tiered hints providing progressive nudges without outright spoiling the verdict.

   * Penalty tracking (-10 points per hint requested).

5. **Accusation & Verdict Room**:

   * Suspect selection interface with required deductive rationale.

   * Immediate backend validation against the sequestered culprit.

   * Comprehensive case breakdown revealing the culprit's motive, crime timeline, and final calculated score.

6. **Case Replay & New Investigation**:

   * Single-click flow to start a fresh case with new premises or difficulties.

## 4. Technology Stack

| Layer | Technology | Rationale | 
| ----- | ----- | ----- | 
| **Frontend Framework** | React 18 + Vite | Lightning-fast development, component modularity, instant HMR | 
| **Styling & Icons** | Tailwind CSS + Lucide React | Noir detective design system, responsive utilities, rich iconography | 
| **Routing & HTTP** | React Router v6 + Axios | Client-side routing, structured API request/response lifecycle | 
| **Backend Runtime** | Node.js (v18+) + Express | Scalable REST API architecture, asynchronous Gemini streaming/calling | 
| **Database & ODM** | MongoDB + Mongoose | Flexible document model for hierarchical case files and game state | 
| **AI Generation** | Google Gemini API (`gemini-1.5-flash` / `@google/genai`) | High-speed, structured JSON generation with system instruction guardrails | 
| **Validation** | Zod | Runtime schema validation of Gemini responses and client payloads | 

## 5. User Flow & Game State Transitions

```
[1. Home Page]
      │
      ▼ (Click "Begin Investigation")
[2. Create Mystery Page]
      │   - Enter Premise (or pick preset)
      │   - Select Difficulty (Easy / Medium / Hard)
      ▼ (Click "Generate Case")
[Loading State: Gemini AI Architect]
      │
      ▼
[3. Investigation Room] <───> [Hint Modal] (Request hint: -10 pts)
      │   - Examine Suspect Profiles
      │   - Discover Clues (+5 pts each)
      │   - Review Crime Scene Synopsis
      ▼ (Click "Make Accusation")
[4. Accusation Page]
      │   - Select Suspect
      │   - State Investigative Deduction
      ▼ (Submit Accusation)
[5. Results Page]
      │   - Verdict (Solved / Unsolved)
      │   - Culprit Reveal & Complete Solution
      │   - Final Score Breakdown & Detective Rank
      ▼ (Click "New Mystery")
[Back to Create Mystery Page]

```

## 6. UI & Page Specifications

### 6.1 Page Specifications

#### 1. Home (`/`)

* **Header**: Project title, detective badge, and navigation.

* **Hero Banner**: "The Generative Whodunit Experience" with an overview of the gameplay loop.

* **Feature Highlights**: AI-generated bespoke plots, clue investigation, score evaluation.

* **CTA**: Prominent "Commission New Mystery" button directing to `/create`.

#### 2. Create Mystery (`/create`)

* **Premise Input**: Text area supporting custom narrative prompts.

* **Preset Starters**: Quick-select buttons for popular detective tropes (Classic Victorian, Cyberpunk Noir, Alpine Express Train, Gallery Arson).

* **Difficulty Selector**:

  * **Easy**: 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts)

  * **Medium**: 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts)

  * **Hard**: 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts)

* **Submit Button**: Displays active loading spinner with investigative status messages.

#### 3. Investigation Room (`/case/:id`)

* **Case Header**: Case file reference number, title, difficulty badge, active score calculation.

* **Case Synopsis**: Narrative describing the incident, location, victim, and initial findings.

* **Suspects Dossier Grid**: Cards displaying name, role, alibi, motive, and interrogated statements.

* **Clue Discovery Board**:

  * Undiscovered clues shown as locked crime scene zones.

  * Click to "Inspect Clue", revealing full forensic text (+5 points).

* **Hint Trigger**: Button showing hints used/available. Opens Hint Modal (-10 pts penalty).

* **Action Bar**: "Proceed to Accusation" button.

#### 4. Accusation Room (`/case/:id/accuse`)

* **Suspect Selector**: Visual radio grid of all suspects.

* **Motive/Deduction Input**: Detective notes field explaining the rationale.

* **Warning Notice**: Informs the player that submitting locks the case and reveals the final verdict.

* **Submit Button**: POST to `/api/cases/:id/accuse`.

#### 5. Results Room (`/case/:id/result`)

* **Verdict Banner**:

  * SUCCESS: "Case Closed: Justice Prevails" (Green/Gold).

  * FAILURE: "Case Cold: Wrong Accusation" (Crimson).

* **Score Card**:

  * Base Points (Difficulty Award if correct): 100 / 150 / 200

  * Clue Discovery Bonus: (Discovered Clues × 5)

  * Hint Penalty: -(Hints Used × 10)

  * **Final Total Score** (minimum 0).

  * Detective Rank Badge.

* **Culprit Dossier**: Full reveal of true culprit, their exact motive, and how the clues connected.

* **Action**: "Investigate Another Mystery" button directing to `/create`.

## 7. Backend & Database Design

### 7.1 Database Schema (MongoDB / Mongoose)

```
const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  story: {
    setting: String,
    victim: String,
    incidentSummary: String,
    timeOfCrime: String
  },
  suspects: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    alibi: String,
    motive: String,
    suspiciousDetail: String
  }],
  clues: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isDiscovered: { type: Boolean, default: false },
    discoveredAt: Date
  }],
  hints: [{
    id: { type: String, required: true },
    order: Number,
    text: { type: String, required: true },
    isRevealed: { type: Boolean, default: false }
  }],
  // SECURITY SENSITIVE: Never sent to client before accusation
  solution: {
    culpritId: { type: String, required: true, select: false },
    culpritName: { type: String, required: true, select: false },
    fullExplanation: { type: String, required: true, select: false },
    keyEvidence: [{ type: String, select: false }]
  },
  playerProgress: {
    cluesDiscoveredCount: { type: Number, default: 0 },
    hintsUsedCount: { type: Number, default: 0 },
    maxHints: { type: Number, required: true },
    isAccused: { type: Boolean, default: false },
    accusedSuspectId: { type: String, default: null },
    accusedAt: Date,
    isCorrect: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

```

### 7.2 API Endpoints Specification

1. `POST /api/cases` — Generate a mystery.

2. `GET /api/cases/:id` — Retrieve an active mystery (stripping `solution`).

3. `POST /api/cases/:id/clues/:clueId/discover` — Discover a clue (+5 pts).

4. `POST /api/cases/:id/hints` — Request a hint (-10 pts).

5. `POST /api/cases/:id/accuse` — Submit an accusation and compute score.

6. `GET /api/cases/:id/result` — Retrieve the completed result with solution.

## 8. AI Behavior & Scoring Rules

### 8.1 Complexity Matrix

| Difficulty | Suspects | Clues | Max Hints | Base Points (Correct Accusation) | 
| ----- | ----- | ----- | ----- | ----- | 
| **Easy** | 3 | 5 | 2 | 100 | 
| **Medium** | 4 | 7 | 3 | 150 | 
| **Hard** | 5 | 9 | 3 | 200 | 

### 8.2 Scoring Formula

$$
\text{Final Score} = \max\left(0, \text{Base Points}_{\text{if correct}} + (\text{Discovered Clues} \times 5) - (\text{Hints Used} \times 10)\right)
$$

* Minimum score is strictly bounded at `0`.

* All calculations are performed and validated server-side.

## 9. Acceptance Criteria Checklist

* \[x\] **Criterion 1**: Users can generate mysteries across all three difficulty levels (Easy, Medium, Hard).

* \[x\] **Criterion 2**: Players can investigate suspect profiles, discover clues, request hints, and submit formal accusations.

* \[x\] **Criterion 3**: The culprit identity and solution explanation are strictly concealed on the backend until an accusation is processed.

* \[x\] **Criterion 4**: Scores are calculated and validated by the backend.

* \[x\] **Criterion 5**: Results display the correct culprit and explanation.

* \[x\] **Criterion 6**: The application works on the deployed website.