import React from "react";
import { ConversationModes } from "./ConversationModes";
import { HearLola } from "./HearLola";
import { RoadmapForward } from "./RoadmapForward";
import { TradeOffsCuts } from "./TradeOffsCuts";
import { ValidationLedger } from "./ValidationLedger";
import { HANDOFF_BOOK } from "./constants";
import { HandoffRules } from "./HandoffRules";
import { JourneyMapArtifact } from "./JourneyMapArtifact";
import { MicrocopyCallout } from "./MicrocopyCallout";
import { ResearchToDecision } from "./ResearchToDecision";
import { ServiceBlueprint } from "./ServiceBlueprint";
import { SourceThreadEvidence } from "./SourceThreadEvidence";
import { WhatWeHeard } from "./WhatWeHeard";
import { FadeIn, Panel } from "./ui";
import { WaButtonPreview } from "./whatsapp";
import { BUTTON_MOMENTS } from "./constants";

export function ReferenceServicePanel() {
  return (
    <div className="space-y-10">
      <ResearchToDecision />
      <SourceThreadEvidence />
      <WhatWeHeard />
      <ServiceBlueprint />
      <HandoffRules />
      <JourneyMapArtifact />

      <FadeIn>
        <MicrocopyCallout />
      </FadeIn>

      <ConversationModes />
      <HearLola />
      <TradeOffsCuts />
      <ValidationLedger />

      <RoadmapForward />

      <FadeIn>
        <p className="cs-meta-label mb-3">WhatsApp button moments</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BUTTON_MOMENTS.map((m) => (
            <Panel key={m.moment} className="cs-panel--pad">
              <p className="cs-eyebrow text-[var(--cs-accent)] mb-1">{m.moment}</p>
              <p className="cs-body text-[12px] mb-3">{m.context}</p>
              <WaButtonPreview options={m.buttons} />
            </Panel>
          ))}
        </div>
      </FadeIn>

      <Panel className="cs-panel--pad border-l-[3px] border-l-[var(--cs-teal)]">
        <p className="cs-meta-label mb-2">{HANDOFF_BOOK.label}</p>
        <p className="cs-body mb-4">{HANDOFF_BOOK.description}</p>
        <a
          href={HANDOFF_BOOK.path}
          target="_blank"
          rel="noopener noreferrer"
          className="cs-btn-primary inline-flex"
        >
          Open HANDOFF_BOOK.md
        </a>
      </Panel>
    </div>
  );
}
