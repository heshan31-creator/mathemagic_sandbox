"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { useProgressStore } from "@/store/progress-store";

interface ExerciseGateProps {
  /** The parent unit/paper's progress key, e.g. "si/grade-10/01-perimeter". */
  itemKey: string;
  /** Stable id for THIS exercise within the item, e.g. "ex-1-sector". */
  exerciseId: string;
  /** 1-based position, purely for display ("Exercise 2 of 3"). */
  index: number;
  total: number;
  title: string;
  /** Exercise id that must already be complete for this one to unlock.
   * Omit for the first exercise in a unit, which is always open. */
  requiredExerciseId?: string;
  /** A SINGLE React element — the embedded interactive/exam component,
   * e.g. <InteractiveSectorLazy .../> or <StrictExamStepperLazy .../>.
   * It must accept an `onComplete?: () => void` prop; ExerciseGate injects
   * that callback itself via cloneElement (entirely client-side) rather
   * than accepting it as a render-prop function, because the unit MDX that
   * builds this element is a Server Component and functions can't cross
   * the server→client boundary as props. */
  children: ReactNode;
}

/**
 * Renders one exercise slot inside a unit (or paper) page. Exercises are
 * shown in document order, but a locked exercise renders a closed card
 * instead of its real content — so a student genuinely cannot see or
 * interact with exercise N+1 until exercise N is marked complete. This is
 * enforced client-side against the persisted progress store, so the lock
 * state also survives a page reload (unlike the in-session-only exam-store
 * used for scoring individual exam steps).
 */
export function ExerciseGate({
  itemKey,
  exerciseId,
  index,
  total,
  title,
  requiredExerciseId,
  children,
}: ExerciseGateProps) {
  const item = useProgressStore((s) => s.items[itemKey]);
  const completeExercise = useProgressStore((s) => s.completeExercise);

  const isComplete = item?.completedExerciseIds.includes(exerciseId) ?? false;
  const isUnlocked = !requiredExerciseId || (item?.completedExerciseIds.includes(requiredExerciseId) ?? false);

  const markComplete = () => completeExercise(itemKey, exerciseId);

  const content = isValidElement(children)
    ? cloneElement(children as ReactElement<{ onComplete?: () => void }>, { onComplete: markComplete })
    : children;

  return (
    <section className="mb-6 last:mb-0" aria-labelledby={`exercise-${exerciseId}-heading`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 id={`exercise-${exerciseId}-heading`} className="text-sm font-black uppercase tracking-wide text-[#328E6E]">
          Exercise {index} of {total} — {title}
        </h3>
        {isComplete && (
          <span className="rounded-full bg-[#E1EEBC] px-2.5 py-1 text-xs font-bold text-[#245F4B]">✓ Complete</span>
        )}
      </div>

      {isUnlocked ? (
        content
      ) : (
        <div
          className="flex items-center gap-3 rounded-2xl border border-dashed border-[#dce8dc] bg-[#f7faf6] p-6 text-sm text-[#61736b]"
          role="status"
        >
          <span aria-hidden="true" className="text-lg">
            🔒
          </span>
          <span>Complete exercise {index - 1} above to unlock this one.</span>
        </div>
      )}
    </section>
  );
}
