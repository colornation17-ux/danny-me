import React from "react";
import {
  BROADCAST_LEGACY,
  BROADCAST_LOLA_INTRO,
  VALIDATION_LEDGER,
  VALIDATION_TEST_MAP,
} from "./constants";
import { SkimTable } from "./skimUi";
import { FadeIn, Panel } from "./ui";
import { PhoneFrame, WaBroadcastHeader, WaBubble, WaButtonPreview } from "./whatsapp";

const BROADCAST_ROW = VALIDATION_LEDGER.find((r) => r.id === "broadcast-buttons");

function nl(text: string) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

export function ValidationLedger() {
  const beforeMenu = BROADCAST_LEGACY.menuText;
  const beforeSpecials = BROADCAST_LEGACY.updateMenu.specialsBody;
  const beforeDigit = BROADCAST_LEGACY.updateMenu.replyDigit;

  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-meta-label mb-2">Validation & iteration</p>
        <h3 className="cs-h3 mb-2">Before → signal → shipped change</h3>
        <p className="cs-body max-w-[40rem] mb-6">
          <strong className="font-semibold text-[var(--cs-ink)]">Messy middle</strong> — pivots under pilot
          pressure, not wireframe → mockup.
        </p>
      </FadeIn>

      <FadeIn>
        <SkimTable
          caption="Validation ledger summary"
          columns={[
            { key: "before", header: "Before" },
            { key: "signal", header: "Signal" },
            {
              key: "after",
              header: "After (live)",
              render: (row) => <strong className="font-semibold text-[var(--cs-ink)]">{row.after}</strong>,
            },
            { key: "proof", header: "Proof" },
          ]}
          rows={VALIDATION_LEDGER}
        />
      </FadeIn>

      <FadeIn delay={0.03}>
        <Panel className="cs-panel--pad mb-8">
          <p className="cs-meta-label mb-1">Weekly blast — before vs after Lola</p>
          <p className="text-[13px] text-[var(--cs-muted)] mb-4 max-w-[40rem]">{BROADCAST_LEGACY.summary}</p>
          <div className="cs-validation-phones">
            <div>
              <p className="text-[13px] font-medium text-[var(--cs-ink)] mb-1">Before · La Bodega Calhoun (CRM)</p>
              <p className="text-[13px] text-[var(--cs-muted)] mb-2">
                Template photo + numbered menu → type 1 or 2 for automated reply
              </p>
              <PhoneFrame contact="La Bodega Calhoun">
                <WaBroadcastHeader compact />
                <WaBubble from="staff" time="2:05 PM" dense>
                  {nl(beforeMenu)}
                </WaBubble>
                <WaBubble from="customer" time="2:05 PM">
                  {beforeDigit}
                </WaBubble>
                <WaBubble from="staff" time="2:05 PM" dense>
                  {nl(beforeSpecials)}
                </WaBubble>
                <WaBubble from="customer" time="2:08 PM">
                  chicken sale still on?
                </WaBubble>
                <p className="cs-wa-thread-note" style={{ fontFamily: "var(--cs-font)" }}>
                  No scripted reply — staff inbox
                </p>
              </PhoneFrame>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--cs-ink)] mb-1">After · Lola on same template</p>
              <p className="text-[13px] text-[var(--cs-muted)] mb-2">
                Same image — numbered menu replaced with Lola + tap buttons
              </p>
              <PhoneFrame contact="Lola · La Bodega">
                <WaBroadcastHeader compact />
                <WaBubble from="lola" time="Fri 9:01" dense>
                  {nl(BROADCAST_LOLA_INTRO.en)}
                </WaBubble>
                <WaButtonPreview options={[...(BROADCAST_ROW?.afterButtons ?? BROADCAST_LOLA_INTRO.buttons.en)]} />
              </PhoneFrame>
            </div>
          </div>
          {BROADCAST_ROW ? (
            <a href={BROADCAST_ROW.href} className="cs-validation-link mt-4 inline-block">
              View broadcast flow →
            </a>
          ) : null}
        </Panel>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Panel className="cs-panel--pad">
          <p className="cs-meta-label mb-3">988 tests → guest-visible behaviors</p>
          <SkimTable
            caption="Regression test mapping"
            columns={[
              {
                key: "behavior",
                header: "Behavior",
                render: (row) => <strong className="font-medium text-[var(--cs-ink)]">{row.behavior}</strong>,
              },
              { key: "suite", header: "Suite" },
              {
                key: "href",
                header: "",
                render: (row) => (
                  <a href={row.href} className="text-[var(--cs-brand)] hover:underline underline-offset-2 text-[13px]">
                    Spec →
                  </a>
                ),
              },
            ]}
            rows={VALIDATION_TEST_MAP}
          />
        </Panel>
      </FadeIn>
    </div>
  );
}
