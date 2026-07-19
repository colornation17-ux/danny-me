import React, { useState } from "react";
import { CUSTOMER_JOURNEY, type JourneyTone } from "./constants";
import { FadeIn, Panel } from "./ui";

type View = "before" | "after";

const DEFAULT_STEP: Record<View, number> = { before: 3, after: 3 };

function progressClass(tone: JourneyTone, filled: boolean) {
  if (!filled) return "";
  if (tone === "bottleneck") return "is-bottleneck";
  if (tone === "gain") return "is-gain";
  return "is-filled";
}

function JourneyColumn({
  title,
  steps,
  active,
  onSelect,
  variant,
}: {
  title: string;
  steps: (typeof CUSTOMER_JOURNEY)["before"];
  active: number;
  onSelect: (i: number) => void;
  variant: View;
}) {
  const current = steps[active];

  return (
    <div
      className={`rounded-[var(--cs-radius)] border p-4 md:p-5 ${
        variant === "before" ? "border-[var(--cs-border)] bg-[var(--cs-bg)]" : "border-[var(--cs-accent)]/25 bg-[var(--cs-accent-soft)]/30"
      }`}
    >
      <p className="cs-eyebrow mb-2">{title}</p>
      <div className="cs-journey-progress mb-3" aria-hidden>
        {steps.map((step, i) => (
          <span key={step.label} className={progressClass(step.tone, i <= active)} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        {steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            className={`cs-journey-pill ${i === active ? "is-active" : ""} ${step.tone === "bottleneck" ? "is-bottleneck" : ""} ${step.tone === "gain" ? "is-gain" : ""}`}
            aria-current={i === active ? "step" : undefined}
            onClick={() => onSelect(i)}
          >
            {step.label}
          </button>
        ))}
      </div>
      <p className="text-[12px] leading-snug text-[var(--cs-ink-muted)]">
        <span className="font-medium text-[var(--cs-ink)]">{current.label}.</span> {current.detail}
      </p>
    </div>
  );
}

/** @param embedded — inside Problem tabs (no outer label/panel) */
export function CustomerJourneyFlow({ embedded = false }: { embedded?: boolean }) {
  const [beforeStep, setBeforeStep] = useState(DEFAULT_STEP.before);
  const [afterStep, setAfterStep] = useState(DEFAULT_STEP.after);

  const body = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <JourneyColumn
        title="Before Lola"
        steps={CUSTOMER_JOURNEY.before}
        active={beforeStep}
        onSelect={setBeforeStep}
        variant="before"
      />
      <JourneyColumn
        title="With Lola"
        steps={CUSTOMER_JOURNEY.after}
        active={afterStep}
        onSelect={setAfterStep}
        variant="after"
      />
    </div>
  );

  if (embedded) return body;

  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Customer journey</p>
      <Panel className="p-4 md:p-5">{body}</Panel>
    </FadeIn>
  );
}
