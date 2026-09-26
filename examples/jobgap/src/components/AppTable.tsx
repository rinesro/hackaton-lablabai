"use client";

import { Application, APPLICATION_STATUSES, ApplicationStatus } from "@/lib/schema";
import { useT } from "@/lib/LanguageContext";

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  applied: "text-blue-700 bg-blue-50",
  responded: "text-purple-700 bg-purple-50",
  interview: "text-green-700 bg-green-50",
  rejected: "text-red-700 bg-red-50",
  ghosted: "text-gray-500 bg-gray-100",
};

interface Props {
  apps: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export default function AppTable({ apps, onStatusChange, onDelete }: Props) {
  const t = useT();

  if (apps.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        {t("table_empty")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="py-2 pr-4">{t("table_company")}</th>
            <th className="py-2 pr-4">{t("table_role")}</th>
            <th className="py-2 pr-4">{t("table_date_applied")}</th>
            <th className="py-2 pr-4">{t("table_cv_version")}</th>
            <th className="py-2 pr-4">{t("table_status")}</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 pr-4 font-medium text-gray-800">{app.company}</td>
              <td className="py-2 pr-4 text-gray-700">{app.role}</td>
              <td className="py-2 pr-4 text-gray-600">{app.date_applied}</td>
              <td className="py-2 pr-4 text-gray-600">{app.cv_version}</td>
              <td className="py-2 pr-4">
                <select
                  value={app.status}
                  onChange={(e) =>
                    onStatusChange(app.id, e.target.value as ApplicationStatus)
                  }
                  className={`rounded px-2 py-0.5 text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_STYLE[app.status]}`}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 text-right">
                <button
                  onClick={() => onDelete(app.id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline"
                >
                  {t("table_delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
