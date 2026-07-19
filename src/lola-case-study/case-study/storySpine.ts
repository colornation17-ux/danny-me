/** End-to-end narrative — Lola (guest) + Lola Connect (staff) as one product */

export const STORY_BEATS = {
  discover: {
    body: "Six weeks in real threads — the inbox after every flyer blast, not a survey.",
    bullets: [
      "Blast to ~1,200 families → free-form EN/ES text and voice",
      "Hours, SNAP, deals, and pickup asks mixed in one queue",
      "Staff read, translated, and quoted by hand — late in rush",
    ],
  },
  define: {
    body: "One loop on the thread families already use. Two surfaces, one pickup finish.",
    bullets: [
      "Guest: Lola on WhatsApp — ask, order, remind, staff help",
      "Staff: Lola Connect — inbox, orders, alerts, shifts",
      "No shopper app · staff keeps control · pickup in store",
    ],
  },
  develop: {
    body: "Six guest flows on WhatsApp. Staff day in Lola Connect. Text and voice on one loop.",
    bullets: [
      "Broadcast through staff handoff — buttons before commands",
      "Inbox Ready bar · Orders board · Tickets · shift alerts",
      "Staff knowledge before imagination · bilingual memory",
    ],
  },
  deliver: {
    body: "Live pilot under real rush — 97.7% first reply <2 min, 96.3% closed without staff.",
    bullets: [
      "Tap buttons replaced numbered menus",
      "Place order replaced vague Hi Lola taps",
      "Staff see lists before walk-in — WhatsApp, dashboard, lock screen",
    ],
  },
  vision: {
    body: "WhatsApp trains the store brain before any floor hardware.",
    bullets: [
      "Same modes → future in-store kiosk",
      "Not in pilot: kiosk OS, queue UX, device payments",
    ],
  },
} as const;

export const STORY_TRACKS = [
  {
    id: "order",
    title: "Order now",
    summary: "Place order → draft → staff quote → YES → order # → Ready → pickup.",
  },
  {
    id: "reminder",
    title: "Remind later",
    summary: "Save list + time → nudge → Place order (not an automatic order).",
  },
] as const;

export type StoryBeatId = keyof typeof STORY_BEATS;
