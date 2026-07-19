import React from "react";
import { Act1Hook } from "./Act1Hook";
import { ProductionTruthStrip } from "../ProductionTruthStrip";

/** Fold I — scroll hook, credentials, production anchors */
export function Fold1Bet() {
  return (
    <>
      <Act1Hook />
      <div className="cs-page pb-[var(--cs-space-8)] md:pb-[var(--cs-space-10)]">
        <ProductionTruthStrip compact />
      </div>
    </>
  );
}
