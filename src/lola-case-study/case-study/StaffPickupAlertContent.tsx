import React from "react";
import { PILOT_SHOPPER_FULL } from "./constants";

export const STAFF_PICKUP_ITEMS = "2 lb chicken breast, tortillas, dozen eggs, milk";
export const STAFF_PICKUP_TIME = "Friday 5:00 PM pickup";
export const STAFF_PICKUP_PHONE = "(404) 555-0142";
export const STAFF_PICKUP_REF = "LB-20250622-0042";

type StaffPickupAlertContentProps = {
  channel: "wa" | "dashboard";
};

/** Shared pickup alert copy + layout for staff WhatsApp and dashboard modal */
export function StaffPickupAlertContent({ channel }: StaffPickupAlertContentProps) {
  return (
    <div className="cs-staff-pickup-alert">
      <p className="cs-staff-pickup-alert__lead">
        <span aria-hidden>🛒 </span>
        <strong>New pickup list</strong>
      </p>
      <p className="cs-staff-pickup-alert__name">{PILOT_SHOPPER_FULL}</p>
      <p className="cs-staff-pickup-alert__sub">{channel === "wa" ? STAFF_PICKUP_PHONE : STAFF_PICKUP_REF}</p>
      <p className="cs-staff-pickup-alert__items">{STAFF_PICKUP_ITEMS}</p>
      <p className="cs-staff-pickup-alert__pickup">{STAFF_PICKUP_TIME}</p>
      {channel === "wa" ? (
        <p className="cs-staff-pickup-alert__action">
          {/* Illustrative mockup chrome — not a page CTA (login wall) */}
          <span className="cs-staff-pickup-alert__link">Review in dashboard →</span>
        </p>
      ) : null}
    </div>
  );
}
