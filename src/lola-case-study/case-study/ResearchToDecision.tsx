import React from "react";
import { RESEARCH_TO_DECISION } from "./constants";
import { FadeIn } from "./ui";

export function ResearchToDecision() {
  return (
    <FadeIn>
      <p className="cs-meta-label mb-3">Research → design decision → where it ships</p>
      <div className="cs-research-table-wrap mb-6 overflow-x-auto">
        <table className="cs-research-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th scope="col">Pattern in inbox</th>
              <th scope="col">What I designed</th>
              <th scope="col">Where it ships</th>
            </tr>
          </thead>
          <tbody>
            {RESEARCH_TO_DECISION.map((row) => (
              <tr key={row.pattern}>
                <td>{row.pattern}</td>
                <td>
                  <strong className="font-semibold text-[var(--cs-ink)]">{row.responseHook}</strong>{" "}
                  {row.responseRest}
                </td>
                <td>
                  <a
                    href={row.ships.href}
                    className="text-[var(--cs-brand)] font-medium hover:underline underline-offset-2"
                  >
                    {row.ships.label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FadeIn>
  );
}
