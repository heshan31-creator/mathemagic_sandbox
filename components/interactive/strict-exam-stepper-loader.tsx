"use client";

import dynamic from "next/dynamic";
import type { ExamDefinition } from "@/lib/exam-types";
import type { Locale } from "@/lib/i18n";

export const EXAM_SHELL_MIN_HEIGHT = 480;

export interface StrictExamStepperLazyProps {
  exam: ExamDefinition;
  locale: Locale;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  progressKey?: string;
  onComplete?: () => void;
}

export const StrictExamStepperLazy = dynamic<StrictExamStepperLazyProps>(
  () => import("./strict-exam-stepper").then((m) => m.StrictExamStepper),
  { ssr: false, loading: () => <ExamStepperSkeleton /> }
);

function ExamStepperSkeleton() {
  return (
    <div
      style={{ minHeight: EXAM_SHELL_MIN_HEIGHT }}
      className="animate-pulse rounded-2xl border border-[#dce8dc] bg-[#f7faf6]"
      aria-hidden="true"
    />
  );
}
