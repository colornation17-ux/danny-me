import React from "react";
import { DEFINE_SCOPE } from "../constants";
import { ServiceBlueprintFlow } from "../ServiceBlueprintFlow";
import { PhaseShell } from "../PhaseShell";
import { FadeIn } from "../ui";

/** Define — service loop + constraints */
export function PhaseDefine() {
  return (
    <PhaseShell id="define" tone="default">
      <div className="cs-page cs-fold-section">
        <div className="cs-block-stack cs-block-stack--tight">
          <div className="cs-phase-artifact cs-phase-artifact--pad">
            <ServiceBlueprintFlow />
          </div>

          <FadeIn>
            <div>
              <p className="cs-meta-label">Constraints</p>
              <ul className="cs-define-scope-chips" aria-label="Product constraints">
                {DEFINE_SCOPE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </PhaseShell>
  );
}
