"use client";

import type { Locale } from "@/lib/translations";

interface Props {
  locale:   Locale;
  onToggle: (l: Locale) => void;
}

export default function LanguageToggle({ locale, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(locale === "es" ? "en" : "es")}
      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-white/30
                 text-white hover:bg-white/10 transition-colors"
      aria-label="Toggle language"
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
