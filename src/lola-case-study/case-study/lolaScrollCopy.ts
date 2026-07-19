/** Scroll narrative — light copy, visual-first four acts */
import { HEADLINE_SPINE } from "./constants";

export const LOLA_SCROLL_ASSETS = {
  store: "/store/lola%20reexp.png",
  lolaCharacter: "/hero/lola-portrait.png",
  servicePanels: "/hero/lola-service-panels.png",
  serviceFull: "/hero/lola-service-full.png",
} as const;

/** Accessible description for hero journey illustration */
export const HERO_JOURNEY_ALT =
  "System flow: customer at home on WhatsApp, Lola as the bilingual assistant, staff order screen, and grocery store pickup.";

export const HERO_FRAME = {
  width: 3840,
  height: 2160,
  bg: "#e4eaf0",
} as const;

export const LOLA_CHARACTER_FRAME = {
  width: 1920,
  height: 1080,
} as const;

export const SERVICE_FRAME = {
  width: 1672,
  height: 941,
} as const;

export const LOLA_SCROLL_ACTS = [
  {
    id: "hero",
    range: [0, 0.22] as const,
    kicker: "La Bodega · Calhoun, GA",
    title: "Already on WhatsApp",
    subtitle: "Bilingual families plan the weekly shop in the same thread they use for family chat.",
    body: null,
  },
  {
    id: "problem",
    range: [0.22, 0.5] as const,
    kicker: "The gap",
    title: "The problem was the inbox",
    subtitle: "After every flyer blast, one queue caught everything.",
    body: "Hours, SNAP, voice notes, pickup lists — in English and Spanish. Staff answered by hand until rush broke the loop.",
  },
  {
    id: "lola",
    range: [0.5, 0.72] as const,
    kicker: "The assistant",
    title: "Meet Lola",
    subtitle: HEADLINE_SPINE.primary,
    body: `${HEADLINE_SPINE.supporting} Tap-first paths and staff handoff when knowledge runs out.`,
  },
  {
    id: "service",
    range: [0.72, 1] as const,
    kicker: "End to end",
    title: "Message → answer → pickup",
    subtitle: "Customer, assistant, and store in one loop.",
    body: null,
  },
] as const;

/** Left-side inbox pile — spread for readability on scroll */
export const PROBLEM_BUBBLES = [
  { id: "hours", text: "¿Están abiertos?", y: 12, x: 9, delay: 0 },
  { id: "chicken", text: "chicken sale still on?", y: 22, x: 15, delay: 0.07 },
  { id: "snap", text: "SNAP accepted today?", y: 32, x: 8, delay: 0.14 },
  { id: "vn", text: "🎤 Voice note · 0:22", y: 42, x: 14, delay: 0.21, waveform: true },
  { id: "hours2", text: "hours today?", y: 52, x: 10, delay: 0.28 },
  { id: "order", text: "2 lb diezmillo para recoger", y: 62, x: 16, delay: 0.35 },
] as const;

/** Lola intro — scroll-reveal feature chips (act 3) */
export const LOLA_FEATURES = [
  { id: "thread", icon: "💬", label: "Same WhatsApp thread", detail: "No new app — families stay where they already chat." },
  { id: "tap", icon: "👆", label: "Tap-first paths", detail: "Place order, hours, specials — buttons over memorized commands." },
  { id: "flyer", icon: "📄", label: "Flyer-grounded answers", detail: "Hours, SNAP, and weekly deals from store knowledge — not guesses." },
  { id: "staff", icon: "🤝", label: "Staff relay", detail: "Off-list asks ping the counter — Lola waits, then posts the answer on-thread." },
] as const;

/** End-to-end loop — act 4 scroll steps (no infographic overlay) */
export const SERVICE_LOOP_STEPS = [
  { id: "message", icon: "📱", label: "Message on WhatsApp" },
  { id: "answer", icon: "✨", label: "Lola answers from flyer + FAQ" },
  { id: "escalate", icon: "🔔", label: "Staff relay when needed" },
  { id: "pickup", icon: "🛍️", label: "Pickup in store" },
] as const;
