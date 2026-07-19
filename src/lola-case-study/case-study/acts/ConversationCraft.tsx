import React from "react";
import { DEVELOP_AI_LAYER } from "../constants";
import { ConversationRules } from "../ConversationRules";
import { FeaturedDecisions } from "../FeaturedDecisions";
import { FadeIn } from "../ui";

/** Craft — three rules + the decisions that made them stick */
export function ConversationCraft() {
  return (
    <div
      id="develop-craft"
      className="scroll-mt-[var(--cs-nav-h)] cs-page cs-fold-section cs-fold-section--tight border-t border-[var(--cs-border-subtle)]"
    >
      <div className="cs-phase-artifact cs-phase-artifact--pad">
        <div className="cs-block-stack cs-block-stack--tight">
          <FadeIn>
            <header className="cs-section-intro cs-section-intro--tight max-w-[52ch]">
              <h3 className="cs-h3">How guest conversations stay on-rails</h3>
              <p className="cs-body">
                Three craft rules — then the product decisions behind them. {DEVELOP_AI_LAYER}
              </p>
            </header>
          </FadeIn>

          <ConversationRules />
          <FeaturedDecisions />
        </div>
      </div>
    </div>
  );
}
