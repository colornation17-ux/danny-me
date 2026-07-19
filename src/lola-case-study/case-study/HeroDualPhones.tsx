import React from "react";
import { PILOT_SHOPPER_FULL } from "./constants";
import { LolaConnectMobileMock } from "./LolaConnectMobileMock";
import { PhoneFrame, WaBubble } from "./whatsapp";

/**
 * Hero product proof — guest WhatsApp beside Lola Connect.
 * H1 stays Lola; this visual shows the full system (not a second flagship name).
 */
export function HeroDualPhones() {
  return (
    <div className="cs-hero-dual" aria-label="Guest WhatsApp and staff Lola Connect — same pickup order">
      <figure className="cs-hero-dual__phone">
        <figcaption className="cs-hero-dual__label">Guest · WhatsApp</figcaption>
        <PhoneFrame contact="Lola · La Bodega" device>
          <WaBubble from="customer" time="9:02">
            {PILOT_SHOPPER_FULL.split(" ")[0]} here — 2 lb chicken, tortillas, eggs, milk for Friday?
          </WaBubble>
          <WaBubble from="lola" time="9:03">
            Got it — I sent your list to the store. Someone will send a total shortly.
          </WaBubble>
          <WaBubble from="lola" time="9:06">
            Total $28.40. Reply YES to confirm, or CANCEL.
          </WaBubble>
        </PhoneFrame>
      </figure>

      <div className="cs-hero-dual__bridge" aria-hidden>
        <span className="cs-hero-dual__bridge-line" />
        <span className="cs-hero-dual__bridge-chip">Same order</span>
        <span className="cs-hero-dual__bridge-line" />
      </div>

      <figure className="cs-hero-dual__phone">
        <figcaption className="cs-hero-dual__label">Staff · Lola Connect</figcaption>
        <LolaConnectMobileMock />
      </figure>
    </div>
  );
}
