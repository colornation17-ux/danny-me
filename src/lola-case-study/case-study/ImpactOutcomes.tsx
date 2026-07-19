import React from "react";

import { PILOT_IMPACT, SCOPE_METRICS } from "./constants";
import { FadeIn } from "./ui";

export function ImpactOutcomes() {
  return (
    <FadeIn delay={0.04}>
      <div>
        <p className="cs-scope-metrics__note mb-3">{SCOPE_METRICS.outcomesWindow}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PILOT_IMPACT.map((row) => {
            const isGap = "tone" in row && row.tone === "gap";
            return (
              <article
                key={row.signal}
                className={`cs-proof-card${isGap ? " cs-proof-card--gap" : ""}`}
              >
                <p className="cs-proof-card__title">{row.signal}</p>
                <p className="cs-proof-card__body">{row.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
