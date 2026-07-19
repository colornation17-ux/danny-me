import React, { useState } from "react";
import { STORY } from "./constants";
import { BoldLead } from "./skimUi";
import { AccordionChevron } from "./transitions";
import { Panel } from "./ui";

/** Progressive disclosure — HMW frame for reviewers who want depth */
export function HeroDesignFraming() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 border-t border-[var(--cs-border)] pt-6">
      <p className="text-[13px] text-[var(--cs-ink-muted)] leading-relaxed mb-4">
        <strong className="font-semibold text-[var(--cs-ink)]">Constraints:</strong> {STORY.constraint}
        <br />
        <strong className="font-semibold text-[var(--cs-ink)]">Strategic answer:</strong> {STORY.constraintAnswer}
      </p>
      <div className="t-acc" data-open={open ? "true" : "false"}>
        <button
          type="button"
          className="t-acc-head w-full min-h-[44px] flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-brand)] rounded-[var(--cs-radius)]"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="cs-meta-label mb-0 normal-case tracking-normal text-[var(--cs-ink)]">
            How might we… (optional depth)
          </span>
          <AccordionChevron />
        </button>
        <div className="t-acc-panel">
          <div className="t-acc-panel-inner">
            <Panel className="mt-3 p-4 md:p-5">
              <BoldLead hook="HMW">{STORY.hmw}</BoldLead>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
