import React, { useCallback, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

type SlidingTabsProps<T extends string> = {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  layoutId: string;
  variant?: "segment" | "pill";
  className?: string;
  /** Links tabs to a `role="tabpanel"` element (WCAG tab pattern) */
  panelId?: string;
  /** Override for stable tab ids; defaults to React useId() */
  tabIdPrefix?: string;
};

export function SlidingTabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  layoutId,
  variant = "segment",
  className = "",
  panelId,
  tabIdPrefix: tabIdPrefixProp,
}: SlidingTabsProps<T>) {
  const reduce = useReducedMotion();
  const autoPrefix = useId().replace(/:/g, "");
  const tabIdPrefix = tabIdPrefixProp ?? autoPrefix;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootClass = variant === "pill" ? "cs-sliding-tabs cs-sliding-tabs--pill" : "cs-sliding-tabs";

  const focusTab = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (!tab) return;
      onChange(tab.id);
      tabRefs.current[index]?.focus();
    },
    [onChange, tabs],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = tabs.length - 1;
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = index >= last ? 0 : index + 1;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = index <= 0 ? last : index - 1;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = last;
      } else {
        return;
      }
      e.preventDefault();
      focusTab(next);
    },
    [focusTab, tabs.length],
  );

  return (
    <div className={`${rootClass} ${className}`.trim()} role="tablist" aria-label={ariaLabel} aria-orientation="horizontal">
      {tabs.map((t, index) => {
        const selected = value === t.id;
        const tabDomId = `${tabIdPrefix}-tab-${t.id}`;
        return (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={tabDomId}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={`cs-sliding-tab ${selected ? "is-active" : ""}`}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {selected ? (
              <motion.span
                layoutId={layoutId}
                className="cs-sliding-tab-indicator"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                aria-hidden
              />
            ) : null}
            <span className="cs-sliding-tab-label">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Pair with SlidingTabs when using panelId */
export function TabPanel({
  id,
  labelledBy,
  children,
  className = "",
  style,
  hidden = false,
}: {
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
}) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className={className}
      style={style}
      hidden={hidden}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
