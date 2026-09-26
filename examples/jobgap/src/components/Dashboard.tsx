"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Application } from "@/lib/schema";
import { useT } from "@/lib/LanguageContext";

interface Props {
  apps: Application[];
}

function pct(num: number, den: number) {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export default function Dashboard({ apps }: Props) {
  const t = useT();
  if (apps.length === 0) return null;

  // Overall rate
  const responded = apps.filter(
    (a) => a.status === "responded" || a.status === "interview"
  ).length;
  const overallRate = pct(responded, apps.length);

  // Per cv_version
  const byVersion: Record<string, { total: number; responded: number }> = {};
  for (const app of apps) {
    if (!byVersion[app.cv_version]) byVersion[app.cv_version] = { total: 0, responded: 0 };
    byVersion[app.cv_version].total++;
    if (app.status === "responded" || app.status === "interview") {
      byVersion[app.cv_version].responded++;
    }
  }
  const chartData = Object.entries(byVersion).map(([version, v]) => ({
    version,
    rate: pct(v.responded, v.total),
  }));

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {t("dashboard_title")}
      </h2>

      {/* Overall stat */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-blue-600">{overallRate}%</span>
        <span className="text-sm text-gray-600">
          {t("dashboard_overall_rate")} ({responded} / {apps.length} {t("dashboard_applications")})
        </span>
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            {t("dashboard_chart_label")}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="version" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.rate >= 50 ? "#22c55e" : entry.rate >= 25 ? "#f59e0b" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
