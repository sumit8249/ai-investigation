# AI Mystery Room — The Generative Whodunit Experience

AI Mystery Room is a full-stack detective game powered by Google Gemini generative AI models. Players step into the role of a lead investigator: exploring dynamic crime scenes, interrogating suspects with conflicting alibis, uncovering hidden physical evidence, strategically unlocking hints, and identifying the culprit before closing the case.

The solution, motives, and culprit identity are cryptographically sequestered on the server until the player submits a formal accusation, evaluated against a calibrated deductive scoring rubric.

## Key Features

* **Generative Mystery Architect**: Uses Google Gemini (`gemini-1.5-flash`) to generate coherent, fair-play whodunits with unique victim backgrounds, crime timelines, and forensic evidence.

* **Strict Schema Validation**: All AI responses are validated at runtime via Zod to eliminate narrative contradictions and missing fields.

* **Server-Sequestered Solution**: Mongoose models enforce `select: false` on the culprit's identity and crime explanation, ensuring zero client-side cheating before accusation.

* **Multi-Tier Investigation Scale**:

  * **Easy**: 3 Suspects, 5 Forensic Clues, 2 Guided Hints (100 Base Points).

  * **Medium**: 4 Suspects, 7 Forensic Clues, 3 Guided Hints (150 Base Points).

  * **Hard**: 5 Suspects, 9 Forensic Clues, 3 Guided Hints (200 Base Points).

* **Calibrated Scoring Engine**:

  * Correct Accusation: +100 / +150 / +200 points.

  * Clue Discovery Bonus: +5 points for each uncovered clue.

  * Strategic Hint Deduction: -10 points for each hint unlocked.

  * Final Score Floor: Bounded at a minimum of 0 points.

* **High-Resilience Offline Mode**: Automatically transitions to an in-memory repository and procedural case engine if MongoDB or Gemini API credentials are not configured.

## Tech Stack

| Layer | Technology | Purpose | 
| ----- | ----- | ----- | 
| **Frontend** | React 18, Vite | High-performance SPA with fast client routing | 
| **Styling & UI** | Tailwind CSS, Lucide React | Dark-noir detective design system with custom typography | 
| **Client Routing & API** | React Router v6, Axios | View transitions and REST lifecycle management | 
| **Backend Runtime** | Node.js (v18+), Express 4 | Modular REST API built with ES modules | 
| **Database & ODM** | MongoDB Atlas, Mongoose | Hierarchical case documents and player progress tracking | 
| **AI Integration** | Google Gemini API (`@google/genai`) | Structured JSON mystery and clue generation | 
| **Schema Validation** | Zod | Runtime contract validation for AI outputs | 

## Project Structure

```
ai-mystery-room/
├── SPEC.md                      # Complete blueprint & system specification
├── README.md                    # Project documentation & setup instructions
├── server/
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Express app entry & database connection
│   ├── models/
│   │   └── Case.js              # Mongoose schema with hidden solution fields
│   ├── routes/
│   │   └── cases.js             # REST endpoints for case lifecycle & scoring
│   ├── services/
│   │   └── geminiService.js     # Gemini API prompt architect & Zod validator
│   └── middleware/
│       └── errorHandler.js      # Centralized error handler
└── client/
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration with API proxy
    ├── tailwind.config.js       # Noir theme palette and typography tokens
    ├── postcss.config.js        # PostCSS configuration
    ├── index.html               # Main entrypoint with web fonts
    └── src/
        ├── App.jsx              # Application router
        ├── main.jsx             # React DOM root
        ├── index.css            # Base styles and scrollbars
        ├── services/
        │   └── api.js           # Axios HTTP client
        ├── components/
        │   ├── Navbar.jsx       # Header and global case status
        │   ├── SuspectCard.jsx  # Suspect dossier card and alibi display
        │   ├── ClueCard.jsx     # Clue inspection and discovery triggers
        │   └── HintModal.jsx    # Hint decryptor with penalty warnings
        └── pages/
            ├── Home.jsx             # Landing page and feature overview
            ├── CreateMystery.jsx    # Premise prompt and difficulty selector
            ├── InvestigationRoom.jsx# Case synopsis, clues, and suspects board
            ├── Accusation.jsx       # Suspect indictment interface
            └── Results.jsx          # Verdict reveal and score audit

```

## Local Setup & Development

### 1. Prerequisites

* Node.js (version 18 or higher)

* npm (version 9 or higher)

* (Optional) MongoDB Atlas database URI & Google Gemini API Key

### 2. Backend Setup

1. Open a terminal and navigate to the `server/` directory:

   ```
   cd server
   npm install
   
   ```

2. Copy the sample environment file:

   ```
   cp .env.example .env
   
   ```

3. Populate `.env` with your credentials:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   
   ```

   *Note: If `MONGODB_URI` or `GEMINI_API_KEY` are omitted, the server automatically starts in resilient in-memory mode with full procedural case generation.*

4. Start the backend development server:

   ```
   npm run dev
   
   ```

   The backend API runs on `http://localhost:5000`.

### 3. Frontend Setup

1. In a second terminal window, navigate to the `client/` directory:

   ```
   cd client
   npm install
   
   ```

2. Start the Vite development server:

   ```
   npm run dev
   
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## API Reference

### 1. Generate Mystery

* **Endpoint**: `POST /api/cases`

* **Body**:

  ```
  {
    "premise": "A rare emerald is stolen from a locked greenhouse during a thunderstorm.",
    "difficulty": "medium"
  }
  
  ```

* **Response**: Returns the created case metadata, suspects, clue placeholders, and hint counters. The `solution` object is strictly excluded.

### 2. Retrieve Active Case

* **Endpoint**: `GET /api/cases/:id`

* **Response**: Returns current case state. Undiscovered clues display redacted descriptions.

### 3. Inspect / Discover Clue

* **Endpoint**: `POST /api/cases/:id/clues/:clueId/discover`

* **Response**: Marks the clue as discovered, reveals the detailed forensic evidence, and credits +5 points.

### 4. Unlock Hint

* **Endpoint**: `POST /api/cases/:id/hints`

* **Response**: Decrypts the next sequential hint, decrements remaining hints, and registers a -10 point penalty.

### 5. Submit Accusation

* **Endpoint**: `POST /api/cases/:id/accuse`

* **Body**:

  ```
  {
    "suspectId": "suspect-1",
    "notes": "Chemical residue on her cuffs matches the dissolved lock tumbler."
  }
  
  ```

* **Response**: Unlocks the sequestered solution, checks deduction correctness, calculates final score, and returns the verdict (`SOLVED` or `UNSOLVED`).

### 6. Retrieve Final Results

* **Endpoint**: `GET /api/cases/:id/result`

* **Response**: Full case post-mortem including culprit identity, complete crime timeline explanation, and score audit.

## Scoring Formula

$$
\text{Final Score} = \max\left(0, \text{Base Points} + (\text{Discovered Clues} \times 5) - (\text{Hints Used} \times 10)\right)
$$

* Base Points: 100 (Easy), 150 (Medium), 200 (Hard) if the accused suspect is correct; 0 if incorrect.

* Clue Discovery: +5 points per inspected crime scene item.

* Hint Usage: -10 points per revealed hint.

* Floor: Final score never drops below 0 points.

## Deployment Guide

### A. MongoDB Atlas

1. Register for a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).

2. Under **Network Access**, whitelist `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud platform connections.

3. Under **Database Access**, create a user with read/write permissions.

4. Copy the connection string to use in your backend environment variables.

### B. Backend (Render / Railway)

1. Push your repository to GitHub.

2. Create a new Web Service in [Render](https://render.com) and link your GitHub repository.

3. Configure the service settings:

   * **Root Directory**: `server`

   * **Build Command**: `npm install`

   * **Start Command**: `npm start`

4. Set Environment Variables:

   * `PORT`: `5000`

   * `MONGODB_URI`: `<your MongoDB connection string>`

   * `GEMINI_API_KEY`: `<your Gemini API Key>`

   * `CLIENT_URL`: `<your Vercel frontend URL>`

### C. Frontend (Vercel)

1. Create a new project in [Vercel](https://vercel.com) and link your repository.

2. Configure project settings:

   * **Framework Preset**: `Vite`

   * **Root Directory**: `client`

   * **Build Command**: `npm run build`

   * **Output Directory**: `dist`

3. Add Environment Variable:

   * `VITE_API_URL`: `<your deployed backend URL>/api`

4. Click **Deploy**.

## Submission Details

* **Submission Form**: [AI Mystery Room Submission Form](https://www.google.com/search?q=https://bit.ly/ai-mystery-room-sub-form)

* **Deadline**: November 2nd, 11:59 PM

* **Required Links**:

  * GitHub Repository (complete frontend and backend code)

  * Deployed Live Application URL