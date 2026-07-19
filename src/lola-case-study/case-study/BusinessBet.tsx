import React from "react";
import { BUSINESS_BET } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn, Panel } from "./ui";

export function BusinessBet() {
  return (
    <FadeIn when="mount" className="mb-0">
      <div id="business-bet">
        <Panel className="cs-panel--pad border-l-[3px] border-l-[var(--cs-teal)] bg-[var(--cs-surface)]">
          <p className="cs-meta-label mb-2">Business bet</p>
          <p className="text-[15px] font-medium text-[var(--cs-ink)] leading-relaxed mb-4">
            <strong className="font-semibold">{BUSINESS_BET.objectiveHook}</strong>{" "}
            {BUSINESS_BET.objectiveRest}
          </p>
          <p className="cs-meta-label mb-2">How we&apos;d know it worked</p>
          <SkimTable
            caption="Success metrics"
            columns={[
              { key: "signal", header: "Signal" },
              {
                key: "target",
                header: "Target",
                render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.target}</strong>,
              },
            ]}
            rows={BUSINESS_BET.successMetrics}
          />
        </Panel>
      </div>
    </FadeIn>
  );
}
