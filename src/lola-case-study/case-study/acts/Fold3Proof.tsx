import React from "react";
import { FoldDivider } from "../FoldShell";
import { FoldShell } from "../FoldShell";
import { ReferenceSection } from "../ReferenceSection";
import { Act4Craft } from "./Act4Craft";
import { Act5Proof } from "./Act5Proof";

/** Fold III — design craft, validation, pilot proof, reference appendix */
export function Fold3Proof() {
  return (
    <>
      <FoldShell id="proof" tone="surface">
        <Act4Craft />
        <Act5Proof />
      </FoldShell>
      <FoldDivider label="Reference appendix" />
      <ReferenceSection />
    </>
  );
}
