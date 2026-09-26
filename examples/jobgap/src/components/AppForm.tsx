"use client";

import { useState } from "react";
import { APPLICATION_STATUSES, ApplicationStatus } from "@/lib/schema";
import { useT } from "@/lib/LanguageContext";

interface FormState {
  company: string;
  role: string;
  date_applied: string;
  cv_version: string;
  status: ApplicationStatus;
}

const EMPTY: FormState = {
  company: "",
  role: "",
  date_applied: new Date().toISOString().slice(0, 10),
  cv_version: "",
  status: "applied",
};

interface Props {
  onAdd: (data: FormState) => void;
}

export default function AppForm({ onAdd }: Props) {
  const t = useT();
  const [form, setForm] = useState<FormState>(EMPTY);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    setForm(EMPTY);
  }

  const valid =
    form.company.trim() &&
    form.role.trim() &&
    form.date_applied &&
    form.cv_version.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 items-end rounded-md border border-gray-200 bg-gray-50 p-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{t("form_company")}</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          placeholder={t("form_placeholder_company")}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{t("form_role")}</label>
        <input
          type="text"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          placeholder={t("form_placeholder_role")}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{t("form_date_applied")}</label>
        <input
          type="date"
          value={form.date_applied}
          onChange={(e) => set("date_applied", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{t("form_cv_version")}</label>
        <input
          type="text"
          value={form.cv_version}
          onChange={(e) => set("cv_version", e.target.value)}
          placeholder={t("form_placeholder_cv_version")}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{t("form_status")}</label>
        <select
          value={form.status}
          onChange={(e) => set("status", e.target.value as ApplicationStatus)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {t("form_add")}
      </button>
    </form>
  );
}
