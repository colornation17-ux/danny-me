import React from "react";
import { FlowExplorer } from "../FlowExplorer";
import { StaffOpsPreview } from "../StaffOpsPreview";
import { ConversationCraft } from "./ConversationCraft";
import { FadeIn } from "../ui";

/** Develop — guest flow → Staff CRM → craft */
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

      <StaffOpsPreview />
      <ConversationCraft />
    </div>
  );
}
