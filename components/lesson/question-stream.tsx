"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useExamStore } from "@/store/exam-store";
import { useProgressStore } from "@/store/progress-store";
import { getLessonQuestions, type QuestionStatus } from "@/lib/lesson-model";
import type { ExamDefinition } from "@/lib/exam-types";
import type { Locale } from "@/lib/i18n";
import { QuestionCard } from "./question-card";
import { LessonProgress } from "./lesson-progress";
import { LESSON_TEXT } from "./lesson-text";

export interface QuestionStreamProps {
  exam: ExamDefinition;
  locale: Locale;
  /** Heading level for each question card, so the lesson's h1→h2→h3 chain
   * stays unbroken wherever the stream is embedded in MDX. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Progress-store item key, e.g. "si/grade-10/01-perimeter". When set,
   * each step's first correct answer is persisted for the homepage. */
  progressKey?: string;
  /** Fired once when every question is complete. */
  onComplete?: () => void;
}

/**
 * The lesson engine.
 *
 * Renders every question in one vertical stream: completed questions stay
 * on the page in a compact form, the active question is fully interactive,
 * and later questions render as lightweight locked shells. Only the active
 * (or a manually reopened) question mounts its full interaction, so a
 * 10-question lesson does not pay for 10 live question bodies at once.
 */
export function QuestionStream({
  exam,
  locale,
  headingLevel = 3,
  progressKey,
  onComplete,
}: QuestionStreamProps) {
  const t = LESSON_TEXT[locale];
  const questions = useMemo(() => getLessonQuestions(exam), [exam]);

  const loadExam = useExamStore((s) => s.loadExam);
  const reset = useExamStore((s) => s.reset);
  const computeScore = useExamStore((s) => s.computeScore);
  const activeQuestionIndex = useExamStore((s) => s.exams[exam.id]?.activeQuestionIndex ?? 0);
  const completedQuestionIds = useExamStore((s) => s.exams[exam.id]?.completedQuestionIds);
  const finished = useExamStore((s) => s.exams[exam.id]?.finished ?? false);

  const completeExercise = useProgressStore((s) => s.completeExercise);

  useEffect(() => {
    loadExam(exam);
  }, [exam, loadExam]);

  // Tracks whether the active index has changed since first paint. Only then
  // may a newly-active question take focus — otherwise landing on the lesson
  // would yank the viewport to the question block on load. useState (not a
  // ref) because this value IS read during render, and reading a ref during
  // render is unsafe under React 19 concurrent rendering.
  const [initialActiveIndex] = useState(activeQuestionIndex);
  const hasAdvanced = activeQuestionIndex !== initialActiveIndex;

  const handleStepCorrect = useCallback(
    (stepId: string) => {
      if (progressKey) completeExercise(progressKey, stepId);
    },
    [progressKey, completeExercise]
  );

  const completedCount = completedQuestionIds?.length ?? 0;

  useEffect(() => {
    if (finished) onComplete?.();
  }, [finished, onComplete]);

  const summary = finished ? computeScore(exam) : null;

  return (
    <div className="not-prose">
      <div className="sticky top-[72px] z-10 -mx-4 mb-5 border-b border-[#dce8dc] bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <LessonProgress
          completed={completedCount}
          total={questions.length}
          activeIndex={activeQuestionIndex}
          locale={locale}
        />
      </div>

      {/* Completion announcements for screen readers, without stealing focus. */}
      <p className="sr-only" role="status" aria-live="polite">
        {finished
          ? t.lessonComplete
          : activeQuestionIndex > 0
            ? t.questionAnnounce(activeQuestionIndex + 1)
            : ""}
      </p>

      <ol className="space-y-4">
        {questions.map((question, i) => {
          const isComplete = completedQuestionIds?.includes(question.id) ?? false;
          const status: QuestionStatus = isComplete
            ? "completed"
            : i === activeQuestionIndex
              ? "active"
              : i < activeQuestionIndex
                ? "active" // skipped-but-open (defensive; shouldn't normally occur)
                : "locked";

          return (
            <li key={question.id} className="lesson-question-reveal">
              <QuestionCard
                exam={exam}
                question={question}
                status={status}
                locale={locale}
                totalQuestions={questions.length}
                headingLevel={headingLevel}
                shouldFocusOnActivate={hasAdvanced && i === activeQuestionIndex}
                onStepCorrect={handleStepCorrect}
              />
            </li>
          );
        })}
      </ol>

      {finished && summary && (
        <section
          role="status"
          className="mt-5 rounded-2xl border-2 border-[#328E6E] bg-[#E1EEBC] p-5"
          aria-label={t.lessonComplete}
        >
          <p className="text-base font-black text-[#173229]">
            <span aria-hidden="true">🎉 </span>
            {t.lessonComplete}
          </p>
          <p className="mt-1 text-sm text-[#245F4B]">
            {t.lessonCompleteBody(
              Math.round(summary.totalPoints * 10) / 10,
              summary.maxPossiblePoints
            )}
          </p>
          <button
            type="button"
            onClick={() => reset(exam)}
            className="mt-3 min-h-[40px] rounded-lg bg-[#245F4B] px-4 py-2 text-sm font-bold text-white"
          >
            {t.restart}
          </button>
        </section>
      )}
    </div>
  );
}
