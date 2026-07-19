import React from "react";
import { DevelopSectionCue } from "../DevelopSectionCue";
import { PhaseShell } from "../PhaseShell";
import { Act3Flows } from "./Act3Flows";

export function PhaseDevelop() {
  return (
    <PhaseShell id="develop" tone="muted" compact>
      <DevelopSectionCue />
      <Act3Flows />
    </PhaseShell>
  );
}
