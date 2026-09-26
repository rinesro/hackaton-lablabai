/**
 * @jest-environment jsdom
 */
import {
  loadApplications,
  saveApplication,
  updateStatus,
  deleteApplication,
} from "@/lib/storage";
import { Application } from "@/lib/schema";

// ---- helpers ----
function makeApp(overrides: Partial<Application> = {}): Application {
  return {
    id: "test-1",
    company: "Acme",
    role: "Engineer",
    date_applied: "2025-01-15",
    cv_version: "v1",
    status: "applied",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ---- response-rate logic (pure, mirrored from Dashboard.tsx) ----
function pct(num: number, den: number) {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

function overallRate(apps: Application[]) {
  const responded = apps.filter(
    (a) => a.status === "responded" || a.status === "interview"
  ).length;
  return pct(responded, apps.length);
}

function rateByVersion(apps: Application[]) {
  const byVersion: Record<string, { total: number; responded: number }> = {};
  for (const app of apps) {
    if (!byVersion[app.cv_version])
      byVersion[app.cv_version] = { total: 0, responded: 0 };
    byVersion[app.cv_version].total++;
    if (app.status === "responded" || app.status === "interview") {
      byVersion[app.cv_version].responded++;
    }
  }
  return Object.fromEntries(
    Object.entries(byVersion).map(([v, d]) => [v, pct(d.responded, d.total)])
  );
}

// ---- response-rate tests ----
describe("response-rate logic", () => {
  it("returns 0 for empty list", () => {
    expect(overallRate([])).toBe(0);
  });

  it("counts responded and interview as positive responses", () => {
    const apps = [
      makeApp({ id: "1", status: "applied" }),
      makeApp({ id: "2", status: "responded" }),
      makeApp({ id: "3", status: "interview" }),
      makeApp({ id: "4", status: "rejected" }),
    ];
    expect(overallRate(apps)).toBe(50); // 2/4
  });

  it("does not count rejected or ghosted", () => {
    const apps = [
      makeApp({ id: "1", status: "rejected" }),
      makeApp({ id: "2", status: "ghosted" }),
    ];
    expect(overallRate(apps)).toBe(0);
  });

  it("returns 100 when all responded", () => {
    const apps = [
      makeApp({ id: "1", status: "responded" }),
      makeApp({ id: "2", status: "responded" }),
    ];
    expect(overallRate(apps)).toBe(100);
  });

  it("computes per-cv_version rates independently", () => {
    const apps = [
      makeApp({ id: "1", cv_version: "v1", status: "responded" }),
      makeApp({ id: "2", cv_version: "v1", status: "applied" }),
      makeApp({ id: "3", cv_version: "v2", status: "interview" }),
      makeApp({ id: "4", cv_version: "v2", status: "interview" }),
    ];
    const rates = rateByVersion(apps);
    expect(rates["v1"]).toBe(50);  // 1/2
    expect(rates["v2"]).toBe(100); // 2/2
  });

  it("rounds to nearest integer", () => {
    // 1/3 = 33.33… → 33
    const apps = [
      makeApp({ id: "1", status: "responded" }),
      makeApp({ id: "2", status: "applied" }),
      makeApp({ id: "3", status: "applied" }),
    ];
    expect(overallRate(apps)).toBe(33);
  });
});

// ---- storage CRUD tests ----
describe("storage", () => {
  it("loads empty list when localStorage is empty", () => {
    expect(loadApplications()).toEqual([]);
  });

  it("saves and reloads an application", () => {
    const app = makeApp();
    saveApplication(app);
    expect(loadApplications()).toEqual([app]);
  });

  it("appends multiple applications", () => {
    const a = makeApp({ id: "1" });
    const b = makeApp({ id: "2", company: "Beta" });
    saveApplication(a);
    saveApplication(b);
    const loaded = loadApplications();
    expect(loaded).toHaveLength(2);
    expect(loaded.map((x) => x.id)).toEqual(["1", "2"]);
  });

  it("updateStatus changes only the targeted entry", () => {
    const a = makeApp({ id: "1", status: "applied" });
    const b = makeApp({ id: "2", status: "applied" });
    saveApplication(a);
    saveApplication(b);
    updateStatus("1", "interview");
    const loaded = loadApplications();
    expect(loaded.find((x) => x.id === "1")?.status).toBe("interview");
    expect(loaded.find((x) => x.id === "2")?.status).toBe("applied");
  });

  it("deleteApplication removes only the targeted entry", () => {
    saveApplication(makeApp({ id: "1" }));
    saveApplication(makeApp({ id: "2" }));
    deleteApplication("1");
    const loaded = loadApplications();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("2");
  });

  it("silently drops corrupt entries on load", () => {
    localStorage.setItem(
      "jobgap_applications",
      JSON.stringify([
        { id: "ok", company: "A", role: "R", date_applied: "2025-01-01", cv_version: "v1", status: "applied" },
        { broken: true },
        null,
      ])
    );
    const loaded = loadApplications();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("ok");
  });

  it("returns empty list when localStorage contains non-array JSON", () => {
    localStorage.setItem("jobgap_applications", JSON.stringify({ oops: true }));
    expect(loadApplications()).toEqual([]);
  });
});
