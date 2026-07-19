import React from "react";
import { Act5Proof } from "./Act5Proof";
import { PhaseShell } from "../PhaseShell";

/** Deliver — proof, learnings, and footer */
export function PhaseDeliver() {
  return (
    <PhaseShell id="deliver" tone="surface" end>
      <Act5Proof />
    </PhaseShell>
  );
}
