/** Pre-Lola Meta broadcast templates — two live variants from production CRM */
export type BroadcastLegacyVariant = {
  id: "update-bilingual" | "join-spanish";
  label: string;
  greeting: string;
  menuText: string;
  body?: string;
  menu: readonly string[];
  replyPrompt: string;
  replyDigit: string;
  replyAltDigit?: string;
  replyAltBody?: string;
  specialsBody: string;
};

export const BROADCAST_LEGACY_HEADER = "/broadcast-header-store.png";

/** Pilot shopper — flows, broadcasts, staff alerts */
export const PILOT_SHOPPER = "María" as const;
export const PILOT_SHOPPER_FULL = "María García" as const;

export const BROADCAST_LEGACY_VARIANTS = {
  updateBilingual: {
    id: "update-bilingual",
    label: "Bilingual update blast",
    greeting: `Hola / Hi ${PILOT_SHOPPER} 👋`,
    /** Text below the template image — numbered menu only */
    menuText: [
      "La Bodega tiene una actualización para ti. / La Bodega has an update for you.",
      "",
      "1 Ver actualización / View update",
      "2 Revisar lista de delivery / Check delivery list 🏎️",
      "",
      "Responde 1 o 2 / Reply 1 or 2",
    ].join("\n"),
    menu: [
      "1 Ver actualización / View update",
      "2 Revisar lista de delivery / Check delivery list 🏎️",
    ],
    replyPrompt: "Responde 1 o 2 / Reply 1 or 2",
    replyDigit: "1",
    replyAltDigit: "2",
    /** Portfolio paraphrase — verify against live CRM template export */
    replyAltBodyParaphrase: true,
    replyAltBody: [
      "🏎️ Lista de delivery / Delivery list",
      "",
      "Aún no hay artículos en tu lista. / No items on your list yet.",
      "Visita la tienda o responde con lo que necesitas. / Visit the store or reply with what you need.",
    ].join("\n"),
    specialsBody: [
      "🛒 Actualización semanal / Weekly Update",
      "",
      "⭐ 2X Puntos Rewards / 2X Rewards Points",
      "Martes y miércoles ganas doble puntos. / Every Tuesday & Wednesday, earn double points.",
      "",
      "🥩 Especiales de carne / Meat Specials",
      "• Chicken Leg Quarters — $0.89/lb | ⭐ Members: $0.79/lb",
      "• Boneless Chicken Breast — $1.99/lb",
      "• Diezmillo / Chuck Roll — $6.99/lb",
      "• Ribeye — $12.99/lb",
      "• Ground Beef 80% — $4.49/lb",
      "• Chorizo — $3.99/lb",
      "",
      "🥚 Grocery / Abarrotes",
      "• Medium Eggs (12 ct) — 2 for $2",
      "• Fieldcrest Milk — $3.99",
    ].join("\n"),
  },
  joinSpanish: {
    id: "join-spanish",
    label: "Spanish join menu",
    greeting: `Hola ${PILOT_SHOPPER} 👋 Gracias por unirte a La Bodega Calhoun.`,
    menuText: [
      `Hola ${PILOT_SHOPPER} 👋 Gracias por unirte a La Bodega Calhoun.`,
      "",
      "Responde:",
      "1 para ubicación",
      "2 para información de la tienda",
      "3 para novedades semanales",
    ].join("\n"),
    menu: [
      "1 para ubicación",
      "2 para información de la tienda",
      "3 para novedades semanales",
    ],
    replyPrompt: "Responde:",
    replyDigit: "3",
    specialsBody: [
      "🛒 Ofertas de Fin de Semana",
      "",
      "🌽 Elote 39¢ c/u",
      "🍋 Limones 4 por $1",
      "🧅 Cebolla amarilla 64¢/lb",
      "☕ Nescafé Gold Espresso 2 por $9.99",
      "🍗 Alitas enteras $1.49/lb",
      "🥩 Diezmillo $6.99/lb",
      "",
      "📅 Junio 6 y 7",
      "📍 La Bodega Calhoun",
    ].join("\n"),
  },
} as const satisfies Record<string, BroadcastLegacyVariant>;

function legacyMenuText(v: BroadcastLegacyVariant & { menuText?: string }) {
  return v.menuText ?? [v.greeting, v.body, ...v.menu, v.replyPrompt].filter(Boolean).join("\n");
}

/** Lola-era broadcast intro (replaces numbered menu on same template image) */
export const BROADCAST_LOLA_INTRO = {
  en: `Hi ${PILOT_SHOPPER}! This week's specials are in the flyer above.\n\nI'm Lola — tap below or ask in English or Spanish.`,
  es: `¡Hola ${PILOT_SHOPPER}! Las ofertas de esta semana están en el folleto de arriba.\n\nSoy Lola — toca abajo o pregúntame en inglés o español.`,
  buttons: {
    en: ["See specials", "Store hours", "Place order"] as const,
    es: ["Ver ofertas", "Horario", "Hacer pedido"] as const,
  },
} as const;

export const BROADCAST_LEGACY = {
  summary:
    "Template image + numbered menu — reply 1 or 2 triggers a fixed automated message (specials wall or delivery list). No tap buttons.",
  headerImage: BROADCAST_LEGACY_HEADER,
  updateMenu: BROADCAST_LEGACY_VARIANTS.updateBilingual,
  joinMenu: BROADCAST_LEGACY_VARIANTS.joinSpanish,
  /** Menu bubble only (below image) — primary before-state */
  menuText: BROADCAST_LEGACY_VARIANTS.updateBilingual.menuText,
  en: legacyMenuText(BROADCAST_LEGACY_VARIANTS.updateBilingual),
  es: legacyMenuText(BROADCAST_LEGACY_VARIANTS.joinSpanish),
} as const;

/** Portfolio footer + back link (override with VITE_* in .env.local / Vercel) */
export const PORTFOLIO = {
  author: "Danny",
  title: "Design technologist",
  seeking: "Open to senior design technologist, product design, and conversational AI roles",
  linkedIn: import.meta.env.VITE_PORTFOLIO_LINKEDIN || "https://www.linkedin.com/in/dannvarg/",
  email: import.meta.env.VITE_PORTFOLIO_EMAIL || "dannyvr172@gmail.com",
  backUrl: import.meta.env.VITE_PORTFOLIO_BACK_URL || "https://danny-me-rho.vercel.app/",
} as const;

/** Public deploy URL — set VITE_SITE_URL for OG previews (no trailing slash) */
export const SITE = {
  title: "Designing Lola: A Bilingual WhatsApp Assistant for La Bodega",
  description:
    "A bilingual WhatsApp assistant that closed 96.3% of guest conversations without staff — designed and built solo for La Bodega.",
  url: (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, ""),
  ogImagePath: "/og-image.svg",
} as const;

export const PROJECT = {
  tag: "CASE STUDY · LA BODEGA · LOLA · LIVE PILOT",
  status: "Live pilot",
  timeline: "May – July 2026",
  context: "Independent grocer · Calhoun, GA",
  team: "Solo Design & Build",
} as const;

/** Unified headline spine — hero, TLDR, and skim blocks */
export const HEADLINE_SPINE = {
  primary: "A Bilingual WhatsApp Assistant for La Bodega",
  supporting:
    "A bilingual WhatsApp assistant that closed 96.3% of guest conversations without staff. I designed the flows and built Lola Connect solo.",
} as const;

/** ~1,200 on weekly deal blast list — scale makes manual reply impossible at rush */
export const LOYALTY_MEMBER_COUNT = "~1,200" as const;

/** Hero body copy under H1 */
export const HERO_SUBTITLE =
  "A bilingual WhatsApp assistant that closed 96.3% of guest conversations without staff. I designed the flows and built Lola Connect solo.";

/** Compact proof pills — hero key results (six weeks in) */
export const HERO_PROOF_PILLS = [
  "96.3% resolution · closed without staff",
  "97.7% first replies under 2 min",
  "~4 sec average first reply",
] as const;

/** Staff dashboard screens — tour under staff alerts (matches Lola Connect IA) */
export const STAFF_DASH_SCREENS = [
  {
    id: "inbox",
    label: "Inbox",
    detail: "Thread + Ready-for-pickup bar — Mark ready when bagged",
  },
  {
    id: "orders",
    label: "Orders",
    detail: "New list → Quote sent → Confirmed → Ready",
  },
  {
    id: "tickets",
    label: "Tickets",
    detail: "Escalations Lola couldn’t answer · Pickup soon dialog",
  },
  {
    id: "home",
    label: "Home",
    detail: "Shift schedule — order alerts route to on-shift staff",
  },
] as const;

/** Public product spine — five jobs, guest→staff loop (hiring skim) */
export const PRODUCT_SYSTEM = {
  eyebrow: "Scope",
  title: "One loop, not a new app",
  lead: "Hard constraints going in: no shopper app, same flyer thread, staff keeps control, pickup-ready output. Lola is the guest face; Lola Connect closes the list.",
  pillars: [
    {
      title: "Same thread families already use",
      detail: "No new channel to teach — reply handling on the weekly blast.",
    },
    {
      title: "Staff knowledge before imagination",
      detail: "Approved hours, deals, and FAQ — never invented prices or policy.",
    },
    {
      title: "Six flows, one thread",
      detail: "Broadcast, pickup, reminders, coach, and staff handoff — EN/ES, text or voice.",
    },
    {
      title: "Buttons before commands",
      detail: "Tap targets for defined actions — not #order keywords to memorize.",
    },
    {
      title: "Staff finishes in Lola Connect",
      detail: "Inbox · Orders · Tickets · WhatsApp + dashboard alerts before walk-in.",
    },
  ],
} as const;

/** Hiring-manager metrics — scope facts + honest gaps (outcomes live on Pilot Outcomes cards) */
export const SCOPE_METRICS = {
  outcomesWindow: "Live data · Jun 2 – Jul 12 2026 · ~6 weeks",
  shippedLabel: "Product scope",
  measuringLabel: "Still measuring",
  shipped: [
    {
      label: "Loyalty reach",
      value: LOYALTY_MEMBER_COUNT,
      detail: "Weekly flyer list",
    },
    {
      label: "Guest flows",
      value: "6",
      detail: "Broadcast → staff help",
    },
    {
      label: "Staff surfaces",
      value: "5",
      detail: "Home · Inbox · Orders · Tickets · Reminders",
    },
    {
      label: "Regression",
      value: "988",
      detail: "Passing Vitest · 103 files",
    },
  ],
  measuring: [
    {
      label: "Pickup before walk-in",
      detail:
        "One real order completed in the study window — the rest were my own test runs. Too early to report a lead time.",
      status: "Measuring",
    },
    {
      label: "Escalation resolution",
      detail:
        "Ticket sample includes internal test traffic (at least 9 of a 14-ticket sample were mine). Re-pulling with test traffic filtered before reporting a solve/expire rate.",
      status: "Measuring",
    },
  ],
} as const;

/** Above-the-fold stats — pilot outcomes + bilingual */
export const PROJECT_STATS = [
  {
    label: "First reply < 2 min",
    value: "97.7%",
    detail: "Lola bot · median ~4 sec · n=353",
  },
  {
    label: "Closed without staff",
    value: "96.3%",
    detail: "On-thread · no escalation",
  },
  {
    label: "Languages",
    value: "EN / ES",
    detail: "Templates, voice, one language per reply",
  },
] as const;

/** Design goal — three outcomes the flows optimize for */
export const DESIGN_GOAL_PILLARS = [
  {
    title: "Staff knowledge before imagination",
    detail: "Hours, deals, SNAP, and policy from approved facts — never invented prices.",
  },
  {
    title: "Buttons before commands",
    detail: "Defined actions are tap targets — list → quote → confirm → pickup on-thread.",
  },
  {
    title: "Clean handoff when unsure",
    detail: "14 of 380 conversations escalated to staff — the rest closed without a human loop.",
  },
] as const;

/** Develop craft — how open-ended turns relate to routing + tools (main path, one beat) */
export const DEVELOP_AI_LAYER =
  "Customer acts first — Lola never initiates outside the flyer broadcast. Open asks use store tools first; staff handoff when knowledge runs out." as const;

/** Fold I — project metadata (Rachel Chen–style intro row) */
export const FOLD1_META = {
  role: "Design Technologist",
  team: PROJECT.team,
  skills: [
    "Conversational UX & Architecture",
    "Service & Operations Design",
    "Full-Stack Development",
    "Bilingual Localization (EN/ES)",
  ] as const,
} as const;

/** Fold I — section headline (two lines) */
export const FOLD1_SECTION_HEADLINE = [
  "The problem was the inbox,",
  "not the store.",
] as const;

/** Fold I — subheading under section headline */
export const FOLD1_SECTION_SUBHEAD =
  "~1,200 loyalty families reply to the weekly flyer — in English and Spanish, by text and voice note — and every message landed in one queue for staff to read, translate, and act on by hand.";

export const FOLD1_OVERVIEW = {
  eyebrow: "Overview",
  title: "Designing Lola for a Neighborhood Grocery",
  lead:
    "La Bodega’s weekly deals blast worked. The responses didn’t. Inquiries regarding hours, SNAP benefits, voice notes, and complex pickup lists flooded a single inbox during rush hours.",
  role:
    "To solve this, I analyzed 180 live flyer threads (310 customer messages) to map the friction points before designing a single flow. I then designed the conversational guest flows and single-handedly built Lola Connect.",
  facts: [
    { label: "Client", detail: "La Bodega Supermarket · Calhoun, GA" },
    { label: "Timeline", detail: "May – July 2026 (6-Week Live Pilot)" },
    {
      label: "Deliverables",
      detail: [
        "6 Conversational Flows: Fully localized (EN/ES) interactions supporting both voice and text inputs.",
        "Lola Connect Backend: Custom live middleware handling automation routing, data logging, and live staff handoffs.",
      ],
    },
  ],
} as const;

/** Develop sub-sections — in-phase progress cue */
export const DEVELOP_STEPS = [
  { id: "develop-flows", label: "Flows" },
  { id: "develop-staff-ops", label: "Staff" },
  { id: "develop-craft", label: "Craft" },
] as const;

export const DISCOVER_BRIDGE =
  "Six weeks reading real threads — not a survey, the actual inbox. That’s where the product shape came from.";

export const FOLD1_OPPORTUNITY_SECTION = {
  eyebrow: "Research insight",
  headline: "People want the flyer thread to talk back",
  body: "They ask in whichever language is comfortable. Many won’t type at all — they send a voice note because it’s faster while cooking. Staff didn’t need a bot that pretends to know everything; they needed one that knows what it’s approved to know, and hands off cleanly when it doesn’t.",
} as const;

export const FOLD1_SOLUTION_SECTION = {
  eyebrow: "Design principle",
  headline: "Staff knowledge before imagination",
} as const;

/** @deprecated use FOLD1_SECTION_HEADLINE */
export const FOLD1_CREDENTIALS_LEAD = FOLD1_SECTION_HEADLINE.join(" ");

/** Fold I — explicit problem (left card) */
export const FOLD1_PROBLEM_BULLETS = [
  {
    hook: `${LOYALTY_MEMBER_COUNT} loyalty members`,
    text: "got the weekly flyer — then replied with hours, SNAP, deals, and pickup lists nobody designed for.",
  },
  {
    hook: "Replies arrived",
    text: "as English, Spanish, and voice notes — staff mentally translating while running checkout.",
  },
  {
    hook: "During rush,",
    text: "one inbox couldn’t sort urgent from casual, quote orders, and keep the floor moving.",
  },
] as const;

/** Fold I — design response (right card) */
export const FOLD1_RESPONSE_BULLETS = [
  {
    hook: "Flyer thread, not a new app",
    text: "Meet families where they already shop — reply handling on the broadcast they open every week.",
  },
  {
    hook: "Bilingual by architecture",
    text: "Language from the first message, held through templates, alerts, and voice replies — not a translation pass.",
  },
  {
    hook: "Same path for text and voice",
    text: "Voice notes transcribe, then hit the same grounded logic as typed asks.",
  },
] as const;

/** @deprecated use FOLD1_RESPONSE_BULLETS */
export const FOLD1_APPROACH_BULLETS = FOLD1_RESPONSE_BULLETS;

/** Fold I — product bet (full-width card) */
export const FOLD1_PRODUCT_BET = {
  main: "Design the weekly shop as a service — not a chatbot.",
  supporting:
    "Flyer prep, broadcast, shopper thread, quote and confirm, counter alert, pickup. Two surfaces, one loop.",
} as const;

/** @deprecated use FOLD1_PRODUCT_BET */
export const FOLD1_BET = FOLD1_PRODUCT_BET.main;

/** Fold I — proof chips below cards */
export const FOLD1_METRIC_CHIPS = [
  `${LOYALTY_MEMBER_COUNT} loyalty members`,
  "English + Spanish",
  "Voice notes supported",
] as const;

/** Fold I — design question (label carries HMW; body does not repeat it) */
export const FOLD1_HMW =
  "Give families instant, grounded answers on the thread they already use — and a pickup path when they’re ready, with staff knowledge before imagination.";

/** @deprecated use FOLD1_PROBLEM_BULLETS */
export const FOLD1_PROBLEM = FOLD1_PROBLEM_BULLETS.map((b) => `${b.hook} ${b.text}`).join(" ");

/** @deprecated chips replaced by FOLD1 cards */
export const FOLD1_CHIPS = [
  { label: "Problem", text: "One inbox after every deal blast" },
  { label: "Solution", text: "Same WhatsApp thread families already use" },
] as const;

/** Define phase — strategy headline only (no problem re-hash) */
export const DEFINE_THESIS = HEADLINE_SPINE.primary;

/** AI trust — caveat near decision points (ai-trust-builders) */
export const LOLA_GROUNDED_CAVEAT =
  "Staff knowledge before imagination — prices, hours, and policy from approved facts, never invented.";

export const DEFINE_SCOPE = [
  "No shopper app",
  "Same WhatsApp thread",
  "Staff keeps control",
  "Pickup-ready workflow",
] as const;

/** Portfolio CTAs — one label per destination */
export const CTA = {
  exploreFlows: "Explore the order flow",
  exploreFlowsHref: "#develop/flows/pickup",
  messageWhatsApp: "See Lola on WhatsApp",
  showNextTurn: "Show next turn",
} as const;

export const STORY = {
  headlineBefore: "Designing ",
  headlineAfter: ":",
  headlineSubline: "A Bilingual WhatsApp Assistant for La Bodega",
  headline: "",
  headlineSub: HERO_SUBTITLE,
  heroThesis: HEADLINE_SPINE.supporting,
  problemLines: [
    {
      hook: "The inbox, not the store",
      text: `After every flyer blast to ${LOYALTY_MEMBER_COUNT} loyalty members, one queue caught hours, SNAP, voice notes, and pickup lists — in Spanish and English.`,
    },
    {
      hook: "Manual reply broke at rush",
      text: "Staff read, translated, and quoted by hand. The other 3.7% didn’t loop — they routed to a human.",
    },
  ] as const,
  solutionHook: "One loop",
  solutionBody:
    "— guest thread on WhatsApp, staff close in Lola Connect. Six flows, bilingual, tap-first, same path for text and voice.",
  ownershipLines: [
    { hook: "I designed", text: "guest flows, EN/ES copy, and when Lola hands off." },
    { hook: "I built", text: "Lola Connect — inbox, orders, tickets, and counter alerts." },
  ] as const,
  /** @deprecated use problemLines */
  problem:
    "La Bodega serves a bilingual community in Calhoun, GA, where families plan their weekly shop on WhatsApp.",
  problemFollow:
    `After each weekly deal blast to ${LOYALTY_MEMBER_COUNT} loyalty members, every reply hit one inbox — hours, SNAP, voice notes, what to buy — in Spanish and English. Staff could not reply to each thread by hand during rush.`,
  solutionIntro:
    "a mascot-led layer on the weekly deals thread for discover, ask, and plan — pickup, shopping list reminders, and staff help. I designed Lola's flows and EN/ES copy, and built the staff dashboard to run threads, quotes, and pickups.",
  capabilities: [
    {
      label: "Buttons before commands",
      ships: "Tap targets on the blast — not #order keywords to memorize.",
    },
    {
      label: "Bilingual architecture",
      ships: "Language from first message, held through templates and alerts.",
    },
    {
      label: "Staff knowledge before imagination",
      ships: "Approved facts only — handoff when knowledge runs out.",
    },
  ] as const,
  hmw: FOLD1_HMW,
  constraint: "No IT team · no shopper app · no new integrations",
  constraintAnswer: "Mascot on the broadcast thread families already use — not a catalog bot or new channel.",
  answer: "A mascot on the broadcast thread families already use — not a new channel or catalog bot.",
  productLine: "Grounded Q&A on the weekly deals thread, plus pickup, shopping list reminders, and staff alerts.",
} as const;

/** Above-the-fold hero — one screen, store banner + inbox pills */
export const HERO = {
  chips: [
    { id: "problem", label: "Problem", text: "One inbox after every deal blast" },
    { id: "solution", label: "Solution", text: "Same WhatsApp thread families already use" },
  ],
  /** Used in flow demos — not shown in Fold I hero */
  contrast: {
    before: {
      label: "Pre-Lola",
      foot: "No scripted path",
      question: "chicken sale still on?",
      questionEs: "¿sigue la oferta del pollo?",
    },
    after: {
      label: "With Lola",
      foot: "Grounded from flyer + FAQ",
      question: "chicken sale still on?",
      answer:
        "Yes — chicken leg quarters are still $0.89/lb this weekend (on the flyer). Tap Place order if you want pickup.",
      answerEs:
        "Sí — las piernas de pollo siguen a $0.89/lb este fin de semana (en el folleto). Toca Hacer pedido si quieres recoger.",
    },
  },
  inboxPills: [
    "¿Están abiertos?",
    "chicken sale still on?",
    "hours today?",
    "SNAP accepted?",
  ] as const,
  roleLine: "Design technologist · flows + copy + staff dashboard",
} as const;

/** Documented gaps between portfolio demo and production code */
export const PRODUCTION_GAPS = [
  {
    topic: "Reminder cron language",
    portfolio: "Bilingual guest copy in flow demos",
    production: "Due cron currently sends EN-only (`lang: 'en'` hardcoded)",
    status: "Open — fix before ES reminder scale",
  },
  {
    topic: "Reply 2 delivery list",
    portfolio: "Paraphrased bilingual automation in Before Lola demo",
    production: "Verify exact strings in staff CRM template export",
    status: "Verify against CRM",
  },
  {
    topic: "Greeting button count",
    portfolio: "Three tap buttons — repeat order is text (“same as last”), not a fourth row",
    production: "Meta caps quick replies at 3; repeat-order path stays typed or voice",
    status: "Aligned to policy",
  },
  {
    topic: "Post-confirm ready check",
    portfolio: "Staff message in pickup flow (not Lola auto-status)",
    production: "Birria-class ready checks stay human — no status lane yet",
    status: "Aligned in demo",
  },
] as const;

/** Business framing — objective before feature list */
export const BUSINESS_BET = {
  objectiveHook: "Answer repeat questions",
  objectiveRest:
    "on-thread and capture pickup intent on the weekly deals thread — without adding counter headcount or a shopper app.",
  objective:
    "Answer repeat questions on-thread and capture pickup intent on the weekly deals thread — without adding counter headcount or a shopper app.",
  successMetrics: [
    { signal: "First reply", target: "97.7% under 2 min" },
    { signal: "FAQ load", target: "96.3% closed without staff" },
    { signal: "Pickup", target: "Lead-time % still measuring" },
  ] as const,
  successSignals: [
    "97.7% of first replies under 2 minutes",
    "96.3% of conversations closed without staff",
    "Pickup lead-time still instrumenting",
  ] as const,
  success:
    "97.7% under 2 min first reply · 96.3% closed without staff · pickup lead-time still measuring.",
  headline: STORY.heroThesis,
} as const;

export const I_SHIPPED_GROUPS = [
  {
    label: "Flows",
    items: ["Journey map + six interactive flow specs (EN/ES) — broadcast through staff help"],
  },
  {
    label: "Copy & templates",
    items: [
      "Canonical turn copy, coach menus, and progressive fallback scripts",
      "Meta broadcast template + WhatsApp button label spec (four moments, one style)",
    ],
  },
  {
    label: "Safety",
    items: ["Safety & recovery playbook — grounding rules, staff-wait, management escalation"],
  },
  {
    label: "Product build",
    items: ["Staff dashboard — WhatsApp inbox, pickup orders, counter alerts"],
  },
] as const;

export const I_SHIPPED = I_SHIPPED_GROUPS.flatMap((g) => g.items);

export const I_DID_NOT_SHIP = [
  "In-store kiosk hardware or queue UX",
  "POS catalog pricing bot — flyer + staff FAQ only in pilot",
] as const;

export const PROJECT_META = {
  role: "Design Technologist",
  timeline: PROJECT.timeline,
  context: PROJECT.context,
  skills:
    "Conversational UX & Architecture · Service & Operations Design · Full-Stack Development · Bilingual Localization (EN/ES)",
} as const;

export const PROBLEM_POINTS = [
  {
    label: "One inbox",
    text: "Every reply to the weekly ad — EN, ES, voice notes — landed in the same staff queue.",
  },
  {
    label: "Repeat FAQs",
    text: "Hours, SNAP, buffet, weekly ad. Same questions every week; slow off-shift.",
  },
  {
    label: "No pickup flow",
    text: "Hot counter worked in chat by hand — no Place order flow, quotes, or staff alerts.",
  },
] as const;

export const WHAT_WE_HEARD = {
  quote: {
    text: "I just wanted to know if the chicken sale was still on — I didn't want to call while I was cooking.",
    who: "Regular shopper",
    role: "Pilot · EN",
  },
  inboxMessages: [
    {
      text: "Hola buenas noches, si ya me trajeron la crema que les pusimos en el papel playera así se llama la crema playera espero que la traigan",
      context: "Follow-up on Crema Playera from the flyer",
      time: "8:14 PM",
    },
    {
      text: "Hola buenas días o tarde eso es muy importante saberlo ya me trajeron la crema que yo había pedido la playera en bote",
      context: "Hours + did my special order arrive?",
      time: "2:03 PM",
    },
    {
      text: "Pueden traer jabón rey es de Colombia",
      context: "Product request — not on this week's ad",
      time: "11:22 AM",
    },
  ],
} as const;

/** Real manual thread — staff replies by hand (pre-Lola / hot counter) */
export const MANUAL_INBOX_THREAD = {
  dateLabel: "Jun 17, 2026",
  messages: [
    { from: "customer" as const, text: "Do you guys have birria pizza today?", time: "1:57 PM" },
    { from: "staff" as const, text: "Yes sir", time: "1:59 PM" },
    { from: "staff" as const, text: "How many pies do you need ?", time: "2:00 PM" },
    { from: "customer" as const, text: "Just 1 today thank you!", time: "2:01 PM" },
    { from: "customer" as const, text: "I'll be there around 6:30-7!", time: "2:02 PM" },
    { from: "staff" as const, text: "Sure sir! See you then", time: "2:02 PM" },
    { from: "staff" as const, text: "Thank you for being our loyal customer! ❤️", time: "2:02 PM" },
    { from: "customer" as const, text: "Is the pizza ready sir?", time: "6:34 PM" },
    { from: "staff" as const, text: "Yes sir", time: "6:37 PM" },
    { from: "customer" as const, text: "Awesome! I'm on the way", time: "6:46 PM" },
  ],
} as const;

export const REFLECTION = [
  {
    hook: "Design the weekly shop",
    title: "Design the weekly shop, not the bot",
    body: "Meet families on discover → ask → plan. Pickup and list reminders were product additions — not something the broadcast channel already did.",
  },
] as const;

/** Main-path proof close — kiosk lives in Reference only */
export const NEXT_STEPS = [
  { hook: "Baselines", text: "reply rate · reminder follow-through · order completion from inbox + POS" },
  { hook: "Language-tagged", text: "broadcast segments (EN/ES)" },
  { hook: "Store knowledge", text: "pilot edge cases → expand grounded FAQ and staff-help patterns" },
] as const;

/** WhatsApp-first → kiosk — product forward strategy (not shipped in pilot) */
export const PRODUCT_FORWARD = {
  headline: "WhatsApp pilot first, in-store kiosk next",
  thesis:
    "Deploy on the thread families already use — low cost, live edge cases, store-specific knowledge — before putting Lola on counter hardware.",
  whatsappPillars: [
    {
      hook: "Low cost",
      text: "No new app, no kiosk capex — Meta template + existing phones.",
    },
    {
      hook: "Live edge cases",
      text: "Real EN/ES threads, voice notes, off-flyer asks — trains what this store actually hears.",
    },
    {
      hook: "Knowledge base",
      text: "FAQ tools, staff-help relay, and inbox history become the grounded brain a kiosk would reuse.",
    },
  ],
  kioskIntent:
    "Counter kiosk = same modes (ask · order · remind) with tap-first UI for walk-ins who are not on the weekly blast thread yet.",
  notInPilot: "Kiosk hardware, queue UX, and in-aisle placement — future phase; pilot scope stays WhatsApp + staff CRM.",
} as const;

export const HANDOFF_BOOK = {
  label: "Full handoff book (PM · Eng · Ops)",
  path: "/HANDOFF_BOOK.md",
  description: "Six-part spec: architecture, scope, deliverables, roadmap — production truth vs. portfolio demo.",
} as const;

export const WHATSAPP_LIVE = {
  display: "(404) 323-8325",
  waMe: "https://wa.me/14043238325?text=Hi%20Lola",
  staffUrl: "https://wacrm-i9f2.vercel.app",
} as const;

/** Double Diamond IA — prologue + four phases */
export const PHASES = [
  {
    id: "prologue",
    label: "Hook",
    num: "—",
    eyebrow: "~90s scroll",
    title: "Already on WhatsApp",
    lead: "Weekly volante blasts reached families — replies hit one staff inbox.",
    href: "#prologue",
    inProgress: false,
  },
  {
    id: "discover",
    label: "Discover",
    num: "1",
    eyebrow: "Evidence",
    title: "From real threads",
    lead: "~6 weeks inbox review · patterns behind the flows.",
    href: "#discover",
    inProgress: true,
  },
  {
    id: "define",
    label: "Define",
    num: "2",
    eyebrow: "Scope",
    title: "The weekly shop service loop",
    lead: "Lola was not designed as a separate app. She was placed inside the store's existing weekly flyer, WhatsApp replies, staff quoting, and pickup workflow.",
    href: "#define",
    inProgress: true,
  },
  {
    id: "develop",
    label: "Develop",
    num: "3",
    eyebrow: "Solution",
    title: "One WhatsApp thread, six controlled flows",
    lead: "Instead of asking customers to download an app, Lola turns weekly flyer replies into structured conversations for questions, orders, reminders, and staff handoff.",
    href: "#develop",
    inProgress: true,
  },
  {
    id: "deliver",
    label: "Deliver",
    num: "4",
    eyebrow: "Deliver",
    title: "Proof & impact",
    lead: "Outcomes, voices, takeaways, what’s next.",
    href: "#deliver",
    inProgress: true,
  },
] as const;

export type PhaseId = (typeof PHASES)[number]["id"];

/** Progress bar + chapter nav (excludes prologue scroll) */
export const PROGRESS_PHASES = PHASES.filter((p) => p.inProgress);

/** @deprecated use PHASES */
export const FOLDS = PROGRESS_PHASES;

export type FoldId = PhaseId;

export const TLDR = PROGRESS_PHASES.map((phase) => ({
  label: phase.label,
  hook: phase.num,
  text: phase.lead,
  href: phase.href,
})) as readonly { label: string; hook: string; text: string; href: string }[];

/** Compact production anchors on Define (P1 trim) */
export const PRODUCTION_FACTS_PRIMARY = ["live", "qa"] as const;

/** Anchors portfolio copy to shipped product surfaces */
export const PRODUCTION_FACTS = [
  {
    kind: "live" as const,
    label: "Guest channel",
    value: "WhatsApp (404) 323-8325",
    detail: "Weekly deals thread · EN/ES · text, buttons, voice notes",
    href: "https://wa.me/14043238325?text=Hi%20Lola",
    linkLabel: "Message Lola",
    external: true,
  },
  {
    kind: "staff" as const,
    label: "Staff CRM",
    value: "Lola Connect ↗",
    detail: "Staff login required — full walkthrough is in the Develop section above",
    href: "https://wacrm-i9f2.vercel.app",
    linkLabel: "Staff login required",
    external: true,
  },
  {
    kind: "qa" as const,
    label: "Regression",
    value: "988 Vitest tests",
    detail: "103 files · routing, grounding, staff-wait, shop-orders",
  },
  {
    kind: "scope" as const,
    label: "Staff alerts",
    value: "Two-tier model",
    detail: "Draft list → staff WhatsApp + dashboard popup; YES → confirm sound + order #",
  },
] as const;

export const OWNERSHIP_BOUNDARY =
  "Design through ship — conversation UX, staff dashboard, and Lola routing on WhatsApp." as const;

/** Supabase aggregate pull · 2026-07-12 · wacrm service role · counts only */
export const RESEARCH_PULL = {
  inboxWindow: "May 1 – Jun 15 2026",
  threads: 180,
  customerMessages: 310,
  languageKnown: { en: 28, es: 98, unknown: 54 },
  languageLead: "Spanish led among threads with a saved preference (98 ES · 28 EN)",
  staffHelp30d: {
    answered: 14,
    expired: 9,
    expireRatePct: 39,
    avgAnswerMinutes: 8.2,
  },
  botFirstReplyStudy: {
    under2MinPct: 95.3,
    medianSec: 3.1,
    n: 233,
  },
  publishedBotFirstReply: {
    under2MinPct: 97.7,
    medianSec: 4,
    n: 353,
    note: "Lola bot latency — not staff",
  },
  pickupAt: { withField: 3, totalOrders: 18, stillMeasuring: true },
  activity30d: { threads: 283, customerMessages: 1472 },
  broadcast30d: { spanishPct: 95, replyRatePct: 9.1 },
} as const;

export const EVIDENCE_LEAD = [
  {
    hook: "Designed for",
    text: "rush-hour thumbs, cooking multitask, EN/ES in one thread.",
  },
  {
    hook: "Learned from",
    text: `${RESEARCH_PULL.threads} threads · ${RESEARCH_PULL.customerMessages} messages · 2 counter shadow sessions`,
  },
] as const;

export const SOURCE_THREAD_BEFORE_AFTER = [
  { before: "Staff typed every reply", after: "Place order + draft list" },
  { before: "No order #", after: "Order # after YES / Confirm" },
  { before: "No counter alert", after: "Draft buzz + confirm on YES" },
  { before: "Ready-check by hand (6:34 PM)", after: "Still human post-pilot" },
] as const;

export const MY_ROLE = [...I_SHIPPED] as const;

export const HOW_WE_LEARNED = [
  {
    title: `${RESEARCH_PULL.threads} threads · ${RESEARCH_PULL.customerMessages} messages`,
    detail: `${RESEARCH_PULL.inboxWindow} — live flyer inbox, not a survey sample. Patterns coded by hand into the six flows.`,
  },
  {
    title: "Bilingual is architecture",
    detail: RESEARCH_PULL.languageLead + ". One language per reply — not mid-thread translation.",
  },
  {
    title: "Handoff still has a gap",
    detail:
      "Staff tickets exist when Lola can’t answer — solve/expire rates stay in Still Measuring until test traffic is filtered from the ticket sample.",
  },
] as const;

/** Methods tab body — site-panel voice, numbers from RESEARCH_PULL */
export const METHODS_PANEL_COPY = [
  `${RESEARCH_PULL.threads} threads · ${RESEARCH_PULL.customerMessages} customer messages. Six weeks live (${RESEARCH_PULL.inboxWindow}), then Lola Connect’s own logs.`,
  `I coded the inbox by pattern — hours, SNAP, pickup lists, loyalty, hot counter — into the six flows. ${RESEARCH_PULL.languageLead}.`,
  "Every escalation gets a status, not just a resolution — but the ticket sample still mixes real guest asks with internal test traffic. Solve/expire rates stay unpublished until that filter is clean.",
  `Bot speed vs human speed: Lola first replies hit ${RESEARCH_PULL.publishedBotFirstReply.under2MinPct}% under 2 min (median ~${RESEARCH_PULL.publishedBotFirstReply.medianSec}s · n=${RESEARCH_PULL.publishedBotFirstReply.n}). Staff replies on escalations are minutes, not seconds — keep those metrics separate.`,
] as const;

export const JOURNEY_PANEL_COPY = [
  "Broadcast → ask → order → wait → pickup — one loop, six friction points.",
  "Guests didn’t want a new app. They wanted the flyer thread to talk back — in whichever language, text or voice, without a command to memorize.",
  "The gap that’s still open: when a guest needs a human, the handoff must close. Escalation solve/expire rates stay in Still Measuring until test traffic is filtered.",
] as const;

export const WHAT_WE_TRIED_FIRST = [
  {
    title: "Manual inbox replies",
    detail: "Worked when someone was at the desk — failed off-shift and during rush.",
  },
  {
    title: "Numbered reply menus (1 for deals, 2 for delivery)",
    detail:
      "CRM automation on the weekly template — reply 1 or 2 triggered fixed text walls. Shoppers ignored digits or typed free text; real questions still hit one inbox.",
  },
  {
    title: "Mixed EN/ES in one blast",
    detail: "Hard to scan on mobile; split into parallel templates and per-thread language preference.",
  },
  {
    title: "Decorative button styles in mocks",
    detail: "Blue/green pill chips don't ship on WhatsApp — one stacked teal reply style only.",
  },
] as const;

export const WEEKLY_SHOP_LOOP = [
  { step: 1, label: "Discover", detail: "Flyer broadcast & weekly ad" },
  { step: 2, label: "Ask", detail: "Hours, buffet, SNAP, specials" },
  { step: 3, label: "Plan", detail: "Remind me later (shopping or offer)" },
  { step: 4, label: "List", detail: "#order by text or voice" },
  { step: 5, label: "Pick up", detail: "Staff quote → YES → in store" },
] as const;

/** Flow explorer — before / after framing (labels live in UI) */
export const FLOW_EXPLORER_BEFORE =
  "Replies hit one inbox — staff read, translated, sorted, and quoted by hand.";

export const FLOW_EXPLORER_AFTER =
  "Same thread becomes six guided flows — tap buttons, bilingual memory, voice on the same path, staff handoff when needed.";

/** Scope cuts — signal → shipped for validation table */
export const WHAT_WE_CUT = [
  {
    cut: "Full SKU price bot",
    signal: "Trust risk",
    shipped: "Flyer + staff FAQ only",
  },
  {
    cut: "Numbered menu as the whole product",
    signal: "Reply 1/2 walls didn't answer real questions",
    shipped: "Lola instant answers + tap paths",
  },
  {
    cut: "Voice on every turn (Hobby)",
    signal: "Vercel timeouts",
    shipped: "Text first, async voice",
  },
  {
    cut: "Alert-only-after-YES (design intent)",
    signal: "Phantom orders vs staff blind spot in rush",
    shipped: "Two-tier: draft alerts staff to quote; YES triggers confirm",
  },
] as const;

export const TRADE_OFFS = [
  {
    tension: "Commands vs buttons",
    call: "Place order primary",
    why: "Meta quick replies + lower cognitive load; #order stays for voice and power users.",
  },
  {
    tension: "Speed vs trust",
    call: "Two-tier staff alerts",
    why: "Draft pings staff to quote in rush; guest YES is the confirm gate before order #.",
  },
  {
    tension: "GPT fluency vs facts",
    call: "Tools + safety layer",
    why: "One wrong price on WhatsApp loses the customer forever.",
  },
  {
    tension: "Auto-handoff vs teach once",
    call: "Progressive fallback",
    why: "First confusion → coach menu; repeat same day → staff or call store.",
  },
] as const;

/** How evidence was gathered — rigor footer for Methods tab */
export const RESEARCH_METHODS_RIGOR = `${RESEARCH_PULL.threads} threads · ${RESEARCH_PULL.customerMessages} messages (${RESEARCH_PULL.inboxWindow}) · 2 counter shadow sessions · escalation solve/expire still measuring (test traffic in ticket sample) · La Bodega, Calhoun GA`;

/** Inbox pattern → design decision → where it ships in the case study / product */
export const RESEARCH_TO_DECISION = [
  {
    pattern: "Hours / SNAP / buffet every week",
    responseHook: "Tool-grounded FAQ",
    responseRest: "Dedicated hours copy — not open-ended GPT.",
    ships: { label: "Greeting flow", href: "#develop/flows/greeting" },
  },
  {
    pattern: "Voice notes while cooking",
    responseHook: "STT + transcript",
    responseRest: "Same routing as text; transcript always on-thread.",
    ships: { label: "Inbox voice · EN", href: "#discover/inbox/voice" },
  },
  {
    pattern: "Hot counter by hand (birria thread)",
    responseHook: "Pickup flow",
    responseRest: "Draft list → quote → YES → staff buzz.",
    ships: { label: "Source thread + demo", href: "#discover/source-thread" },
  },
  {
    pattern: "Product not on this week's ad",
    responseHook: "Staff help relay",
    responseRest: "Never invent stock or aisle.",
    ships: { label: "Staff help flow", href: "#develop/flows/staff-help" },
  },
  {
    pattern: "Staff on floor during rush",
    responseHook: "Phone buzz + dashboard",
    responseRest: "Not another app to check.",
    ships: { label: "Staff alert mock", href: "#develop-staff-ops" },
  },
  {
    pattern: "Loyalty while busy (won't call)",
    responseHook: "Staff help for points",
    responseRest: "STT on-thread — not automated in pilot.",
    ships: { label: "Shopper voice · EN", href: "#discover/inbox/voice" },
  },
] as const;

export const CANONICAL_MICROCOPY = [
  { moment: "Broadcast", copy: "This week's specials are in the flyer above." },
  { moment: "Order draft", copy: "Thanks — we got your list! Someone will send a total shortly." },
  { moment: "Confirm gate", copy: "Reply YES to confirm, or CANCEL to exit." },
  { moment: "Staff wait", copy: "I asked our store team. I'll reply here shortly." },
  { moment: "List reminder", copy: "Not an order yet — I'll nudge you then." },
] as const;

export const BUTTON_LABEL_SYSTEM =
  "See specials · Store hours · Place order · Remind me — one stacked teal style, max 3 per message." as const;

/** Meta / WhatsApp Business API — quick-reply buttons per message */
export const WHATSAPP_MAX_REPLY_BUTTONS = 3;

/** Who owns each moment — guest / Lola / staff / store ops */
export type ServiceBlueprintTag = "Store ops" | "Designed" | "Staff + Lola" | "Pickup";

export const SERVICE_BLUEPRINT = [
  {
    id: "flyer",
    label: "Flyer prep",
    detail: "Store ops prepares the weekly deals and flyer image.",
    tag: "Store ops" as ServiceBlueprintTag,
    highlight: false,
  },
  {
    id: "blast",
    label: "Meta broadcast",
    detail: "The flyer goes out to loyalty members through the existing WhatsApp broadcast flow.",
    tag: "Store ops" as ServiceBlueprintTag,
    highlight: false,
  },
  {
    id: "thread",
    label: "Shopper thread",
    detail: "Customers reply in the same WhatsApp thread with questions, voice notes, or pickup lists.",
    tag: "Designed" as ServiceBlueprintTag,
    highlight: true,
  },
  {
    id: "quote",
    label: "Quote & confirm",
    detail: "Staff prices the list, Lola keeps the customer in a simple confirm-or-edit loop.",
    tag: "Staff + Lola" as ServiceBlueprintTag,
    highlight: true,
  },
  {
    id: "alert",
    label: "Counter alert",
    detail: "Confirmed pickup lists trigger staff WhatsApp and dashboard alerts.",
    tag: "Staff + Lola" as ServiceBlueprintTag,
    highlight: true,
  },
  {
    id: "fulfill",
    label: "Pickup in store",
    detail: "The customer pays at the register and picks up the prepared order.",
    tag: "Pickup" as ServiceBlueprintTag,
    highlight: false,
  },
] as const;

/** Staff-facing alert channels — not a separate shopper app */
export const STAFF_CHANNELS = [
  {
    channel: "Staff WhatsApp",
    trigger: "Shopping list lands (awaiting guest confirm)",
    action: "Buzz + CRM review link on counter phone",
  },
  {
    channel: "Staff WhatsApp",
    trigger: "~20 min before pickup window",
    action: "Pickup nudge — prep counter / hot food",
  },
  {
    channel: "Dashboard modal",
    trigger: "New shop_orders row (draft list)",
    action: "Repeating popup + sound until dismissed — quote or open chat",
  },
  {
    channel: "Dashboard sound",
    trigger: "Guest replies YES or taps Confirm on quote",
    action: "Order confirmed toast — prep counter / hot food",
  },
] as const;

export const FULFILLMENT_CHAIN =
  "Staff sends quote in WhatsApp or CRM → guest replies YES → Lola posts order # and pickup window on-thread → counter bags the list → guest pays in store. Ready-check messages stay human until we spec a post-confirm status lane." as const;

/** When humans own the thread vs. Lola */
export const HANDOFF_RULES = [
  {
    trigger: "Low confidence or off-flyer product",
    lola: "Offers staff help; stops inventing facts",
    staff: "Replies in CRM; Lola relays in guest thread",
  },
  {
    trigger: "Guest confirms pickup (YES)",
    lola: "Order # + pickup window on-thread",
    staff: "Phone buzz + dashboard popup; send quote if not already",
  },
  {
    trigger: "Allergies, refunds, complaints",
    lola: "Routes to management inbox — no confident bot answer",
    staff: "Human owns the thread",
  },
  {
    trigger: "Staff replies in the CRM inbox",
    lola: "Stays quiet on that chat — no duplicate bot loops",
    staff: "Direct WhatsApp or inbox reply",
  },
] as const;

/** Before → signal → after — pilot validation ledger */
export const VALIDATION_LEDGER = [
  {
    id: "broadcast-buttons",
    before: "Template image + numbered menu — reply sends bilingual specials wall",
    signal: "No tap path to order · menus varied (1/2 vs 1/2/3) · off-script replies buried in inbox",
    after: "Same template + Lola intro and Place order / hours / specials tap buttons",
    proof: "Pilot observation · Meta template v2",
    href: "#develop/flows/broadcast",
    beforeText: BROADCAST_LEGACY.menuText,
    beforeSpecials: BROADCAST_LEGACY.updateMenu.specialsBody,
    beforeReplyDigit: BROADCAST_LEGACY.updateMenu.replyDigit,
    afterButtons: ["Place order", "Store hours", "See specials"] as const,
  },
  {
    id: "phantom-alert",
    before: "Counter buzz on draft list",
    signal: "Phantom orders vs staff missing lists in rush",
    after: "Two-tier: draft labeled awaiting confirm; YES triggers confirm signal",
    proof: "Staff interviews + production code",
    href: "#develop-staff-ops",
  },
  {
    id: "sku-bot",
    before: "Full SKU / aisle price bot",
    signal: "Wrong price kills neighborhood trust",
    after: "Flyer + staff FAQ only; off-list → staff help",
    proof: "Scope cut · safety spec",
    href: "#reference/safety",
  },
  {
    id: "voice-every-turn",
    before: "Voice note on every Lola reply",
    signal: "Vercel timeout · slow path on Hobby tier",
    after: "Text first; async voice on select turns",
    proof: "Production constraint",
    href: "#reference",
  },
  {
    id: "gpt-hours",
    before: "Open GPT answers for hours/SNAP",
    signal: "Hallucination risk on retail facts",
    after: "Tool-grounded FAQ + 988 regression tests",
    proof: "Vitest suites · grounding checks",
    href: "#reference/safety",
  },
  {
    id: "reminder-order",
    before: "Saved list treated as an order",
    signal: "Guest confusion on timing and liability",
    after: "Reminder nudges → Place order tap",
    proof: "Flow completion observation",
    href: "#develop/flows/list-reminder",
  },
] as const;

/** Design-visible behaviors covered by regression tests */
export const VALIDATION_TEST_MAP = [
  {
    behavior: "Wrong price never ships as fact",
    suite: "Grounding",
    href: "#reference/safety",
  },
  {
    behavior: "Place order button routes to pickup coach",
    suite: "Routing & buttons",
    href: "#reference/routing",
  },
  {
    behavior: "Thanks only while waiting on staff — no re-escalation",
    suite: "Staff help & voice",
    href: "#reference/safety",
  },
] as const;

export const TESTIMONIALS = [
  {
    who: "Counter staff, paraphrased",
    quote:
      "We used to find out about orders when someone walked in. Now the phone buzzes when the list comes in.",
    role: "Staff",
  },
  {
    who: "Regular shopper, paraphrased",
    quote:
      "I used the voice note because I didn't want to call the store while I was cooking dinner.",
    role: "Customer",
  },
] as const;

export const PILOT_IMPACT = [
  {
    signal: "97.7% first reply < 2 min",
    detail: "Lola bot · median ~4 sec · n=353 on the live flyer thread.",
  },
  {
    signal: "96.3% closed without staff",
    detail: "14 of 380 conversations escalated — the rest didn’t loop in chat.",
  },
  {
    signal: "988 Vitest tests",
    detail: "Routing, language, tone, and safety — ship changes without babysitting deploys.",
  },
  {
    signal: "Voice on the same path",
    detail: "Spoken asks transcribe, then hit the same grounded logic as text.",
  },
] as const;

/** Peak-end close — honest open work + shopper quote (staff quote stays in PilotVoices) */
export const CLOSING_BEAT = {
  eyebrow: "Where this stands",
  body: "Six weeks, 380 real conversations, 96.3% closed without staff. Escalation solve/expire rates stay in Still Measuring until test traffic is filtered from the ticket sample — same honesty bar as pickup lead time.",
  quote: TESTIMONIALS[1].quote,
  attribution: TESTIMONIALS[1].who,
} as const;

/** Lightweight ops proof — keep it scannable on the main page */
export const OPS_PROOF = [
  {
    signal: "Lock-screen alerts",
    detail: "Staff get a phone buzz when the dashboard is closed.",
  },
  {
    signal: "Tested before ship",
    detail: "988 automated checks on routing, language, tone, and safety.",
  },
  {
    signal: "Alerts while the app is open",
    detail: "Pop-up and sound when a new list lands during rush.",
  },
] as const;

/** Top pilot pivots — title + one line each */
export const PILOT_PIVOTS_TILES = [
  {
    title: "Tap buttons, not reply 1/2/3",
    note: "Clear next steps; fewer messages lost in the inbox.",
  },
  {
    title: "“Place order” instead of “Hi Lola”",
    note: "Guests knew what would happen when they tapped.",
  },
  {
    title: "Text first, voice when it helps",
    note: "Faster replies with the same order logic.",
  },
] as const;

/** What we'd carry to the next store */
export const PILOT_TAKEAWAYS = [
  {
    title: "Start from the channel that already exists",
    body: `The CRM broadcast already reached the loyalty list. The opportunity was reply handling, not app downloads.`,
  },
  {
    title: "Bilingual is architecture, not translation",
    body: "Language preference, templates, and handoff rules need to be designed into the system.",
  },
  {
    title: "Mascot builds warmth; facts build trust",
    body: "Lola can feel friendly, but prices, hours, and policies must come from approved store knowledge.",
  },
  {
    title: "Design the weekly shop, not the chatbot",
    body: "The strongest flows are practical: ask, plan, order, confirm, remind, and pickup.",
  },
] as const;

/** Honest next phase — pilot is live, not finished */
export const FUTURE_SCOPE = [
  {
    title: "Pickup lead-time & POS match",
    detail:
      "Wire reliable pickup_at + POS-matched completion so “lists before walk-in” and revenue become claimable metrics.",
  },
  {
    title: "Language-tagged broadcasts",
    detail: "Send English and Spanish segments separately instead of one bilingual reply wall.",
  },
  {
    title: "Expanded store knowledge",
    detail: "Add more grounded FAQ, deal, product, and staff-help patterns.",
  },
  {
    title: "In-store kiosk later",
    detail: "Reuse the same ask, order, and remind logic for walk-in customers.",
  },
] as const;

/** Remaining instrumented gaps — outcomes already in Pilot Outcomes cards */
export const PILOT_METRICS_NEXT = [
  {
    label: "Pickup lists before walk-in",
    detail: "One real order completed in the study window — the rest were test runs. Too early to report lead time.",
    status: "Measuring",
  },
] as const;

/** Primary nav: prologue + four phases + reference */
export const ACTS = [
  ...PHASES.map((p) => ({ id: p.id, label: p.label, num: p.num })),
  { id: "reference", label: "Reference", num: "·", parentId: "deliver" as const },
] as const;

export type ActId = (typeof ACTS)[number]["id"];

/** Deep-link subsections inside phases */
export const SUBSECTIONS = [
  { id: "evidence", label: "Evidence", phaseId: "discover" as const },
  { id: "flows", label: "Flows", phaseId: "develop" as const },
] as const;

export type FlowId = "broadcast" | "greeting" | "order" | "reminder" | "stuck" | "staffhelp";
export type Lang = "en" | "es";

export type JourneyTone = "default" | "bottleneck" | "gain";

export type JourneyStep = {
  label: string;
  detail: string;
  tone: JourneyTone;
};

export const CUSTOMER_JOURNEY: { before: JourneyStep[]; after: JourneyStep[] } = {
  before: [
    {
      label: "Broadcast",
      detail:
        "Weekly flyer hits the loyalty list — replies pile into one unsorted inbox (EN/ES mixed).",
      tone: "default",
    },
    {
      label: "Ask",
      detail: "Hours, SNAP, loyalty points, hot counter — text or voice, no shared script.",
      tone: "default",
    },
    {
      label: "Order",
      detail: "Informal pickup lists typed by hand — no quote/confirm loop on-thread.",
      tone: "default",
    },
    {
      label: "Wait",
      detail: "Staff first response measured in minutes to hours — guest often goes quiet.",
      tone: "bottleneck",
    },
    {
      label: "Drop off",
      detail: "No pickup path on the channel — call the store or walk in cold.",
      tone: "bottleneck",
    },
  ],
  after: [
    {
      label: "Broadcast",
      detail: "Same flyer thread + Lola intro and tap buttons — no new app.",
      tone: "default",
    },
    {
      label: "Ask",
      detail: `Store-tool answers in EN or ES. Bot first reply ${RESEARCH_PULL.publishedBotFirstReply.under2MinPct}% under 2 min (median ~${RESEARCH_PULL.publishedBotFirstReply.medianSec}s) — Lola speed, not staff.`,
      tone: "gain",
    },
    {
      label: "Order",
      detail: "Confirm-or-edit loop: draft list → staff quote → YES → order #. Counter alert on confirm.",
      tone: "gain",
    },
    {
      label: "Handoff",
      detail:
        "When knowledge runs out → staff ticket. Solve/expire rates stay in Still Measuring until test traffic is filtered from the ticket sample.",
      tone: "bottleneck",
    },
    {
      label: "Pickup",
      detail:
        "Staff alert before walk-in. Pickup lead-time still measuring — one real order in the study window; the rest were test runs.",
      tone: "gain",
    },
  ],
};

export type InboxSnippetMessage = {
  from: "customer" | "staff";
  text: string;
  time: string;
};

export const INBOX_SNIPPETS = [
  {
    id: "voice",
    title: "Shopper voice · EN",
    insight: "Loyalty question by voice note — easier than calling during dinner rush.",
    kind: "voice" as const,
    contact: "Customer",
    time: "7:18 PM",
    duration: "0:22",
    transcript:
      "I signed up for the loyalty program two weeks back, but I've been purchasing from your store since the beginning. Can you add those purchases to my points?",
  },
  {
    id: "promo-product",
    title: "Product request · ES",
    insight: "Product ask after the flyer — not on this week's ad.",
    kind: "thread" as const,
    contact: "Cliente",
    messages: [
      { from: "customer" as const, text: "Pueden traer jabón rey es de Colombia", time: "11:22 AM" },
    ] satisfies InboxSnippetMessage[],
  },
  {
    id: "promo-order",
    title: "Order follow-up · ES",
    insight: "Special-order follow-up mixed with a hours question.",
    kind: "thread" as const,
    contact: "Cliente",
    messages: [
      {
        from: "customer" as const,
        text: "Hola buenas días — eso es muy importante saberlo. ¿Ya me trajeron la crema playera en bote?",
        time: "2:03 PM",
      },
    ] satisfies InboxSnippetMessage[],
  },
  {
    id: "hot-counter",
    title: "Hot counter · EN",
    insight: "Availability → pickup window → ready check — all typed by staff.",
    kind: "thread" as const,
    contact: "Customer",
    messages: [
      { from: "customer" as const, text: "Do you guys have birria pizza today?", time: "1:57 PM" },
      { from: "staff" as const, text: "Yes sir — how many pies do you need?", time: "2:00 PM" },
      { from: "customer" as const, text: "Just 1 today — I'll be there around 6:30-7!", time: "2:02 PM" },
      { from: "customer" as const, text: "Is the pizza ready sir?", time: "6:34 PM" },
      { from: "staff" as const, text: "Yes sir", time: "6:37 PM" },
    ] satisfies InboxSnippetMessage[],
  },
] as const;

export const FLOW_TABS: { id: FlowId; label: string; blurb: string; hashSlug: string }[] = [
  { id: "broadcast", label: "Broadcast", blurb: "The store's weekly WhatsApp flyer blast.", hashSlug: "broadcast" },
  { id: "greeting", label: "Greeting", blurb: "Customer says hi — Lola offers deals, hours, or pickup.", hashSlug: "greeting" },
  { id: "order", label: "Pickup order", blurb: "List items → staff quote → confirm → pickup time.", hashSlug: "pickup" },
  { id: "reminder", label: "Reminder", blurb: "Save a shopping list and day — Lola nudges when it's time.", hashSlug: "list-reminder" },
  { id: "stuck", label: "Confused", blurb: "Coach menu when the customer sends ? or gets lost.", hashSlug: "stuck" },
  { id: "staffhelp", label: "Staff handoff", blurb: "Off-flyer question → staff relay → answer on-thread.", hashSlug: "staff-help" },
];

export const FLOW_ID_FROM_SLUG = Object.fromEntries(
  FLOW_TABS.map((tab) => [tab.hashSlug, tab.id]),
) as Record<string, FlowId>;

export const FLOW_SLUG_FROM_ID = Object.fromEntries(
  FLOW_TABS.map((tab) => [tab.id, tab.hashSlug]),
) as Record<FlowId, string>;

export const EVIDENCE_EXHIBIT_TABS = [
  { id: "inbox", label: "Inbox" },
  { id: "journey", label: "Journey" },
  { id: "methods", label: "Methods" },
] as const;

export type EvidenceExhibitTabId = (typeof EVIDENCE_EXHIBIT_TABS)[number]["id"];

export const REFERENCE_TABS = [
  { id: "routing", label: "Request path" },
  { id: "safety", label: "Safety & QA" },
  { id: "service", label: "Service design" },
  { id: "artifacts", label: "Artifacts" },
  { id: "persona", label: "Persona" },
] as const;

export type ReferenceTabId = (typeof REFERENCE_TABS)[number]["id"];

export const BUTTON_MOMENTS = [
  { moment: "Broadcast", context: "After template image — tap buttons we added (was numbered menu + text-wall reply)", buttons: ["See specials", "Store hours", "Place order"] },
  {
    moment: "Greeting",
    context: "Customer texts hi / hola — repeat order is typed (“same as last”), not a fourth button",
    buttons: ["✨ Weekly deals", "🕐 Store hours", "🛒 Place order"],
  },
  { moment: "After specials", context: "Second message after ad", buttons: ["🛒 Place order", "🔔 Remind me", "No thanks"] },
  { moment: "Coach", context: "Customer sends ?", buttons: ["📦 Pickup order", "🔔 List reminder", "Cancel"] },
];

/** Main-path product decisions — technical mechanisms (philosophy lives on Craft rules) */
export const FEATURED_PRODUCT_DECISIONS = [
  {
    tag: "Architecture",
    decision: "Store tools on open asks",
    body: "Hours, FAQ, and deals resolve through store tools first — the agent never invents prices or stock.",
  },
  {
    tag: "Operations",
    decision: "Staff quote the list",
    body: "Shopping lists get a human quote and confirm — Lola does not price an order on her own.",
  },
  {
    tag: "Alerts",
    decision: "Two-tier staff alerts",
    body: "WhatsApp alerts catch attention; dashboard alerts support fulfillment.",
  },
  {
    tag: "Consent",
    decision: "Customer acts first",
    body: "Lola responds after a customer taps, texts, or sends a voice note.",
  },
] as const;

/** @deprecated use FEATURED_PRODUCT_DECISIONS */
export const FEATURED_DECISION_TITLES = FEATURED_PRODUCT_DECISIONS.map((d) => d.decision);

/** Main-path pivot log (4 rows) — aligned to live pilot story */
export const PILOT_PIVOTS = [
  {
    before: "Numbered reply menu (1 for deals, 2 for delivery)",
    signal: "Fixed automation walls — shoppers ignored digits or typed anyway",
    after: "Lola + tap buttons — instant grounded answers, then pickup when ready",
  },
  {
    before: "Manual inbox only",
    signal: "Off-shift and rush — replies hours late or missed",
    after: "In-thread answers + staff relay for hard asks",
  },
  {
    before: "Open-ended price / aisle bot",
    signal: "Wrong price kills neighborhood trust",
    after: "Flyer + FAQ tools only — humans quote lists",
  },
  {
    before: "Voice → staff alert with no read-back",
    signal: "Kitchen noise skewed transcription",
    after: "Draft text shown for confirm before counter ping",
  },
] as const;

export const DECISIONS = [
  {
    title: "Bilingual is architecture",
    body: "Templates, saved language preference, and voice — not a bolt-on translation layer.",
    tag: "Product",
  },
  {
    title: "Store tools on open asks",
    body: "Open-ended turns hit an agent that must call store tools — hours, FAQ, deals — before it speaks. Low confidence never ships as fact.",
    tag: "Architecture",
  },
  {
    title: "Staff quote the list",
    body: "🛒 Place order beats memorizing #order. Lists get a human quote — Lola does not invent order totals.",
    tag: "WhatsApp",
  },
  {
    title: "Two-tier staff alerts",
    body: "Draft list pings staff to quote early; guest YES or Confirm button is the gate before order # — production uses both signals.",
    tag: "Ops",
  },
  {
    title: "Thread modes, not stateless chat",
    body: "Every turn carries live context: ask, order, remind, or waiting on staff — so replies match where the guest actually is.",
    tag: "Conversation",
  },
  {
    title: "Safety before send",
    body: "Allergies, refunds, and invented prices route to staff or management — never out as confident bot answers.",
    tag: "Trust",
  },
  {
    title: "Customer acts first",
    body: "Broadcast invites — Lola speaks only after tap, text, or voice note.",
    tag: "Consent",
  },
] as const;

/** Runtime modes injected into live context — same journey, clearer framing per turn */
export const CONVERSATION_MODES = [
  {
    id: "asking",
    label: "Ask",
    framing: "Ask mode — hours, deals, SNAP, what to buy",
    detail: "Default after broadcast or greeting. Facts via tools, not guesses.",
  },
  {
    id: "ordering",
    label: "Order",
    framing: "Order mode — building a pickup list",
    detail: "Guided coach or Place order. Draft → confirm → quote. Active order pauses free chat unless hours/deals.",
  },
  {
    id: "reminding",
    label: "Remind",
    framing: "Reminder mode — nudge later, not order now",
    detail: "List + day/time saved. Cron message asks to place order when the window opens.",
  },
  {
    id: "waiting_staff",
    label: "Staff help",
    framing: "Staff help — store teammate will reply",
    detail: "Staff-help wait state. Thanks and ack only — no re-escalation loops.",
  },
] as const;

export const ARCHITECTURE_LAYERS = [
  {
    id: "inbound",
    label: "WhatsApp inbound",
    detail: "Text, template quick replies, interactive buttons, voice notes (OGG/MP3). Whisper STT on audio.",
  },
  {
    id: "route",
    label: "Handler routing (local)",
    detail:
      "Buttons, hashtags, and structured intents hit handlers first — offers, guided coach, staff-wait, order status, lang pick. Human inbox assignment pauses Lola.",
  },
  {
    id: "context",
    label: "Live context",
    detail:
      "Snapshot per turn: store open vs pickup order window (10am–8pm), conversation mode, active draft order, coach stage, staff-help pending, recent thread, saved language.",
  },
  {
    id: "agent",
    label: "Agent + tools",
    detail:
      "gpt-4o-mini tool loop — check_hours, search_store_faq, get_weekly_deals, draft_pickup_order, create_reminder, handoff_to_staff. Facts only from tool results.",
  },
  {
    id: "grounding",
    label: "Grounding checks",
    detail:
      "JSON confidence on legacy path; hallucinated prices and unsupported claims blocked. Tools-first on the agent path.",
  },
  {
    id: "safety",
    label: "Safety layer",
    detail:
      "Allergies, refunds, complaints → management inbox. Low confidence or risky replies → staff handoff. Inbox marked pending when humans must own the thread.",
  },
  {
    id: "fallback",
    label: "Progressive fallback",
    detail: "1st confusion → coach menu; 2nd+ same day → call-store line or staff ping. Rules, not endless GPT.",
  },
  {
    id: "voice",
    label: "Voice delivery",
    detail: "Text lands first; voice note follows async. Edge Jenny/Paloma TTS; skipped on pure button turns.",
  },
  {
    id: "human",
    label: "Human handoff",
    detail:
      "Staff help relay in-thread; management for serious issues; staff reply relayed by Lola. Hard threads stay in CRM inbox.",
  },
] as const;

/** Outbound guardrails — what must never ship as a confident bot answer */
export const SAFETY_GUARDRAILS = [
  {
    label: "Invented store facts",
    detail: "Prices, aisles, stock, or policies not in knowledge → block send or force staff handoff.",
  },
  {
    label: "Allergy & dietary risk",
    detail: "Cross-contamination, nut-free, gluten questions → management inbox — not model improvisation.",
  },
  {
    label: "Payment & complaints",
    detail: "Refunds, chargebacks, fraud, serious issues → management escalation + inbox pending.",
  },
  {
    label: "Staff-wait discipline",
    detail: "While waiting on staff: thanks/acks only — no duplicate pings or new GPT loops.",
  },
  {
    label: "Order window honesty",
    detail: "After hours: guests can leave a list; quotes wait until the pickup window opens (10am).",
  },
] as const;

/** How we regression-tested conversation logic before pilot — design-relevant coverage */
export const CONVERSATION_QA = {
  lead: "988 passing Vitest cases · 103 files — routing, grounding, and staff-wait stay stable as the stack grows.",
  suites: [
    {
      label: "Routing & buttons",
      detail: "Handler order, webhook paths, Meta button payloads, coach handoffs.",
    },
    {
      label: "Grounding",
      detail: "Confidence JSON, price-in-context checks, low-confidence → staff offer.",
    },
    {
      label: "Safety",
      detail: "Hallucinated prices blocked, refund/allergy → management, skip re-escalation on thanks.",
    },
    {
      label: "Staff help & voice",
      detail: "Wait-state exits, spoken-reply text-first, bilingual STT/TTS paths.",
    },
  ],
} as const;

export const DESIGN_ARTIFACTS = [
  {
    id: "conversational",
    type: "Conversational",
    summary: "Happy path — what customers see and tap",
    items: [
      { label: "Journey maps", detail: "Broadcast → discover / ask / plan → pickup & list reminders" },
      { label: "Canonical EN/ES copy", detail: "Approved strings for every turn" },
      { label: "Meta broadcast templates", detail: "Weekly template + tap buttons (replaced numbered menu + specials text wall)" },
      { label: "Button label spec", detail: "Four moments, max 3 buttons per message, one stacked teal style" },
    ],
  },
  {
    id: "recovery",
    type: "Recovery",
    summary: "When guests get stuck — rules, not endless GPT",
    items: [
      { label: "Progressive fallback model", detail: "1st confusion → coach menu; repeat same day → call store or staff" },
      { label: "Guided coach", detail: "? → three tap buttons for order or reminder" },
      { label: "Conversation modes", detail: "Ask / order / remind / staff help — live context framing per turn" },
      { label: "Error recovery playbook", detail: "Confusion scripts, no voice on pure fallback turns" },
    ],
  },
  {
    id: "safety",
    type: "Safety & QA",
    summary: "Guardrails and regression tests — trust at retail stakes",
    items: [
      { label: "Outbound safety spec", detail: "Block bluffs, risky topics, and bad copy before WhatsApp send" },
      { label: "Grounding test matrix", detail: "Prices in context, low-confidence staff offer, warm ack without facts" },
      { label: "Routing test suites", detail: "Buttons, staff-wait, order window, inbox pause — Vitest in CI" },
      { label: "Pilot monitoring", detail: "Reply rate, reminder follow-through, confirm → quote completion (when data lands)" },
    ],
  },
  {
    id: "handoff",
    type: "Engineering handoff",
    summary: "Design → code bridge for the live app",
    items: [
      { label: "Orders & reminders spec", detail: "Draft → confirm → quote; list reminder cron → Place order nudge" },
      { label: "WhatsApp buttons kitchen", detail: "Template IDs, payload mapping, Meta limits" },
      { label: "Layered stack", detail: "handler.ts, layers/* (context, agent, tools, safety), persona.ts" },
    ],
  },
] as const;

export const LOLA_VOICE_SAMPLES = [
  {
    id: "hours-en",
    lang: "EN" as const,
    label: "Store hours",
    playLabel: "Play English voice",
    audioSrc: "/audio/lola-hours-en.mp3",
    transcript:
      "We're open 9 AM to 9 PM, seven days a week. Hot food and restaurant counter inside. SNAP and EBT welcome.",
  },
  {
    id: "hours-es",
    lang: "ES" as const,
    label: "Horario",
    playLabel: "Play Spanish voice",
    audioSrc: "/audio/lola-hours-es.mp3",
    transcript:
      "Abrimos de 9 de la mañana a 9 de la noche, todos los días. Tenemos comida caliente y mostrador adentro. Aceptamos SNAP y EBT.",
  },
] as const;

/** Conversation design rules — three cards (voice path lives in Voice Lane) */
export const CONVERSATION_RULES = [
  {
    title: "Bilingual by thread",
    body: "Lola detects English or Spanish and keeps the reply language consistent within the thread.",
  },
  {
    title: "Buttons before commands",
    body: "Customers should not need to remember commands like #order. Key actions use tap buttons.",
  },
  {
    title: "Staff knowledge before imagination",
    body: "Hours, prices, menu items, and deals come from staff-approved knowledge. If Lola does not know, she routes to staff instead of inventing.",
  },
] as const;

/** @deprecated use CONVERSATION_RULES */
export const LOLA_CHANNELS = [
  {
    title: "Customer → Lola",
    items: ["Text, tap buttons, or voice notes", "Bilingual — preference remembered per thread"],
  },
  {
    title: "Lola → Customer",
    items: ["Grounded text from staff knowledge + weekly offers", "Voice replies when useful"],
  },
] as const;

export const STAFF_OPS_PROCESS =
  "Customer sends list → Staff quotes → Customer confirms → Staff receives alert → Pickup prepared" as const;

export const LOLA_PERSONA = {
  visual: "Teen mascot (~16–17) — folkloric La Bodega kid shoppers recognize from the store.",
  voice: "Warm and casual, but TTS tuned slightly more mature (early-20s tone) so price and hours answers feel trustworthy — not babyish.",
  rules:
    "Facts from tools/knowledge only · one language per message · intro once · safety layer before every outbound send.",
};
