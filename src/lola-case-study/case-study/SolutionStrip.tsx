import React from "react";
import { FadeIn } from "./ui";
import { PhoneFrame, WaBroadcastHeader, WaBubble, WaButtons } from "./whatsapp";
import { BROADCAST_LEGACY, PILOT_SHOPPER } from "./constants";

const SHIPPED = [
  {
    label: "Weekly broadcast",
    caption:
      "Same template image — added tap buttons (before: numbered menu + automated text replies).",
    visual: (
      <PhoneFrame contact="La Bodega Calhoun">
        <WaBroadcastHeader compact />
        <WaBubble from="staff" time="2:05 PM" dense>
          {BROADCAST_LEGACY.menuText.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </WaBubble>
      </PhoneFrame>
    ),
  },
  {
    label: "Weekly deals thread",
    caption: "Grounded EN/ES on the weekly deals thread.",
    visual: (
      <PhoneFrame>
        <WaBubble from="customer" time="8:02">
          hi
        </WaBubble>
        <WaBubble from="lola" time="8:02">
          {`Hi, ${PILOT_SHOPPER}! Tap below or ask about deals.`}
          <WaButtons options={["✨ Weekly deals", "🕐 Store hours", "🛒 Place order"]} compact />
        </WaBubble>
      </PhoneFrame>
    ),
  },
  {
    label: "List reminders",
    caption: "List + time → nudge → Place order tap.",
    visual: (
      <PhoneFrame>
        <WaBubble from="lola" time="Sat 10:00">
          Your list: milk, eggs, tortillas. Ready for pickup?
          <WaButtons options={["🛒 Place order", "Not today"]} compact />
        </WaBubble>
      </PhoneFrame>
    ),
  },
  {
    label: "Pickup & alerts",
    caption: "Staff WhatsApp buzz when a list lands.",
    visual: (
      <PhoneFrame contact="La Bodega · Staff">
        <WaBubble from="lola" time="9:06" dense>
          🛒 <strong>New list</strong> — {PILOT_SHOPPER} · chicken, tortillas, eggs, milk
        </WaBubble>
      </PhoneFrame>
    ),
  },
  {
    label: "Staff help relay",
    caption: "No answer in knowledge → staff reply relayed.",
    visual: (
      <PhoneFrame>
        <WaBubble from="customer" time="3:14">
          Do you have guava leaves today?
        </WaBubble>
        <WaBubble from="lola" time="3:18" dense>
          From our store team: Yes — produce, near the plantains.
        </WaBubble>
      </PhoneFrame>
    ),
  },
] as const;

export function SolutionStrip() {
  return (
    <section
      id="solution-pillars"
      className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)] py-10 md:py-14 mt-10 md:mt-14 scroll-mt-[var(--cs-nav-h)]"
    >
      <div className="cs-page">
        <FadeIn>
          <p className="cs-meta-label mb-2">What shipped</p>
          <h2 className="cs-h2 mb-6">Lola on the weekly deals thread</h2>
        </FadeIn>
        <div className="cs-shipped-scroll" role="list">
          {SHIPPED.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.04}>
              <article className="cs-shipped-card" role="listitem">
                <div className="cs-shipped-phone-wrap">{item.visual}</div>
                <h3 className="font-medium text-[14px] text-[var(--cs-ink)] mb-1 text-center">{item.label}</h3>
                <p className="text-[13px] text-[var(--cs-ink-muted)] leading-snug text-center">{item.caption}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
