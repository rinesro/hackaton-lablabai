"use client";

import { useRef, useState, useEffect } from "react";
import { useT } from "@/lib/LanguageContext";

type CvMode = "upload" | "manual" | "uploaded";

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Push the panel into a specific mode from outside (e.g. Try sample) */
  forceMode?: CvMode;
  onForceModeConsumed?: () => void;
}

// Simple upload-cloud SVG icon
function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

export default function CvUpload({ value, onChange, forceMode, onForceModeConsumed }: Props) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<CvMode>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // Honour external mode push (e.g. Try sample)
  useEffect(() => {
    if (forceMode) {
      setMode(forceMode);
      onForceModeConsumed?.();
    }
  }, [forceMode, onForceModeConsumed]);

  async function handleFile(file: File) {
    setUploadError(null);
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/extract-cv", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? t("cv_upload_error_default"));
      } else {
        setFileName(file.name);
        onChange(data.text as string);
        setMode("uploaded");
      }
    } catch {
      setUploadError(t("cv_network_error"));
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (mode !== "upload") return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // ── shared textarea classes (no fixed height — fills flex-1) ──────────────
  const TEXTAREA = "w-full rounded-md border text-sm resize-none flex-1 min-h-[16rem]";

  // ── STATE 1: upload drop-zone ──────────────────────────────────────────────
  if (mode === "upload") {
    return (
      <div className="flex flex-col gap-1 h-full">
        <label className="text-sm font-medium text-gray-700">{t("cv_label")}</label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex-1 min-h-[16rem] w-full rounded-md border flex flex-col items-center justify-center gap-3 cursor-default transition-colors ${
            dragging
              ? "border-2 border-dashed border-blue-400 bg-blue-50"
              : "border border-gray-300"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={onInputChange}
          />

          {uploading ? (
            <p className="text-sm text-gray-500">{t("cv_extracting")}</p>
          ) : (
            <>
              <UploadIcon />
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  {t("cv_upload_btn")}
                </button>
                <span className="text-xs text-gray-400">{t("cv_drag_drop")}</span>
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 text-center px-4">{uploadError}</p>
              )}

              <button
                type="button"
                onClick={() => { setUploadError(null); setMode("manual"); }}
                className="text-xs text-blue-600 hover:underline"
              >
                {t("cv_paste_manually")}
              </button>
            </>
          )}
        </div>

      </div>
    );
  }

  // ── STATE 2: manual textarea ───────────────────────────────────────────────
  if (mode === "manual") {
    return (
      <div className="flex flex-col gap-1 h-full">
        <label className="text-sm font-medium text-gray-700" htmlFor="cv">
          {t("cv_label")}
        </label>
        <textarea
          id="cv"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("cv_placeholder")}
          className={`${TEXTAREA} border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="button"
          onClick={() => { onChange(""); setMode("upload"); }}
          className="text-xs text-blue-600 hover:underline self-start"
        >
          {t("cv_upload_instead")}
        </button>
      </div>
    );
  }

  // ── STATE 3: after successful upload ──────────────────────────────────────
  return (
    <div className="flex flex-col gap-1 h-full">
      <label className="text-sm font-medium text-gray-700" htmlFor="cv-extracted">
        {t("cv_label")}
      </label>
      <textarea
        id="cv-extracted"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${TEXTAREA} border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <div className="flex flex-col gap-0.5 items-start">
        <span
          className="flex items-center gap-1.5 text-xs text-green-600 font-medium max-w-full"
          title={fileName ?? ""}
        >
          <span>✓</span>
          <span className="truncate">{fileName}</span>
        </span>
        <button
          type="button"
          onClick={() => { onChange(""); setFileName(null); setMode("upload"); }}
          className="text-xs text-blue-600 hover:underline"
        >
          {t("cv_replace_file")}
        </button>
      </div>
    </div>
  );
}
