import React from "react";
import { FOLD1_META, FOLD1_OVERVIEW } from "./constants";

function FoldSubhead({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="cs-meta-label">
      {children}
    </p>
  );
}

function FoldTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="cs-fold-title cs-fold-title--fold1">
      {children}
    </h2>
  );
}

/** Below hero — metadata + project overview (evidence lives in Discover) */
export function Fold1Credentials() {
  return (
    <div className="fold1-credentials">
      <dl className="fold1-meta-grid" aria-label="Project metadata">
        <div className="fold1-meta-item">
          <dt className="cs-meta-label">Role</dt>
          <dd className="fold1-meta-value">{FOLD1_META.role}</dd>
        </div>
        <div className="fold1-meta-item">
          <dt className="cs-meta-label">Team</dt>
          <dd className="fold1-meta-value">{FOLD1_META.team}</dd>
        </div>
        <div className="fold1-meta-item">
          <dt className="cs-meta-label">Skills</dt>
          <dd className="fold1-meta-value">
            <ul className="fold1-meta-skills">
              {FOLD1_META.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <section className="fold1-case-block fold1-case-block--last" aria-labelledby="fold1-overview-label">
        <FoldSubhead id="fold1-overview-label">{FOLD1_OVERVIEW.eyebrow}</FoldSubhead>
        <FoldTitle>{FOLD1_OVERVIEW.title}</FoldTitle>
        <div className="fold1-overview-body">
          <p>{FOLD1_OVERVIEW.lead}</p>
          <p>{FOLD1_OVERVIEW.role}</p>
        </div>

        <dl className="fold1-overview-facts" aria-label="Project at a glance">
          {FOLD1_OVERVIEW.facts.map((fact) => (
            <div key={fact.label} className="fold1-overview-fact">
              <dt className="cs-meta-label">{fact.label}</dt>
              <dd className="fold1-overview-fact-value">
                {typeof fact.detail === "string" ? (
                  fact.detail
                ) : (
                  <ul className="fold1-overview-deliverables">
                    {fact.detail.map((item) => (
                      <li key={item.slice(0, 48)}>{item}</li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
