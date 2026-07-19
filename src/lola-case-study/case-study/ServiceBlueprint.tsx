import React from "react";
import { SERVICE_BLUEPRINT } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn } from "./ui";

export function ServiceBlueprint() {
  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Service blueprint</p>
      <p className="cs-body max-w-[40rem] mb-4">
        <strong className="font-semibold text-[var(--cs-ink)]">One service</strong> — Lola is a layer in a
        store-run weekly shop, not an isolated chatbot screen.
      </p>
      <SkimTable
        caption="Service blueprint steps"
        columns={[
          { key: "label", header: "Step", render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.label}</strong> },
          { key: "tag", header: "Owner" },
          { key: "detail", header: "What happens" },
        ]}
        rows={SERVICE_BLUEPRINT}
      />
    </FadeIn>
  );
}
