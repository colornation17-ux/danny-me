import { work } from './projects'

const bySlug = Object.fromEntries(work.map((p) => [p.slug, p]))

/**
 * Homepage featured strip, Nudge-style ordered showcase.
 * Edge AI lives in Play; shown here as a concept card.
 */
export const featured = [
  {
    ...bySlug['competitor-watch'],
    index: '01',
    displayTitle: 'Competitor Watch',
    company: 'La Bodega',
    folderDate: 'Jun 10, 2026',
    outcome:
      'Solo React+Python: Flipp deals + combos, shelf-vs-floor pricing, market trends, weekend playbook, forecast, RFM visit-rhythm nudges, WhatsApp→POS (2,088 visits)',
    tags: ['Web app', 'Full-stack', 'Retail'],
    reel: '/work/competitor-watch/motion/CompetitorWatch-Reel.mp4',
    folderFill: '#166534',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['lola'],
    index: '02',
    displayTitle: 'Lola',
    company: 'La Bodega',
    folderDate: 'Jun 28, 2026',
    outcome:
      'Designed flows + built Lola Connect solo (Home · Inbox · Orders · Tickets · Reminders): bilingual deals, buttons-first pickup, reminders, staff handoff (~1,200 loyalty · 96.3% closed without staff)',
    blurb:
      'Six guest WhatsApp flows; staff run the Connect PWA spine. Flyer-grounded answers — no invented prices. Research-backed from real threads before ship.',
    tags: ['WhatsApp', 'PWA', 'Full-stack'],
    reel: '/work/lola/motion/GuestThread.mp4',
    reelPortrait: true,
    folderFill: '#290545',
    folderInk: '#ffffff',
    folderTitleFont: 'pixelify',
    connectSpine: ['Home', 'Inbox', 'Orders', 'Tickets', 'Reminders'],
    connectPreviews: [
      { label: 'Inbox', src: '/work/lola/motion/connect/Inbox.mp4' },
      { label: 'Orders', src: '/work/lola/motion/connect/Orders.mp4' },
    ],
  },
  {
    ...bySlug['bodega-ops'],
    index: '03',
    displayTitle: 'Checkout ops',
    company: 'La Bodega',
    folderDate: 'Feb 24, 2026',
    outcome:
      'Ops recovery + tool: barcode/receiving pipeline and scanner app. Checkout <30s, SKU recognition ~100% in 72 hrs',
    tags: ['Service design', 'Ops'],
    cover: '/work/bodega-ops/store-floor.jpg',
    coverAlt: 'La Bodega store floor during checkout ops recovery',
  },
  {
    ...bySlug['code19'],
    index: '04',
    displayTitle: 'CODE19 Racing',
    company: 'CODE19',
    folderDate: 'Dec 2024',
    outcome:
      'Website redesign: UI/UX, IA, content & SEO for fans, sponsors, engineers, and drivers. 1,500+ monthly sessions · −36% organic bounce · seed $150K→$500K',
    tags: ['Website redesign', 'SEO'],
    cover: '/work/code19/hero-2.jpg',
    coverAlt: 'CODE19 Racing website hero — race car and brand',
    folderFill: '#111212',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['wing-hmi'],
    index: '05',
    displayTitle: 'Wing Automotive HMI',
    company: 'Wing',
    folderDate: 'Aug 18, 2025',
    outcome:
      'Concept HMI: cluster, HUD, and voice prototype. 92% task success in simulator (2-week sprint)',
    tags: ['HMI', 'Concept'],
    reel: '/work/wing-hmi/demo-1.mp4',
    cover: '/work/wing-hmi/hero.png',
    coverAlt: 'Wing automotive HMI cluster and HUD concept',
    folderFill: '#EA580C',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['edge-ai'],
    index: '06',
    displayTitle: 'WING Edge AI',
    company: 'Wing',
    folderDate: 'Nov 4, 2025',
    outcome:
      'Concept: on-device vehicle AI UX: local inference, driver data controls (target <20ms edge latency)',
    tags: ['Edge AI', 'Concept'],
    reel: '/work/edge-ai/demo-1.mp4',
    cover: '/work/edge-ai/hero.jpg',
    coverAlt: 'Wing Edge AI vehicle concept',
    folderFill: '#0891B2',
    folderInk: '#ffffff',
  },
]
