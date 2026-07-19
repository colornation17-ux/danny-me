import React, { useCallback, useEffect, useRef, useState } from "react";
import { PROGRESS_PHASES, type PhaseId } from "./constants";
import { AccordionChevron } from "./transitions";
import { LolaMark } from "./ui";
import { useScrollSpy } from "./useScrollSpy";

const CHAPTER_SECTION_IDS = ["prologue", ...PROGRESS_PHASES.map((p) => p.id)] as const;

function useActivePhase() {
  const { activeId, fillPct } = useScrollSpy(CHAPTER_SECTION_IDS);

  const activePhase: PhaseId | "prologue" =
    activeId === "prologue" ? "prologue" : (activeId as PhaseId);

  const activeIdx =
    activePhase === "prologue" ? -1 : PROGRESS_PHASES.findIndex((p) => p.id === activePhase);

  return { activePhase, activeIdx, fillPct };
}

/** Compact fixed left timeline — sized to content, not full viewport */
export function PhaseRail() {
  const { activePhase, activeIdx, fillPct } = useActivePhase();
  const onPrologue = activePhase === "prologue";

  return (
    <aside className="cs-phase-rail" aria-label="Case study timeline">
      <a href="#prologue" className="cs-phase-rail__brand" title="Lola case study">
        <LolaMark variant="nav" />
      </a>

      <div className="cs-phase-rail__body">
        <div className="cs-phase-rail__progress" aria-hidden="true">
          <div className="cs-phase-rail__track">
            <div className="cs-phase-rail__fill" style={{ height: `${Math.min(100, fillPct)}%` }} />
          </div>
        </div>

        <ol className="cs-phase-rail__steps">
          <li>
            <a
              href="#prologue"
              className={`cs-phase-rail__step${onPrologue ? " is-active" : ""}${!onPrologue ? " is-past" : ""}`}
              aria-current={onPrologue ? "step" : undefined}
              title="Intro"
            >
              <span className="cs-phase-rail__dot" aria-hidden="true" />
              <span className="cs-phase-rail__meta">
                <span className="cs-phase-rail__num">00</span>
                <span className="cs-phase-rail__label">Intro</span>
              </span>
            </a>
          </li>
          {PROGRESS_PHASES.map((phase, i) => {
            const isActive = activePhase === phase.id;
            const isPast = !onPrologue && activeIdx > i;
            return (
              <li key={phase.id}>
                <a
                  href={`#${phase.id}`}
                  title={phase.lead}
                  aria-current={isActive ? "step" : undefined}
                  className={`cs-phase-rail__step${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}${onPrologue ? " is-idle" : ""}`}
                >
                  <span className="cs-phase-rail__dot" aria-hidden="true" />
                  <span className="cs-phase-rail__meta">
                    <span className="cs-phase-rail__num">{phase.num}</span>
                    <span className="cs-phase-rail__label">{phase.label}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

/** Mobile-only phase picker under the portfolio nav */
export function MobilePhasePickerBar() {
  const { activePhase, activeIdx, fillPct } = useActivePhase();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const onPrologue = activePhase === "prologue";
  const current = onPrologue ? null : PROGRESS_PHASES[activeIdx];
  const stepCount = PROGRESS_PHASES.length;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="cs-phase-mobile-bar" ref={rootRef}>
      <div className="cs-page">
        <div className="cs-phase-mobile-picker">
          <button
            ref={triggerRef}
            type="button"
            className="cs-phase-mobile-picker__trigger"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="cs-phase-mobile-menu"
            aria-label={onPrologue ? "Intro — choose a process phase" : `Current step: ${current?.label}. Choose phase.`}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="cs-phase-mobile-picker__value">
              {onPrologue ? "Intro · Lola" : `${current?.num} / ${stepCount} · ${current?.label}`}
            </span>
            <AccordionChevron className={`cs-phase-mobile-picker__chevron${open ? " is-open" : ""}`} />
          </button>

          {open ? (
            <ul id="cs-phase-mobile-menu" className="cs-phase-mobile-picker__menu" role="listbox" aria-label="Process phases">
              <li role="presentation">
                <a
                  href="#prologue"
                  role="option"
                  aria-selected={onPrologue}
                  className={`cs-phase-mobile-picker__option${onPrologue ? " is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="cs-phase-mobile-picker__option-num">00</span>
                  <span>Intro</span>
                </a>
              </li>
              {PROGRESS_PHASES.map((phase) => {
                const isActive = activePhase === phase.id;
                return (
                  <li key={phase.id} role="presentation">
                    <a
                      href={`#${phase.id}`}
                      role="option"
                      aria-selected={isActive}
                      className={`cs-phase-mobile-picker__option${isActive ? " is-active" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="cs-phase-mobile-picker__option-num">{phase.num}</span>
                      <span>{phase.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="cs-phase-stepper__progress cs-phase-stepper__progress--mobile" aria-hidden="true">
            <div className="cs-phase-stepper__track">
              <div className="cs-phase-stepper__fill" style={{ width: `${fillPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated use PortfolioNav + PhaseRail */
export function ChapterNav() {
  return (
    <>
      <MobilePhasePickerBar />
      <PhaseRail />
    </>
  );
}
