import React, { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

function closeMs(varName: string, reduce: boolean) {
  if (reduce) return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return parseFloat(raw) || 150;
}

/** Open / close surface — dropdown (.t-dropdown) or modal (.t-modal). */
export function useSurfaceTransition(wantOpen: boolean, closeVar = "--dropdown-close-dur") {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"hidden" | "resting" | "open" | "closing">(wantOpen ? "open" : "hidden");

  useEffect(() => {
    if (wantOpen) {
      setPhase("resting");
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("open"));
      });
      return () => cancelAnimationFrame(id);
    }

    setPhase((p) => (p === "open" || p === "resting" ? "closing" : p));
  }, [wantOpen]);

  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => setPhase("hidden"), closeMs(closeVar, reduce));
    return () => window.clearTimeout(t);
  }, [phase, closeVar, reduce]);

  const surfaceClass = phase === "open" ? "is-open" : phase === "closing" ? "is-closing" : "";
  const mounted = phase !== "hidden";

  return { surfaceClass, mounted };
}

/** One-shot open on mount (demo modals). */
export function useSurfaceOpenOnMount(closeVar = "--modal-open-dur") {
  const reduce = useReducedMotion() ?? false;
  const [surfaceClass, setSurfaceClass] = useState("");

  useEffect(() => {
    if (reduce) {
      setSurfaceClass("is-open");
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSurfaceClass("is-open"));
    });
    return () => cancelAnimationFrame(id);
  }, [reduce, closeVar]);

  return surfaceClass;
}

export function IconSwap({
  state,
  iconA,
  iconB,
  className = "",
}: {
  state: "a" | "b";
  iconA: React.ReactNode;
  iconB: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`t-icon-swap ${className}`.trim()} data-state={state} aria-hidden>
      <span className="t-icon" data-icon="a">
        {iconA}
      </span>
      <span className="t-icon" data-icon="b">
        {iconB}
      </span>
    </span>
  );
}

export function AccordionChevron({ className = "" }: { className?: string }) {
  return (
    <span className={`t-acc-chevron text-[var(--cs-brand)] flex-shrink-0 ${className}`.trim()} aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 6.5L8 10.5L12 6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
