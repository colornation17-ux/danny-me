import React from "react";
import { PILOT_PIVOTS } from "./constants";
import { FadeIn } from "./ui";

/** Four pilot pivots — story-aligned cards */
export function PivotLog() {
  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-meta-label mb-3">What we tried first</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PILOT_PIVOTS.map((row) => (
            <article key={row.before} className="cs-pivot-card">
              <p className="cs-pivot-card-before">{row.before}</p>
              <p className="cs-pivot-card-arrow" aria-hidden>
                ↓
              </p>
              <p className="cs-pivot-card-after">{row.after}</p>
              <p className="cs-pivot-card-signal">{row.signal}</p>
            </article>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
