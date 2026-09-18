import type { Locale } from "./i18n";

/**
 * A "learning item" is anything that can be visited and has one or more
 * gated exercises inside it — a grade unit, or a past paper. Both are
 * tracked identically so the homepage can show one unified recent/progress
 * list instead of two separate models.
 */
export type ProgressItemKind = "unit" | "past-paper";

export interface ProgressItem {
  /** Stable id, e.g. "si/grade-10/01-perimeter" or "si/past-papers/2023". */
  key: string;
  kind: ProgressItemKind;
  locale: Locale;
  title: string;
  /** Path (starting with "/") the "Continue" link should point to. */
  href: string;
  /** Total gated exercises inside this item (unit exercises, or exam steps). */
  totalExercises: number;
  /** Ids of exercises completed at least once. A Set would be nicer, but
   * plain arrays survive JSON (localStorage) round-trips without a custom
   * (de)serializer. */
  completedExerciseIds: string[];
  lastAccessedAt: number;
}

export function percentComplete(item: Pick<ProgressItem, "totalExercises" | "completedExerciseIds">): number {
  if (item.totalExercises <= 0) return 0;
  return Math.round((item.completedExerciseIds.length / item.totalExercises) * 100);
}
