/**
 * Gemini client for JobGap.
 *
 * Uses @google/genai with structured-output (responseSchema) so the model
 * returns JSON that exactly matches the LLM portion of AnalyzeOutputSchema.
 *
 * match_score is NOT requested from the LLM — it is computed in route.ts.
 */

import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import type { JdForm } from "./jdSchema";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LLMAnalysis {
  matched_skills: string[];
  missing_skills: { skill: string; priority: "high" | "medium" | "low" }[];
  learning_plan: {
    skill: string;
    action: string;
    resource_type: string;
    est_hours: number;
  }[];
}

/** Thrown when all retries + fallback have been exhausted. */
export class GeminiBusyError extends Error {
  constructor() {
    super("All Gemini attempts failed");
    this.name = "GeminiBusyError";
  }
}

// ── JSON schema passed to the API ─────────────────────────────────────────

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    matched_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missing_skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          priority: { type: Type.STRING },
        },
        required: ["skill", "priority"],
      },
    },
    learning_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          action: { type: Type.STRING },
          resource_type: { type: Type.STRING },
          est_hours: { type: Type.NUMBER },
        },
        required: ["skill", "action", "resource_type", "est_hours"],
      },
    },
  },
  required: ["matched_skills", "missing_skills", "learning_plan"],
};

// ── Retry helpers ──────────────────────────────────────────────────────────

const RETRY_STATUSES = new Set([429, 503]);
const BACKOFF_MS = [1000, 2000, 4000];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base: number) {
  return base + Math.random() * 200;
}

// ── Core call ─────────────────────────────────────────────────────────────

/**
 * Call one Gemini model with up to 3 attempts (retrying on 429/503).
 * Throws the last error if all attempts fail.
 * Throws immediately (no retry) on 400-class non-retryable errors.
 */
export async function callGeminiWithRetry(
  prompt: string,
  model: string,
  apiKey: string
): Promise<LLMAnalysis> {
  const ai = new GoogleGenAI({ apiKey });

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await sleep(jitter(BACKOFF_MS[attempt - 1]));
    }

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const raw = response.text ?? "";
      // Strip stray markdown fences just in case
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      return JSON.parse(cleaned) as LLMAnalysis;
    } catch (err) {
      // Don't retry on 400-class errors (bad request / invalid key)
      if (
        err instanceof Error &&
        /\b4[0-9]{2}\b/.test(err.message) &&
        !RETRY_STATUSES.has(Number(err.message.match(/\b([0-9]{3})\b/)?.[1]))
      ) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError;
}

// ── Public entry point ────────────────────────────────────────────────────

/**
 * Try the primary model, then fall back to GEMINI_FALLBACK_MODEL.
 * Logs which model answered to the server console.
 * Throws GeminiBusyError if both fail.
 */
export async function analyzeWithGemini(prompt: string): Promise<LLMAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const primaryModel =
    process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL;

  // Try primary
  try {
    const result = await callGeminiWithRetry(prompt, primaryModel, apiKey);
    console.log(`[gemini] answered by primary model: ${primaryModel}`);
    return result;
  } catch (primaryErr) {
    console.warn(
      `[gemini] primary model (${primaryModel}) failed:`,
      primaryErr instanceof Error ? primaryErr.message : primaryErr
    );
  }

  // Try fallback (single attempt — it has already waited through backoff)
  if (fallbackModel) {
    try {
      const result = await callGeminiWithRetry(prompt, fallbackModel, apiKey);
      console.log(`[gemini] answered by fallback model: ${fallbackModel}`);
      return result;
    } catch (fallbackErr) {
      console.warn(
        `[gemini] fallback model (${fallbackModel}) also failed:`,
        fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
      );
    }
  }

  throw new GeminiBusyError();
}

// ── JD image extraction ───────────────────────────────────────────────────

const JD_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    jobTitle:     { type: Type.STRING },
    company:      { type: Type.STRING },
    requirements: { type: Type.STRING },
    description:  { type: Type.STRING },
    workingHours: { type: Type.STRING },
    benefits:     { type: Type.STRING },
    otherInfo:    { type: Type.STRING },
  },
  required: ["jobTitle", "company", "requirements", "description",
             "workingHours", "benefits", "otherInfo"],
};

const JD_EXTRACT_PROMPT =
  "You are a job-posting parser. Extract only what is explicitly visible in this image. " +
  "Map the content into the JSON fields: jobTitle, company, requirements, description, " +
  "workingHours, benefits, otherInfo. " +
  "Leave a field as an empty string if that information is not present. " +
  "Never invent or infer content that is not shown. " +
  "Return ONLY the JSON object, no markdown fences.";

/**
 * Call Gemini with an image (base64) to extract JD fields.
 * Uses the same retry/backoff pattern as callGeminiWithRetry.
 */
export async function extractJdWithGemini(
  imageBase64: string,
  mimeType: string
): Promise<JdForm> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const primaryModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL;

  async function attempt(model: string): Promise<JdForm> {
    const ai = new GoogleGenAI({ apiKey });
    let lastError: unknown;

    for (let i = 0; i < 3; i++) {
      if (i > 0) await sleep(jitter(BACKOFF_MS[i - 1]));
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              parts: [
                { text: JD_EXTRACT_PROMPT },
                { inlineData: { mimeType, data: imageBase64 } },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: JD_RESPONSE_SCHEMA,
          },
        });
        const raw = (response.text ?? "")
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();
        return JSON.parse(raw) as JdForm;
      } catch (err) {
        if (
          err instanceof Error &&
          /\b4[0-9]{2}\b/.test(err.message) &&
          !RETRY_STATUSES.has(Number(err.message.match(/\b([0-9]{3})\b/)?.[1]))
        ) {
          throw err;
        }
        lastError = err;
      }
    }
    throw lastError;
  }

  try {
    const result = await attempt(primaryModel);
    console.log(`[gemini] JD extracted by primary model: ${primaryModel}`);
    return result;
  } catch (primaryErr) {
    console.warn(
      `[gemini] JD primary model (${primaryModel}) failed:`,
      primaryErr instanceof Error ? primaryErr.message : primaryErr
    );
  }

  if (fallbackModel) {
    try {
      const result = await attempt(fallbackModel);
      console.log(`[gemini] JD extracted by fallback model: ${fallbackModel}`);
      return result;
    } catch (fallbackErr) {
      console.warn(
        `[gemini] JD fallback model (${fallbackModel}) also failed:`,
        fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
      );
    }
  }

  throw new GeminiBusyError();
}
