"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { useExamStore } from "@/store/exam-store";
import { useProgressStore } from "@/store/progress-store";
import { validateAnswer } from "@/lib/answer-validator";
import type { ExamDefinition } from "@/lib/exam-types";
import type { Locale } from "@/lib/i18n";

const VALIDATION_ERROR_TEXT: Record<Locale, string> = {
  si: "එය සංඛ්‍යාවක් හෝ ප්‍රකාශනයක් ලෙස කියවිය නොහැක.",
  ta: "அதை எண் அல்லது கணிதக் கூற்றாகப் படிக்க முடியவில்லை.",
};

interface UiText {
  step: string;
  submit: string;
  nextStep: string;
  finish: string;
  hint: string;
  dismiss: string;
  correctPlain: string;
  correctWithHint: (pct: number) => string;
  retake: string;
  results: string;
}

const UI_TEXT: Record<Locale, UiText> = {
  si: {
    step: "පියවර",
    submit: "ඉදිරිපත් කරන්න",
    nextStep: "ඊළඟ පියවර",
    finish: "අවසන් කරන්න",
    hint: "ඉඟිය",
    dismiss: "ඉවත් කරන්න",
    correctPlain: "නිවැරදියි.",
    correctWithHint: (pct) =>
      `නිවැරදියි — නමුත් ඉඟියක් භාවිතා කළ බැවින්, මෙම පියවර ${pct}% කින් අඩුවෙන් ලකුණු ලබා දේ.`,
    retake: "නැවත උත්සාහ කරන්න",
    results: "ප්‍රතිඵල",
  },
  ta: {
    step: "படி",
    submit: "சமர்ப்பிக்கவும்",
    nextStep: "அடுத்த படி",
    finish: "முடிக்கவும்",
    hint: "குறிப்பு",
    dismiss: "நிராகரி",
    correctPlain: "சரி.",
    correctWithHint: (pct) => `சரி — ஆனால் குறிப்பு பயன்படுத்தப்பட்டதால், இந்தப் படிக்கு ${pct}% குறைவாக மதிப்பெண் வழங்கப்படும்.`,
    retake: "மீண்டும் முயற்சிக்கவும்",
    results: "முடிவுகள்",
  },
};

interface StrictExamStepperProps {
  exam: ExamDefinition;
  locale: Locale;
  /** Lets the caller keep the semantic heading hierarchy unbroken wherever
   * this is embedded — e.g. 2 when directly under a page h1 (past-papers
   * route), higher if nested under MDX section headings elsewhere. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** When provided, every step's first-correct-answer is also recorded
   * against this progress-store item key, so a past paper's completion
   * percentage on the homepage reflects steps answered, not just "opened". */
  progressKey?: string;
  /** Fired once, the first time the whole exam is finished — lets a parent
   * (e.g. ExerciseGate, for a unit's embedded quick-check exercise) mark
   * that exercise complete without needing per-step progress tracking. */
  onComplete?: () => void;
}

export function StrictExamStepper({ exam, locale, headingLevel = 2, progressKey, onComplete }: StrictExamStepperProps) {
  const loadExam = useExamStore((s) => s.loadExam);
  const currentStepIndex = useExamStore((s) => s.currentStepIndex);
  const stepRuntime = useExamStore((s) => s.stepRuntime);
  const finished = useExamStore((s) => s.finished);
  const submitStepAnswer = useExamStore((s) => s.submitStepAnswer);
  const dismissHint = useExamStore((s) => s.dismissHint);
  const advanceStep = useExamStore((s) => s.advanceStep);
  const computeScore = useExamStore((s) => s.computeScore);
  const reset = useExamStore((s) => s.reset);
  const completeExercise = useProgressStore((s) => s.completeExercise);

  const [answerInput, setAnswerInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const t = UI_TEXT[locale];

  useEffect(() => {
    loadExam(exam);
  }, [exam, loadExam]);

  // Computed (not hooked) before any early return, so the two effects below
  // can safely depend on them without breaking the Rules of Hooks.
  const step = exam.steps[currentStepIndex];
  const runtime = step ? stepRuntime[step.id] : undefined;

  // Record each step's first correct answer against the parent item
  // (a unit or a past paper) as soon as it happens — this is what lets the
  // homepage show "2 / 4 steps" progress on a paper that's only partly done.
  useEffect(() => {
    if (progressKey && step && runtime?.correct) {
      completeExercise(progressKey, step.id);
    }
  }, [progressKey, step, runtime?.correct, completeExercise]);

  useEffect(() => {
    if (finished) {
      onComplete?.();
    }
    // Intentionally re-fires if `finished` goes false→true again after a
    // retake — completeExercise() on the caller's side is idempotent.
  }, [finished, onComplete]);

  if (finished) {
    return (
      <ScoreDashboard
        summary={computeScore()}
        exam={exam}
        locale={locale}
        headingLevel={headingLevel}
        onRetake={() => reset()}
      />
    );
  }

  if (!step || !runtime) return null;

  const handleSubmit = () => {
    const result = validateAnswer(answerInput, step.validator);
    setValidationError(result.error === "unparseable" ? VALIDATION_ERROR_TEXT[locale] : null);
    submitStepAnswer(step.id, result.isCorrect);
    setAnswerInput("");
  };

  const stepHeadingId = `exam-step-${step.id}-heading`;
  const StepHeading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const isLastStep = currentStepIndex === exam.steps.length - 1;

  return (
    <section className="rounded-2xl border border-[#dce8dc] bg-white p-5" aria-labelledby={stepHeadingId} role="group">
      <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#328E6E]">
        <span aria-live="polite">
          {t.step} {currentStepIndex + 1} / {exam.steps.length}
        </span>
        <span>{step.maxPoints} pts</span>
      </div>

      <StepHeading id={stepHeadingId} className="mb-2 text-lg font-bold text-[#173229]">
        {step.title[locale]}
      </StepHeading>
      <p className="mb-4 text-sm text-[#61736b]">{step.prompt[locale]}</p>

      <div className="flex gap-2">
        <label htmlFor={`answer-${step.id}`} className="sr-only">
          {step.title[locale]}
        </label>
        <input
          id={`answer-${step.id}`}
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          placeholder="22/7 or 3.14"
          aria-describedby={validationError ? `answer-error-${step.id}` : undefined}
          aria-invalid={validationError ? true : undefined}
          className="flex-1 rounded-lg border border-[#dce8dc] px-3 py-2 text-sm text-[#173229]"
        />
        <button
          onClick={handleSubmit}
          aria-label={`${t.submit} — ${t.step} ${currentStepIndex + 1}`}
          className="rounded-lg bg-[#245F4B] px-4 py-2 text-sm font-bold text-white"
        >
          {t.submit}
        </button>
      </div>

      {validationError && (
        <p id={`answer-error-${step.id}`} role="alert" className="mt-2 text-xs text-red-700">
          {validationError}
        </p>
      )}

      {runtime.correct && (
        <div role="status" className="mt-3 flex items-center justify-between rounded-lg bg-[#E1EEBC] p-3 text-sm text-[#173229]">
          <span>{runtime.hintUsed ? t.correctWithHint(step.hintPenaltyPercent) : t.correctPlain}</span>
          <button
            onClick={advanceStep}
            aria-label={isLastStep ? t.finish : t.nextStep}
            className="rounded-lg bg-[#245F4B] px-3 py-1.5 text-xs font-bold text-white"
          >
            {isLastStep ? t.finish : t.nextStep}
          </button>
        </div>
      )}

      {runtime.hintVisible && (
        <div role="status" className="mt-3 rounded-lg bg-[#fef3c7] p-3 text-sm text-[#173229]">
          <strong>{t.hint}:</strong> {step.hintText[locale]}
          <button onClick={() => dismissHint(step.id)} aria-label={t.dismiss} className="ml-3 text-xs font-bold text-[#245F4B] underline">
            {t.dismiss}
          </button>
        </div>
      )}
    </section>
  );
}

interface ScoreDashboardProps {
  summary: ReturnType<typeof useExamStore.getState>["computeScore"] extends (...args: any) => infer R ? R : never;
  exam: ExamDefinition;
  locale: Locale;
  headingLevel: 2 | 3 | 4 | 5 | 6;
  onRetake: () => void;
}

function ScoreDashboard({ summary, exam, locale, headingLevel, onRetake }: ScoreDashboardProps) {
  const ResultsHeading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const t = UI_TEXT[locale];

  return (
    <section className="rounded-2xl border border-[#dce8dc] bg-white p-6" aria-label={`${exam.title[locale]} ${t.results}`}>
      <ResultsHeading className="mb-1 text-xl font-bold text-[#173229]">
        {exam.title[locale]} — {t.results}
      </ResultsHeading>
      <p className="mb-5 text-3xl font-black text-[#328E6E]">
        {summary.totalPoints} / {summary.maxPossiblePoints}{" "}
        <span className="text-base font-bold text-[#61736b]">({summary.percentage.toFixed(1)}%)</span>
      </p>

      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {summary.stepResults.map((result, i) => {
          const step = exam.steps.find((s) => s.id === result.stepId)!;
          return (
            <div key={result.stepId} className="flex items-center justify-between rounded-lg border border-[#dce8dc] px-3 py-2 text-sm">
              <span>
                {t.step} {i + 1}: {step.title[locale]}
              </span>
              <span className="font-bold">
                {result.pointsAwarded} / {step.maxPoints}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={onRetake} aria-label={t.retake} className="mt-5 rounded-lg bg-[#328E6E] px-4 py-2 text-sm font-bold text-white">
        {t.retake}
      </button>
    </section>
  );
}
