import React from "react";
import { STORY } from "./constants";
import { PhoneFrame, WaBubble, WaButtons, WaFlyer } from "./whatsapp";

/** Hero visual anchor — product first, copy second */
export function HeroPhone() {
  return (
    <div className="cs-hero-phone">
      <PhoneFrame contact="Lola · La Bodega">
        <WaFlyer />
        <div className="mt-2">
          <WaBubble from="lola" time="Fri 9:00">
            Tap below for this week&apos;s deals — EN or ES.
            <WaButtons options={["See specials", "Store hours", "Place order"]} />
          </WaBubble>
        </div>
        <WaBubble from="customer" time="9:02">
          hi
        </WaBubble>
        <WaBubble from="lola" time="9:02">
          Hi! I&apos;m Lola — ask about hours, deals, or pickup.
        </WaBubble>
      </PhoneFrame>
    </div>
  );
}

const CAPABILITY_ICONS = ["💬", "👆", "🙋"] as const;

/** Compact visual capability row — no paragraph block */
export function CapabilityVisuals() {
  return (
    <ul className="cs-capability-visuals">
      {STORY.capabilities.map((item, i) => (
        <li key={item.label} className="cs-capability-visual">
          <span className="cs-capability-visual-icon" aria-hidden>
            {CAPABILITY_ICONS[i] ?? "✓"}
          </span>
          <div>
            <p className="cs-capability-visual-label">{item.label}</p>
            <p className="cs-capability-visual-detail">{item.ships}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
