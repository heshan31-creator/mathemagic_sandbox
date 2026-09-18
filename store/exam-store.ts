import { create } from "zustand";
import type { ExamDefinition, ExamStep, StepResult, ExamScoreSummary } from "@/lib/exam-types";

const HINT_THRESHOLD = 3;

interface StepRuntimeState {
  incorrectAttempts: number;
  hintVisible: boolean;
  hintUsed: boolean;       // sticky once shown — a hint seen can't be "un-used" by dismissing it
  correct: boolean;
  attempted: boolean;
}

interface ExamState {
  exam: ExamDefinition | null;
  currentStepIndex: number;
  stepRuntime: Record<string, StepRuntimeState>;
  finished: boolean;

  loadExam: (exam: ExamDefinition) => void;
  submitStepAnswer: (stepId: string, isCorrect: boolean) => void;
  dismissHint: (stepId: string) => void;
  advanceStep: () => void;
  computeScore: () => ExamScoreSummary;
  reset: () => void;
}

const emptyRuntime = (): StepRuntimeState => ({
  incorrectAttempts: 0,
  hintVisible: false,
  hintUsed: false,
  correct: false,
  attempted: false,
});

export const useExamStore = create<ExamState>((set, get) => ({
  exam: null,
  currentStepIndex: 0,
  stepRuntime: {},
  finished: false,

  loadExam: (exam) => {
    set({
      exam,
      currentStepIndex: 0,
      finished: false,
      stepRuntime: Object.fromEntries(exam.steps.map((s) => [s.id, emptyRuntime()])),
    });
  },

  submitStepAnswer: (stepId, isCorrect) => {
    const runtime = get().stepRuntime[stepId];
    if (!runtime) return;

    if (isCorrect) {
      set((state) => ({
        stepRuntime: {
          ...state.stepRuntime,
          [stepId]: { ...runtime, correct: true, attempted: true, hintVisible: false },
        },
      }));
      return;
    }

    const nextIncorrect = runtime.incorrectAttempts + 1;
    const shouldShowHint = nextIncorrect >= HINT_THRESHOLD;

    set((state) => ({
      stepRuntime: {
        ...state.stepRuntime,
        [stepId]: {
          ...runtime,
          attempted: true,
          incorrectAttempts: nextIncorrect,
          hintVisible: shouldShowHint,
          // Once a hint is *shown*, it's permanently "used" for grading purposes —
          // a student can't peek and then have it not count against them.
          hintUsed: runtime.hintUsed || shouldShowHint,
        },
      },
    }));
  },

  dismissHint: (stepId) => {
    const runtime = get().stepRuntime[stepId];
    if (!runtime) return;
    // Dismissing hides the panel but does NOT clear hintUsed — grading already locked it in.
    set((state) => ({
      stepRuntime: { ...state.stepRuntime, [stepId]: { ...runtime, hintVisible: false } },
    }));
  },

  advanceStep: () => {
    const { exam, currentStepIndex } = get();
    if (!exam) return;
    const isLast = currentStepIndex >= exam.steps.length - 1;
    if (isLast) {
      set({ finished: true });
    } else {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  computeScore: () => {
    const { exam, stepRuntime } = get();
    if (!exam) {
      return { examId: "", totalPoints: 0, maxPossiblePoints: 0, percentage: 0, stepResults: [] };
    }

    const stepResults: StepResult[] = exam.steps.map((step) => {
      const runtime = stepRuntime[step.id] ?? emptyRuntime();
      const pointsAwarded = computeStepPoints(step, runtime);

      return {
        stepId: step.id,
        attempted: runtime.attempted,
        correct: runtime.correct,
        incorrectAttempts: runtime.incorrectAttempts,
        hintUsed: runtime.hintUsed,
        pointsAwarded,
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

  reset: () => {
    const { exam } = get();
    if (!exam) return;
    set({
      currentStepIndex: 0,
      finished: false,
      stepRuntime: Object.fromEntries(exam.steps.map((s) => [s.id, emptyRuntime()])),
    });
  },
}));

/**
 * Strict grading rule: an unanswered step scores 0 regardless of hint state.
 * A correct step scores full points, minus the hint penalty percentage if a
 * hint was ever shown for that step — even if the student got it right afterward.
 */
function computeStepPoints(step: ExamStep, runtime: StepRuntimeState): number {
  if (!runtime.correct) return 0;
  if (!runtime.hintUsed) return step.maxPoints;

  const penalty = step.maxPoints * (step.hintPenaltyPercent / 100);
  return Math.max(0, step.maxPoints - penalty);
}
