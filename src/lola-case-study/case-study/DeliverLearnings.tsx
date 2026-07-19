import React from "react";
import { FUTURE_SCOPE, PILOT_TAKEAWAYS } from "./constants";
import { FadeIn } from "./ui";

export function DeliverLearnings() {
  return (
    <div>
      <FadeIn>
        <header className="cs-section-intro max-w-[24ch]">
          <h3 className="cs-h3">What I&apos;d carry into the next store</h3>
        </header>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <FadeIn>
          <p className="cs-meta-label">Takeaways</p>
          <ol className="cs-closing-list">
            {PILOT_TAKEAWAYS.map((item, i) => (
              <li key={item.title} className="cs-closing-list-item">
                <span className="cs-closing-list-num" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <p className="cs-closing-list-title">{item.title}</p>
                  <p className="cs-closing-list-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>

        <FadeIn delay={0.04}>
          <p className="cs-meta-label">Future scope</p>
          <ol className="cs-closing-list">
            {FUTURE_SCOPE.map((item, i) => (
              <li key={item.title} className="cs-closing-list-item">
                <span className="cs-closing-list-num" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <p className="cs-closing-list-title">{item.title}</p>
                  <p className="cs-closing-list-body">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </div>
  );
}
