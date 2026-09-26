import { SKILL_KEYWORDS } from "./skillKeywords";
import type { JdForm } from "./jdSchema";

export interface JdValidationResult {
  ok: boolean;       // false if any blocking issue exists
  blocking: string[]; // stop analysis
  warnings: string[]; // show but allow analysis
}

// ── Constants ──────────────────────────────────────────────────────────────

const MIN_WORDS = 10;
const MIN_SKILL_MATCHES = 2;
const SIMILARITY_THRESHOLD = 0.80;

// ── Helpers ────────────────────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function lowerWords(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\s+/).filter(Boolean));
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = lowerWords(a);
  const setB = lowerWords(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function countSkillMatches(text: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of SKILL_KEYWORDS) {
    if (lower.includes(kw)) count++;
  }
  return count;
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Validates the JD form object against structural rules.
 *
 * Blocking rules  → set ok=false, push to blocking[].
 * Warning rules   → push to warnings[] only; ok stays true unless
 *                   a blocking rule also fired.
 */
export function validateJd(jd: JdForm, cv: string): JdValidationResult {
  const blocking: string[] = [];
  const warnings: string[] = [];

  const req = jd.requirements ?? "";

  // Blocking 1: requirements empty or under 10 words
  if (wordCount(req) < MIN_WORDS) {
    blocking.push("val_requirements_too_short");
  }

  // Blocking 2: requirements over 80% identical to CV
  if (cv.trim().length > 0 && jaccardSimilarity(req, cv) > SIMILARITY_THRESHOLD) {
    blocking.push("val_requirements_same_as_cv");
  }

  // Warning only: fewer than 2 known skill terms across all fields
  const allText = [
    jd.jobTitle, jd.company, req, jd.description,
    jd.workingHours, jd.benefits, jd.otherInfo,
  ].filter(Boolean).join(" ");

  if (countSkillMatches(allText) < MIN_SKILL_MATCHES) {
    warnings.push("val_warn_few_skills");
  }

  return { ok: blocking.length === 0, blocking, warnings };
}
