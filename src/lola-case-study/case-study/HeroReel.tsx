import React from "react";
import { FeatureVideo } from "./FeatureVideo";
import { LOLA_MOTION } from "./motionAssets";

/** Hero product proof — full Lola reel (guest + staff) with sound */
export function HeroReel() {
  const { reel } = LOLA_MOTION;
  return (
    <div className="cs-hero-reel" aria-label={reel.caption}>
      <FeatureVideo
        src={reel.src}
        variant="hero"
        title={reel.title}
        caption={reel.caption}
        autoPlay
      />
    </div>
  );
}
