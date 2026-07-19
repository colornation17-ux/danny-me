import React from "react";
import { I_DID_NOT_SHIP, I_SHIPPED, OWNERSHIP_BOUNDARY } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn } from "./ui";

const ROW_COUNT = Math.max(I_SHIPPED.length, I_DID_NOT_SHIP.length);
const SHIPPED_ROWS = Array.from({ length: ROW_COUNT }, (_, i) => ({
  shipped: I_SHIPPED[i] ?? "—",
  notShipped: I_DID_NOT_SHIP[i] ?? "—",
}));

export function OwnershipBlock() {
  return (
    <div id="role" className="cs-role-boundary">
      <FadeIn when="mount" delay={0.02} className="mb-0">
        <p className="cs-meta-label mb-3">Scope boundary</p>
        <SkimTable
          caption="What I shipped vs did not ship"
          columns={[
            { key: "shipped", header: "I shipped" },
            { key: "notShipped", header: "I did not ship" },
          ]}
          rows={SHIPPED_ROWS}
        />
        <p className="text-[13px] text-[var(--cs-ink-muted)] -mt-2 mb-0">
          <strong className="font-semibold text-[var(--cs-ink)]">Boundary:</strong> {OWNERSHIP_BOUNDARY}
        </p>
      </FadeIn>
    </div>
  );
}
