import React from "react";
import { HANDOFF_RULES } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn } from "./ui";

export function HandoffRules() {
  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Human ↔ Lola handoffs</p>
      <p className="cs-body max-w-[40rem] mb-4">
        <strong className="font-semibold text-[var(--cs-ink)]">Pause rules</strong> we spec&apos;d with
        engineering before pilot.
      </p>
      <SkimTable
        caption="Handoff rules"
        columns={[
          { key: "trigger", header: "Trigger", render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.trigger}</strong> },
          { key: "lola", header: "Lola" },
          { key: "staff", header: "Staff" },
        ]}
        rows={HANDOFF_RULES}
      />
    </FadeIn>
  );
}
