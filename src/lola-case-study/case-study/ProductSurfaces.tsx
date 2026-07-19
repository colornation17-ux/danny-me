import React from "react";
import { WHATSAPP_LIVE } from "./constants";
import { FadeIn } from "./ui";

const SURFACES = [
  {
    id: "guest",
    eyebrow: "Guest",
    title: "Lola on WhatsApp",
    body: "Ask, order, remind, and get staff help on the weekly deals thread — EN/ES, text or voice.",
    jobs: ["Grounded FAQ", "Pickup order", "List reminder", "Staff handoff"],
    href: "#develop/flows/broadcast",
    cta: "Try guest flows",
  },
  {
    id: "staff",
    eyebrow: "Staff",
    title: "Lola Connect",
    body: "Inbox, orders, alerts, and shifts — so the counter sees lists before walk-in.",
    jobs: ["Ready for pickup", "Tickets", "Pickup soon", "Shift schedule"],
    href: "#develop-staff-ops",
    cta: "See staff app",
  },
] as const;

/** Define — the product as two surfaces, one order */
export function ProductSurfaces() {
  return (
    <FadeIn>
      <div className="cs-product-surfaces">
        <p className="cs-meta-label mb-3">The product</p>
        <div className="cs-product-surfaces__grid">
          {SURFACES.map((surface) => (
            <article key={surface.id} className="cs-product-surfaces__card">
              <p className="cs-product-surfaces__eyebrow">{surface.eyebrow}</p>
              <h4 className="cs-product-surfaces__title">{surface.title}</h4>
              <p className="cs-product-surfaces__body">{surface.body}</p>
              <ul className="cs-product-surfaces__jobs">
                {surface.jobs.map((job) => (
                  <li key={job}>{job}</li>
                ))}
              </ul>
              <a href={surface.href} className="cs-product-surfaces__link">
                {surface.cta} →
              </a>
            </article>
          ))}
        </div>
        <p className="cs-product-surfaces__live">
          Live staff app:{" "}
          <a href={WHATSAPP_LIVE.staffUrl} target="_blank" rel="noopener noreferrer">
            Lola Connect ↗
          </a>
          <span className="cs-product-surfaces__live-note">
            {" "}
            (staff login required — full walkthrough is in Develop)
          </span>
        </p>
      </div>
    </FadeIn>
  );
}
