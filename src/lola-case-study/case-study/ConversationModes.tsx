import React from "react";
import { CONVERSATION_MODES } from "./constants";
import { FadeIn, Panel } from "./ui";

export function ConversationModes() {
  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-meta-label mb-2">Conversation architecture</p>
        <h3 className="cs-h3 mb-2">Four thread modes — same weekly shop, different job</h3>
        <p className="cs-body max-w-[40rem] mb-6">
          The shopper journey did not change. Production adds a <strong className="text-[var(--cs-ink)]">mode</strong>{" "}
          on every turn so Lola knows whether she is answering, drafting an order, scheduling a nudge, or holding for
          staff — without asking the guest to learn commands.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CONVERSATION_MODES.map((mode, i) => (
          <FadeIn key={mode.id} delay={i * 0.03}>
            <Panel className="cs-panel--pad h-full">
              <p className="cs-eyebrow text-[var(--cs-teal-text)] mb-1">{mode.label}</p>
              <p className="font-medium text-[14px] text-[var(--cs-ink)] mb-2 leading-snug">{mode.framing}</p>
              <p className="cs-body text-[13px]">{mode.detail}</p>
            </Panel>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
