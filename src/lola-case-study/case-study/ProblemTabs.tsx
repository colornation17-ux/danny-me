import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DISCOVER_BRIDGE,
  EVIDENCE_EXHIBIT_TABS,
  HOW_WE_LEARNED,
  INBOX_SNIPPETS,
  JOURNEY_PANEL_COPY,
  METHODS_PANEL_COPY,
  RESEARCH_METHODS_RIGOR,
  type EvidenceExhibitTabId,
} from "./constants";
import { CustomerJourneyFlow } from "./CustomerJourneyFlow";
import { SlidingTabs } from "./SlidingTabs";
import { useHashLocation } from "./useHashRoute";
import { Panel } from "./ui";
import { PhoneFrame, WaBubble, WaVoiceNote } from "./whatsapp";

const INBOX_TAB_ITEMS = INBOX_SNIPPETS.map((s) => ({ id: s.id, label: s.title }));

const METHODS = [...HOW_WE_LEARNED];

function isEvidenceTab(value: string): value is EvidenceExhibitTabId {
  return EVIDENCE_EXHIBIT_TABS.some((t) => t.id === value);
}

const INBOX_PANEL_ID = "inbox-snippet-panel";
const INBOX_TAB_PREFIX = "inbox-snippet-tab";

function InboxTab({
  snippetId,
  onSnippetChange,
}: {
  snippetId: string;
  onSnippetChange: (id: string) => void;
}) {
  const slide = INBOX_SNIPPETS.find((s) => s.id === snippetId) ?? INBOX_SNIPPETS[0];
  const showPhone = slide.kind === "thread" || slide.kind === "voice";

  return (
    <div>
      <SlidingTabs
        tabs={INBOX_TAB_ITEMS}
        value={snippetId}
        onChange={onSnippetChange}
        ariaLabel="Inbox snippets"
        layoutId="inbox-snippet-pill"
        variant="pill"
        panelId={INBOX_PANEL_ID}
        tabIdPrefix={INBOX_TAB_PREFIX}
        className="mb-3"
      />
      <div
        id={INBOX_PANEL_ID}
        role="tabpanel"
        aria-labelledby={`${INBOX_TAB_PREFIX}-tab-${snippetId}`}
        tabIndex={0}
        className={showPhone ? "cs-inbox-split" : undefined}
      >
        <div className="min-w-0">
          <p className="cs-insight-line">{slide.insight}</p>
          {slide.kind === "voice" && (
            <div className="cs-transcript">
              <p className="cs-transcript-label" id="inbox-transcript-label">
                Transcription
              </p>
              <p className="cs-transcript-body" aria-labelledby="inbox-transcript-label">
                &ldquo;{slide.transcript}&rdquo;
              </p>
            </div>
          )}
        </div>
        {slide.kind === "voice" && (
          <PhoneFrame contact={slide.contact} inbox>
            <WaBubble from="customer" time={slide.time} perspective="store">
              <WaVoiceNote duration={slide.duration} />
            </WaBubble>
          </PhoneFrame>
        )}
        {slide.kind === "thread" && (
          <PhoneFrame contact={slide.contact} inbox>
            {slide.messages.map((msg, i) => (
              <WaBubble key={`${msg.time}-${i}`} from={msg.from} time={msg.time} perspective="store">
                {msg.text}
              </WaBubble>
            ))}
          </PhoneFrame>
        )}
      </div>
    </div>
  );
}

function MethodsTab() {
  return (
    <div>
      <div className="space-y-3 mb-4">
        {METHODS_PANEL_COPY.map((line) => (
          <p key={line.slice(0, 48)} className="text-[14px] text-[var(--cs-ink)] leading-snug">
            {line}
          </p>
        ))}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {METHODS.map((item) => (
          <li key={item.title} className="cs-panel px-4 py-3">
            <p className="font-medium text-[14px] text-[var(--cs-ink)] leading-snug">{item.title}</p>
            <p className="text-[13px] text-[var(--cs-ink-muted)] mt-1 leading-snug">{item.detail}</p>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-[var(--cs-muted)] leading-relaxed border-t border-[var(--cs-border-subtle)] pt-3">
        <span className="font-medium text-[var(--cs-ink)]">Methods note: </span>
        {RESEARCH_METHODS_RIGOR}
      </p>
    </div>
  );
}

const PROBLEM_PANEL_ID = "problem-tabpanel";
const PROBLEM_TAB_PREFIX = "problem-tab";

export function ProblemTabs() {
  const [tab, setTab] = useState<EvidenceExhibitTabId>("inbox");
  const [snippetId, setSnippetId] = useState(INBOX_SNIPPETS[0].id);
  const { section, segments, setHash } = useHashLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (section !== "discover") return;
    const exhibit = segments[0];
    if (exhibit && isEvidenceTab(exhibit)) {
      setTab(exhibit);
      if (exhibit === "inbox" && segments[1]) {
        const match = INBOX_SNIPPETS.find((s) => s.id === segments[1]);
        if (match) setSnippetId(match.id);
      }
    }
  }, [section, segments]);

  const selectTab = (next: EvidenceExhibitTabId) => {
    setTab(next);
    setHash("discover", next);
  };

  const selectSnippet = (id: string) => {
    setSnippetId(id);
    setTab("inbox");
    setHash("discover", "inbox", id);
  };

  return (
    <Panel className="p-0 overflow-hidden cs-panel--flush">
      <div className="px-4 py-2.5 border-b border-[var(--cs-border)] bg-[var(--cs-bg)]">
        <SlidingTabs
          tabs={[...EVIDENCE_EXHIBIT_TABS]}
          value={tab}
          onChange={selectTab}
          ariaLabel="Evidence exhibits"
          layoutId="problem-detail-pill"
          panelId={PROBLEM_PANEL_ID}
          tabIdPrefix={PROBLEM_TAB_PREFIX}
        />
      </div>
      {tab === "inbox" ? (
        <p className="cs-phase-panel-intro">{DISCOVER_BRIDGE}</p>
      ) : null}
      <div
        id={PROBLEM_PANEL_ID}
        role="tabpanel"
        aria-labelledby={`${PROBLEM_TAB_PREFIX}-tab-${tab}`}
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
            {tab === "journey" && (
              <>
                <div className="space-y-2 mb-4">
                  {JOURNEY_PANEL_COPY.map((line) => (
                    <p key={line.slice(0, 40)} className="text-[13px] text-[var(--cs-ink-muted)] leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
                <CustomerJourneyFlow embedded />
              </>
            )}
            {tab === "inbox" && <InboxTab snippetId={snippetId} onSnippetChange={selectSnippet} />}
            {tab === "methods" && <MethodsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}
