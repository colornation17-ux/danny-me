import React from "react";
import { DEVELOP_AI_LAYER } from "../constants";
import { ConversationRules } from "../ConversationRules";
import { FeaturedDecisions } from "../FeaturedDecisions";
import { FeatureVideo } from "../FeatureVideo";
import { HearLola } from "../HearLola";
import { LOLA_MOTION } from "../motionAssets";
import { FadeIn } from "../ui";

/** Craft — voice clips + rules (tight stack) */
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
                Three craft rules below — then hear Lola, then the product decisions that made them stick.{" "}
                {DEVELOP_AI_LAYER}
              </p>
            </header>
          </FadeIn>

          <FadeIn>
            <div className="cs-craft-motion">
              <FeatureVideo
                src={LOLA_MOTION.clips.voiceGreeting.src}
                variant="inline"
                title={LOLA_MOTION.clips.voiceGreeting.title}
                caption={LOLA_MOTION.clips.voiceGreeting.caption}
                autoPlay
              />
              <FeatureVideo
                src={LOLA_MOTION.clips.voiceNotes.src}
                variant="inline"
                title={LOLA_MOTION.clips.voiceNotes.title}
                caption={LOLA_MOTION.clips.voiceNotes.caption}
                autoPlay
              />
            </div>
          </FadeIn>

          <ConversationRules />
          <HearLola />
          <FeaturedDecisions />
        </div>
      </div>
    </div>
  );
}
