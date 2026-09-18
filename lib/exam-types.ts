import type { AnswerValidator } from "./answer-validator";
import type { Locale } from "./i18n";

export type LocalizedString = Record<Locale, string>;

export interface ExamStep {
  id: string;
  title: LocalizedString;
  prompt: LocalizedString;
  maxPoints: number;
  hintPenaltyPercent: number;
  hintText: LocalizedString;
  validator: AnswerValidator;
}

export interface ExamDefinition {
  id: string;
  title: LocalizedString;
  steps: ExamStep[];
}

export interface StepResult {
  stepId: string;
  attempted: boolean;
  correct: boolean;
  incorrectAttempts: number;
  hintUsed: boolean;
  pointsAwarded: number;
}

export interface ExamScoreSummary {
  examId: string;
  totalPoints: number;
  maxPossiblePoints: number;
  percentage: number;
  stepResults: StepResult[];
}
