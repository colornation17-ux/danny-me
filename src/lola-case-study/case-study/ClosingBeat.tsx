import React from "react";
import { CLOSING_BEAT } from "./constants";
import { FadeIn } from "./ui";

/** Peak-end beat — honest gap + human quote before Reference appendix */
export function ClosingBeat() {
  return (
    <div
      id="where-this-stands"
      className="cs-page cs-fold-section cs-fold-section--tight border-t border-[var(--cs-border-subtle)] scroll-mt-[var(--cs-nav-h)]"
    >
      <FadeIn>
        <header className="cs-section-intro max-w-[52ch]">
          <p className="cs-meta-label">{CLOSING_BEAT.eyebrow}</p>
          <p className="cs-body">{CLOSING_BEAT.body}</p>
        </header>
        <blockquote className="cs-quote-card mt-6 max-w-[48ch]">
          <p className="cs-quote-card-text">&ldquo;{CLOSING_BEAT.quote}&rdquo;</p>
          <footer className="cs-quote-card-label">{CLOSING_BEAT.attribution}</footer>
        </blockquote>
      </FadeIn>
    </div>
  );
}
