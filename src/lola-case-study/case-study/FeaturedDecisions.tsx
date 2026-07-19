import React from "react";
import { FEATURED_PRODUCT_DECISIONS } from "./constants";
import { FadeIn } from "./ui";

export function FeaturedDecisions() {
  return (
    <div>
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURED_PRODUCT_DECISIONS.map((d) => (
            <div key={d.decision} className="cs-decision-chip">
              <span className="cs-overline text-[var(--cs-accent)]">{d.tag}</span>
              <p className="cs-decision-chip-title">{d.decision}</p>
              <p className="cs-decision-chip-body">{d.body}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
