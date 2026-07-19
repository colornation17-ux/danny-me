import React from "react";
import { PILOT_SHOPPER, PILOT_SHOPPER_FULL } from "./constants";

type LcNavId = "home" | "inbox" | "orders" | "tickets";

const BOTTOM_NAV: { id: LcNavId; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
];

const MenuIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

/** Production Lola Connect floating bottom nav (icon-only inactive · active expands with label) */
function LcBottomNav({ active }: { active: LcNavId }) {
  return (
    <div className="cs-lc-phone__nav-dock" aria-hidden>
      <nav className="cs-lc-nav-float" aria-label="Lola Connect navigation">
        {BOTTOM_NAV.map((tab) => {
          const isActive = tab.id === active;
          return (
            <span
              key={tab.id}
              className={`cs-lc-nav-link${isActive ? " is-active" : ""}`}
              title={tab.label}
            >
              <span className="cs-lc-nav-icon">{tab.icon}</span>
              {isActive ? <span className="cs-lc-nav-label">{tab.label}</span> : null}
            </span>
          );
        })}
        <span className="cs-lc-nav-link" title="More">
          <span className="cs-lc-nav-icon">{MenuIcon}</span>
        </span>
      </nav>
    </div>
  );
}

function LcPhoneShell({
  active,
  className = "",
  screenClassName = "",
  label,
  children,
}: {
  active: LcNavId;
  className?: string;
  screenClassName?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`cs-lc-phone ${className}`.trim()} aria-label={label}>
      <div className={`cs-lc-phone__screen ${screenClassName}`.trim()}>
        <div className="cs-lc-phone__body">{children}</div>
        <LcBottomNav active={active} />
      </div>
    </div>
  );
}

/** Compact Lola Connect inbox thread — Ready bar (matches production) */
export function LolaConnectMobileMock({ className = "" }: { className?: string }) {
  return (
    <LcPhoneShell active="inbox" className={className} label="Lola Connect inbox mockup">
      <header className="cs-lc-phone__thread-bar">
        <span className="cs-lc-phone__avatar" aria-hidden>
          {PILOT_SHOPPER.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="cs-lc-phone__contact">{PILOT_SHOPPER_FULL}</p>
          <p className="cs-lc-phone__order">(404) 555-0142</p>
        </div>
      </header>

      <div className="cs-lc-phone__messages">
        <div className="cs-lc-phone__bubble cs-lc-phone__bubble--guest">
          2 lb chicken breast, tortillas, dozen eggs, milk
        </div>
        <div className="cs-lc-phone__bubble cs-lc-phone__bubble--staff">
          Total $28.40 — reply YES to confirm
        </div>
        <div className="cs-lc-phone__bubble cs-lc-phone__bubble--guest">YES</div>
      </div>

      <div className="cs-lc-phone__ready-bar">
        <div className="min-w-0">
          <p className="cs-lc-phone__ready-title">Ready for pickup</p>
          <p className="cs-lc-phone__ready-hint">Notify guest when bagged</p>
          <p className="cs-lc-phone__ready-meta">LB-20250622-0042 · Confirmed</p>
        </div>
        <span className="cs-lc-phone__ready-btn">Mark ready</span>
      </div>
    </LcPhoneShell>
  );
}

/** Orders list — production status labels */
export function LolaConnectOrdersMock({ className = "" }: { className?: string }) {
  const rows = [
    {
      name: PILOT_SHOPPER_FULL,
      ref: "LB-0042",
      items: "chicken, tortillas, eggs…",
      pickup: "Fri 5:00 PM",
      status: "Quote sent",
      accent: true,
      action: "Waiting for YES",
    },
    {
      name: "Ana Ruiz",
      ref: "LB-0038",
      items: "rice, beans, cilantro",
      pickup: "Fri 4:30 PM",
      status: "Ready",
      accent: false,
      action: "Ready for pickup",
    },
    {
      name: "James T.",
      ref: "LB-0035",
      items: "ground beef, onions",
      pickup: "Today",
      status: "New list",
      accent: false,
      action: "Review & send quote",
    },
  ];

  return (
    <LcPhoneShell active="orders" className={className} label="Lola Connect orders mockup">
      <header className="cs-lc-phone__page-head">
        <div className="min-w-0">
          <p className="cs-lc-phone__page-title">Orders</p>
          <p className="cs-lc-phone__page-meta">Today — 3 pending · 12 completed</p>
          <p className="cs-lc-phone__sample-note" role="note">
            Illustrative sample — see Still Measuring
          </p>
        </div>
        <span className="cs-lc-phone__ghost-btn">Refresh</span>
      </header>

      <ul className="cs-lc-phone__order-list">
        {rows.map((row) => (
          <li key={row.ref} className={`cs-lc-phone__order-row${row.accent ? " is-accent" : ""}`}>
            <div className="cs-lc-phone__order-row-top">
              <div className="min-w-0">
                <p className="cs-lc-phone__order-name">{row.name}</p>
                <p className="cs-lc-phone__order-meta">
                  <span className="cs-lc-phone__order-ref">{row.ref}</span>
                  {" · "}
                  {row.items}
                </p>
                <p className="cs-lc-phone__order-meta">Pickup {row.pickup}</p>
              </div>
              <span className="cs-lc-phone__status">{row.status}</span>
            </div>
            <span className="cs-lc-phone__order-action">{row.action}</span>
          </li>
        ))}
      </ul>
    </LcPhoneShell>
  );
}

/** Tickets + Pickup soon — real alert surfaces */
export function LolaConnectTicketsMock({ className = "" }: { className?: string }) {
  return (
    <LcPhoneShell
      active="tickets"
      className={className}
      screenClassName="cs-lc-phone__screen--alerts"
      label="Lola Connect tickets mockup"
    >
      <header className="cs-lc-phone__page-head">
        <div className="min-w-0">
          <p className="cs-lc-phone__page-title">Tickets</p>
          <p className="cs-lc-phone__page-meta cs-lc-phone__page-meta--warn">1 waiting</p>
        </div>
      </header>

      <div className="cs-lc-phone__ticket-card">
        <p className="cs-lc-phone__alert-eyebrow">Staff escalation</p>
        <p className="cs-lc-phone__alert-title">Lola ticket #A3F</p>
        <p className="cs-lc-phone__alert-body">Do you have birria pizza today?</p>
        <span className="cs-lc-phone__ghost-btn">Open in inbox</span>
      </div>

      <div className="cs-lc-phone__pickup-soon">
        <p className="cs-lc-phone__alert-eyebrow">Pickup soon</p>
        <p className="cs-lc-phone__alert-title">Is the order ready?</p>
        <p className="cs-lc-phone__alert-body">
          {PILOT_SHOPPER_FULL} · LB-0042 · Fri 5:00 PM
        </p>
        <span className="cs-lc-phone__ready-btn cs-lc-phone__ready-btn--block">
          Yes — ready for pickup
        </span>
      </div>
    </LcPhoneShell>
  );
}

/** Home — Shift schedule for order alerts */
export function LolaConnectShiftsMock({ className = "" }: { className?: string }) {
  const shifts = [
    { name: "Ana", window: "Fri 2:00–6:00 PM", badge: "Live" },
    { name: "Carlos", window: "Fri 6:00–9:00 PM", badge: "Next" },
    { name: "Maya", window: "Sat 10:00 AM–2:00 PM", badge: "Upcoming" },
  ];

  return (
    <LcPhoneShell active="home" className={className} label="Lola Connect shift schedule mockup">
      <header className="cs-lc-phone__page-head">
        <div className="min-w-0">
          <p className="cs-lc-phone__page-title">Home</p>
          <p className="cs-lc-phone__page-meta">Shift schedule — order alerts</p>
        </div>
      </header>

      <div className="cs-lc-phone__shift-live">
        <p className="cs-lc-phone__shift-live-label">Alerting now</p>
        <p className="cs-lc-phone__shift-live-value">Ana · until Fri 6:00 PM</p>
      </div>

      <ul className="cs-lc-phone__order-list">
        {shifts.map((row) => (
          <li
            key={row.name}
            className={`cs-lc-phone__order-row${row.badge === "Live" ? " is-accent" : ""}`}
          >
            <div className="min-w-0">
              <p className="cs-lc-phone__order-name">{row.name}</p>
              <p className="cs-lc-phone__order-meta">{row.window}</p>
            </div>
            <span className="cs-lc-phone__status">{row.badge}</span>
          </li>
        ))}
      </ul>
    </LcPhoneShell>
  );
}

/** @deprecated use LolaConnectTicketsMock */
export const LolaConnectAlertsMock = LolaConnectTicketsMock;
