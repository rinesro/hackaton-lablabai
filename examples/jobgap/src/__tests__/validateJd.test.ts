import { validateJd } from "@/lib/validateJd";
import type { JdForm } from "@/lib/jdSchema";

// ── Fixtures ──────────────────────────────────────────────────────────────

/** A well-formed JD form that passes all rules */
const GOOD_JD: JdForm = {
  jobTitle: "Junior Full-Stack Engineer",
  company: "TechStartup.id",
  requirements: `Proficient in TypeScript and React.
Experience with Node.js and REST APIs.
Familiarity with Docker and CI/CD pipelines.
Good communication and teamwork skills.
Knowledge of SQL databases (PostgreSQL preferred).`,
  description: "Build and maintain customer-facing features for our SaaS platform.",
  workingHours: "Mon–Fri, hybrid",
  benefits: "BPJS, flexible hours",
  otherInfo: "",
};

/** A CV clearly different from the JD */
const UNRELATED_CV = `
Budi Santoso - Fresh Graduate
Skills: JavaScript, Python, React, Git
Experience: Intern at PT Digital Maju
Education: Universitas Indonesia, GPA 3.6
`;

// ── Blocking 1: requirements under 10 words ───────────────────────────────

describe("validateJd — blocking 1: requirements word count", () => {
  it("passes when requirements has 10+ words", () => {
    const result = validateJd(GOOD_JD, UNRELATED_CV);
    expect(result.blocking).not.toContain("val_requirements_too_short");
  });

  it("blocks when requirements is empty", () => {
    const jd: JdForm = { ...GOOD_JD, requirements: "" };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.ok).toBe(false);
    expect(result.blocking).toContain("val_requirements_too_short");
  });

  it("blocks when requirements has fewer than 10 words", () => {
    const jd: JdForm = { ...GOOD_JD, requirements: "TypeScript React Node.js" };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.ok).toBe(false);
    expect(result.blocking).toContain("val_requirements_too_short");
  });

  it("passes at exactly 10 words", () => {
    const jd: JdForm = {
      ...GOOD_JD,
      requirements: "TypeScript React Node.js Docker PostgreSQL Git AWS Python SQL Jest",
    };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.blocking).not.toContain("val_requirements_too_short");
  });
});

// ── Blocking 2: requirements near-duplicate of CV ─────────────────────────

describe("validateJd — blocking 2: requirements similarity to CV", () => {
  it("passes when requirements and CV are clearly different", () => {
    const result = validateJd(GOOD_JD, UNRELATED_CV);
    expect(result.blocking).not.toContain("val_requirements_same_as_cv");
  });

  it("blocks when requirements is identical to the CV", () => {
    const jd: JdForm = { ...GOOD_JD, requirements: UNRELATED_CV };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.ok).toBe(false);
    expect(result.blocking).toContain("val_requirements_same_as_cv");
  });

  it("skips similarity check when CV is empty", () => {
    const result = validateJd(GOOD_JD, "");
    expect(result.blocking).not.toContain("val_requirements_same_as_cv");
  });
});

// ── Warning: fewer than 2 known skill terms ────────────────────────────────

describe("validateJd — warning: skill term count", () => {
  it("does NOT warn when 2+ skill terms are present across fields", () => {
    const result = validateJd(GOOD_JD, UNRELATED_CV);
    expect(result.warnings).not.toContain("val_warn_few_skills");
  });

  it("warns (but does not block) when no skill terms are found", () => {
    const jd: JdForm = {
      ...GOOD_JD,
      requirements: "We need someone reliable who delivers on time every single day.",
      description: "",
      benefits: "",
      otherInfo: "",
    };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.ok).toBe(true); // still ok — warning only
    expect(result.warnings).toContain("val_warn_few_skills");
  });

  it("checks skill terms across all non-empty fields, not only requirements", () => {
    const jd: JdForm = {
      ...GOOD_JD,
      // requirements alone has no skill terms but description does
      requirements: "Must be reliable, a good communicator, and deliver work on time every day.",
      description: "You will work with TypeScript and React on a daily basis.",
    };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.warnings).not.toContain("val_warn_few_skills");
  });
});

// ── Combined ──────────────────────────────────────────────────────────────

describe("validateJd — combined", () => {
  it("returns ok=true, empty blocking and warnings for a valid form", () => {
    const result = validateJd(GOOD_JD, UNRELATED_CV);
    expect(result.ok).toBe(true);
    expect(result.blocking).toHaveLength(0);
  });

  it("warning does not set ok=false", () => {
    const noSkills: JdForm = {
      ...GOOD_JD,
      requirements: "We need someone reliable who delivers on time every single day.",
      description: "",
      benefits: "",
    };
    const result = validateJd(noSkills, UNRELATED_CV);
    expect(result.ok).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("multiple blocking issues are all collected", () => {
    // Empty requirements triggers blocking 1 (too short)
    // Pass CV as requirements to trigger blocking 2 (similarity)
    // Both fire: too short check fires first, similarity skipped if no cv overlap
    const jd: JdForm = { ...GOOD_JD, requirements: "" };
    const result = validateJd(jd, UNRELATED_CV);
    expect(result.ok).toBe(false);
    expect(result.blocking.length).toBeGreaterThanOrEqual(1);
  });
});
