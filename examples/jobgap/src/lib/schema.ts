import { z } from "zod";

// ----- Input -----
export const AnalyzeInputSchema = z.object({
  cv: z.string().min(1, "CV text is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

// ----- Output -----
export const MissingSkillSchema = z.object({
  skill: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

export const LearningStepSchema = z.object({
  skill: z.string(),
  action: z.string(),
  resource_type: z.string(),
  est_hours: z.number(),
});

export const AnalyzeOutputSchema = z.object({
  match_score: z.number().int().min(0).max(100),
  matched_skills: z.array(z.string()),
  missing_skills: z.array(MissingSkillSchema),
  learning_plan: z.array(LearningStepSchema).max(5),
});
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;

// ----- Application Tracker -----
export const APPLICATION_STATUSES = [
  "applied",
  "responded",
  "interview",
  "rejected",
  "ghosted",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const ApplicationSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  date_applied: z.string().min(1), // ISO date string YYYY-MM-DD
  cv_version: z.string().min(1),
  status: z.enum(APPLICATION_STATUSES),
});
export type Application = z.infer<typeof ApplicationSchema>;
