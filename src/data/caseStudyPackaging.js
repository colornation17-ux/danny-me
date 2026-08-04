/**
 * Case-study visual skim: one outcome line + up to three sketch/screen beats.
 * Keyed by project slug. CW A/B share `competitor-watch`.
 */

/**
 * @typedef {'image' | 'video'} PackBeatKind
 * @typedef {{ src: string, kind?: PackBeatKind, caption: string, alt: string }} PackBeat
 * @typedef {{ line: string, beats?: PackBeat[] }} CasePackaging
 */

/** @type {Record<string, CasePackaging>} */
export const CASE_STUDY_PACKAGING = {
  lola: {
    line: 'WhatsApp deals and pickup without drowning the floor.',
    beats: [
      {
        src: '/hero/lola-service-panels.png',
        kind: 'image',
        caption: 'Guest–staff service map',
        alt: 'Lola service blueprint panels for guest and staff loops',
      },
      {
        src: '/work/lola/motion/GuestThread.mp4',
        kind: 'video',
        caption: 'Guest thread in WhatsApp',
        alt: 'Lola guest WhatsApp conversation demo',
      },
      {
        src: '/work/lola/motion/connect/Inbox.mp4',
        kind: 'video',
        caption: 'Staff Connect inbox',
        alt: 'Lola Connect staff inbox demo',
      },
    ],
  },

  'competitor-watch': {
    line: 'Thursday chain floor readable before the order window closes.',
    beats: [
      {
        src: '/work/bodega-ops/store-floor.jpg',
        kind: 'image',
        caption: 'Thursday on the floor',
        alt: 'La Bodega store floor during retail ops',
      },
      {
        src: '/work/competitor-watch/motion/CW-07-CompetitivePricing.png',
        kind: 'image',
        caption: 'Shelf vs chain ads',
        alt: 'Competitor Watch competitive pricing screen',
      },
      {
        src: '/work/competitor-watch/motion/CW-07-CompetitivePricing.webm',
        kind: 'video',
        caption: 'Same-day pricing call',
        alt: 'Competitor Watch competitive pricing clip',
      },
    ],
  },

  'bodega-ops': {
    line: 'Registers kept selling while the product path got rebuilt.',
    beats: [
      {
        src: '/work/bodega-ops/store-floor.jpg',
        kind: 'image',
        caption: 'Launch-week floor',
        alt: 'La Bodega store floor during launch week',
      },
      {
        src: '/work/bodega-ops/scanner-app-1.jpg',
        kind: 'image',
        caption: 'Scan and normalize',
        alt: 'Scanner app for product recognition recovery',
      },
      {
        src: '/work/bodega-ops/scanner-app-2.jpg',
        kind: 'image',
        caption: 'Catalog corrections',
        alt: 'Excel export view used while correcting catalog records',
      },
    ],
  },

  'la-bodega-ops': {
    line: 'Labor, vendors, stock, kitchen, spend — without a CEO Excel hour.',
    beats: [],
  },

  code19: {
    line: 'Four audiences, one site — each with a reason to stay.',
    beats: [
      {
        src: '/work/code19/ia-sitemap.png',
        kind: 'image',
        caption: 'Card-sorted IA',
        alt: 'CODE19 information architecture sitemap',
      },
      {
        src: '/work/code19/design-system.png',
        kind: 'image',
        caption: 'Racing DNA system',
        alt: 'CODE19 visual design system',
      },
      {
        src: '/work/code19/final-screens.png',
        kind: 'image',
        caption: 'Shipped screens',
        alt: 'CODE19 final website screens collage',
      },
    ],
  },

  'timely-ne': {
    line: 'Generative video that stays inside Premiere’s cut.',
  },

  'wing-hmi': {
    line: 'Glanceable mission control — not a phone glued to the dash.',
    beats: [
      {
        src: '/work/wing-hmi/hero.png',
        kind: 'image',
        caption: 'Cabin composition',
        alt: 'WING HMI cabin hero composition',
      },
      {
        src: '/work/wing-hmi/screen-1.png',
        kind: 'image',
        caption: 'Cluster and HUD',
        alt: 'WING HMI cluster and HUD screen',
      },
      {
        src: '/work/wing-hmi/screen-3.png',
        kind: 'image',
        caption: 'Center stack state',
        alt: 'WING HMI center stack interface',
      },
    ],
  },

  'edge-ai': {
    line: 'Local-first cabin AI — control before cloud theater.',
    beats: [
      {
        src: '/work/edge-ai/screen-2.png',
        kind: 'image',
        caption: 'On-device architecture',
        alt: 'Edge AI local-first architecture diagram',
      },
      {
        src: '/work/edge-ai/screen-3.png',
        kind: 'image',
        caption: 'Driver controls',
        alt: 'Edge AI driver control screens',
      },
      {
        src: '/work/edge-ai/screen-5.png',
        kind: 'image',
        caption: 'Data boundary',
        alt: 'Edge AI privacy and data boundary screen',
      },
    ],
  },

  ocusync: {
    line: 'CRM next to the cut — one truth for production ops.',
  },

  stutax: {
    line: 'Tax filing taught in student language first.',
    beats: [
      {
        src: '/work/stutax/style.png',
        kind: 'image',
        caption: 'Whiteboard to wires',
        alt: 'StuTax whiteboard sketches and wireframe flows',
      },
      {
        src: '/work/stutax/hifi.png',
        kind: 'image',
        caption: 'Hi-fi mobile flow',
        alt: 'StuTax high-fidelity mobile screens',
      },
      {
        src: '/work/stutax/persona-arjun.png',
        kind: 'image',
        caption: 'Research persona',
        alt: 'StuTax persona board for international student Arjun',
      },
    ],
  },
}

/** @param {string | undefined} slug */
export function getCaseStudyPackaging(slug) {
  if (!slug) return null
  return CASE_STUDY_PACKAGING[slug] ?? null
}
