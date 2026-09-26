# JobGap: Skill-gap analyzer & application tracker for fresh graduates

## Problem
Youth unemployment in Indonesia (age 15-24) is 16.89% (BPS, Aug 2025).
Fresh graduates send many applications with little response and don't
know which skills they lack for a specific job.

## MVP scope (48h hackathon, do NOT add features beyond this)
1. Skill Gap Analyzer: user pastes CV text + job description.
   LLM returns JSON: match_score (0-100), matched_skills[],
   missing_skills[] (each with priority: high|medium|low),
   learning_plan[] (max 5 steps: skill, action, free resource type, est_hours).
2. Application Tracker: add application (company, role, date_applied,
   cv_version, status: applied|responded|interview|rejected|ghosted).
3. Dashboard: overall response rate + response rate per cv_version.
Supports CVs in English and Indonesian. UI in English.
4. CV upload: PDF or DOCX (max 2 MB). Text is extracted server-side and
   placed into the CV textarea for review. CV is not stored anywhere.
5. JD is a structured form: job_title, company, requirements (REQUIRED),
   job_description, working_hours, benefits, other_info.
   Can be filled manually OR by uploading an image (PNG/JPG/JPEG, max
   4 MB): Gemini extracts the posting into these fields for review.
6. Validation before analysis (rule-based, no AI call), focused on the
   requirements field.
7. Learning plan cards are clickable links to real learning resources.

## Out of scope
Auth, PDF or DOCX upload, job-site scraping, payments, database backend.

## Stack
Next.js (App Router, TypeScript) + Tailwind, zod, localStorage, recharts.
AI: Gemini API called server-side via @google/genai.
Env vars: GEMINI_API_KEY, GEMINI_MODEL, GEMINI_FALLBACK_MODEL.
Use structured output (JSON schema) so the response matches /lib/schema.ts.
match_score is computed in code, not by the LLM.

## Structure
/app/page.tsx (analyzer) | /app/tracker/page.tsx | /app/api/analyze/route.ts
/lib/schema.ts | /lib/prompt.ts | /lib/storage.ts | /lib/sample.ts | /components/*

## Rules for Bob
- One task at a time. Only touch files named in the task.
- Before coding, show a plan of max 5 bullets, then proceed.
- For changes, edit only the needed lines. Never rewrite whole files.
- Keep replies short. No long explanations unless asked.
- Never hardcode API keys. Use .env.local.