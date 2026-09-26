"use client";

import { useEffect, useState } from "react";
import { Application, ApplicationStatus } from "@/lib/schema";
import {
  loadApplications,
  saveApplication,
  updateStatus,
  deleteApplication,
} from "@/lib/storage";
import { useT } from "@/lib/LanguageContext";
import AppForm from "@/components/AppForm";
import AppTable from "@/components/AppTable";
import Dashboard from "@/components/Dashboard";

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const t = useT();

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setApps(loadApplications());
  }, []);

  function handleAdd(data: Omit<Application, "id">) {
    const app: Application = { ...data, id: crypto.randomUUID() };
    saveApplication(app);
    setApps((prev) => [...prev, app]);
  }

  function handleStatusChange(id: string, status: ApplicationStatus) {
    updateStatus(id, status);
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  function handleDelete(id: string) {
    deleteApplication(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t("tracker_title")}</h1>
        <p className="text-sm text-gray-500">{t("tracker_subtitle")}</p>
      </div>

      <Dashboard apps={apps} />

      <AppForm onAdd={handleAdd} />

      <AppTable
        apps={apps}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
