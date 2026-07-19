import React from "react";
import type { PhaseId } from "./constants";
import { PHASES } from "./constants";
import { PhaseHeaderReveal } from "./ui";
import { motion, useReducedMotion } from "motion/react";

type PhaseShellProps = {
  id: PhaseId;
  children: React.ReactNode;
  tone?: "default" | "muted" | "surface";
  /** Tighter fold header — fits interactive explorer in one viewport */
  compact?: boolean;
  /** No bottom pad — last phase with footer flush */
  end?: boolean;
};

const TONE_CLASS = {
  default: "cs-fold--default",
  muted: "cs-fold--muted",
  surface: "cs-fold--surface",
} as const;

export function PhaseShell({ id, children, tone = "default", compact = false, end = false }: PhaseShellProps) {
  const phase = PHASES.find((p) => p.id === id);
  const reduce = useReducedMotion();
  if (!phase) return <>{children}</>;

  const markerOpacity = compact ? 0.08 : 0.12;

  return (
    <section
      id={id}
      className={`cs-fold scroll-mt-[var(--cs-nav-h)] ${TONE_CLASS[tone]}${compact ? " cs-fold--compact" : ""}${end ? " cs-fold--end" : ""}`}
      aria-labelledby={`phase-title-${id}`}
    >
      {reduce ? (
        <div className="cs-fold-marker" aria-hidden>
          <span className="cs-fold-marker-num">{phase.num}</span>
        </div>
      ) : (
        <motion.div
          className="cs-fold-marker"
          aria-hidden
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: markerOpacity, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="cs-fold-marker-num">{phase.num}</span>
        </motion.div>
      )}
      <header className="cs-fold-header cs-page">
        <PhaseHeaderReveal
          eyebrow={phase.eyebrow}
          titleId={`phase-title-${id}`}
          title={phase.title}
          lead={phase.lead}
        />
      </header>
      <div className="cs-fold-body">{children}</div>
    </section>
  );
}

export function PhaseDivider({ label }: { label: string }) {
  return (
    <div className="cs-fold-divider" role="separator" aria-label={label}>
      <div className="cs-page">
        <span className="cs-fold-divider-label">{label}</span>
      </div>
    </div>
  );
}

/** @deprecated use PhaseShell */
export const FoldShell = PhaseShell;
/** @deprecated use PhaseDivider */
export const FoldDivider = PhaseDivider;
