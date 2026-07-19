import React from "react";
import { WHAT_WE_HEARD } from "./constants";
import { QuoteCallout } from "./skimUi";
import { FadeIn } from "./ui";

export function WhatWeHeard() {
  const { quote } = WHAT_WE_HEARD;

  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">What we heard</p>
      <QuoteCallout
        quote={quote.text}
        who={quote.who}
        role={quote.role}
        footer={
          <>
            <strong className="font-semibold text-[var(--cs-ink)]">Design response:</strong> Instant grounded
            deals + hours on-thread — no phone call mid-cook.{" "}
            <a href="#develop/flows/greeting" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
              Greeting flow
            </a>
          </>
        }
      />
    </FadeIn>
  );
}
