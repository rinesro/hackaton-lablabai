"use client";

import { type AnalyzeOutput } from "@/lib/schema";
import { resolveResource } from "@/lib/resources";
import { useT } from "@/lib/LanguageContext";

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block w-3 h-3 ml-1 opacity-60 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

const PRIORITY_STYLE: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

interface Props {
  result: AnalyzeOutput;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="53" textAnchor="middle" fontSize="20" fontWeight="bold" fill={color}>
          {score}
        </text>
      </svg>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}

export default function AnalysisResult({ result }: Props) {
  const t = useT();

  return (
    <div className="space-y-6 mt-8 border-t border-gray-200 pt-6">
      {/* Score */}
      <div className="flex justify-center">
        <ScoreRing score={result.match_score} label={t("result_match_score")} />
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Matched */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            ✅ {t("result_matched_skills")} ({result.matched_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matched_skills.length === 0 && (
              <span className="text-sm text-gray-400">{t("result_none_found")}</span>
            )}
            {result.matched_skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-green-200 bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            ❌ {t("result_missing_skills")} ({result.missing_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.length === 0 && (
              <span className="text-sm text-gray-400">{t("result_none_missing")}</span>
            )}
            {result.missing_skills.map((ms) => (
              <span
                key={ms.skill}
                className={`rounded-full border px-3 py-0.5 text-xs font-medium ${PRIORITY_STYLE[ms.priority]}`}
                title={`Priority: ${ms.priority}`}
              >
                {ms.skill}
                <span className="ml-1 opacity-60">· {t(`priority_${ms.priority}` as Parameters<typeof t>[0])}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Plan */}
      {result.learning_plan.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📚 {t("result_learning_plan")}
          </h3>
          <ol className="space-y-3">
            {result.learning_plan.map((step, i) => {
              const resource = resolveResource(step.skill);
              return (
                <li key={i}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="text-sm min-w-0">
                      <p className="font-medium text-gray-800">{step.skill}</p>
                      <p className="text-gray-600">{step.action}</p>
                      <p className="mt-0.5 text-xs text-blue-600 group-hover:underline flex items-center">
                        {resource.title}
                        <ExternalLinkIcon />
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">~{step.est_hours}h</p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
