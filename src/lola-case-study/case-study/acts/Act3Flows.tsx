import React from "react";
import { FlowExplorer } from "../FlowExplorer";
import { KeyFlowsMotion } from "../KeyFlowsMotion";
import { StaffOpsPreview } from "../StaffOpsPreview";
import { ConversationCraft } from "./ConversationCraft";
import { FadeIn } from "../ui";

/** Develop — demo → key clips → staff → craft (tight section rhythm) */
export function Act3Flows() {
  return (
    <div className="cs-develop-stack">
      <div id="develop-flows" className="cs-page cs-fold-section cs-fold-section--tight scroll-mt-[var(--cs-nav-h)]">
        <FadeIn>
          <div className="cs-phase-artifact cs-phase-artifact--pad">
            <FlowExplorer />
          </div>
        </FadeIn>
      </div>

      <div className="cs-page cs-fold-section cs-fold-section--tight border-t border-[var(--cs-border-subtle)]">
        <FadeIn>
          <div className="cs-phase-artifact cs-phase-artifact--pad">
            <KeyFlowsMotion />
          </div>
        </FadeIn>
      </div>

      <StaffOpsPreview />
      <ConversationCraft />
    </div>
  );
}
