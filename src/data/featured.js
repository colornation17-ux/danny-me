import { work } from './projects'

const bySlug = Object.fromEntries(work.map((p) => [p.slug, p]))

/**
 * Homepage featured strip — four shipped proof cases.
 * WING HMI + Edge AI live under /play (explorations).
 */
export const featured = [
  {
    ...bySlug['lola'],
    index: '01',
    displayTitle: 'Lola',
    company: 'La Bodega',
    folderDate: 'Jun 28, 2026',
    role: 'Design technologist',
    status: 'Live pilot',
    timeline: 'May – July 2026',
    team: 'Solo design and development',
    outcome:
      'Guest WhatsApp pickup flows + Lola Connect staff CRM — ~1,200 loyalty families; 96.3% of conversations did not require staff escalation.',
    blurb:
      'Six bilingual guest flows; staff close pickup in Connect. Flyer-grounded answers — no invented prices.',
    tags: ['WhatsApp', 'PWA', 'Staff CRM'],
    reel: '/work/lola/motion/Lola-Reel-Horizontal.mp4',
    reelPoster: '/work/lola/journey.png',
    reelAudioControl: true,
    folderFill: '#290545',
    folderInk: '#ffffff',
    folderTitleFont: 'pixelify',
    connectSpine: ['Home', 'Inbox', 'Orders', 'Tickets', 'Reminders'],
  },
  {
    ...bySlug['bodega-ops'],
    index: '02',
    displayTitle: 'Checkout Operations',
    company: 'La Bodega',
    folderDate: 'Feb 24, 2026',
    role: 'Service designer',
    status: 'Shipped',
    timeline: '72-hour recovery · store operations',
    team: 'Reported to CEO',
    outcome:
      'Led launch-week checkout recovery on Odoo: diagnosed barcode format mismatch, moved validation upstream, and shipped a scanner tool that trims codes to Datalogic EAN-13, exports Excel, and batch-imports into Odoo.',
    tags: ['Service design', 'Ops'],
    cover: '/work/bodega-ops/store-floor.jpg',
    coverAlt: 'La Bodega store floor during checkout ops recovery',
    folderFill: '#E8A030',
    folderInk: '#111212',
  },
  {
    ...bySlug['competitor-watch'],
    index: '03',
    displayTitle: 'Competitor Watch',
    company: 'La Bodega',
    folderDate: 'Jun 10, 2026',
    role: 'Design technologist',
    status: 'Shipped',
    timeline: 'Two-week MVP · Ongoing production',
    team: 'Solo design and development',
    outcome:
      'Thursday decision loop for merchandising: live competitor deals and shelf-vs-floor pricing → weekend playbook → demand bands → WhatsApp outreach → POS visit attribution (2,088 visits).',
    tags: ['Web app', 'Full-stack', 'Retail'],
    reel: '/work/competitor-watch/motion/CompetitorWatch-Reel.mp4',
    reelPoster: '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
    folderFill: '#166534',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['code19'],
    index: '04',
    displayTitle: 'CODE19 Racing',
    company: 'CODE19',
    folderDate: 'Dec 2024',
    role: 'Product designer',
    status: 'Shipped',
    timeline: 'Content strategy and SEO',
    team: null,
    outcome:
      'Website redesign for fans, sponsors, engineers, and drivers: 1,500+ new monthly sessions; organic bounce −36% (to 58.5%). Seed rose $150K→$500K alongside stronger brand presence — not claimed as sole cause.',
    tags: ['Website redesign', 'SEO'],
    cover: '/work/code19/hero-2.jpg',
    coverAlt: 'CODE19 Racing website hero — race car and brand',
    folderFill: '#111212',
    folderInk: '#ffffff',
  },
]
