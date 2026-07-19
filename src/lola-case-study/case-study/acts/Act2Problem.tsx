import React from "react";
import { ProblemTabs } from "../ProblemTabs";
import { FadeIn } from "../ui";

export function Act2Problem() {
  return (
    <div id="discover-evidence" className="cs-page cs-fold-section">
      <FadeIn>
        <ProblemTabs />
      </FadeIn>
    </div>
  );
}
