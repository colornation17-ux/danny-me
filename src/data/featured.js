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
    tabLabel: 'Lola',
    displayTitle: 'Lola',
    company: 'La Bodega',
    folderDate: 'Jun 28, 2026',
    role: 'Design technologist',
    status: 'Live pilot',
    timeline: 'May – July 2026',
    team: 'Solo design and build',
    outcome:
      'Bilingual WhatsApp shopping and pickup, connected to a staff workspace for orders, tickets and human handoff. 96.3% of conversations did not require staff escalation.',
    blurb:
      'Bilingual WhatsApp shopping and pickup, connected to a staff workspace for orders, tickets and human handoff. 96.3% of conversations did not require staff escalation.',
    tags: ['Conversational AI', 'Service design', 'PWA'],
    reel: '/work/lola/motion/Lola-Reel-Horizontal.mp4',
    reelPoster: '/work/lola/journey.png',
    reelAudioControl: true,
    folderFill: '#290545',
    folderInk: '#ffffff',
    folderTitleFont: 'pixelify',
    connectSpine: ['Home', 'Inbox', 'Orders', 'Tickets', 'Reminders'],
    whatsappCta: 'Try Lola',
    connectCta: 'Open staff app',
  },
  {
    ...bySlug['bodega-ops'],
    index: '02',
    tabLabel: 'Checkout Ops',
    displayTitle: 'Checkout Operations',
    company: 'La Bodega',
    folderDate: 'Feb 24, 2026',
    role: 'Service designer',
    status: 'Shipped',
    timeline: '72-hour launch recovery',
    team: 'Store operations team',
    outcome:
      'Recovered a live checkout failure by redesigning receiving and building a barcode-normalization tool that cut product-fix time from 2–5 minutes to under 30 seconds.',
    blurb:
      'Recovered a live checkout failure by redesigning receiving and building a barcode-normalization tool that cut product-fix time from 2–5 minutes to under 30 seconds.',
    tags: ['Service design', 'Retail operations', 'Workflow automation'],
    cover: '/work/bodega-ops/store-floor.jpg',
    coverAlt: 'La Bodega store floor during checkout ops recovery',
    folderFill: '#E8A030',
    folderInk: '#111212',
    caseCta: 'View recovery case study',
  },
  {
    ...bySlug['competitor-watch'],
    index: '03',
    tabLabel: 'Market Watch',
    displayTitle: 'Competitor Watch',
    company: 'La Bodega',
    folderDate: 'Jun 10, 2026',
    role: 'Design technologist',
    status: 'In production',
    timeline: 'Two-week MVP',
    team: 'Solo design and build',
    outcome:
      'Decision-support platform combining competitor promotions, store sales, weather and customer behavior into weekly merchandising actions.',
    blurb:
      'Decision-support platform combining competitor promotions, store sales, weather and customer behavior into weekly merchandising actions.',
    metric: 'WhatsApp-to-POS attribution across 2,088 recorded visits.',
    tags: ['Decision support', 'Retail intelligence', 'Full-stack'],
    reel: '/work/competitor-watch/motion/CompetitorWatch-Reel.mp4',
    reelPoster: '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
    folderFill: '#166534',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['code19'],
    index: '04',
    tabLabel: 'CODE19',
    displayTitle: 'CODE19 Racing',
    company: 'CODE19 Racing',
    folderDate: 'Dec 2024',
    role: 'Product designer',
    status: 'Shipped',
    timeline: 'October – December 2024',
    team: 'Cross-functional team',
    outcome:
      'Redesigned the site’s information architecture, content and SEO to better serve fans, sponsors, engineers and prospective partners.',
    blurb:
      'Redesigned the site’s information architecture, content and SEO to better serve fans, sponsors, engineers and prospective partners.',
    metric: '1,500+ monthly sessions · 36% lower organic bounce rate',
    tags: ['Information architecture', 'Content strategy', 'SEO'],
    cover: '/work/code19/hero-2.jpg',
    coverAlt: 'CODE19 Racing website hero — race car and brand',
    folderFill: '#111212',
    folderInk: '#ffffff',
  },
]
