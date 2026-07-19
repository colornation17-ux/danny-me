import React from "react";
import { ACTS, PROGRESS_PHASES, type ActId } from "./constants";

export function BreadcrumbNav({ activeId }: { activeId: ActId }) {
  if (activeId === "prologue") return null;

  const active = ACTS.find((a) => a.id === activeId);
  if (!active) return null;

  const parentPhaseId =
    "parentId" in active && active.parentId ? active.parentId : active.id;
  const parentPhase = PROGRESS_PHASES.find((p) => p.id === parentPhaseId);
  const isChild = "parentId" in active && Boolean(active.parentId);

  return (
    <nav aria-label="Breadcrumb" className="border-b border-[var(--cs-border-subtle)] bg-[var(--cs-bg)]">
      <div className="cs-page py-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--cs-muted)]">
          <li>
            <a
              href="#prologue"
              className="hover:text-[var(--cs-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-brand)] rounded"
            >
              Hook
            </a>
          </li>
          {parentPhase ? (
            <>
              <li aria-hidden className="text-[var(--cs-border)]">
                /
              </li>
              <li>
                {isChild ? (
                  <a
                    href={`#${parentPhase.id}`}
                    title={parentPhase.lead}
                    className="hover:text-[var(--cs-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-brand)] rounded"
                  >
                    {parentPhase.label}
                  </a>
                ) : (
                  <span className="text-[var(--cs-ink)] font-medium" aria-current="page">
                    {parentPhase.label}
                  </span>
                )}
              </li>
            </>
          ) : null}
          {isChild ? (
            <>
              <li aria-hidden className="text-[var(--cs-border)]">
                /
              </li>
              <li className="text-[var(--cs-ink)] font-medium" aria-current="page">
                {active.label}
              </li>
            </>
          ) : null}
        </ol>
      </div>
    </nav>
  );
}
