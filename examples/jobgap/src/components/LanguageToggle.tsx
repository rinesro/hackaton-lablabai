"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["en", "id"];

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex rounded border border-gray-600 overflow-hidden text-xs font-medium">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={
            locale === l
              ? "px-2 py-1 bg-gray-100 text-gray-900"
              : "px-2 py-1 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
          }
          aria-pressed={locale === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
