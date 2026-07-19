import React from "react";
import { BUTTON_MOMENTS } from "./constants";
import { FadeIn, Panel } from "./ui";
import { WaButtonPreview } from "./whatsapp";

/** Four WhatsApp button moments — one stacked teal style */
export function ButtonMoments() {
  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-eyebrow mb-2">WhatsApp buttons</p>
        <h3 className="cs-h3 mb-2">Four moments, one button style</h3>
        <p className="cs-body mb-6 max-w-[48ch]">
          Labels change by step; stacked teal rows do not. Max three buttons per message — production uses the same
          pattern on broadcast, greeting, after-specials, and coach paths.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BUTTON_MOMENTS.map((m, i) => (
          <FadeIn key={m.moment} delay={i * 0.04}>
            <Panel className="cs-panel--pad h-full">
              <p className="cs-eyebrow text-[var(--cs-accent)] mb-1">{m.moment}</p>
              <p className="cs-body text-[12px] mb-3 text-[var(--cs-ink-muted)]">{m.context}</p>
              <WaButtonPreview options={m.buttons} />
            </Panel>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
