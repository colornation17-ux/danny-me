import React from "react";
import { FOLDS, TLDR } from "./constants";

const TLDR_ROMAN = ["I", "II", "III"] as const;

export function TldrStrip() {
  return (
    <div className="border-b border-[var(--cs-border)] bg-[var(--cs-surface)]">
      <div className="cs-page py-[var(--cs-space-4)] md:py-[var(--cs-space-5)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--cs-space-3)] mb-[var(--cs-space-3)]">
          <p className="cs-overline text-[var(--cs-ink)] mb-0">60-second skim</p>
          <nav className="flex flex-wrap gap-[var(--cs-space-2)]" aria-label="Jump to fold">
            {FOLDS.map((fold) => (
              <a key={fold.id} href={fold.href} className="cs-skim-jump">
                {fold.num} {fold.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="cs-skim-grid cs-skim-grid--folds">
          {TLDR.map((row, i) => (
            <article key={row.label} className="cs-skim-card cs-skim-card--fold">
              <a
                href={row.href}
                className="block rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-brand)] min-h-[44px]"
              >
                <span className="cs-fold-roman" aria-hidden>
                  {TLDR_ROMAN[i] ?? row.hook}
                </span>
                <div className="min-w-0">
                  <p className="cs-skim-card-label">{row.label}</p>
                  <p className="cs-skim-card-text">{row.text}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[var(--cs-muted)]">
          <strong className="font-medium text-[var(--cs-ink)]">My role:</strong>{" "}
          <a href="#role" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
            what I shipped vs. engineering partner scope
          </a>
          {" · "}
          <a href="#reference" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
            Reference appendix
          </a>
        </p>
      </div>
    </div>
  );
}
