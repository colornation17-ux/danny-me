import React from "react";
import { PRODUCT_FORWARD } from "./constants";
import { BoldLead } from "./skimUi";
import { FadeIn, Panel } from "./ui";

export function RoadmapForward() {
  return (
    <FadeIn>
      <Panel className="cs-panel--pad border-l-[3px] border-l-[var(--cs-teal)] mb-10">
        <p className="cs-meta-label mb-2">Forward — WhatsApp first, kiosk next</p>
        <h3 className="cs-h3 mb-3">{PRODUCT_FORWARD.headline}</h3>
        <p className="cs-body mb-5 max-w-[40rem]">{PRODUCT_FORWARD.thesis}</p>
        <ul className="space-y-3 mb-5">
          {PRODUCT_FORWARD.whatsappPillars.map((item) => (
            <li key={item.hook}>
              <BoldLead hook={item.hook} className="text-[14px] text-[var(--cs-ink-muted)] mb-0 max-w-none">
                {item.text}
              </BoldLead>
            </li>
          ))}
        </ul>
        <p className="text-[14px] text-[var(--cs-ink-muted)] leading-relaxed mb-2">
          <strong className="font-semibold text-[var(--cs-ink)]">Kiosk intent:</strong> {PRODUCT_FORWARD.kioskIntent}
        </p>
        <p className="text-[12px] text-[var(--cs-muted)]">{PRODUCT_FORWARD.notInPilot}</p>
      </Panel>
    </FadeIn>
  );
}
