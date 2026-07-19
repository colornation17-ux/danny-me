import React from "react";
import { TRADE_OFFS, WHAT_WE_CUT } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn } from "./ui";

export function TradeOffsCuts() {
  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-meta-label mb-2">Cross-functional reality</p>
        <h3 className="cs-h3 mb-2">Trade-offs, cuts, and what broke</h3>
        <p className="cs-body max-w-[40rem] mb-6">
          <strong className="font-semibold text-[var(--cs-ink)]">Not linear</strong> — Meta limits, store trust,
          and rush hours shaped what landed.
        </p>
      </FadeIn>

      <FadeIn>
        <p className="cs-meta-label mb-3">Trade-offs negotiated</p>
        <SkimTable
          caption="Negotiated trade-offs"
          columns={[
            { key: "tension", header: "Tension" },
            {
              key: "call",
              header: "Call",
              render: (row) => <strong className="font-semibold text-[var(--cs-ink)]">{row.call}</strong>,
            },
            { key: "why", header: "Why" },
          ]}
          rows={TRADE_OFFS}
        />
      </FadeIn>

      <FadeIn delay={0.04}>
        <p className="cs-meta-label mb-3">Killed or fixed in pilot</p>
        <SkimTable
          caption="Pilot cuts"
          columns={[
            { key: "cut", header: "Cut", render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.cut}</strong> },
            { key: "signal", header: "Signal" },
            {
              key: "shipped",
              header: "Shipped instead",
              render: (row) => <strong className="font-medium text-[var(--cs-teal-text)]">{row.shipped}</strong>,
            },
          ]}
          rows={WHAT_WE_CUT}
        />
      </FadeIn>
    </div>
  );
}
