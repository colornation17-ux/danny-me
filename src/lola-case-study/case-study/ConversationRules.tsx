import React from "react";
import { CONVERSATION_RULES } from "./constants";
import { FadeIn, Panel } from "./ui";

/** Four conversation design decision cards */
export function ConversationRules() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONVERSATION_RULES.map((rule, i) => (
          <FadeIn key={rule.title} delay={i * 0.04}>
            <Panel className="cs-conversation-rule h-full">
              <p className="cs-conversation-rule-title">{rule.title}</p>
              <p className="cs-conversation-rule-body">{rule.body}</p>
            </Panel>
          </FadeIn>
        ))}
    </div>
  );
}
