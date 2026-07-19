import React from "react";
import { BUTTON_LABEL_SYSTEM, CANONICAL_MICROCOPY } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn, Panel } from "./ui";

export function MicrocopyCallout() {
  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Canonical copy wins</p>
      <SkimTable
        caption="Lola microcopy"
        columns={[
          { key: "moment", header: "Moment", render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.moment}</strong> },
          {
            key: "copy",
            header: "EN microcopy",
            render: (row) => (
              <blockquote className="cs-inline-quote">&ldquo;{row.copy}&rdquo;</blockquote>
            ),
          },
        ]}
        rows={CANONICAL_MICROCOPY}
      />
      <Panel className="cs-panel--pad mt-2 mb-12">
        <p className="text-[13px] text-[var(--cs-ink-muted)] leading-relaxed">
          <strong className="font-semibold text-[var(--cs-ink)]">Button system:</strong> {BUTTON_LABEL_SYSTEM}
        </p>
      </Panel>
    </FadeIn>
  );
}
