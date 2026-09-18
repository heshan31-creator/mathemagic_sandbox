"use client";

import { useProgressStore } from "@/store/progress-store";
import { percentComplete } from "@/lib/progress-types";

interface UnitProgressBadgeProps {
  itemKey: string;
}

export function UnitProgressBadge({ itemKey }: UnitProgressBadgeProps) {
  const item = useProgressStore((s) => s.items[itemKey]);
  if (!item || item.totalExercises === 0) return null;

  const percent = percentComplete(item);
  const done = item.completedExerciseIds.length;

  return (
    <div
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce8dc] bg-[#f1f7e8] px-3 py-1.5 text-xs font-bold text-[#245F4B]"
      role="status"
    >
      <span aria-hidden="true">{percent === 100 ? "✓" : "◐"}</span>
      <span>
        {done} / {item.totalExercises} exercises complete ({percent}%)
      </span>
    </div>
  );
}
