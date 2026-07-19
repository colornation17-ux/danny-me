import React from "react";
import { MANUAL_INBOX_THREAD, SOURCE_THREAD_BEFORE_AFTER } from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn } from "./ui";
import { PhoneFrame, WaBubble } from "./whatsapp";

export function SourceThreadEvidence() {
  return (
    <FadeIn>
      <div id="evidence-source-thread" className="scroll-mt-[var(--cs-nav-h)] mb-8">
        <p className="cs-meta-label mb-2">Source thread · pickup spec</p>
        <h3 className="cs-h3 mb-2">Birria pizza — coordinated by hand (pre-Lola)</h3>
        <p className="cs-body max-w-[40rem] mb-4">
          <strong className="font-semibold text-[var(--cs-ink)]">This thread</strong> became the pickup flow
          spec.{" "}
          <a href="#develop/flows/pickup" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
            Pickup demo
          </a>
        </p>
        <SkimTable
          caption="Before Lola vs after Lola"
          columns={[
            { key: "before", header: "Before Lola" },
            {
              key: "after",
              header: "After Lola",
              render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.after}</strong>,
            },
          ]}
          rows={SOURCE_THREAD_BEFORE_AFTER}
        />
        <div className="cs-inbox-split">
          <p className="cs-insight-line min-w-0">
            <strong className="font-semibold text-[var(--cs-ink)]">{MANUAL_INBOX_THREAD.dateLabel}</strong>
            {" — real store inbox thread"}
          </p>
          <PhoneFrame contact="Customer · Hot counter" inbox>
            {MANUAL_INBOX_THREAD.messages.map((msg, i) => (
              <WaBubble key={`${msg.time}-${i}`} from={msg.from} time={msg.time} perspective="store">
                {msg.text}
              </WaBubble>
            ))}
          </PhoneFrame>
        </div>
      </div>
    </FadeIn>
  );
}
