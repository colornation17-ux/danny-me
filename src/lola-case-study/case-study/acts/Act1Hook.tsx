import React from "react";
import { Fold1Credentials } from "../Fold1Credentials";
import { LolaScrollNarrative } from "../LolaScrollNarrative";
import { FadeIn } from "../ui";

export function Act1Hook() {
  return (
    <header id="overview" className="scroll-mt-[var(--cs-nav-h)]">
      <LolaScrollNarrative />

      <div className="border-b border-[var(--cs-border)] bg-[var(--cs-surface)]">
        <div className="cs-page py-[var(--cs-space-5)] md:py-[var(--cs-space-6)]">
          <FadeIn when="mount">
            <Fold1Credentials />
          </FadeIn>
        </div>
      </div>
    </header>
  );
}
