import React from "react";
import { CTA, DESIGN_GOAL_PILLARS, HERO_PROOF_PILLS, HERO_SUBTITLE, PROJECT_STATS, STORY, WHATSAPP_LIVE } from "./constants";
import { BoldLead } from "./skimUi";
import { LolaMark } from "./ui";

/** Hero H1 — two-line portfolio headline */
export function StoryHero() {
  return (
    <h1 className="cs-h1 cs-h1--hero-split mb-0">
      {STORY.headline ? (
        STORY.headline
      ) : (
        <>
          <span className="cs-h1-line">
            {STORY.headlineBefore}
            <LolaMark className="cs-prologue-lola-mark" />
            {STORY.headlineAfter}
          </span>
          {STORY.headlineSubline ? (
            <span className="cs-h1-subline">{STORY.headlineSubline}</span>
          ) : null}
        </>
      )}
    </h1>
  );
}

/** Portfolio body under H1 */
export function StoryHeroSubtitle() {
  return <p className="cs-hero-banner-lead mt-4 mb-0 max-w-[42ch]">{HERO_SUBTITLE}</p>;
}

/** Compact hero proof pills */
export function HeroProofPills() {
  return (
    <ul className="cs-hero-proof-pills" aria-label="Project proof points">
      {HERO_PROOF_PILLS.map((label) => (
        <li key={label} className="cs-chip cs-hero-proof-pill">
          {label}
        </li>
      ))}
    </ul>
  );
}

/** Hero CTAs — primary case-study path; WhatsApp as quiet secondary */
export function HeroCtas() {
  return (
    <div className="cs-hero-banner-ctas">
      <a href={CTA.exploreFlowsHref} className="cs-btn-primary">
        {CTA.exploreFlows}
      </a>
      <a
        href={WHATSAPP_LIVE.waMe}
        target="_blank"
        rel="noopener noreferrer"
        className="cs-hero-text-link"
      >
        {CTA.messageWhatsApp}
      </a>
    </div>
  );
}

/** Defensible pilot stats — no fabricated KPIs */
export function HeroStats() {
  return (
    <ul className="cs-stat-row mt-5" aria-label="Pilot outcomes">
      {PROJECT_STATS.map((stat) => (
        <li key={stat.label} className="cs-stat-chip">
          <span className="cs-stat-chip-value">{stat.value}</span>
          <span className="cs-stat-chip-label">{stat.label}</span>
          <span className="cs-stat-chip-text">{stat.detail}</span>
        </li>
      ))}
    </ul>
  );
}

/** Three design outcomes — scan line before problem/HMW */
export function DesignGoalPillars() {
  return (
    <ul className="cs-goal-pillars mt-6" aria-label="Design goals">
      {DESIGN_GOAL_PILLARS.map((pillar) => (
        <li key={pillar.title} className="cs-goal-pillar">
          <p className="cs-goal-pillar-title">{pillar.title}</p>
          <p className="cs-goal-pillar-detail">{pillar.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/** Compact problem + solution skim (used below hero, not duplicating H1) */
export function StoryBody() {
  return (
    <div className="max-w-[52rem] mt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <p className="cs-meta-label mb-3 normal-case tracking-normal">User problem</p>
          {STORY.problemLines.map((line) => (
            <BoldLead key={line.hook} hook={line.hook} className="text-[15px]">
              {line.text}
            </BoldLead>
          ))}
        </div>
        <div>
          <p className="cs-meta-label mb-3 normal-case tracking-normal">What shipped</p>
          <ul className="cs-hero-cap-list">
            {STORY.capabilities.map((item) => (
              <li key={item.label}>
                <strong className="font-semibold text-[var(--cs-ink)]">{item.label}</strong>
                <span className="text-[var(--cs-ink-muted)]"> — {item.ships}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Solution + capability table (below meta grid) */
export function StorySolution() {
  return (
    <div className="max-w-[52rem]">
      <p className="cs-meta-label mb-3 normal-case tracking-normal">The solution</p>
      <BoldLead hook={STORY.solutionHook} className="cs-hero-summary mb-4 max-w-none">
        {STORY.solutionBody}
      </BoldLead>

      <div className="cs-skim-table-wrap overflow-x-auto mb-4">
        <table className="cs-skim-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th scope="col">Capability</th>
              <th scope="col">Ships as</th>
            </tr>
          </thead>
          <tbody>
            {STORY.capabilities.map((item) => (
              <tr key={item.label}>
                <td>
                  <strong className="font-semibold text-[var(--cs-ink)]">{item.label}</strong>
                </td>
                <td>{item.ships}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[13px] text-[var(--cs-ink-muted)] leading-relaxed">
        {STORY.ownershipLines.map((line, i) => (
          <React.Fragment key={line.hook}>
            {i > 0 ? " " : null}
            <strong className="font-semibold text-[var(--cs-ink)]">{line.hook}</strong> {line.text}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
