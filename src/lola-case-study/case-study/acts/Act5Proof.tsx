import React from "react";
import { ClosingBeat } from "../ClosingBeat";
import { DeliverLearnings } from "../DeliverLearnings";
import { ImpactOutcomes } from "../ImpactOutcomes";
import { PilotVoices } from "../PilotVoices";
import { ReferenceGate } from "../ReferenceGate";
import { ScopeMetrics } from "../ScopeMetrics";

export function Act5Proof() {
  return (
    <>
      <div id="pilot-outcomes" className="cs-page cs-fold-section cs-fold-section--tight scroll-mt-[var(--cs-nav-h)]">
        <div className="cs-block-stack cs-block-stack--tight">
          <div className="cs-phase-artifact cs-phase-artifact--pad">
            <p className="cs-meta-label mb-3">Pilot outcomes</p>
            <ImpactOutcomes />
            <div className="cs-deliver-metrics">
              <ScopeMetrics />
            </div>
          </div>

          <PilotVoices />
        </div>
      </div>

      <div
        id="deliver-learnings"
        className="cs-page cs-fold-section cs-fold-section--tight border-t border-[var(--cs-border-subtle)] scroll-mt-[var(--cs-nav-h)]"
      >
        <DeliverLearnings />
      </div>

      <ClosingBeat />

      <ReferenceGate />
    </>
  );
}
