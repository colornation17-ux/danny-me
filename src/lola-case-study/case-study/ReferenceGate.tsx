import React, { useEffect, useState } from "react";
import { PRODUCTION_FACTS } from "./constants";
import { ReferenceSection } from "./ReferenceSection";
import { PhaseDivider } from "./PhaseShell";
import { useHashLocation } from "./useHashRoute";
import { FadeIn, Panel } from "./ui";

/** Reference depth — collapsed until reviewer opts in or hash targets #reference */
export function ReferenceGate() {
  const [open, setOpen] = useState(false);
  const { section } = useHashLocation();

  useEffect(() => {
    if (section === "reference") setOpen(true);
  }, [section]);

  return (
    <>
      <PhaseDivider label="Reference" />
      <div className="cs-page py-[var(--cs-section-y-compact)]">
        <FadeIn>
          <p className="cs-meta-label mb-2">Eng &amp; handoff depth</p>
          <h2 className="cs-h3 mb-3">Reference appendix</h2>
          <p className="text-[14px] text-[var(--cs-ink-muted)] mb-5 max-w-[36rem]">
            Routing, safety, and eng handoff — for reviewers who want the full system picture.
          </p>
          {!open ? (
            <Panel className="cs-panel--pad mb-4">
              <ul className="cs-reference-skim-list mb-4">
                {PRODUCTION_FACTS.slice(0, 3).map((fact) => (
                  <li key={fact.kind}>
                    <span className="font-medium text-[var(--cs-ink)]">{fact.label}</span>
                    <span className="text-[var(--cs-muted)]"> — {fact.value}</span>
                  </li>
                ))}
              </ul>
              <button type="button" className="cs-btn-primary" aria-expanded={false} onClick={() => setOpen(true)}>
                Open full reference
              </button>
            </Panel>
          ) : (
            <button
              type="button"
              className="cs-btn-secondary mb-6"
              aria-expanded={true}
              onClick={() => setOpen(false)}
            >
              Collapse reference
            </button>
          )}
        </FadeIn>
      </div>
      {open ? <ReferenceSection embedded /> : null}
    </>
  );
}
