import React from "react";
import { PROJECT_META } from "./constants";
import { FadeIn } from "./ui";

const ITEMS = [
  { label: "Role", value: PROJECT_META.role },
  { label: "Timeline", value: PROJECT_META.timeline },
  { label: "Context", value: PROJECT_META.context },
  { label: "Skills", value: PROJECT_META.skills },
] as const;

export function ProjectMeta() {
  return (
    <FadeIn delay={0.04}>
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-4 md:py-5 border-y border-[var(--cs-border)] mb-6">
        {ITEMS.map((item) => (
          <div key={item.label}>
            <dt className="cs-meta-label">{item.label}</dt>
            <dd className="cs-meta-value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </FadeIn>
  );
}
