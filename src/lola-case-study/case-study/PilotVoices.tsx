import React from "react";
import { TESTIMONIALS } from "./constants";
import { FadeIn } from "./ui";

export function PilotVoices() {
  return (
    <FadeIn delay={0.06}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.who} className="cs-quote-card">
              <p className="cs-quote-card-text">&ldquo;{t.quote}&rdquo;</p>
              <footer className="cs-quote-card-label">{t.who}</footer>
            </blockquote>
          ))}
        </div>
    </FadeIn>
  );
}
