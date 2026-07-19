import React from "react";
import { HERO_JOURNEY_ALT, LOLA_SCROLL_ASSETS } from "./lolaScrollCopy";

/** Hero right column — full-bleed journey illustration (no overlays) */
export function HeroJourneyVisual() {
  return (
    <figure className="cs-hero-journey">
      <img
        src={LOLA_SCROLL_ASSETS.store}
        alt={HERO_JOURNEY_ALT}
        className="cs-hero-journey-img"
        width={2400}
        height={1350}
        decoding="async"
        fetchPriority="high"
      />
    </figure>
  );
}
