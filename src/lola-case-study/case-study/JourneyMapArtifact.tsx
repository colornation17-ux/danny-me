import React from "react";
import { FadeIn, Panel } from "./ui";

const LANES = [
  {
    role: "Shopper",
    color: "var(--cs-bg)",
    steps: [
      { label: "Broadcast", note: "Reads weekly deals on WhatsApp" },
      { label: "Ask", note: "Hours, SNAP, what to buy" },
      { label: "Order", note: "Place order → draft → confirm → quote" },
    ],
  },
  {
    role: "Lola",
    color: "var(--cs-teal-soft)",
    steps: [
      { label: "Template", note: "Hero image + tap buttons (was numbered menu + text wall)" },
      { label: "Grounded Q&A", note: "Staff knowledge · EN/ES" },
      { label: "Nudge", note: "List reminder → Place order" },
    ],
  },
  {
    role: "Staff",
    color: "var(--cs-accent-soft)",
    steps: [
      { label: "Inbox", note: "Hard threads go to staff" },
      { label: "Relay", note: "Answer ping → Lola relays" },
      { label: "Pickup", note: "Quote · buzz · ready check" },
    ],
  },
] as const;

/** Designed deliverable — journey map frame (spec artifact) */
export function JourneyMapArtifact() {
  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Design deliverable</p>
      <Panel className="p-4 md:p-5 bg-[var(--cs-bg)] border-[var(--cs-border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--cs-border)]">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/lola-mascot.svg"
              alt=""
              width={40}
              height={40}
              className="shrink-0 rounded-full border border-[var(--cs-border)]"
            />
            <div>
              <p className="cs-eyebrow text-[var(--cs-brand)] mb-0.5">Journey map · v3</p>
              <p className="text-[13px] font-medium text-[var(--cs-ink)]">La Bodega weekly shop on WhatsApp</p>
            </div>
          </div>
          <p className="text-[11px] text-[var(--cs-ink-muted)]" style={{ fontFamily: "var(--cs-mono)" }}>
            EN / ES · Pilot · Figma source
          </p>
        </div>

        <div
          className="cs-journey-swimlanes"
          role="img"
          aria-label="Journey swimlanes: Shopper, Lola, and Staff from broadcast through pickup"
        >
          {LANES.map((lane) => (
            <div key={lane.role} className="cs-journey-swimlane">
              <p className="cs-journey-swimlane-label">{lane.role}</p>
              <div className="cs-journey-swimlane-track" style={{ background: lane.color }}>
                {lane.steps.map((step, i) => (
                  <React.Fragment key={step.label}>
                    <div className="cs-journey-swimlane-node">
                      <span className="cs-journey-map-label">{step.label}</span>
                      <span className="cs-journey-map-note">{step.note}</span>
                    </div>
                    {i < lane.steps.length - 1 && (
                      <span className="cs-journey-swimlane-arrow" aria-hidden>
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px] text-[var(--cs-ink-muted)] leading-snug">
          Shipped artifact: Figma journey + canonical copy doc + Meta broadcast template IDs — handed to engineering as
          source of truth. Drop a PNG export at <code className="text-[11px]">/journey-map.png</code> to replace this
          frame when ready.
        </p>
      </Panel>
    </FadeIn>
  );
}
