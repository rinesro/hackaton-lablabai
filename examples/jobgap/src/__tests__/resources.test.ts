import { resolveResource } from "@/lib/resources";

describe("resolveResource", () => {
  // ── Direct catalogue matches ────────────────────────────────────────────

  it("returns the mapped resource for a known skill (exact key)", () => {
    const r = resolveResource("typescript");
    expect(r.title).toBe("TypeScript – Official Handbook");
    expect(r.url).toContain("typescriptlang.org");
  });

  it("is case-insensitive for direct keys", () => {
    const r = resolveResource("Python");
    expect(r.url).toContain("python.org");
  });

  it("trims whitespace before matching", () => {
    const r = resolveResource("  docker  ");
    expect(r.url).toContain("docker.com");
  });

  // ── Alias resolution ────────────────────────────────────────────────────

  it("resolves alias 'ts' → typescript", () => {
    const r = resolveResource("ts");
    expect(r.title).toBe("TypeScript – Official Handbook");
  });

  it("resolves alias 'js' → javascript", () => {
    const r = resolveResource("js");
    expect(r.url).toContain("mozilla.org");
  });

  it("resolves alias 'node' → nodejs", () => {
    const r = resolveResource("node");
    expect(r.url).toContain("nodejs.org");
  });

  it("resolves alias 'node.js' → nodejs", () => {
    const r = resolveResource("node.js");
    expect(r.url).toContain("nodejs.org");
  });

  it("resolves alias 'golang' → go", () => {
    const r = resolveResource("golang");
    expect(r.url).toContain("go.dev");
  });

  it("resolves alias 'k8s' → kubernetes", () => {
    const r = resolveResource("k8s");
    expect(r.url).toContain("kubernetes.io");
  });

  it("resolves alias 'reactjs' → react", () => {
    const r = resolveResource("reactjs");
    expect(r.url).toContain("react.dev");
  });

  it("resolves alias 'nextjs' → next.js", () => {
    const r = resolveResource("nextjs");
    expect(r.url).toContain("nextjs.org");
  });

  it("resolves alias 'cicd' → ci/cd (GitHub Actions)", () => {
    const r = resolveResource("cicd");
    expect(r.url).toContain("github.com");
  });

  // ── Fallback behaviour ──────────────────────────────────────────────────

  it("returns 'Search free courses' title for an unknown skill", () => {
    const r = resolveResource("some-obscure-technology-xyz");
    expect(r.title).toBe("Search free courses");
  });

  it("returns a Google search URL for an unknown skill", () => {
    const r = resolveResource("some-obscure-technology-xyz");
    expect(r.url).toContain("google.com/search");
    expect(r.url).toContain("some-obscure-technology-xyz");
  });

  it("encodes special characters in the fallback URL", () => {
    const r = resolveResource("C# programming");
    expect(r.url).toContain("google.com/search");
    // The query string must be URL-encoded
    expect(r.url).not.toContain("C# programming");
    expect(r.url).toContain("C%23");
  });

  // ── Known catalogue entries are real URLs ───────────────────────────────

  it("all catalogue resources have https URLs", () => {
    const skills = [
      "javascript", "typescript", "python", "react", "next.js", "docker",
      "kubernetes", "git", "aws", "gcp", "sql", "mongodb", "machine learning",
    ];
    for (const skill of skills) {
      const r = resolveResource(skill);
      expect(r.url).toMatch(/^https:\/\//);
    }
  });
});
