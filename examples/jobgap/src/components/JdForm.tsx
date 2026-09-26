"use client";

import { useRef, useState } from "react";
import { type JdForm, EMPTY_JD_FORM } from "@/lib/jdSchema";
import { validateJd } from "@/lib/validateJd";
import { useT } from "@/lib/LanguageContext";
import type { DictKey } from "@/lib/i18n";

interface Props {
  value: JdForm;
  onChange: (v: JdForm) => void;
  cv: string; // needed to run validateJd after image fill
  blocking: string[];
  warnings: string[];
  onBlockingChange: (b: string[]) => void;
  onWarningsChange: (w: string[]) => void;
}

const INPUT_BASE =
  "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const BORDER_NORMAL  = "border-gray-300";
const BORDER_ERROR   = "border-red-400";
const BORDER_EMPTY   = "border-amber-300"; // field left empty after extraction

export default function JdForm({
  value, onChange, cv,
  blocking, warnings,
  onBlockingChange, onWarningsChange,
}: Props) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  // Fields that were empty after the last image extraction
  const [emptyAfterExtract, setEmptyAfterExtract] = useState<Set<keyof JdForm>>(new Set());

  function set(field: keyof JdForm, v: string) {
    // Clear the "empty after extract" highlight when user edits
    setEmptyAfterExtract((prev) => { const s = new Set(prev); s.delete(field); return s; });
    onChange({ ...value, [field]: v });
  }

  async function handleImageFile(file: File) {
    setUploadError(null);
    setExtracting(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/extract-jd", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? t("jd_extract_error_default"));
        return;
      }
      const filled = data as JdForm;
      setFileName(file.name);
      onChange(filled);

      // Highlight fields that stayed empty
      const emptyFields = new Set<keyof JdForm>();
      for (const key of Object.keys(EMPTY_JD_FORM) as (keyof JdForm)[]) {
        if (!filled[key] || !(filled[key] as string).trim()) {
          emptyFields.add(key);
        }
      }
      setEmptyAfterExtract(emptyFields);

      // Run validation and surface issues immediately
      const check = validateJd(filled, cv);
      onBlockingChange(check.blocking);
      onWarningsChange(check.warnings);
    } catch {
      setUploadError(t("jd_network_error"));
    } finally {
      setExtracting(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  }

  function fieldClass(field: keyof JdForm, isTextarea = false): string {
    const base = `${INPUT_BASE}${isTextarea ? " resize-none" : ""}`;
    if (blocking.length > 0 && field === "requirements") return `${base} ${BORDER_ERROR}`;
    if (emptyAfterExtract.has(field)) return `${base} ${BORDER_EMPTY}`;
    return `${base} ${BORDER_NORMAL}`;
  }

  /** Translate a message if it looks like a dict key, otherwise pass through. */
  function translateMsg(msg: string): string {
    try { return t(msg as DictKey); } catch { return msg; }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {t("jd_label")}
        </label>

        {/* Upload image button */}
        <div className="flex flex-col items-end gap-0.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,.jpg,.jpeg,.png"
            className="hidden"
            onChange={onInputChange}
          />
          {fileName ? (
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-green-600 font-medium truncate max-w-[140px]" title={fileName}>
                ✓ {fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  setEmptyAfterExtract(new Set());
                  setUploadError(null);
                  inputRef.current?.click();
                }}
                className="text-blue-600 hover:underline"
              >
                {t("jd_replace_image")}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={extracting}
              className="text-xs text-blue-600 hover:underline disabled:opacity-50"
            >
              {extracting ? t("jd_extracting") : t("jd_upload_image")}
            </button>
          )}
          {uploadError && (
            <p className="text-xs text-red-600 text-right max-w-[220px]">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Job Title */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-title">
          {t("jd_field_job_title")}
          {emptyAfterExtract.has("jobTitle") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <input
          id="jd-title"
          type="text"
          value={value.jobTitle ?? ""}
          onChange={(e) => set("jobTitle", e.target.value)}
          placeholder={t("jd_placeholder_job_title")}
          className={fieldClass("jobTitle")}
        />
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-company">
          {t("jd_field_company")}
          {emptyAfterExtract.has("company") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <input
          id="jd-company"
          type="text"
          value={value.company ?? ""}
          onChange={(e) => set("company", e.target.value)}
          placeholder={t("jd_placeholder_company")}
          className={fieldClass("company")}
        />
      </div>

      {/* Requirements */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-req">
          {t("jd_field_requirements")} <span className="text-red-500">*</span>
          {emptyAfterExtract.has("requirements") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <textarea
          id="jd-req"
          rows={8}
          value={value.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          placeholder={t("jd_placeholder_requirements")}
          className={fieldClass("requirements", true)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-desc">
          {t("jd_field_description")}
          {emptyAfterExtract.has("description") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <textarea
          id="jd-desc"
          rows={4}
          value={value.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder={t("jd_placeholder_description")}
          className={fieldClass("description", true)}
        />
      </div>

      {/* Working Hours */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-hours">
          {t("jd_field_working_hours")}
          {emptyAfterExtract.has("workingHours") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <input
          id="jd-hours"
          type="text"
          value={value.workingHours ?? ""}
          onChange={(e) => set("workingHours", e.target.value)}
          placeholder={t("jd_placeholder_working_hours")}
          className={fieldClass("workingHours")}
        />
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-benefits">
          {t("jd_field_benefits")}
          {emptyAfterExtract.has("benefits") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <input
          id="jd-benefits"
          type="text"
          value={value.benefits ?? ""}
          onChange={(e) => set("benefits", e.target.value)}
          placeholder={t("jd_placeholder_benefits")}
          className={fieldClass("benefits")}
        />
      </div>

      {/* Other Info */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500" htmlFor="jd-other">
          {t("jd_field_other_info")}
          {emptyAfterExtract.has("otherInfo") && (
            <span className="ml-1 text-amber-500">{t("jd_not_found_in_image")}</span>
          )}
        </label>
        <textarea
          id="jd-other"
          rows={2}
          value={value.otherInfo ?? ""}
          onChange={(e) => set("otherInfo", e.target.value)}
          placeholder={t("jd_placeholder_other_info")}
          className={fieldClass("otherInfo", true)}
        />
      </div>

      {/* Blocking errors */}
      {blocking.length > 0 && (
        <ul className="space-y-0.5">
          {blocking.map((msg, i) => (
            <li key={i} className="text-xs text-red-600">• {translateMsg(msg)}</li>
          ))}
        </ul>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <ul className="space-y-0.5">
          {warnings.map((msg, i) => (
            <li key={i} className="text-xs text-yellow-600">⚠ {translateMsg(msg)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
