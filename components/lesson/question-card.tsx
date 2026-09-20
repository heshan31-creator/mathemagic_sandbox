"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { useExamStore, EMPTY_STEP_RUNTIME } from "@/store/exam-store";
import { validateAnswer } from "@/lib/answer-validator";
import type { ExamDefinition } from "@/lib/exam-types";
import type { Locale } from "@/lib/i18n";
import type { LessonQuestion, QuestionStatus } from "@/lib/lesson-model";
import { questionMaxPoints } from "@/lib/lesson-model";
import { LESSON_TEXT } from "./lesson-text";

interface QuestionCardProps {
  exam: ExamDefinition;
  question: LessonQuestion;
  status: QuestionStatus;
  locale: Locale;
  totalQuestions: number;
  headingLevel: 2 | 3 | 4 | 5 | 6;
  /** True when this question became active as a result of the learner
   * completing the previous one (not on first paint) — only then do we move
   * focus, so an initial page load never steals focus from the document. */
  shouldFocusOnActivate: boolean;
  onStepCorrect?: (stepId: string) => void;
}

export function QuestionCard({
  exam,
  question,
  status,
  locale,
  totalQuestions,
  headingLevel,
  shouldFocusOnActivate,
  onStepCorrect,
}: QuestionCardProps) {
  const t = LESSON_TEXT[locale];
  const headingRef = useRef<HTMLDivElement>(null);
  const hasFocusedRef = useRef(false);

  const reopened = useExamStore(
    (s) => s.exams[exam.id]?.reopenedQuestionIds.includes(question.id) ?? false
  );
  const toggleReopen = useExamStore((s) => s.toggleReopen);

  // Move focus to the newly-opened question, but only when it opened because
  // the learner finished the previous one, and only once per activation.
  useEffect(() => {
    if (status !== "active" || !shouldFocusOnActivate || hasFocusedRef.current) return;
    hasFocusedRef.current = true;
    const node = headingRef.current;
    if (!node) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    node.focus({ preventScroll: true });
    // "Gently bring into view" — nearest, not center, so the completed
    // question above stays on screen and the page never jumps to the bottom.
    node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }, [status, shouldFocusOnActivate]);

  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const headingId = `q-${exam.id}-${question.id}-heading`;
  const label = `${t.question} ${question.index}`;

  if (status === "locked") {
    return (
      <section
        aria-labelledby={headingId}
        data-question-status="locked"
        className="rounded-2xl border border-dashed border-[#dce8dc] bg-[#f7faf6] p-5 opacity-70"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-sm">
            🔒
          </span>
          <Heading id={headingId} className="text-sm font-bold text-[#61736b]">
            {label}
          </Heading>
        </div>
        <p className="mt-1 text-sm text-[#61736b]">
          {t.lockedHint(question.index - 1)}
        </p>
      </section>
    );
  }

  if (status === "completed" && !reopened) {
    return (
      <CompletedCard
        exam={exam}
        question={question}
        locale={locale}
        headingId={headingId}
        Heading={Heading}
        label={label}
        onReopen={() => toggleReopen(exam.id, question.id)}
      />
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      data-question-status={status}
      className="rounded-2xl border-2 border-[#328E6E] bg-white p-5 shadow-[0_4px_18px_rgba(50,142,110,0.10)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          ref={headingRef}
          tabIndex={-1}
          className="outline-none focus-visible:ring-2 focus-visible:ring-[#245F4B] focus-visible:ring-offset-2"
        >
          <Heading id={headingId} className="text-base font-black text-[#173229]">
            {label}
            <span className="sr-only"> {t.ofTotal(totalQuestions)}</span>
          </Heading>
        </div>
        {status === "completed" && (
          <button
            type="button"
            onClick={() => toggleReopen(exam.id, question.id)}
            aria-expanded={true}
            className="rounded-lg border border-[#dce8dc] px-3 py-1.5 text-xs font-bold text-[#245F4B]"
          >
            {t.collapse}
          </button>
        )}
      </div>

      <QuestionSteps
        exam={exam}
        question={question}
        locale={locale}
        headingLevel={headingLevel}
        readOnly={status === "completed"}
        onStepCorrect={onStepCorrect}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface CompletedCardProps {
  exam: ExamDefinition;
  question: LessonQuestion;
  locale: Locale;
  headingId: string;
  Heading: keyof JSX.IntrinsicElements;
  label: string;
  onReopen: () => void;
}

function CompletedCard({
  exam,
  question,
  locale,
  headingId,
  Heading,
  label,
  onReopen,
}: CompletedCardProps) {
  const t = LESSON_TEXT[locale];
  const stepRuntime = useExamStore((s) => s.exams[exam.id]?.stepRuntime);

  const hintUsed = question.steps.some((s) => stepRuntime?.[s.id]?.hintUsed);
  const maxPoints = questionMaxPoints(question);

  return (
    <section
      aria-labelledby={headingId}
      data-question-status="completed"
      className="rounded-2xl border border-[#dce8dc] bg-[#f7faf6] px-5 py-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Not colour-only: a glyph + the word "completed" both carry state. */}
          <span aria-hidden="true" className="text-sm font-black text-[#245F4B]">
            ✓
          </span>
          <Heading id={headingId} className="text-sm font-bold text-[#245F4B]">
            {label} — {t.completed}
          </Heading>
        </div>

        <button
          type="button"
          onClick={onReopen}
          aria-expanded={false}
          className="rounded-lg border border-[#dce8dc] bg-white px-3 py-1.5 text-xs font-bold text-[#245F4B]"
        >
          {t.viewSolution}
        </button>
      </div>

      <p className="mt-2 text-xs text-[#61736b]">
        {t.stepsCleared(question.steps.length, maxPoints)}
        {hintUsed ? ` · ${t.hintWasUsed}` : ""}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface QuestionStepsProps {
  exam: ExamDefinition;
  question: LessonQuestion;
  locale: Locale;
  headingLevel: 2 | 3 | 4 | 5 | 6;
  readOnly: boolean;
  onStepCorrect?: (stepId: string) => void;
}

/** The step-by-step interaction inside an ACTIVE (or reopened) question.
 * This preserves the original stepper's behaviour — one step at a time,
 * 3-strike hints, permanent hint tax — but scoped to a single question. */
function QuestionSteps({
  exam,
  question,
  locale,
  headingLevel,
  readOnly,
  onStepCorrect,
}: QuestionStepsProps) {
  const t = LESSON_TEXT[locale];

  const cursor = useExamStore((s) => s.exams[exam.id]?.stepCursor[question.id] ?? 0);
  const submitStepAnswer = useExamStore((s) => s.submitStepAnswer);
  const dismissHint = useExamStore((s) => s.dismissHint);
  const advanceStep = useExamStore((s) => s.advanceStep);

  // When reopened for review, show the last step rather than the live cursor.
  const stepIndex = readOnly ? question.steps.length - 1 : Math.min(cursor, question.steps.length - 1);
  const step = question.steps[stepIndex];

  const runtime = useExamStore(
    (s) => (step ? s.exams[exam.id]?.stepRuntime[step.id] : undefined) ?? EMPTY_STEP_RUNTIME
  );

  const [answerInput, setAnswerInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Report each step's first correct answer upward (for progress persistence).
  useEffect(() => {
    if (step && runtime.correct) onStepCorrect?.(step.id);
  }, [step, runtime.correct, onStepCorrect]);

  if (!step) return null;

  const handleSubmit = () => {
    const result = validateAnswer(answerInput, step.validator);
    setValidationError(result.error === "unparseable" ? t.unparseable : null);
    submitStepAnswer(exam.id, step.id, result.isCorrect);
    if (result.isCorrect) setAnswerInput("");
  };

  const StepHeading = `h${Math.min(headingLevel + 1, 6)}` as keyof JSX.IntrinsicElements;
  const isLastStep = stepIndex === question.steps.length - 1;
  const multiStep = question.steps.length > 1;

  return (
    <div>
      {multiStep && (
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#328E6E]">
          {t.step} {stepIndex + 1} / {question.steps.length}
        </p>
      )}

      <StepHeading className="mb-1 text-[15px] font-bold text-[#173229]">
        {step.title[locale]}
      </StepHeading>
      <p className="mb-4 text-sm leading-relaxed text-[#61736b]">{step.prompt[locale]}</p>

      {!readOnly && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`answer-${exam.id}-${step.id}`} className="sr-only">
            {step.title[locale]}
          </label>
          <input
            id={`answer-${exam.id}-${step.id}`}
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            inputMode="text"
            autoComplete="off"
            placeholder={t.answerPlaceholder}
            disabled={runtime.correct}
            aria-describedby={validationError ? `answer-error-${exam.id}-${step.id}` : undefined}
            aria-invalid={validationError ? true : undefined}
            className="min-h-[44px] flex-1 rounded-lg border border-[#dce8dc] px-3 py-2 text-base text-[#173229] disabled:bg-[#f7faf6] sm:text-sm"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={runtime.correct}
            className="min-h-[44px] rounded-lg bg-[#245F4B] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {t.submit}
          </button>
        </div>
      )}

      {validationError && (
        <p
          id={`answer-error-${exam.id}-${step.id}`}
          role="alert"
          className="mt-2 text-xs font-semibold text-[#b42318]"
        >
          ⚠ {validationError}
        </p>
      )}

      {!runtime.correct && runtime.attempted && !validationError && (
        <p role="alert" className="mt-2 text-xs font-semibold text-[#b42318]">
          ✗ {t.incorrect(runtime.incorrectAttempts)}
        </p>
      )}

      {runtime.correct && (
        <div
          role="status"
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#E1EEBC] p-3 text-sm text-[#173229]"
        >
          <span>
            <span aria-hidden="true">✓ </span>
            {runtime.hintUsed ? t.correctWithHint(step.hintPenaltyPercent) : t.correctPlain}
          </span>
          {!readOnly && (
            <button
              type="button"
              onClick={() => advanceStep(exam, question.id)}
              className="min-h-[40px] rounded-lg bg-[#245F4B] px-3 py-1.5 text-xs font-bold text-white"
            >
              {isLastStep ? t.finishQuestion : t.nextStep}
            </button>
          )}
        </div>
      )}

      {runtime.hintVisible && (
        <div role="status" className="mt-3 rounded-lg border border-[#f0c674] bg-[#fef3c7] p-3 text-sm text-[#173229]">
          <strong>{t.hint}:</strong> {step.hintText[locale]}
          <button
            type="button"
            onClick={() => dismissHint(exam.id, step.id)}
            className="ml-3 text-xs font-bold text-[#245F4B] underline"
          >
            {t.dismiss}
          </button>
        </div>
      )}
    </div>
  );
}
