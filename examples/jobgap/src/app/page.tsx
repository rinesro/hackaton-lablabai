"use client";

import { useState } from "react";
import { type AnalyzeOutput } from "@/lib/schema";
import { type JdForm, EMPTY_JD_FORM } from "@/lib/jdSchema";
import { SAMPLE_CV, SAMPLE_JD_FORM } from "@/lib/sample";
import { validateJd } from "@/lib/validateJd";
import { useLanguage, useT } from "@/lib/LanguageContext";
import AnalysisResult from "@/components/AnalysisResult";
import CvUpload from "@/components/CvUpload";
import JdFormComponent from "@/components/JdForm";

export default function AnalyzerPage() {
  const [cv, setCv] = useState("");
  const [jd, setJd] = useState<JdForm>(EMPTY_JD_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jdBlocking, setJdBlocking] = useState<string[]>([]);
  const [jdWarnings, setJdWarnings] = useState<string[]>([]);
  const [cvForceMode, setCvForceMode] = useState<"manual" | undefined>(undefined);
  const { locale } = useLanguage();
  const t = useT();

  function handleJdChange(v: JdForm) {
    setJd(v);
    // Clear blocking errors on edit; re-validate lazily on submit
    setJdBlocking([]);
    setJdWarnings([]);
  }

  async function handleAnalyze() {
    const check = validateJd(jd, cv);
    setJdBlocking(check.blocking);
    setJdWarnings(check.warnings);
    if (!check.ok) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jd, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Server may return blocking issues from its own validation (as keys)
        if (Array.isArray(data?.issues)) {
          setJdBlocking(data.issues as string[]);
        } else {
          setError(
            typeof data?.error === "string"
              ? data.error
              : t("err_generic")
          );
        }
        return;
      }
      setResult(data as AnalyzeOutput);
    } catch {
      setError(t("err_network"));
    } finally {
      setLoading(false);
    }
  }

  const ready = cv.trim().length > 0 && jd.requirements.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Page title + action row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("analyzer_title")}</h1>
          <p className="text-sm text-gray-500">{t("analyzer_subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setCv(SAMPLE_CV);
              setJd(SAMPLE_JD_FORM);
              setResult(null);
              setError(null);
              setJdBlocking([]);
              setJdWarnings([]);
              setCvForceMode("manual");
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("btn_try_sample")}
          </button>
        </div>
      </div>

      {/* Two-column input grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch gap-6 md:gap-10 lg:gap-16">
        <CvUpload
          value={cv}
          onChange={setCv}
          forceMode={cvForceMode}
          onForceModeConsumed={() => setCvForceMode(undefined)}
        />

        <JdFormComponent
          value={jd}
          onChange={handleJdChange}
          cv={cv}
          blocking={jdBlocking}
          warnings={jdWarnings}
          onBlockingChange={setJdBlocking}
          onWarningsChange={setJdWarnings}
        />
      </div>

      {/* Analyze button */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!ready || loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t("btn_analyzing") : t("btn_analyze")}
      </button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && <AnalysisResult result={result} />}
    </div>
  );
}
