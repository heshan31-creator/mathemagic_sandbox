import { evaluate, equal } from "mathjs";

export type ValidatorKind = "numeric-tolerance" | "algebraic-equivalence";

export interface AnswerValidator {
  kind: ValidatorKind;
  /** Ground-truth expression, e.g. "22/7 * 7^2 / 2" or "77". mathjs-evaluable. */
  expectedExpression: string;
  /** Only used for numeric-tolerance: absolute epsilon around the evaluated expected value. */
  epsilon?: number;
}

interface ValidationResult {
  isCorrect: boolean;
  parsedInput: number | null;
  error?: string;
}

/**
 * Evaluates the student's raw input against the step's answer key using mathjs,
 * so "22/7", "3.14", and "3.142857" can all validate against the same
 * expectedExpression within an epsilon — rather than requiring exact string match.
 */
export function validateAnswer(rawInput: string, validator: AnswerValidator): ValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { isCorrect: false, parsedInput: null, error: "empty" };
  }

  let studentValue: number;
  let expectedValue: number;

  try {
    studentValue = evaluate(trimmed);
    expectedValue = evaluate(validator.expectedExpression);
  } catch {
    // Malformed input (e.g. partial expression while typing) — treat as incorrect,
    // not as a thrown error, so the UI doesn't crash on every keystroke.
    return { isCorrect: false, parsedInput: null, error: "unparseable" };
  }

  if (typeof studentValue !== "number" || typeof expectedValue !== "number") {
    return { isCorrect: false, parsedInput: null, error: "non-numeric-result" };
  }

  if (validator.kind === "algebraic-equivalence") {
    // mathjs `equal` handles exact/symbolic-style equivalence for evaluated results;
    // for true symbolic equivalence (unevaluated variables) this would need
    // mathjs's simplify() instead — flagged in README.
    return { isCorrect: equal(studentValue, expectedValue) as boolean, parsedInput: studentValue };
  }

  // numeric-tolerance
  const epsilon = validator.epsilon ?? 0.01;
  const withinTolerance = Math.abs(studentValue - expectedValue) <= epsilon;
  return { isCorrect: withinTolerance, parsedInput: studentValue };
}
