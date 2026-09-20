import { create } from "zustand";
import type { ExamDefinition, ExamStep, StepResult, ExamScoreSummary } from "@/lib/exam-types";
import { groupStepsIntoQuestions } from "@/lib/lesson-model";

const HINT_THRESHOLD = 3;

export interface StepRuntimeState {
  incorrectAttempts: number;
  hintVisible: boolean;
  hintUsed: boolean;       // sticky once shown — a hint seen can't be "un-used" by dismissing it
  correct: boolean;
  attempted: boolean;
}

/**
 * Per-exam runtime.
 *
 * This used to be flattened onto the store root (one `exam`, one
 * `currentStepIndex`, one `stepRuntime`), which made the store structurally
 * incapable of the lesson-stream UX: a stream shows several questions at
 * once, each holding its own independent step cursor and answer state, so a
 * single global cursor cannot represent it. Keying runtime by examId also
 * means a page embedding two exercise sets no longer has them overwrite each
 * other on mount.
 */
interface ExamRuntime {
  stepRuntime: Record<string, StepRuntimeState>;
  /** Per-question step cursor, keyed by question id ("q1", "q2", ...). */
  stepCursor: Record<string, number>;
  /** Question ids the learner has finished, in completion order. */
  completedQuestionIds: string[];
  /** Index (0-based) of the question currently open for interaction. */
  activeQuestionIndex: number;
  /** True once every question is complete. */
  finished: boolean;
  /** Question ids the learner has manually reopened from the compact state. */
  reopenedQuestionIds: string[];
}

interface ExamState {
  exams: Record<string, ExamRuntime>;

  loadExam: (exam: ExamDefinition) => void;
  submitStepAnswer: (examId: string, stepId: string, isCorrect: boolean) => void;
  dismissHint: (examId: string, stepId: string) => void;
  /** Advance within a question; completes the question when its last step is
   * cleared, and opens the next one. */
  advanceStep: (exam: ExamDefinition, questionId: string) => void;
  toggleReopen: (examId: string, questionId: string) => void;
  computeScore: (exam: ExamDefinition) => ExamScoreSummary;
  reset: (exam: ExamDefinition) => void;
}

const emptyRuntime = (): StepRuntimeState => ({
  incorrectAttempts: 0,
  hintVisible: false,
  hintUsed: false,
  correct: false,
  attempted: false,
});

function freshExamRuntime(exam: ExamDefinition): ExamRuntime {
  return {
    stepRuntime: Object.fromEntries(exam.steps.map((s) => [s.id, emptyRuntime()])),
    stepCursor: Object.fromEntries(groupStepsIntoQuestions(exam.steps).map((q) => [q.id, 0])),
    completedQuestionIds: [],
    activeQuestionIndex: 0,
    finished: false,
    reopenedQuestionIds: [],
  };
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: {},

  loadExam: (exam) => {
    // Idempotent: re-mounting a component (StrictMode double-invoke, a
    // reopened question re-rendering) must NOT wipe answers already given.
    if (get().exams[exam.id]) return;
    set((state) => ({ exams: { ...state.exams, [exam.id]: freshExamRuntime(exam) } }));
  },

  submitStepAnswer: (examId, stepId, isCorrect) => {
    const runtimeMap = get().exams[examId];
    if (!runtimeMap) return;
    const runtime = runtimeMap.stepRuntime[stepId];
    if (!runtime) return;

    const nextStep: StepRuntimeState = isCorrect
      ? { ...runtime, correct: true, attempted: true, hintVisible: false }
      : (() => {
          const nextIncorrect = runtime.incorrectAttempts + 1;
          const shouldShowHint = nextIncorrect >= HINT_THRESHOLD;
          return {
            ...runtime,
            attempted: true,
            incorrectAttempts: nextIncorrect,
            hintVisible: shouldShowHint,
            // Once a hint is *shown*, it's permanently "used" for grading —
            // a student can't peek and then have it not count against them.
            hintUsed: runtime.hintUsed || shouldShowHint,
          };
        })();

    set((state) => ({
      exams: {
        ...state.exams,
        [examId]: {
          ...runtimeMap,
          stepRuntime: { ...runtimeMap.stepRuntime, [stepId]: nextStep },
        },
      },
    }));
  },

  dismissHint: (examId, stepId) => {
    const runtimeMap = get().exams[examId];
    const runtime = runtimeMap?.stepRuntime[stepId];
    if (!runtimeMap || !runtime) return;
    // Hides the panel but does NOT clear hintUsed — grading already locked it in.
    set((state) => ({
      exams: {
        ...state.exams,
        [examId]: {
          ...runtimeMap,
          stepRuntime: { ...runtimeMap.stepRuntime, [stepId]: { ...runtime, hintVisible: false } },
        },
      },
    }));
  },

  advanceStep: (exam, questionId) => {
    const runtimeMap = get().exams[exam.id];
    if (!runtimeMap) return;

    const questions = groupStepsIntoQuestions(exam.steps);
    const qIndex = questions.findIndex((q) => q.id === questionId);
    const question = questions[qIndex];
    if (!question) return;

    const cursor = runtimeMap.stepCursor[questionId] ?? 0;
    const isLastStepOfQuestion = cursor >= question.steps.length - 1;

    if (!isLastStepOfQuestion) {
      set((state) => ({
        exams: {
          ...state.exams,
          [exam.id]: {
            ...runtimeMap,
            stepCursor: { ...runtimeMap.stepCursor, [questionId]: cursor + 1 },
          },
        },
      }));
      return;
    }

    // Last step cleared → complete this question and open the next one.
    const alreadyComplete = runtimeMap.completedQuestionIds.includes(questionId);
    const completedQuestionIds = alreadyComplete
      ? runtimeMap.completedQuestionIds
      : [...runtimeMap.completedQuestionIds, questionId];

    set((state) => ({
      exams: {
        ...state.exams,
        [exam.id]: {
          ...runtimeMap,
          completedQuestionIds,
          // Collapse the just-finished question back to its compact form even
          // if the learner had manually reopened it earlier.
          reopenedQuestionIds: runtimeMap.reopenedQuestionIds.filter((id) => id !== questionId),
          activeQuestionIndex: Math.max(runtimeMap.activeQuestionIndex, qIndex + 1),
          finished: completedQuestionIds.length >= questions.length,
        },
      },
    }));
  },

  toggleReopen: (examId, questionId) => {
    const runtimeMap = get().exams[examId];
    if (!runtimeMap) return;
    const isOpen = runtimeMap.reopenedQuestionIds.includes(questionId);
    set((state) => ({
      exams: {
        ...state.exams,
        [examId]: {
          ...runtimeMap,
          reopenedQuestionIds: isOpen
            ? runtimeMap.reopenedQuestionIds.filter((id) => id !== questionId)
            : [...runtimeMap.reopenedQuestionIds, questionId],
        },
      },
    }));
  },

  computeScore: (exam) => {
    const runtimeMap = get().exams[exam.id];
    const stepRuntime = runtimeMap?.stepRuntime ?? {};

    const stepResults: StepResult[] = exam.steps.map((step) => {
      const runtime = stepRuntime[step.id] ?? emptyRuntime();
      return {
        stepId: step.id,
        attempted: runtime.attempted,
        correct: runtime.correct,
        incorrectAttempts: runtime.incorrectAttempts,
        hintUsed: runtime.hintUsed,
        pointsAwarded: computeStepPoints(step, runtime),
      };
    });

    const totalPoints = stepResults.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const maxPossiblePoints = exam.steps.reduce((sum, s) => sum + s.maxPoints, 0);

    return {
      examId: exam.id,
      totalPoints,
      maxPossiblePoints,
      percentage: maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 100 : 0,
      stepResults,
    };
  },

  reset: (exam) => {
    set((state) => ({ exams: { ...state.exams, [exam.id]: freshExamRuntime(exam) } }));
  },
}));

/**
 * Strict grading rule: an unanswered step scores 0 regardless of hint state.
 * A correct step scores full points, minus the hint penalty percentage if a
 * hint was ever shown for that step — even if answered correctly afterward.
 */
function computeStepPoints(step: ExamStep, runtime: StepRuntimeState): number {
  if (!runtime.correct) return 0;
  if (!runtime.hintUsed) return step.maxPoints;

  const penalty = step.maxPoints * (step.hintPenaltyPercent / 100);
  return Math.max(0, step.maxPoints - penalty);
}

/** Stable empty runtime so selectors can read a not-yet-loaded exam without
 * creating a new object every render (which would loop useSyncExternalStore). */
export const EMPTY_STEP_RUNTIME: StepRuntimeState = Object.freeze(emptyRuntime());
