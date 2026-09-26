import type { JdForm } from "./jdSchema";
import type { Locale } from "./i18n";

/** Convert a JdForm into a labeled text block, skipping empty fields. */
export function jdFormToText(jd: JdForm): string {
  const lines: string[] = [];
  if (jd.jobTitle)     lines.push(`Job Title: ${jd.jobTitle}`);
  if (jd.company)      lines.push(`Company: ${jd.company}`);
  if (jd.requirements) lines.push(`Requirements / Required Skills:\n${jd.requirements}`);
  if (jd.description)  lines.push(`Job Description:\n${jd.description}`);
  if (jd.workingHours) lines.push(`Working Hours: ${jd.workingHours}`);
  if (jd.benefits)     lines.push(`Benefits: ${jd.benefits}`);
  if (jd.otherInfo)    lines.push(`Other Info:\n${jd.otherInfo}`);
  return lines.join("\n\n");
}

export interface PromptInput {
  cv: string;
  jd: JdForm;
  locale?: Locale;
}

export function buildPrompt(input: PromptInput): string {
  const langInstruction =
    input.locale === "id"
      ? "Write all `action` and `resource_type` values in Indonesian (Bahasa Indonesia). Skill names stay in their original form (do not translate)."
      : "Write all `action` and `resource_type` values in English. Skill names stay in their original form.";

  return `You are a career advisor. Analyze the candidate's CV against the job description.
Return ONLY a JSON object — no markdown fences, no explanation, nothing else.
${langInstruction}

The JSON must conform exactly to this shape:
{
  "matched_skills": ["<skill>", ...],
  "missing_skills": [{"skill": "<skill>", "priority": "high"|"medium"|"low"}, ...],
  "learning_plan": [
    {"skill": "<skill>", "action": "<what to do>", "resource_type": "<free resource type>", "est_hours": <number>},
    ... (max 5 items)
  ]
}

Do NOT include a match_score field — it will be calculated separately.

CV:
${input.cv}

Job Posting:
${jdFormToText(input.jd)}`;
}
