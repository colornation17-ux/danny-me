import React from "react";
import { ARCHITECTURE_LAYERS, DESIGN_ARTIFACTS, LOLA_PERSONA } from "./constants";
import { Accordion } from "./Accordion";
import { FadeIn, LolaMark, Panel } from "./ui";

export function ConversationalArchitecture() {
  const pathItems = ARCHITECTURE_LAYERS.map((layer, i) => ({
    id: layer.id,
    title: `${i + 1}. ${layer.label}`,
    summary: layer.detail,
    children: <p>{layer.detail}</p>,
  }));

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

  return (
    <div className="mb-14">
      <FadeIn>
        <p className="cs-eyebrow mb-2">Conversational architecture</p>
        <h3 className="cs-h3 mb-2">Grounded answers that sound human — not a black-box chatbot</h3>
        <p className="cs-body mb-8">
          <LolaMark /> uses OpenAI for natural language when needed, but{" "}
          <strong className="text-[var(--cs-ink)]">local routing, staff knowledge, and progressive fallback</strong> do most of the work. Prices and hours never come from model imagination.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        <FadeIn>
          <p className="cs-eyebrow mb-2">Request path</p>
          <Accordion items={pathItems} />
        </FadeIn>

        <FadeIn delay={0.06}>
          <Panel>
            <p className="cs-eyebrow mb-3">
              <LolaMark variant="inline" /> persona &amp; voice
            </p>
            <dl className="space-y-3 text-[13px]">
              <div>
                <dt className="text-[var(--cs-muted)] cs-eyebrow mb-1">Character</dt>
                <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.visual}</dd>
              </div>
              <div>
                <dt className="text-[var(--cs-muted)] cs-eyebrow mb-1">Sound</dt>
                <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.voice}</dd>
              </div>
              <div>
                <dt className="text-[var(--cs-muted)] cs-eyebrow mb-1">Guardrails</dt>
                <dd className="text-[var(--cs-ink)] leading-relaxed">{LOLA_PERSONA.rules}</dd>
              </div>
            </dl>
          </Panel>
        </FadeIn>
      </div>

      <FadeIn delay={0.1}>
        <p className="cs-eyebrow mt-8 mb-3">Design artifacts</p>
        <Accordion items={artifactItems} />
      </FadeIn>
    </div>
  );
}
