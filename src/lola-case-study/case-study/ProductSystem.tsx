import React from "react";
import { PRODUCT_SYSTEM } from "./constants";
import { FadeIn } from "./ui";

/** Public product spine — jobs across guest + staff, not a feature laundry list */
export function ProductSystem() {
  return (
    <FadeIn>
      <div className="cs-product-system">
        <header className="cs-product-system__intro">
          <p className="cs-meta-label">{PRODUCT_SYSTEM.eyebrow}</p>
          <h3 className="cs-product-system__title">{PRODUCT_SYSTEM.title}</h3>
          <p className="cs-product-system__lead">{PRODUCT_SYSTEM.lead}</p>
        </header>
        <ol className="cs-product-system__list" aria-label="Product capabilities">
          {PRODUCT_SYSTEM.pillars.map((item, i) => (
            <li key={item.title} className="cs-product-system__item">
              <span className="cs-product-system__num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="cs-product-system__item-title">{item.title}</p>
                <p className="cs-product-system__item-detail">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </FadeIn>
  );
}
