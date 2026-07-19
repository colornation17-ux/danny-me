import React from "react";
import { Act2Problem } from "./Act2Problem";
import { PhaseShell } from "../PhaseShell";

export function PhaseDiscover() {
  return (
    <PhaseShell id="discover" tone="muted">
      <Act2Problem />
    </PhaseShell>
  );
}
