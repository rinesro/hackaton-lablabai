# Architecture — JobGap

## Purpose

JobGap is a **skill-gap analyzer and application tracker** built for fresh graduates in Indonesia (youth unemployment ~16.89%). It helps users:

- Identify the gap between their CV skills and a job description's requirements
- Receive a prioritized learning plan from Google Gemini AI (≤ 5 steps)
- Track every job application and monitor response rates by CV version
- Supports CVs and JDs in both English and Indonesian

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16.3.5 (App Router) | Full-stack; handles client pages and server route handlers |
| **Language** | TypeScript 5 | Strict typing across all files |
| **UI** | React 19.2.8 + Tailwind CSS 4 | Hooks-based state; utility-first styling |
| **Validation** | Zod 4.6.5 | Runtime schema validation at API boundaries and storage |
| **AI** | Google Gemini `@google/genai` 2.23.0 | Structured-JSON output; retry + fallback model pattern |
| **Charting** | recharts 3.10.1 | Response-rate bar chart on Dashboard |
| **Document parsing** | mammoth 1.12.3, unpdf 1.8.1 | Extract text from DOCX and PDF CV uploads |
| **Storage** | Browser `localStorage` | No backend database; all tracker data persists per device |
| **Testing** | Jest 30.5.2, ts-jest 29.4.12 | Unit tests for schemas, retry logic, storage, extraction |
| **Linting / Format** | ESLint, TypeScript compiler | `eslint.config.mjs`, `tsconfig.json` |

---

## Key Components

### Frontend

**Pages (`src/app/`)**

| File | Route | Responsibility |
|---|---|---|
| `layout.tsx` | all routes | Root layout: navigation bar, `LanguageProvider` wrapper |
| `page.tsx` | `/` | Skill Gap Analyzer: manages CV/JD state, calls `/api/analyze`, renders result |
| `tracker/page.tsx` | `/tracker` | Application Tracker + Dashboard: loads from localStorage, inline edits, delete |

**UI Components (`src/components/`)**

| Component | Description |
|---|---|
| `CvUpload.tsx` | File-upload (PDF/DOCX) or manual textarea for CV input |
| `JdForm.tsx` | Multi-field form for job details; optional image upload → `/api/extract-jd` |
| `AnalyzerForm.tsx` | Wrapper combining CV and JD inputs |
| `AnalysisResult.tsx` | Renders match score badge, matched/missing skill chips, learning plan table |
| `AppForm.tsx` | Adds a new application to the tracker (company, role, date, CV version) |
| `AppTable.tsx` | Table of tracked applications with inline status dropdown and delete |
| `Dashboard.tsx` | Overall response-rate stat + recharts bar chart per CV version |
| `NavLinks.tsx` | Navigation links to `/` and `/tracker` |
| `LanguageToggle.tsx` | Toggle between English and Indonesian locale |

**Context & i18n (`src/lib/`)**

- `LanguageContext.tsx` — React Context; exposes `useLanguage()` and `useT()` hooks
- `i18n.ts` — Localization string dictionaries (en / id)

### Backend / API

**Route Handlers (`src/app/api/`)**

| Route | File | Description |
|---|---|---|
| `POST /api/analyze` | `analyze/route.ts` | Main skill-gap endpoint. Validates input → builds prompt → calls Gemini → computes `match_score` → returns JSON |
| `POST /api/extract-cv` | `extract-cv/route.ts` | Accepts multipart CV file (DOCX/PDF); extracts plain text via mammoth/unpdf |
| `POST /api/extract-jd` | `extract-jd/route.ts` | Accepts JD image (base64); calls `extractJdWithGemini()` to return structured JD fields |

**Server-side library (`src/lib/`)**

| File | Responsibility |
|---|---|
| `schema.ts` | Zod schemas: `AnalyzeInputSchema`, `AnalyzeOutputSchema`, `ApplicationSchema`, `MissingSkillSchema`, `LearningStepSchema` |
| `jdSchema.ts` | Zod schema for `JdForm` (jobTitle, company, requirements, description, workingHours, benefits, otherInfo) |
| `validateJd.ts` | Rule-based JD validation (blocking issues vs. warnings) before Gemini call |
| `prompt.ts` | `buildPrompt({ cv, jd, locale })` — assembles the Gemini text prompt |
| `gemini.ts` | `callGeminiWithRetry()` (3 attempts, 1/2/4 s backoff), `analyzeWithGemini()` (primary + fallback), `extractJdWithGemini()` |
| `resources.ts` | Learning-resource catalog referenced by the prompt |
| `skillKeywords.ts` | Skill synonym mapping used during analysis |
| `sample.ts` | `SAMPLE_CV` and `SAMPLE_JD_FORM` demo strings for the "Try Sample" button |

### Storage

All application-tracker data lives in the browser's **`localStorage`** under key `"jobgap_applications"` (JSON array). There is no backend database.

**`src/lib/storage.ts`** exports:

| Function | Description |
|---|---|
| `loadApplications()` | Read all records; Zod-validates each entry and silently drops corrupt ones |
| `saveApplication(app)` | Append a new `Application` record |
| `updateStatus(id, status)` | Change the status field of one record |
| `deleteApplication(id)` | Remove a record by ID |

---

## Folder Structure

```
examples/jobgap/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout + nav + LanguageProvider
│   │   ├── page.tsx                 # "/" — Skill Gap Analyzer page
│   │   ├── globals.css              # Tailwind base + custom styles
│   │   ├── tracker/
│   │   │   └── page.tsx             # "/tracker" — Application Tracker + Dashboard
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts         # POST /api/analyze
│   │       ├── extract-cv/
│   │       │   └── route.ts         # POST /api/extract-cv
│   │       └── extract-jd/
│   │           └── route.ts         # POST /api/extract-jd
│   ├── components/
│   │   ├── CvUpload.tsx
│   │   ├── JdForm.tsx
│   │   ├── AnalyzerForm.tsx
│   │   ├── AnalysisResult.tsx
│   │   ├── AppForm.tsx
│   │   ├── AppTable.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NavLinks.tsx
│   │   └── LanguageToggle.tsx
│   ├── lib/
│   │   ├── schema.ts                # Core Zod types
│   │   ├── jdSchema.ts              # JdForm Zod schema
│   │   ├── validateJd.ts            # Rule-based JD checks
│   │   ├── prompt.ts                # Gemini prompt builder
│   │   ├── gemini.ts                # Gemini client + retry + fallback
│   │   ├── storage.ts               # localStorage CRUD
│   │   ├── LanguageContext.tsx      # i18n context
│   │   ├── i18n.ts                  # Localization strings
│   │   ├── resources.ts             # Learning resource catalog
│   │   ├── skillKeywords.ts         # Skill synonym map
│   │   └── sample.ts                # Demo CV + JD data
│   └── __tests__/
│       ├── schema.test.ts
│       ├── gemini.test.ts
│       ├── storage.test.ts
│       ├── extract-cv.test.ts
│       ├── validateJd.test.ts
│       ├── resources.test.ts
│       └── fixtures/
│           └── sample.docx          # DOCX fixture for extract-cv tests
├── package.json
├── tsconfig.json
├── jest.config.ts
├── next.config.ts
├── README.md
└── .env.local                       # API key — git-ignored
```

---

## Data Flow

### Primary Happy Path — Skill Gap Analysis

```
User fills CV + JD  →  POST /api/analyze  →  Gemini API  →  AnalysisResult rendered
```

**Step-by-step:**

1. **User Input** — The user pastes or uploads a CV via `CvUpload` and fills job details in `JdForm`. Optionally uploads a JD image, which triggers `POST /api/extract-jd` to have Gemini parse it into form fields.

2. **Client-side validation** — On "Analyze" click, `page.tsx` calls `validateJd(jd, cv)` (rule-based checks). Blocking issues halt submission with inline errors; warnings are shown informally.

3. **API Request** — `page.tsx` sends:
   ```json
   POST /api/analyze
   { "cv": "...", "jd": { "jobTitle": "...", "requirements": "...", ... }, "locale": "en" }
   ```

4. **Server validation** — `route.ts` runs `RequestSchema.safeParse()` (Zod). Returns 400 on schema error; calls `validateJd()` again server-side and returns 422 on blocking JD issues.

5. **Prompt construction** — `buildPrompt({ cv, jd, locale })` converts JD fields to labeled text and embeds locale instructions.

6. **Gemini call with retry** — `analyzeWithGemini(prompt)` calls `callGeminiWithRetry()` on the primary model (up to 3 attempts, exponential backoff at 1 s / 2 s / 4 s, jitter ±200 ms). Retries only on 429/503. On exhaustion, tries the fallback model once. On total failure, throws `GeminiBusyError` → HTTP 503.

7. **Structured response** — Gemini returns JSON enforced by `RESPONSE_SCHEMA`:
   ```json
   { "matched_skills": [...], "missing_skills": [{"skill":"...","priority":"..."},...], "learning_plan": [{"skill":"...","action":"...","resource_type":"...","est_hours":0},...] }
   ```

8. **Match score computation** — `route.ts` computes `match_score = round(matched / (matched + missing) * 100)` and attaches it to the response. Score is never requested from the LLM.

9. **Result rendering** — `page.tsx` stores the response in React state. `AnalysisResult` renders: green match-score badge, matched skill chips, missing skill chips with priority colors, and the learning plan table.

### Secondary Flow — Application Tracker

1. User navigates to `/tracker`
2. `tracker/page.tsx` calls `loadApplications()` → reads and Zod-validates `localStorage`
3. `AppForm` submits → `saveApplication()` → persists to `localStorage`
4. `AppTable` renders rows; status dropdown → `updateStatus()`; delete button → `deleteApplication()`
5. `Dashboard` reads all records, computes response rate, renders recharts bar chart per CV version
