import React, { useState } from "react";
import {
  PILOT_SHOPPER_FULL,
  STAFF_DASH_SCREENS,
  STAFF_OPS_PROCESS,
} from "./constants";
import { FeatureVideo } from "./FeatureVideo";
import { LOLA_MOTION } from "./motionAssets";
import { SlidingTabs, TabPanel } from "./SlidingTabs";
import { useSurfaceOpenOnMount } from "./transitions";
import { FadeIn, LolaMark, Panel } from "./ui";
import { PhoneFrame, WaBubble } from "./whatsapp";
import { WacrmDashboardBackdrop } from "./WacrmDashboardBackdrop";
import { StaffPickupAlertContent } from "./StaffPickupAlertContent";

const STAFF_PROCESS_STEPS = STAFF_OPS_PROCESS.split(" → ");

type StaffTourId = (typeof STAFF_DASH_SCREENS)[number]["id"];

const STAFF_TOUR_PANEL_ID = "staff-app-tour-panel";
const STAFF_TOUR_TAB_PREFIX = "staff-app-tour";

const STAFF_TOUR_CLIPS: Record<StaffTourId, (typeof LOLA_MOTION.clips)[keyof typeof LOLA_MOTION.clips]> = {
  inbox: LOLA_MOTION.clips.staffInbox,
  orders: LOLA_MOTION.clips.orders,
  tickets: LOLA_MOTION.clips.tickets,
  home: LOLA_MOTION.clips.home,
};

const DESK_NAV = [
  { id: "home", label: "Home" },
  { id: "inbox", label: "Inbox", badge: 2 },
  { id: "orders", label: "Orders" },
  { id: "tickets", label: "Tickets", badge: 1, warn: true },
  { id: "reminders", label: "Reminders" },
] as const;

const ORDER_ROWS = [
  {
    name: "Ana Ruiz",
    ref: "LB-20250622-0038",
    items: "rice, beans, cilantro",
    status: "Ready",
    tone: "success" as const,
  },
  {
    name: PILOT_SHOPPER_FULL,
    ref: "LB-20250622-0042",
    items: "chicken, tortillas, eggs…",
    status: "Quote sent",
    tone: "primary" as const,
    highlight: true,
  },
  {
    name: "James T.",
    ref: "LB-20250622-0035",
    items: "ground beef, onions",
    status: "New list",
    tone: "muted" as const,
  },
];

function StaffProcessFlow() {
  return (
    <div className="cs-staff-process-flow" aria-label="Pickup alert process">
      {STAFF_PROCESS_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          {i > 0 ? (
            <span className="cs-staff-process-flow__arrow" aria-hidden>
              →
            </span>
          ) : null}
          <span className="cs-staff-process-flow__step">{step}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function SoundIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function ConfirmOrderModal() {
  const surfaceClass = useSurfaceOpenOnMount();

  return (
    <div aria-hidden="true" className={`cs-staff-alert-modal t-modal ${surfaceClass}`}>
      <div className="cs-staff-alert-modal__banner">
        <span className="cs-staff-alert-modal__banner-icon">
          <BagIcon />
        </span>
        <div className="cs-staff-alert-modal__banner-text">
          <p className="cs-staff-alert-modal__banner-eyebrow">Order confirmed</p>
          <p className="cs-staff-alert-modal__banner-title">Guest replied YES</p>
        </div>
      </div>
      <div className="cs-staff-alert-modal__sheet">
        <StaffPickupAlertContent channel="dashboard" />
      </div>
    </div>
  );
}

function DeskChip({
  children,
  active = false,
  soft = false,
}: {
  children: React.ReactNode;
  active?: boolean;
  soft?: boolean;
}) {
  return (
    <span
      className={`cs-staff-desk__chip${active ? " is-active" : ""}${soft ? " is-soft" : ""}`}
    >
      {children}
    </span>
  );
}

function DeskOrdersMain() {
  return (
    <>
      <header className="cs-staff-desk__page-head">
        <div className="cs-staff-desk__page-copy">
          <p className="cs-staff-desk__page-desc">
            Customer shopping lists from WhatsApp — separate from Inbox chats.
          </p>
          <p className="cs-staff-desk__page-meta">
            Today — Fri Jun 22 · <span>3 pending · 12 completed · 1 cancelled</span>
          </p>
          <p className="cs-staff-desk__sample-note" role="note">
            Illustrative sample — pilot order volume is still ramping (see Still Measuring).
          </p>
        </div>
        <span className="cs-staff-desk__refresh">Refresh</span>
      </header>
      <div className="cs-staff-desk__panel">
        <p className="cs-staff-desk__filter-label">Date</p>
        <div className="cs-staff-desk__chips">
          <DeskChip active>Today</DeskChip>
          <DeskChip>All dates</DeskChip>
        </div>
        <p className="cs-staff-desk__filter-label">Status</p>
        <div className="cs-staff-desk__chips">
          <DeskChip soft active>
            Pending (3)
          </DeskChip>
          <DeskChip>Completed (12)</DeskChip>
          <DeskChip>Cancelled (1)</DeskChip>
          <DeskChip>All</DeskChip>
        </div>
      </div>
      <div className="cs-staff-desk__callout">3 orders need a quote or next step today.</div>
      <div className="cs-staff-desk__table">
        <div className="cs-staff-desk__table-head">
          <span>Customer</span>
          <span>Status</span>
        </div>
        {ORDER_ROWS.map((row) => (
          <div
            key={row.ref}
            className={`cs-staff-desk__table-row${row.highlight ? " is-highlight" : ""}`}
          >
            <div className="cs-staff-desk__table-customer">
              <div className="cs-staff-desk__table-name-row">
                <span className="cs-staff-desk__table-name">{row.name}</span>
                <span className="cs-staff-desk__table-ref">{row.ref}</span>
              </div>
              <p className="cs-staff-desk__table-items">{row.items}</p>
            </div>
            <span className={`cs-staff-desk__status cs-staff-desk__status--${row.tone}`}>
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function DeskInboxMain() {
  return (
    <div className="cs-staff-desk__inbox">
      <aside className="cs-staff-desk__inbox-list">
        <p className="cs-staff-desk__inbox-list-title">Inbox</p>
        {[
          { name: PILOT_SHOPPER_FULL, preview: "YES", time: "2m", active: true },
          { name: "Ana Ruiz", preview: "¿Todavía hay pollo?", time: "18m" },
          { name: "James T.", preview: "Thanks!", time: "1h" },
        ].map((c) => (
          <div
            key={c.name}
            className={`cs-staff-desk__inbox-item${c.active ? " is-active" : ""}`}
          >
            <span className="cs-staff-desk__inbox-avatar">{c.name.charAt(0)}</span>
            <div className="cs-staff-desk__inbox-item-copy">
              <div className="cs-staff-desk__inbox-item-top">
                <span className="cs-staff-desk__inbox-name">{c.name}</span>
                <span className="cs-staff-desk__inbox-time">{c.time}</span>
              </div>
              <p className="cs-staff-desk__inbox-preview">{c.preview}</p>
            </div>
          </div>
        ))}
      </aside>
      <div className="cs-staff-desk__inbox-thread">
        <div className="cs-staff-desk__ready-bar">
          <div>
            <p className="cs-staff-desk__ready-title">Ready for pickup</p>
            <p className="cs-staff-desk__ready-meta">LB-20250622-0042 · Confirmed — Mark ready when bagged</p>
          </div>
          <span className="cs-staff-desk__ready-btn">Mark ready</span>
        </div>
        <div className="cs-staff-desk__thread-bubbles">
          <p className="cs-staff-desk__bubble cs-staff-desk__bubble--guest">Total $28.40 — reply YES to confirm</p>
          <p className="cs-staff-desk__bubble cs-staff-desk__bubble--guest">YES</p>
          <p className="cs-staff-desk__bubble cs-staff-desk__bubble--lola">
            Got it — order LB-20250622-0042 is confirmed. We’ll text when it’s ready.
          </p>
        </div>
      </div>
    </div>
  );
}

function DeskTicketsMain() {
  return (
    <>
      <header className="cs-staff-desk__page-head">
        <div className="cs-staff-desk__page-copy">
          <p className="cs-staff-desk__page-desc">
            Customers Lola could not answer — reply in Inbox or mark resolved when done.
          </p>
          <p className="cs-staff-desk__page-meta cs-staff-desk__page-meta--warn">1 waiting</p>
        </div>
      </header>
      <p className="cs-staff-desk__section-title">Staff escalation queue</p>
      <div className="cs-staff-desk__chips">
        <DeskChip active>pending</DeskChip>
        <DeskChip>answered</DeskChip>
        <DeskChip>expired</DeskChip>
        <DeskChip>all</DeskChip>
      </div>
      <article className="cs-staff-desk__ticket">
        <div className="cs-staff-desk__ticket-top">
          <span className="cs-staff-desk__ticket-who">Guest · #A3F</span>
          <span className="cs-staff-desk__ticket-status">pending</span>
        </div>
        <p className="cs-staff-desk__ticket-msg">Do you have birria pizza today?</p>
        <div className="cs-staff-desk__ticket-actions">
          <span className="cs-staff-desk__chip is-soft">Open Inbox</span>
          <span className="cs-staff-desk__chip">Mark resolved</span>
        </div>
      </article>
    </>
  );
}

function DeskHomeMain() {
  return (
    <>
      <header className="cs-staff-desk__page-head">
        <div className="cs-staff-desk__page-copy">
          <p className="cs-staff-desk__page-desc">Operations overview for today’s counter.</p>
          <p className="cs-staff-desk__page-meta">Shift schedule — order alerts</p>
        </div>
      </header>
      <div className="cs-staff-desk__metric-row">
        {[
          { label: "Pending orders", value: "3" },
          { label: "Open tickets", value: "1" },
          { label: "Unread inbox", value: "2" },
        ].map((m) => (
          <div key={m.label} className="cs-staff-desk__metric">
            <p className="cs-staff-desk__metric-value">{m.value}</p>
            <p className="cs-staff-desk__metric-label">{m.label}</p>
          </div>
        ))}
      </div>
      <article className="cs-staff-desk__shift-panel">
        <p className="cs-staff-desk__section-title">Order alert shifts</p>
        <div className="cs-staff-desk__shift is-live">
          <span className="cs-staff-desk__shift-dot" />
          <div>
            <p className="cs-staff-desk__shift-name">Ana · Alerting now</p>
            <p className="cs-staff-desk__shift-when">Until Fri 6:00 PM</p>
          </div>
        </div>
        <div className="cs-staff-desk__shift">
          <div>
            <p className="cs-staff-desk__shift-name">Carlos · Next</p>
            <p className="cs-staff-desk__shift-when">Fri 6:00–9:00 PM</p>
          </div>
        </div>
      </article>
    </>
  );
}

function StaffDeskPreview({ screen }: { screen: StaffTourId }) {
  return (
    <div className="cs-staff-app-tour__desk" aria-hidden>
      <div className="cs-staff-desk">
        <aside className="cs-staff-desk__side">
          <div className="cs-staff-desk__brand">
            <img src="/lola-connect-app-icon.png" alt="Lola Connect" width={28} height={28} />
            <div className="cs-staff-desk__brand-copy">
              <p className="cs-staff-desk__product">
                <LolaMark variant="inline" />
                <span className="cs-staff-desk__product-rest">Connect</span>
              </p>
              <p className="cs-staff-desk__tagline">La Bodega WhatsApp</p>
            </div>
          </div>
          <nav className="cs-staff-desk__nav">
            <p className="cs-staff-desk__nav-group">Work</p>
            <ul className="cs-staff-desk__nav-list">
              {DESK_NAV.map((item) => {
                const active = item.id === screen;
                return (
                  <li key={item.id} className={active ? "is-active" : undefined}>
                    <span className="cs-staff-desk__nav-label">{item.label}</span>
                    {"badge" in item && item.badge && !active ? (
                      <span
                        className={`cs-staff-desk__nav-badge${"warn" in item && item.warn ? " is-warn" : ""}`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="cs-staff-desk__user">
            <span className="cs-staff-desk__user-avatar">A</span>
            <span className="cs-staff-desk__user-name">Ana · Counter</span>
          </div>
        </aside>
        <main className="cs-staff-desk__main">
          {screen === "orders" ? <DeskOrdersMain /> : null}
          {screen === "inbox" ? <DeskInboxMain /> : null}
          {screen === "tickets" ? <DeskTicketsMain /> : null}
          {screen === "home" ? <DeskHomeMain /> : null}
        </main>
      </div>
    </div>
  );
}

function StaffAppTour() {
  const [screen, setScreen] = useState<StaffTourId>("inbox");
  const active = STAFF_DASH_SCREENS.find((s) => s.id === screen) ?? STAFF_DASH_SCREENS[0];
  const clip = STAFF_TOUR_CLIPS[screen];

  return (
    <div className="cs-staff-app-tour">
      <header className="cs-staff-app-tour__intro">
        <p className="cs-meta-label mb-2">Inside the staff dashboard</p>
        <p className="cs-staff-app-tour__lead">
          This is the real Lola Connect interface, not a mock — Inbox, Orders, Tickets, Home. It runs behind staff
          login because it holds real customer names and order data; what&apos;s shown across these four tabs is the
          complete picture.
        </p>
      </header>

      <SlidingTabs
        tabs={STAFF_DASH_SCREENS.map((s) => ({ id: s.id, label: s.label }))}
        value={screen}
        onChange={setScreen}
        ariaLabel="Staff dashboard screens"
        layoutId="staff-app-tour"
        variant="pill"
        className="cs-staff-app-tour__tabs"
        panelId={STAFF_TOUR_PANEL_ID}
        tabIdPrefix={STAFF_TOUR_TAB_PREFIX}
      />

      <TabPanel id={STAFF_TOUR_PANEL_ID} labelledBy={`${STAFF_TOUR_TAB_PREFIX}-tab-${screen}`}>
        <div className="cs-staff-app-tour__stage cs-staff-app-tour__stage--dual">
          <div className="cs-staff-app-tour__phone">
            <FeatureVideo
              key={clip.src}
              src={clip.src}
              variant="inline"
              title={clip.title}
              hideCaption
              autoPlay
            />
          </div>
          <div className="cs-staff-app-tour__desk-wrap">
            <StaffDeskPreview screen={screen} />
          </div>
          <p className="cs-staff-app-tour__detail">{active.detail}</p>
        </div>
      </TabPanel>
    </div>
  );
}

/** Staff-facing channels + dashboard tour — not a second flagship product */
export function StaffOpsPreview() {
  return (
    <div id="develop-staff-ops" className="scroll-mt-[var(--cs-nav-h)] cs-page cs-fold-section cs-fold-section--tight border-t border-[var(--cs-border-subtle)]">
      <div className="cs-phase-artifact cs-phase-artifact--pad cs-staff-ops-section">
        <FadeIn>
          <header className="cs-section-intro max-w-[52ch]">
            <p className="cs-meta-label">Staff product · Lola Connect</p>
            <h3 className="cs-h3 max-w-[28ch]">The other half of the loop — ops that close pickup</h3>
            <p className="cs-body">
              I built Lola Connect so confirmed lists land before walk-in — Inbox, Orders, Tickets, shift alerts. The
              full walkthrough is below; the live app stays behind staff login.
            </p>
          </header>
          <StaffProcessFlow />
        </FadeIn>

        <div className="cs-staff-ops-grid cs-staff-ops-grid--pdf cs-staff-ops-grid--spaced">
          <article aria-labelledby="staff-wa-heading" className="cs-staff-panel">
            <FadeIn>
              <div className="cs-staff-panel-header">
                <h4 id="staff-wa-heading" className="cs-staff-panel-label">
                  Staff WhatsApp alert
                </h4>
              </div>
              <div className="cs-staff-phone-wrap">
                <PhoneFrame contact="La Bodega · Staff" device>
                  <WaBubble from="lola" time="9:06">
                    <StaffPickupAlertContent channel="wa" />
                  </WaBubble>
                </PhoneFrame>
              </div>
            </FadeIn>
          </article>

          <article aria-labelledby="staff-dash-heading" className="cs-staff-panel">
            <FadeIn>
              <div className="cs-staff-panel-header">
                <h4 id="staff-dash-heading" className="cs-staff-panel-label">
                  Dashboard alert
                </h4>
                <span className="cs-alert-sound" role="note">
                  <SoundIcon />
                  Alert repeats until dismissed
                </span>
              </div>
              <Panel className="p-0 cs-panel--flush cs-staff-dash-panel">
                <div className="cs-staff-dash-scene">
                  <div className="cs-staff-dash-scene__backdrop" aria-hidden>
                    <WacrmDashboardBackdrop />
                  </div>
                  <div className="cs-staff-dash-scene__overlay" aria-hidden />
                  <div className="cs-staff-dash-scene__modal">
                    <ConfirmOrderModal />
                  </div>
                </div>
              </Panel>
            </FadeIn>
          </article>
        </div>

        <FadeIn delay={0.06}>
          <StaffAppTour />
        </FadeIn>
      </div>
    </div>
  );
}
