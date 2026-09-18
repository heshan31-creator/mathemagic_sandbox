"use client";

import { useState } from "react";

const CHOICES = ["Vertically opposite", "Corresponding", "Alternate"];

export function HeroDemo() {
  const [active, setActive] = useState(1);

  return (
    <div className="mm-demo" aria-label="Interactive learning preview">
      <div className="mm-demo-top">
        <span>LIVE PRACTICE</span>
        <span>Grade 10 · Unit 5</span>
      </div>
      <div className="mm-demo-window">
        <div className="mm-demo-course">
          <div>
            <div className="mm-course-tag">Congruence of triangles</div>
            <h3>Find the missing angle</h3>
          </div>
          <strong>64%</strong>
        </div>
        <div className="mm-progress" aria-label="64 percent complete">
          <i />
        </div>
        <div className="mm-step">
          <div className="mm-step-label">Step 2 of 4</div>
          <div className="mm-eq">∠A = 48°</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 9 }}>
            Which rule justifies this step?
          </div>
          <div className="mm-choices">
            {CHOICES.map((choice, i) => (
              <button
                key={choice}
                type="button"
                className={`mm-choice${active === i ? " mm-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
        <div className="mm-step" style={{ background: "#f8fafc" }}>
          <div className="mm-step-label">Smart hint</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 5 }}>
            Look for the pair of matching angles created by the parallel lines.
          </div>
        </div>
      </div>
    </div>
  );
}
