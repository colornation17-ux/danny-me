import React from "react";
import { FeaturedDecisions } from "../FeaturedDecisions";
import { PivotLog } from "../PivotLog";
import { CONVERSATION_QA } from "../constants";
import { ActHeader, FadeIn, Panel, Section } from "../ui";

export function Act4Craft() {
  return (
    <Section id="design">
      <ActHeader
        label="Design"
        num="4"
        title="Decisions under constraint"
        lead="Two calls that shaped the pilot — full log in Reference."
        compact
      />

      <FeaturedDecisions />
      <PivotLog />

      <FadeIn>
        <Panel className="cs-panel--pad border-l-[3px] border-l-[var(--cs-teal)]">
          <p className="cs-meta-label mb-2">Quality bar</p>
          <p className="cs-body mb-2">{CONVERSATION_QA.lead}</p>
          <p className="text-[13px] text-[var(--cs-muted)]">
            Routing, grounding, and safety suites in{" "}
            <a href="#reference/safety" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
              Reference → Safety &amp; QA
            </a>
            .
          </p>
        </Panel>
      </FadeIn>
    </Section>
  );
}
