import React from "react";
import { HOW_WE_LEARNED, WEEKLY_SHOP_LOOP, WHAT_WE_TRIED_FIRST } from "./constants";
import { FadeIn } from "./ui";

/** Discover — how we learned, early pivots, weekly shop loop (v2 layout, production-accurate copy) */
export function ResearchFraming() {
  return (
    <div className="cs-research-framing mb-10 md:mb-12">
      <FadeIn>
        <p className="cs-meta-label mb-3">How we learned</p>
        <ol className="cs-learned-steps" aria-label="Research insights">
          {HOW_WE_LEARNED.map((item, i) => (
            <li key={item.title} className="cs-learned-step">
              <span className="cs-learned-step-num" aria-hidden>
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="cs-learned-step-title">{item.title}</p>
                <p className="cs-learned-step-detail">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </FadeIn>

      <FadeIn className="mt-10">
        <p className="cs-meta-label mb-3">What we tried first</p>
        <ul className="cs-tried-first-grid">
          {WHAT_WE_TRIED_FIRST.map((item) => (
            <li key={item.title} className="cs-tried-first-card">
              <p className="cs-tried-first-title">{item.title}</p>
              <p className="cs-tried-first-detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn className="mt-10">
        <p className="cs-meta-label mb-3">Weekly shop loop</p>
        <ol className="cs-weekly-shop-loop" aria-label="Customer weekly shop journey">
          {WEEKLY_SHOP_LOOP.map((step) => (
            <li key={step.label} className="cs-weekly-shop-step">
              <span className="cs-weekly-shop-num" aria-hidden>
                {step.step}
              </span>
              <div className="min-w-0">
                <p className="cs-weekly-shop-label">{step.label}</p>
                <p className="cs-weekly-shop-detail">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </FadeIn>
    </div>
  );
}
