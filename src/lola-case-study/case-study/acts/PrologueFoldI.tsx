import React from "react";
import { Fold1Credentials } from "../Fold1Credentials";
import { ProductSystem } from "../ProductSystem";
import { StoreScrollStage } from "../StoreScrollStage";
import { FadeIn } from "../ui";

export function PrologueFoldI() {
  return (
    <div id="prologue" className="scroll-mt-[var(--cs-nav-h)]">
      <StoreScrollStage />

      <div className="border-b border-[var(--cs-border)] bg-[var(--cs-surface)]">
        <div className="cs-page cs-fold-section">
          <FadeIn when="view">
            <Fold1Credentials />
          </FadeIn>
          <div className="mt-8 pt-8 border-t border-[var(--cs-border-subtle)]">
            <ProductSystem />
          </div>
        </div>
      </div>
    </div>
  );
}
