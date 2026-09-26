import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { JdFormSchema } from "@/lib/jdSchema";
import { buildPrompt } from "@/lib/prompt";
import { analyzeWithGemini, GeminiBusyError } from "@/lib/gemini";
import { validateJd } from "@/lib/validateJd";

const RequestSchema = z.object({
  cv: z.string().min(1, "CV text is required"),
  jd: JdFormSchema,
  locale: z.enum(["en", "id"]).optional().default("en"),
});

/** Compute match_score from skill arrays (0–100, rounded). */
function computeMatchScore(matched: string[], missing: unknown[]): number {
  const total = matched.length + missing.length;
  if (total === 0) return 0;
  return Math.round((matched.length / total) * 100);
}

export async function POST(req: NextRequest) {
  // 1. Validate input shape
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cv, jd, locale } = parsed.data;

  // 2. Rule-based JD validation
  const jdCheck = validateJd(jd, cv);
  if (!jdCheck.ok) {
    return NextResponse.json({ issues: jdCheck.blocking }, { status: 422 });
  }
  // warnings are informational — not returned to client from API

  // 3. Call Gemini
  const prompt = buildPrompt({ cv, jd, locale });
  let llmResult;
  try {
    llmResult = await analyzeWithGemini(prompt);
  } catch (err) {
    if (err instanceof GeminiBusyError) {
      return NextResponse.json(
        { error: "The AI service is busy right now. Please try again in a minute." },
        { status: 503 }
      );
    }
    const msg = err instanceof Error ? err.message : "Gemini call failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // 4. Compute match_score in code
  const match_score = computeMatchScore(
    llmResult.matched_skills,
    llmResult.missing_skills
  );

  return NextResponse.json({
    match_score,
    matched_skills: llmResult.matched_skills,
    missing_skills: llmResult.missing_skills,
    learning_plan: llmResult.learning_plan,
  });
}
