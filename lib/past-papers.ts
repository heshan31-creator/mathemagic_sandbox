import type { ExamDefinition } from "./exam-types";
import type { Locale } from "./i18n";
import { OL_2023_P2_Q4 } from "@/content/paper-defs/ol-2023-p2-q4";

export interface PastPaperMeta {
  year: string;
  locale: Locale;
  title: string;
  description: string;
  exam: ExamDefinition;
}

// Keyed by locale then year. Unlike lib/content.ts (which scans MDX files
// on disk), exam content is structured data registered explicitly here —
// there's no frontmatter to parse.
const PAST_PAPERS: Record<Locale, Record<string, PastPaperMeta>> = {
  si: {
    "2023": {
      year: "2023",
      locale: "si",
      title: "O/L 2023 - කඩදාසි 2 - ප්‍රශ්නය 4",
      description:
        "සම්මිශ්‍ර රූපයක වර්ගඵලය සොයන ප්‍රශ්නය — අර්ධ වෘත්තයක් ඉවත් කළ සෘජුකෝණාස්‍රයක්. පියවරෙන් පියවර විසඳන්න.",
      exam: OL_2023_P2_Q4,
    },
  },
  ta: {
    "2023": {
      year: "2023",
      locale: "ta",
      title: "த/த 2023 - தாள் 2 - வினா 4",
      description:
        "கூட்டு உருவத்தின் பரப்பளவைக் காணும் வினா — அரைவட்டம் நீக்கப்பட்ட செவ்வகம். படிப்படியாகத் தீர்க்கவும்.",
      exam: OL_2023_P2_Q4,
    },
  },
};

export function getPastPaper(locale: Locale, year: string): PastPaperMeta | undefined {
  return PAST_PAPERS[locale]?.[year];
}

export function getAllPastPaperParams(): { locale: Locale; year: string }[] {
  return (Object.keys(PAST_PAPERS) as Locale[]).flatMap((locale) =>
    Object.keys(PAST_PAPERS[locale]).map((year) => ({ locale, year }))
  );
}
