import React from "react";
import { FoldShell } from "../FoldShell";
import { OwnershipBlock } from "../OwnershipBlock";
import { Act2Problem } from "./Act2Problem";
import { Act3Flows } from "./Act3Flows";

/** Fold II — evidence, interactive flows, staff ops */
export function Fold2System() {
  return (
    <FoldShell id="system" tone="muted">
      <div className="cs-page pb-[var(--cs-space-6)]">
        <OwnershipBlock />
      </div>
      <Act2Problem />
      <Act3Flows />
    </FoldShell>
  );
}
