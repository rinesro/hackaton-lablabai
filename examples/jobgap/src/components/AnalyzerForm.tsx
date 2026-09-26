"use client";

interface Props {
  cv: string;
  jobDescription: string;
  loading: boolean;
  onCvChange: (v: string) => void;
  onJdChange: (v: string) => void;
  onSubmit: () => void;
  onSample: () => void;
}

export default function AnalyzerForm({
  cv,
  jobDescription,
  loading,
  onCvChange,
  onJdChange,
  onSubmit,
  onSample,
}: Props) {
  const ready = cv.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Inputs
        </h2>
        <button
          type="button"
          onClick={onSample}
          className="text-sm text-blue-600 hover:underline"
        >
          Try sample
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="cv">
            Your CV
          </label>
          <textarea
            id="cv"
            rows={14}
            value={cv}
            onChange={(e) => onCvChange(e.target.value)}
            placeholder="Paste your CV text here (English or Indonesian)…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="jd">
            Job Description
          </label>
          <textarea
            id="jd"
            rows={14}
            value={jobDescription}
            onChange={(e) => onJdChange(e.target.value)}
            placeholder="Paste the job description here…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!ready || loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Analyzing…" : "Analyze"}
      </button>
    </div>
  );
}
