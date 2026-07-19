import React from "react";
import { motion, useReducedMotion } from "motion/react";

export function Tag({
  children,
  variant = "accent",
}: {
  children: React.ReactNode;
  variant?: "accent" | "muted" | "teal";
}) {
  const styles = {
    accent: "bg-[var(--cs-accent-soft)] text-[var(--cs-brand)] border-[color-mix(in_srgb,var(--cs-brand)_18%,var(--cs-border))]",
    muted: "bg-[var(--cs-bg)] text-[var(--cs-muted)] border-[var(--cs-border-subtle)]",
    teal: "bg-[var(--cs-teal-soft)] text-[var(--cs-teal-text)] border-[color-mix(in_srgb,var(--cs-teal)_20%,var(--cs-border))]",
  };
  return (
    <span className={`cs-chip text-[11px] ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function ActHeader({
  label,
  title,
  lead,
  compact = false,
  num,
}: {
  label: string;
  title: string;
  lead?: React.ReactNode;
  compact?: boolean;
  /** Large display index — Coveo / editorial style */
  num?: string;
}) {
  return (
    <header className={compact ? "cs-act-header-compact" : "mb-8 md:mb-10"}>
      <div className="cs-act-header-row">
        {num ? (
          <span className="cs-act-display-num" aria-hidden>
            {num}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="cs-meta-label mb-3">{label}</p>
          <h2 className="cs-h2 mb-3">{title}</h2>
          {lead ? <div className="cs-lead">{lead}</div> : null}
        </div>
      </div>
    </header>
  );
}

export const Section = React.forwardRef<HTMLElement, {
  children: React.ReactNode;
  id: string;
  className?: string;
  /** Tighter section padding — sub-blocks inside a phase */
  compact?: boolean;
  /** Minimal padding — nested bands (e.g. flow explorer strip) */
  inset?: boolean;
  /** Children manage their own horizontal gutters (e.g. full-bleed + cs-page children) */
  bleed?: boolean;
}>(function Section(
  { children, id, className = "", compact = false, inset = false, bleed = false },
  ref,
) {
  const density = inset ? "cs-section--inset" : compact ? "cs-section--compact" : "";
  return (
    <section ref={ref} id={id} className={`cs-section ${density} ${className}`.trim()}>
      {bleed ? children : <div className="cs-page">{children}</div>}
    </section>
  );
});

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`cs-panel p-4 md:p-5 ${className}`}>{children}</div>;
}

export function InsightCallout({ children }: { children: React.ReactNode }) {
  return (
    <Panel className="bg-[color-mix(in_srgb,var(--cs-accent-soft)_35%,var(--cs-surface))] border-[var(--cs-border-subtle)]">
      <p className="text-[var(--cs-ink)] font-medium text-[15px] leading-relaxed">{children}</p>
    </Panel>
  );
}

export function QuoteCard({
  quote,
  who,
  role,
}: {
  quote: string;
  who: string;
  role: string;
}) {
  return (
    <Panel className="h-full flex flex-col">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-[var(--cs-ink)] mb-4">&ldquo;{quote}&rdquo;</blockquote>
      <footer>
        <p className="font-medium text-[13px] text-[var(--cs-ink)]">{who}</p>
        <p className="cs-eyebrow mt-0.5">{role}</p>
      </footer>
    </Panel>
  );
}

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
/** Trigger when ~18% of block is visible — stable across section heights */
const SCROLL_VIEWPORT = { once: true, amount: 0.18, margin: "0px 0px -6% 0px" } as const;

export function FadeIn({
  children,
  className = "",
  delay = 0,
  when = "view",
  distance = 10,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "mount" = animate on load (hero). "view" = animate when scrolled into view. */
  when?: "mount" | "view";
  distance?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const transition = { duration: 0.32, delay, ease: REVEAL_EASE };
  if (when === "mount") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={SCROLL_VIEWPORT}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/** Phase chapter header — eyebrow, title, lead stagger on scroll */
export function PhaseHeaderReveal({
  eyebrow,
  titleId,
  title,
  lead,
}: {
  eyebrow: string;
  titleId: string;
  title: string;
  lead: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <>
        <p className="cs-fold-eyebrow">{eyebrow}</p>
        <h2 id={titleId} className="cs-fold-title">
          {title}
        </h2>
        <p className="cs-fold-lead">{lead}</p>
      </>
    );
  }

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: REVEAL_EASE } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ ...SCROLL_VIEWPORT, amount: 0.22 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } } }}
    >
      <motion.p className="cs-fold-eyebrow" variants={item}>
        {eyebrow}
      </motion.p>
      <motion.h2 id={titleId} className="cs-fold-title" variants={item}>
        {title}
      </motion.h2>
      <motion.p className="cs-fold-lead" variants={item}>
        {lead}
      </motion.p>
    </motion.div>
  );
}

/** Pixelify display name — use everywhere instead of plain "Lola" text */
export function LolaMark({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white" | "nav" | "phone" | "inline";
}) {
  const variantClass =
    variant === "white"
      ? "cs-lola--white"
      : variant === "nav"
        ? "cs-lola--nav"
        : variant === "phone"
          ? "cs-lola--phone"
          : variant === "inline"
            ? "cs-lola--inline"
            : "";
  return <span className={`cs-lola ${variantClass} ${className}`.trim()}>Lola</span>;
}
