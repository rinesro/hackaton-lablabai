import { AnalyzeOutputSchema } from "@/lib/schema";

const validPayload = {
  match_score: 72,
  matched_skills: ["TypeScript", "React"],
  missing_skills: [
    { skill: "Docker", priority: "high" },
    { skill: "Kubernetes", priority: "low" },
  ],
  learning_plan: [
    {
      skill: "Docker",
      action: "Complete the official Docker getting-started tutorial",
      resource_type: "interactive tutorial",
      est_hours: 4,
    },
  ],
};

describe("AnalyzeOutputSchema", () => {
  it("accepts a valid payload", () => {
    const result = AnalyzeOutputSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects match_score outside 0-100", () => {
    const result = AnalyzeOutputSchema.safeParse({ ...validPayload, match_score: 150 });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown priority value", () => {
    const bad = {
      ...validPayload,
      missing_skills: [{ skill: "Docker", priority: "critical" }],
    };
    const result = AnalyzeOutputSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects learning_plan with more than 5 items", () => {
    const step = validPayload.learning_plan[0];
    const result = AnalyzeOutputSchema.safeParse({
      ...validPayload,
      learning_plan: [step, step, step, step, step, step],
    });
    expect(result.success).toBe(false);
  });
});
