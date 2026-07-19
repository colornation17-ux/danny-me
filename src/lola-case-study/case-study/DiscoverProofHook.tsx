import React from "react";
import { BROADCAST_LEGACY, BROADCAST_LOLA_INTRO, CTA } from "./constants";
import { FadeIn } from "./ui";
import { PhoneFrame, WaBroadcastHeader, WaBubble, WaButtonPreview } from "./whatsapp";

function nl(text: string) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

/** Compact before/after blast — early proof linking to full FlowExplorer */
export function DiscoverProofHook() {
  const beforeMenu = BROADCAST_LEGACY.updateMenu.menuText;
  const beforeDigit = BROADCAST_LEGACY.updateMenu.replyDigit;

  return (
    <FadeIn className="mt-8">
      <p className="cs-meta-label mb-2">Proof at a glance</p>
      <p className="text-[14px] text-[var(--cs-ink-muted)] mb-4 max-w-[40ch]">
        Same weekly template — numbered menu vs Lola + tap buttons.
      </p>
      <div className="cs-discover-proof-phones">
        <div>
          <p className="cs-discover-proof-label">Before · CRM menu</p>
          <PhoneFrame contact="La Bodega Calhoun">
            <WaBroadcastHeader compact />
            <WaBubble from="staff" time="2:05 PM" dense>
              {nl(beforeMenu)}
            </WaBubble>
            <WaBubble from="customer" time="2:08 PM" dense>
              chicken sale still on?
            </WaBubble>
            <p className="cs-wa-thread-note" style={{ fontFamily: "var(--cs-font)" }}>
              No reply — staff inbox
            </p>
          </PhoneFrame>
        </div>
        <div>
          <p className="cs-discover-proof-label">After · Lola</p>
          <PhoneFrame contact="Lola · La Bodega">
            <WaBroadcastHeader compact />
            <WaBubble from="lola" time="Fri 9:01" dense>
              {nl(BROADCAST_LOLA_INTRO.en)}
            </WaBubble>
            <WaButtonPreview options={[...BROADCAST_LOLA_INTRO.buttons.en]} />
          </PhoneFrame>
        </div>
      </div>
      <a href={CTA.exploreFlowsHref} className="cs-btn-primary mt-4 inline-flex">
        {CTA.exploreFlows} →
      </a>
    </FadeIn>
  );
}
