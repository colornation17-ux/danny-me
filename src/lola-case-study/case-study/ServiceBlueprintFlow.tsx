import React from "react";
import { SERVICE_BLUEPRINT } from "./constants";
import { FadeIn } from "./ui";

const FIRST_HIGHLIGHT = SERVICE_BLUEPRINT.findIndex((step) => step.highlight);

/** Service loop — vertical timeline on mobile, horizontal strip on desktop */
export function ServiceBlueprintFlow() {
  return (
    <FadeIn>
      <ol className="cs-service-loop" aria-label="Weekly shop service loop">
        {SERVICE_BLUEPRINT.map((step, i) => (
          <React.Fragment key={step.id}>
            {step.highlight && i === FIRST_HIGHLIGHT ? (
              <li className="cs-service-loop__zone" aria-hidden>
                <span className="cs-service-loop__zone-label">Designed in pilot</span>
              </li>
            ) : null}
            <li
              className={`cs-service-loop__step${step.highlight ? " cs-service-loop__step--highlight" : ""}`}
            >
              <div className="cs-service-loop__marker" aria-hidden>
                <span className="cs-service-loop__num">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <article className="cs-service-loop__card">
                <h3 className="cs-service-loop__title">{step.label}</h3>
                <p className="cs-service-loop__detail">{step.detail}</p>
                <span className="cs-service-loop__tag" data-tag={step.tag}>
                  {step.tag}
                </span>
              </article>
              {i < SERVICE_BLUEPRINT.length - 1 ? (
                <span className="cs-service-loop__arrow" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </FadeIn>
  );
}
