import React from "react";
import { PRODUCTION_FACTS, PRODUCTION_FACTS_PRIMARY, WHATSAPP_LIVE } from "./constants";
import { FadeIn } from "./ui";

function FactIcon({ kind }: { kind: (typeof PRODUCTION_FACTS)[number]["kind"] }) {
  const common = "w-4 h-4 shrink-0 text-[var(--cs-brand)]";
  if (kind === "live") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "staff") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" strokeLinejoin="round" />
        <path d="M8 7h8M8 11h5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "qa") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
    </svg>
  );
}

/** Production anchors — portfolio claims tied to shipped surfaces */
export function ProductionTruthStrip({
  compact = false,
  primaryOnly = false,
}: {
  compact?: boolean;
  primaryOnly?: boolean;
}) {
  const facts = primaryOnly
    ? PRODUCTION_FACTS.filter((f) => (PRODUCTION_FACTS_PRIMARY as readonly string[]).includes(f.kind))
    : PRODUCTION_FACTS;
  return (
    <FadeIn>
      <div className={compact ? "mb-6" : "mb-8 md:mb-10"}>
        <p className="cs-meta-label mb-3">Production truth</p>
        <ul className={`cs-prod-bento ${compact ? "cs-prod-bento--compact" : ""}`}>
          {facts.map((fact) => (
            <li key={fact.label} className="cs-prod-bento-card">
              <div className="flex items-start gap-3 flex-1 min-h-0 flex-col">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <FactIcon kind={fact.kind} />
                  <div className="min-w-0 flex-1">
                    <p className="cs-prod-bento-label">{fact.label}</p>
                    <p className="cs-prod-bento-value">{fact.value}</p>
                    {fact.detail ? <p className="cs-prod-bento-detail">{fact.detail}</p> : null}
                  </div>
                </div>
                {fact.href ? (
                  <a
                    href={fact.href}
                    target={fact.external ? "_blank" : undefined}
                    rel={fact.external ? "noopener noreferrer" : undefined}
                    className="cs-prod-bento-link"
                  >
                    {fact.linkLabel ?? "Open"}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[var(--cs-muted)]">
          Guest:{" "}
          <a href={WHATSAPP_LIVE.waMe} className="text-[var(--cs-brand)] hover:underline underline-offset-2">
            {WHATSAPP_LIVE.display}
          </a>
          {" · "}
          <a href="/HANDOFF_BOOK.md" target="_blank" rel="noopener noreferrer" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
            Handoff book
          </a>
        </p>
      </div>
    </FadeIn>
  );
}
