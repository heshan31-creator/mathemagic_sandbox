import type { ExamDefinition, ExamStep } from "./exam-types";

/**
 * A lesson Question is a group of one or more consecutive ExamSteps.
 *
 * The existing exercise definitions already encode this grouping in their
 * step ids: "q1-arc" and "q1-perimeter" are two steps of Question 1, while
 * "q3-radius-equation" is a single-step Question 3. Deriving questions from
 * that prefix means the lesson engine gains a question layer WITHOUT
 * rewriting any content file or changing the authored ExamDefinition shape.
 *
 * Steps whose id has no recognisable "qN-" prefix each become their own
 * single-step question, so malformed or legacy content degrades gracefully
 * into the old one-question-per-step behaviour instead of throwing.
 */
export interface LessonQuestion {
  /** Stable id for this question within its exam, e.g. "q1". */
  id: string;
  /** 1-based position used for display and for the progress indicator. */
  index: number;
  steps: ExamStep[];
}

const QUESTION_PREFIX = /^(q\d+)-/i;

export function groupStepsIntoQuestions(steps: ExamStep[]): LessonQuestion[] {
  const questions: LessonQuestion[] = [];
  const byId = new Map<string, LessonQuestion>();

  for (const step of steps) {
    const match = QUESTION_PREFIX.exec(step.id);
    // Fall back to the step's own id so an unprefixed step still gets a
    // unique group rather than colliding with every other unprefixed step.
    const questionId = match?.[1]?.toLowerCase() ?? step.id;

    const existing = byId.get(questionId);
    if (existing) {
      existing.steps.push(step);
      continue;
    }

    const question: LessonQuestion = {
      id: questionId,
      index: questions.length + 1,
      steps: [step],
    };
    byId.set(questionId, question);
    questions.push(question);
  }

  return questions;
}

export function getLessonQuestions(exam: ExamDefinition): LessonQuestion[] {
  return groupStepsIntoQuestions(exam.steps);
}

/** Total points available across a question's steps — used for the compact
 * completed-card summary without recomputing the whole exam score. */
export function questionMaxPoints(question: LessonQuestion): number {
  return question.steps.reduce((sum, s) => sum + s.maxPoints, 0);
}

export type QuestionStatus = "locked" | "active" | "completed";
