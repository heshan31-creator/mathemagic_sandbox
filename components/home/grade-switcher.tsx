"use client";

import { useState } from "react";
import Link from "next/link";
import { CURRICULUM } from "@/lib/homepage-data";

interface GradeSwitcherProps {
  locale: string;
}

type Grade = "grade-10" | "grade-11";

const GRADE_META: Record<Grade, { label: string; unitCount: number }> = {
  "grade-10": { label: "Grade 10 · 32 units", unitCount: 32 },
  "grade-11": { label: "Grade 11 · 25 units", unitCount: 25 },
};

export function GradeSwitcher({ locale }: GradeSwitcherProps) {
  const [grade, setGrade] = useState<Grade>("grade-10");
  const topics = CURRICULUM[grade];

  return (
    <>
      <div className="mm-grade-switch" role="tablist" aria-label="Choose grade">
        {(Object.keys(GRADE_META) as Grade[]).map((g) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={grade === g}
            className={grade === g ? "mm-active" : ""}
            onClick={() => setGrade(g)}
          >
            {GRADE_META[g].label}
          </button>
        ))}
      </div>

      <div className="mm-curriculum">
        {topics.map((topic, i) => (
          <Link key={topic.num} className="mm-unit" href={`/${locale}/${grade}`}>
            <div className="mm-num">{topic.num}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <div className="mm-unit-footer">
              <span>{i < 3 ? "Start here" : "Explore unit"}</span>
              <span className="mm-bar">
                <i style={{ width: i < 3 ? "18%" : "0%" }} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
