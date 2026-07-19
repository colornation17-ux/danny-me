import React from "react";
import { DEVELOP_STEPS } from "./constants";
import { useScrollSpy } from "./useScrollSpy";

const DEVELOP_SECTION_IDS = DEVELOP_STEPS.map((step) => step.id);

/** In-phase progress for Develop — flows, staff, craft */
export function DevelopSectionCue() {
  const { activeIdx } = useScrollSpy(DEVELOP_SECTION_IDS);
  const safeIdx = activeIdx >= 0 ? activeIdx : 0;
  const active = DEVELOP_STEPS[safeIdx];

  return (
    <nav className="cs-develop-cue" aria-label="Develop sections">
      <div className="cs-page cs-develop-cue__inner">
        <p className="cs-develop-cue__status" aria-live="polite">
          {safeIdx + 1} of {DEVELOP_STEPS.length} · {active.label}
        </p>
        <ol className="cs-develop-cue__steps">
          {DEVELOP_STEPS.map((step, i) => {
            const isActive = i === safeIdx;
            return (
              <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  className={`cs-develop-cue__step${isActive ? " is-active" : ""}${i < safeIdx ? " is-past" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {step.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
