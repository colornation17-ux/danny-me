import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ARCHITECTURE_LAYERS,
  CONVERSATION_QA,
  DESIGN_ARTIFACTS,
  LOLA_PERSONA,
  PRODUCTION_GAPS,
  REFERENCE_TABS,
  SAFETY_GUARDRAILS,
  type ReferenceTabId,
} from "./constants";
import { ReferenceServicePanel } from "./ReferenceServicePanel";
import { Accordion } from "./Accordion";
import { SlidingTabs } from "./SlidingTabs";
import { useHashLocation } from "./useHashRoute";
import { FadeIn, LolaMark, Panel, Section } from "./ui";

function RoutingPanel() {
  const pathItems = ARCHITECTURE_LAYERS.map((layer, i) => ({
    id: layer.id,
    title: `${i + 1}. ${layer.label}`,
    summary: layer.detail,
    children: <p>{layer.detail}</p>,
  }));

  return (
    <div>
      <p className="cs-body mb-5">
        Structured moments (buttons, coach, reminders) stay on <strong className="text-[var(--cs-ink)]">local handlers</strong>.
        Open-ended text runs through <strong className="text-[var(--cs-ink)]">live context → agent tools → safety</strong> before
        anything reaches WhatsApp. <LolaMark /> never invents prices or hours.
      </p>
      <Accordion items={pathItems} />
    </div>
  );
}

function SafetyPanel() {
  return (
    <div>
      <p className="cs-body mb-5">{CONVERSATION_QA.lead}</p>
      <p className="cs-meta-label mb-3">Outbound guardrails</p>
      <ul className="space-y-3 mb-8">
        {SAFETY_GUARDRAILS.map((item) => (
          <li key={item.label} className="cs-panel px-4 py-3">
            <p className="font-medium text-[var(--cs-ink)] text-[14px]">{item.label}</p>
            <p className="text-[13px] text-[var(--cs-muted)] mt-1 leading-relaxed">{item.detail}</p>
          </li>
        ))}
      </ul>
      <p className="cs-meta-label mb-3">Regression coverage (Vitest)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONVERSATION_QA.suites.map((suite) => (
          <div key={suite.label} className="cs-panel px-4 py-3 h-full">
            <p className="font-medium text-[var(--cs-ink)] text-[14px]">{suite.label}</p>
            <p className="text-[13px] text-[var(--cs-muted)] mt-1 leading-relaxed">{suite.detail}</p>
          </div>
        ))}
      </div>
      <p className="cs-meta-label mt-8 mb-3">Portfolio vs production (documented gaps)</p>
      <ul className="space-y-3">
        {PRODUCTION_GAPS.map((row) => (
          <li key={row.topic} className="cs-panel px-4 py-3">
            <p className="font-medium text-[var(--cs-ink)] text-[14px]">{row.topic}</p>
            <p className="text-[12px] text-[var(--cs-muted)] mt-1 leading-relaxed">
              <span className="font-medium text-[var(--cs-ink)]">Demo: </span>
              {row.portfolio}
            </p>
            <p className="text-[12px] text-[var(--cs-muted)] mt-1 leading-relaxed">
              <span className="font-medium text-[var(--cs-ink)]">Production: </span>
              {row.production}
            </p>
            <p className="text-[11px] text-[var(--cs-brand)] mt-1.5 font-medium">{row.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArtifactsPanel() {
  const artifactItems = DESIGN_ARTIFACTS.map((group) => ({
    id: group.id,
    title: group.type,
    summary: group.summary,
    children: (
      <ul className="space-y-3">
        {group.items.map((item) => (
          <li key={item.label}>
            <p className="font-medium text-[var(--cs-ink)] text-[14px]">{item.label}</p>
            <p className="text-[13px] text-[var(--cs-muted)] mt-0.5 leading-relaxed">{item.detail}</p>
          </li>
        ))}
      </ul>
    ),
  }));

  return <Accordion items={artifactItems} />;
}

function PersonaPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 items-start">
      <div className="flex justify-center md:justify-start">
        <img
          src="/lola-mascot.svg"
          alt=""
          width={120}
          height={120}
          className="rounded-full border border-[var(--cs-border)] bg-[var(--cs-teal-soft)]"
        />
      </div>
      <dl className="space-y-4 text-[14px]">
        <div>
          <dt className="cs-eyebrow mb-1">Character</dt>
          <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.visual}</dd>
        </div>
        <div>
          <dt className="cs-eyebrow mb-1">Sound</dt>
          <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.voice}</dd>
        </div>
        <div>
          <dt className="cs-eyebrow mb-1">Guardrails</dt>
          <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.rules}</dd>
        </div>
      </dl>
    </div>
  );
}

const TAB_PANELS: Record<ReferenceTabId, React.ReactNode> = {
  routing: <RoutingPanel />,
  safety: <SafetyPanel />,
  service: <ReferenceServicePanel />,
  artifacts: <ArtifactsPanel />,
  persona: <PersonaPanel />,
};

function isReferenceTab(value: string): value is ReferenceTabId {
  return REFERENCE_TABS.some((t) => t.id === value);
}

const REFERENCE_PANEL_ID = "reference-tabpanel";
const REFERENCE_TAB_PREFIX = "reference-tab";

export function ReferenceSection({ embedded = false }: { embedded?: boolean }) {
  const [tab, setTab] = useState<ReferenceTabId>("routing");
  const { section, segments, setHash } = useHashLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (section !== "reference") return;
    const next = segments[0];
    if (next && isReferenceTab(next)) {
      setTab(next);
    }
  }, [section, segments]);

  const selectTab = (id: ReferenceTabId) => {
    setTab(id);
    setHash("reference", id);
  };

  return (
    <Section id="reference" className="bg-[var(--cs-bg)] border-y border-[var(--cs-border)]">
      {!embedded ? (
        <FadeIn>
          <p className="cs-meta-label mb-3">Reference</p>
          <h2 className="cs-h2 mb-3">Request path, safety, artifacts &amp; persona</h2>
          <p className="cs-lead mb-6 max-w-[40rem]">
            Depth for eng reviewers and hiring managers who want the full pivot log, trade-offs, and handoff book.
          </p>
        </FadeIn>
      ) : null}

      <Panel className="p-0 overflow-hidden cs-panel--flush">
        <div className="px-4 py-2.5 border-b border-[var(--cs-border)] bg-[var(--cs-surface)]">
          <SlidingTabs
            tabs={REFERENCE_TABS}
            value={tab}
            onChange={selectTab}
            ariaLabel="Reference sections"
            layoutId="reference-pill"
            panelId={REFERENCE_PANEL_ID}
            tabIdPrefix={REFERENCE_TAB_PREFIX}
          />
        </div>
        <div
          id={REFERENCE_PANEL_ID}
          role="tabpanel"
          aria-labelledby={`${REFERENCE_TAB_PREFIX}-tab-${tab}`}
          className="cs-problem-panel-body min-h-0"
          tabIndex={0}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {TAB_PANELS[tab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </Panel>

      <p className="mt-6 text-[13px] text-[var(--cs-muted)]">
        <a href="#design" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
          ← Back to Design
        </a>
        <span className="mx-2 text-[var(--cs-border)]" aria-hidden>
          ·
        </span>
        <a href="#develop/flows/pickup" className="text-[var(--cs-brand)] hover:underline underline-offset-2">
          See live demo → Pickup flow
        </a>
      </p>
    </Section>
  );
}
