# Setup Guide — JobGap

## Prerequisites

| Tool | Version | Check | Download |
|---|---|---|---|
| Node.js | >= 18 | `node --version` | [nodejs.org](https://nodejs.org/) |
| npm | >= 8 (bundled with Node) | `npm --version` | Comes with Node.js |
| Git | any | `git --version` | [git-scm.com](https://git-scm.com/) |
| Gemini API key | — | — | [aistudio.google.com](https://aistudio.google.com/app/apikey) (free tier works) |

---

## 1. Clone the Repository

**macOS / Linux:**
```bash
git clone <repo-url>
cd examples/jobgap
```

**Windows (PowerShell):**
```powershell
git clone <repo-url>
cd examples\jobgap
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs Next.js, React, Zod, `@google/genai`, Tailwind CSS, recharts, mammoth, unpdf, Jest, and all dev dependencies listed in `package.json`.

**Verify:**
```bash
npm list next react @google/genai
```

---

## 3. Configure Environment Variables

Create `.env.local` in the project root (`examples/jobgap/.env.local`):

**macOS / Linux:**
```bash
touch .env.local
```

**Windows (PowerShell):**
```powershell
New-Item -Name .env.local -ItemType File
```

Add the following content:

```env
GEMINI_API_KEY=your-actual-key-here
```

### Environment Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key. Never commit this value. |
| `GEMINI_MODEL` | No | `gemini-3.6-flash` | Primary model name. |
| `GEMINI_FALLBACK_MODEL` | No | (none) | Fallback model tried once if primary exhausts 3 retries (e.g. `gemini-2.0-flash-lite`). |

All variables are read server-side in `src/lib/gemini.ts` only. They are never exposed to the browser.

`.env.local` is git-ignored by default.

> **Note:** `.env.local.example` is not present in this repo. Create `.env.local` manually with the content above.

---

## 4. Run the Application

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.3.5
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in ~2s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Other available scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |
| `npm test` | Run all Jest tests |

---

## 5. Verify It Works

| URL | Expected result |
|---|---|
| `http://localhost:3000/` | Skill Gap Analyzer — two-panel form (CV input + JD fields) with "Analyze" button |
| `http://localhost:3000/tracker` | Application Tracker — empty table + add-application form + dashboard |

**Quick smoke test:**
1. Go to `http://localhost:3000/`
2. Click **"Try Sample"** — demo CV and JD populate automatically
3. Click **"Analyze"** — wait 2–5 seconds
4. You should see a match-score badge, skill chips, and a learning plan table ✅

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Page shows nothing at `:3000` | Dev server not running | Run `npm run dev` in the `examples/jobgap` directory |
| `Error: GEMINI_API_KEY is not set` | `.env.local` missing or key absent | Create `.env.local` with `GEMINI_API_KEY=<your-key>` |
| `Error: listen EADDRINUSE :::3000` | Port 3000 already in use | **macOS/Linux:** `lsof -ti:3000 \| xargs kill` **Windows:** `netstat -ano \| findstr :3000` then `taskkill /PID <pid> /F` |
| `Error 429 Too Many Requests` from Gemini | Free-tier rate limit hit | Wait ~1 min; add `GEMINI_FALLBACK_MODEL=gemini-2.0-flash-lite` to `.env.local` |
| `Cannot find module '@google/genai'` | `npm install` not run or failed | Delete `node_modules/` and run `npm install` again |
| TypeScript errors in editor | Stale IDE cache | Restart your editor; run `npm run build` to verify the TypeScript compiles |
| `localStorage` tracker data lost | Different browser or incognito mode | Data is per-browser and not synced; use the same browser profile |

---

## Running Tests

```bash
npm test
```

**Expected output (31 tests):**
```
PASS  src/__tests__/schema.test.ts
PASS  src/__tests__/gemini.test.ts
PASS  src/__tests__/storage.test.ts
PASS  src/__tests__/extract-cv.test.ts
PASS  src/__tests__/validateJd.test.ts
PASS  src/__tests__/resources.test.ts

Test Suites: 6 passed, 6 total
Tests:       31 passed, 31 total
```

| Suite | What it covers |
|---|---|
| `schema.test.ts` | `AnalyzeOutputSchema` — score range 0–100, priority enum, learning plan capped at 5 items |
| `gemini.test.ts` | `callGeminiWithRetry` — exponential backoff, 400 no-retry, fallback model, `GeminiBusyError` |
| `storage.test.ts` | localStorage CRUD — add/update/delete `Application`, response-rate calculation |
| `extract-cv.test.ts` | `/api/extract-cv` — 400/422 validation, real DOCX fixture parsing |
| `validateJd.test.ts` | Rule-based JD validation — blocking issues vs. warnings |
| `resources.test.ts` | Learning resource catalog logic |

Run a single suite:
```bash
npm test -- schema.test.ts
```

Run with coverage:
```bash
npm test -- --coverage
```
