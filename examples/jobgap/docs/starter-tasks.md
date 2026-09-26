# Starter Tasks — JobGap

### Task 1: Add a Salary Range Field to the Application Tracker

**Difficulty:** Easy

**Why it's a good first task:** It is a pure data-layer addition that touches the Zod schema, form, and table without involving the AI layer. It teaches you how data flows from schema to storage to UI.

**Files to touch:**
- `src/lib/schema.ts` — Add `salary_range` field to `ApplicationSchema`
- `src/components/AppForm.tsx` — Add a text input for salary range
- `src/components/AppTable.tsx` — Add a salary range column to the table

**What to do:**
- In `ApplicationSchema` (line 41 of `schema.ts`), add `salary_range: z.string().optional()`
- In `AppForm.tsx`, add a labeled `<input type="text">` for "Salary Range" and include it in the submitted record
- In `AppTable.tsx`, add a `<th>Salary</th>` header and render `app.salary_range` in each row
- Run `npm test` to confirm schema validation tests still pass
- Run `npm run dev` and add a test application with a salary range to verify end-to-end

---

### Task 2: Improve Error Messages in the Analyzer

**Difficulty:** Easy

**Why it's a good first task:** Error handling UX is often neglected but high-value. You will trace the error path from `GeminiBusyError` in `src/lib/gemini.ts` through `src/app/api/analyze/route.ts` to the UI in `src/app/page.tsx`.

**Files to touch:**
- `src/app/page.tsx` — Render friendlier error text based on HTTP status code
- `src/app/api/analyze/route.ts` — Optionally add an `errorCode` field to error responses

**What to do:**
- Identify where `setError()` is called in `page.tsx` after a failed `/api/analyze` request
- Map the 503 response (Gemini busy) to: "The AI is overloaded — please retry in 30 seconds."
- Map the 422 response to: "Your job description is incomplete. Check the Requirements field."
- Map unexpected errors to a generic fallback message with a suggestion to check the API key
- Test each path by temporarily returning different status codes in `route.ts` during development

---

### Task 3: Add a Color-Coded Match Score Badge to the Tracker

**Difficulty:** Easy

**Why it's a good first task:** Conditional styling is a core React/Tailwind pattern used throughout this codebase (see `src/components/AnalysisResult.tsx`). This task gives you a safe, isolated place to practice it.

**Files to touch:**
- `src/lib/schema.ts` — Add optional `match_score` to `ApplicationSchema`
- `src/components/AppForm.tsx` — Add a numeric input for match score (0–100)
- `src/components/AppTable.tsx` — Render a colored badge: green >= 70, orange 40–69, red < 40

**What to do:**
- Add `match_score: z.number().int().min(0).max(100).optional()` to `ApplicationSchema`
- Add a "Match Score %" number input to `AppForm.tsx`
- In `AppTable.tsx`, create a helper `scoreBadgeClass(score)` that returns a Tailwind class string based on the score range
- Render the badge in the table row next to the role name
- Run `npm test` to confirm no schema tests break

---

### Task 4: Export Applications to CSV

**Difficulty:** Medium

**Why it's a good first task:** Introduces file I/O and data serialization while staying entirely in the browser (no API changes). You will learn how to trigger a file download from JavaScript.

**Files to touch:**
- `src/lib/storage.ts` — Add an `exportToCSV(apps)` helper function
- `src/app/tracker/page.tsx` — Add an "Export CSV" button that calls the helper and triggers download

**What to do:**
- In `storage.ts`, write `exportToCSV(apps: Application[]): string` that returns a CSV string with headers: `company,role,date_applied,cv_version,status`
- In `tracker/page.tsx`, add a button that calls `exportToCSV(applications)`, wraps the result in a `Blob`, and creates an `<a>` element with `download="applications.csv"` to trigger download
- Test by adding a few tracker entries and clicking Export — open the downloaded file in a spreadsheet app
- Run `npm test` to verify no existing storage tests regress

---

### Task 5: Show Retry Attempt Feedback During Analysis

**Difficulty:** Medium

**Why it's a good first task:** Connects frontend state to backend retry behavior. You will learn how the retry loop in `src/lib/gemini.ts` works (`callGeminiWithRetry` — 3 attempts, backoff 1 s / 2 s / 4 s) and how to surface async progress in the UI.

**Files to touch:**
- `src/lib/gemini.ts` — Expose attempt count from `callGeminiWithRetry()`
- `src/app/api/analyze/route.ts` — Include attempt count in the response body
- `src/app/page.tsx` — Update loading state to show attempt number

**What to do:**
- Modify `callGeminiWithRetry()` in `gemini.ts` to return `{ result: LLMAnalysis, attempts: number }` instead of bare `LLMAnalysis`
- Update `analyzeWithGemini()` and `route.ts` to propagate `attempts` and include it in the JSON response body
- In `page.tsx`, while loading, display "Analyzing… (Attempt 1/3)" updating as the response arrives
- Update `gemini.test.ts` to assert on the returned `attempts` count
- Run `npm test` to ensure the retry and fallback tests still pass

---

## How to Pick Your First Task

| Preference | Task |
|---|---|
| I want to learn Zod schemas and data modeling | Task 1 or Task 3 |
| I care about UX and error states | Task 2 |
| I want to do something useful and self-contained | Task 4 |
| I want to understand the AI / async flow | Task 5 |
| I have never contributed to this codebase before | Task 1 (smallest blast radius) |

**General workflow:**

1. `git checkout -b task/<n>-short-description`
2. Make the changes described in "What to do"
3. `npm test` — all 31 tests must still pass (add new tests if you add new logic)
4. `npm run dev` — smoke-test the feature manually in the browser
5. `git commit -m "Task <n>: <description>"`
6. Push your branch and open a pull request
