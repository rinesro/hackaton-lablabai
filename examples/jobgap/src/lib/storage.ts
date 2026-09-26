import {
  Application,
  ApplicationSchema,
  ApplicationStatus,
} from "./schema";

const STORAGE_KEY = "jobgap_applications";

export function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each entry; silently drop corrupt ones
    return parsed.flatMap((item) => {
      const r = ApplicationSchema.safeParse(item);
      return r.success ? [r.data] : [];
    });
  } catch {
    return [];
  }
}

function persist(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export function saveApplication(app: Application): void {
  const apps = loadApplications();
  persist([...apps, app]);
}

export function updateStatus(id: string, status: ApplicationStatus): void {
  const apps = loadApplications().map((a) =>
    a.id === id ? { ...a, status } : a
  );
  persist(apps);
}

export function deleteApplication(id: string): void {
  persist(loadApplications().filter((a) => a.id !== id));
}
