"use client";

import type { Locale } from "@/lib/i18n";
import { LESSON_TEXT } from "./lesson-text";

interface LessonProgressProps {
  completed: number;
  total: number;
  activeIndex: number;
  locale: Locale;
}

/**
 * Secondary-by-design progress readout. Dots on wider screens, a bar on
 * small ones. State is never communicated by colour alone: the numeric
 * "3 / 7" label is the primary signal and the dots carry a title/shape
 * difference too.
 */
export function LessonProgress({ completed, total, activeIndex, locale }: LessonProgressProps) {
  const t = LESSON_TEXT[locale];
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-3"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={completed}
      aria-valuetext={t.progressLabel(completed, total)}
    >
      <span className="whitespace-nowrap text-xs font-black uppercase tracking-wide text-[#328E6E]">
        {t.progressLabel(Math.min(activeIndex + 1, total), total)}
      </span>

      {/* Mobile: a single bar. */}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8efe5] sm:hidden">
        <div
          className="h-full rounded-full bg-[#328E6E] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Desktop: discrete dots, one per question. */}
      <ol className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const done = i < completed;
          const active = i === activeIndex && !done;
          return (
            <li
              key={i}
              className={[
                "h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                done ? "w-2.5 bg-[#328E6E]" : active ? "w-6 bg-[#90C67C]" : "w-2.5 bg-[#e8efe5]",
              ].join(" ")}
            />
          );
        })}
      </ol>
    </div>
  );
}
