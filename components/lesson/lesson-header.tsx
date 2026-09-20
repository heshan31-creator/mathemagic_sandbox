import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface LessonHeaderProps {
  locale: Locale;
  /** e.g. "grade-10" — used for the breadcrumb link and label. */
  grade: "grade-10" | "grade-11";
  title: string;
  /** The unit's frontmatter description, used as the learning objective. */
  objective: string;
}

const GRADE_LABEL: Record<Locale, Record<"grade-10" | "grade-11", string>> = {
  si: { "grade-10": "10 ශ්‍රේණිය", "grade-11": "11 ශ්‍රේණිය" },
  ta: { "grade-10": "தரம் 10", "grade-11": "தரம் 11" },
};

/**
 * Server component — intentionally not a client component, so the lesson's
 * crawlable heading, breadcrumb and objective stay in the static HTML and
 * the existing SEO/heading-hierarchy guarantees are untouched.
 */
export function LessonHeader({ locale, grade, title, objective }: LessonHeaderProps) {
  return (
    <header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#61736b]">
          <li>
            <Link href={`/${locale}`} className="hover:text-[#328E6E]">
              Mathemagic
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${locale}/${grade}`} className="hover:text-[#328E6E]">
              {GRADE_LABEL[locale][grade]}
            </Link>
          </li>
        </ol>
      </nav>

      {/* The page's only h1. */}
      <h1 className="text-2xl font-black leading-tight text-[#173229] sm:text-3xl">{title}</h1>

      {objective && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#61736b]">{objective}</p>
      )}
    </header>
  );
}
