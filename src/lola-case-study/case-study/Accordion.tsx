import React, { useId, useState } from "react";
import { AccordionChevron } from "./transitions";

export function Accordion({
  items,
}: {
  items: { id: string; title: string; summary?: string; children: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const uid = useId().replace(/:/g, "");

  return (
    <div className="border border-[var(--cs-border)] rounded-[var(--cs-radius)] bg-[var(--cs-surface)] divide-y divide-[var(--cs-border-subtle)]">
      {items.map((item) => {
        const isOpen = open === item.id;
        const triggerId = `${uid}-acc-trigger-${item.id}`;
        const panelId = `${uid}-acc-panel-${item.id}`;
        return (
          <div key={item.id} className="t-acc" data-open={isOpen ? "true" : "false"}>
            <button
              id={triggerId}
              type="button"
              className="t-acc-head w-full flex items-start justify-between gap-4 px-4 py-3.5 text-left hover:bg-[var(--cs-bg)]/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--cs-accent)]"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span>
                <span className="block text-[14px] font-semibold text-[var(--cs-ink)]" style={{ fontFamily: "var(--cs-font)" }}>
                  {item.title}
                </span>
                {item.summary && !isOpen && (
                  <span className="block text-[12px] text-[var(--cs-muted)] mt-0.5 line-clamp-1">{item.summary}</span>
                )}
              </span>
              <AccordionChevron />
            </button>
            <div
              id={panelId}
              className="t-acc-panel"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
            >
              <div className="t-acc-panel-inner px-4 pb-4 text-[13px] text-[var(--cs-muted)] leading-relaxed">{item.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
