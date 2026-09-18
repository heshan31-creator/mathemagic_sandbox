"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useProgressStore, selectRecentItems, selectOverallPercent } from "@/store/progress-store";
import { percentComplete } from "@/lib/progress-types";

const KIND_LABEL: Record<string, string> = {
  unit: "Unit",
  "past-paper": "Past paper",
};

export function ProgressPanel() {
  const recent = useProgressStore((s) => selectRecentItems(s, 8));
  const overallPercent = useProgressStore(selectOverallPercent);

  if (recent.length === 0) {
    return (
      <div className="mm-progress-empty">
        <p>
          Open a unit or a past paper and your progress shows up here automatically — no
          account needed. It&rsquo;s saved on this device.
        </p>
        <Link className="mm-text-link" href="#curriculum">
          Start with a unit →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mm-progress-overall">
        <div className="mm-progress-overall-ring" style={{ "--pct": `${overallPercent}%` } as CSSProperties}>
          <span>{overallPercent}%</span>
        </div>
        <div>
          <strong>Your overall progress</strong>
          <p>
            Across {recent.length} visited item{recent.length > 1 ? "s" : ""} — units and past
            papers combined, weighted by number of exercises.
          </p>
        </div>
      </div>

      <div className="mm-progress-grid">
        {recent.map((item) => {
          const percent = percentComplete(item);
          return (
            <Link key={item.key} className="mm-progress-card" href={item.href}>
              <div className="mm-progress-card-top">
                <span className="mm-tag">{KIND_LABEL[item.kind] ?? item.kind}</span>
                <span>{percent}%</span>
              </div>
              <h3>{item.title}</h3>
              <div className="mm-bar" style={{ width: "100%" }}>
                <i style={{ width: `${percent}%` }} />
              </div>
              <div className="mm-progress-card-foot">
                <span>
                  {item.completedExerciseIds.length} / {item.totalExercises} exercises
                </span>
                <span>{percent === 100 ? "Review →" : "Continue →"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
