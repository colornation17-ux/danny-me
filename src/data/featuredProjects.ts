import { lab, work } from './projects'
import {
  assertFeaturedProjectCard,
  type FeaturedProjectCard,
  type ProjectAction,
  type ProjectMedia,
  variantFromStatus,
} from '../components/project-cards/project-card.types'

const bySlug = Object.fromEntries(
  [...work, ...lab].map((p) => [p.slug, p]),
)

function mediaVideo(
  src: string,
  poster: string | undefined,
  alt: string,
  audioControl = false,
): ProjectMedia {
  return { kind: 'video', src, poster, alt, audioControl }
}

function mediaImage(src: string, alt: string): ProjectMedia {
  return { kind: 'image', src, alt }
}

function primary(
  label: string,
  href: string,
  external = false,
): ProjectAction {
  return { label, href, external }
}

function secondary(label: string, href: string): ProjectAction {
  return { label, href, external: true }
}

/**
 * Frozen featured-card content (six projects).
 * Case-study bodies still live in projects.js / lab; this is the card contract.
 */
export const featuredProjects: FeaturedProjectCard[] = [
  {
    id: 'lola',
    slug: 'lola',
    indexLabel: '01',
    tabLabel: 'Lola',
    title: 'Lola',
    role: 'Design technologist',
    organization: 'La Bodega',
    status: 'Live pilot',
    timeline: 'May–July 2026',
    team: 'Solo product design and development',
    date: 'Jun 28, 2026',
    summary:
      'Bilingual WhatsApp shopping and pickup connected to a staff workspace for orders, tickets and human handoff.',
    metric: {
      kind: 'Pilot signal',
      value: '96.3% of valid conversations did not require staff escalation.',
    },
    primaryAction: primary('View case study', '/projects/lola'),
    secondaryActions: [
      secondary('Try Lola', bySlug['lola'].whatsappUrl),
      secondary('Open staff app', bySlug['lola'].connectUrl),
    ],
    tags: ['Conversational UX', 'Service design', 'PWA'],
    media: mediaVideo(
      '/work/lola/motion/Lola-Reel-Horizontal.mp4',
      '/work/lola/journey.png',
      'Lola preview',
      true,
    ),
    theme: { fill: '#290545', ink: '#ffffff', titleFont: 'pixelify' },
    variant: 'pilot',
    caseStudyPath: '/projects/lola',
  },
  {
    id: 'bodega-ops',
    slug: 'bodega-ops',
    indexLabel: '02',
    tabLabel: 'Checkout Ops',
    title: 'Checkout Operations',
    role: 'Service designer',
    organization: 'La Bodega',
    status: 'Shipped',
    timeline: '72-hour recovery',
    team: 'Store operations team',
    date: 'Feb 24, 2026',
    summary:
      'Redesigned receiving and built a barcode-normalization tool to prevent product failures from reaching checkout.',
    metric: {
      kind: 'Outcome',
      value: 'Item correction fell from 2–5 minutes to under 30 seconds.',
    },
    primaryAction: primary('View case study', '/projects/bodega-ops'),
    secondaryActions: [],
    tags: ['Service design', 'Retail operations', 'Workflow automation'],
    media: mediaImage(
      '/work/bodega-ops/store-floor.jpg',
      'La Bodega store floor during checkout ops recovery',
    ),
    theme: { fill: '#E8A030', ink: '#111212' },
    variant: 'shipped',
    caseStudyPath: '/projects/bodega-ops',
  },
  {
    id: 'competitor-watch',
    slug: 'competitor-watch',
    indexLabel: '03',
    tabLabel: 'Competitor Watch',
    tabLabelCompact: 'Competitors',
    title: 'Competitor Watch',
    role: 'Design technologist',
    organization: 'La Bodega',
    status: 'In production',
    timeline: 'Two-week MVP',
    team: 'Solo product design and development',
    date: 'Jun 10, 2026',
    summary:
      'Turns competitor promotions, store sales, weather and customer behavior into weekly merchandising decisions.',
    metric: {
      kind: 'Usage signal',
      value: '2,088 attributed POS visits from WhatsApp outreach.',
    },
    primaryAction: primary('View case study', '/projects/competitor-watch'),
    secondaryActions: [
      secondary('Open live app', bySlug['competitor-watch'].liveUrl),
    ],
    tags: ['Decision support', 'Retail intelligence', 'Full-stack'],
    media: mediaVideo(
      '/work/competitor-watch/motion/CompetitorWatch-Reel.mp4',
      '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
      'Competitor Watch preview',
    ),
    theme: { fill: '#166534', ink: '#ffffff' },
    variant: 'production',
    caseStudyPath: '/projects/competitor-watch',
  },
  {
    id: 'code19',
    slug: 'code19',
    indexLabel: '04',
    tabLabel: 'CODE19',
    title: 'CODE19 Racing',
    role: 'Product designer and UX engineer',
    organization: 'CODE19 Racing',
    status: 'Shipped',
    timeline: 'Three-month launch',
    team: 'Design, engineering and leadership',
    date: 'Dec 2024',
    summary:
      'Reframed a technical racing site around four audiences through new information architecture, content and SEO.',
    metric: {
      kind: 'Outcome',
      value: '1,500+ new monthly sessions · 36% lower organic bounce.',
    },
    primaryAction: primary('View case study', '/projects/code19'),
    secondaryActions: [secondary('Visit live site', bySlug['code19'].liveUrl)],
    tags: ['Information architecture', 'Content strategy', 'SEO'],
    media: mediaImage(
      '/work/code19/hero-2.jpg',
      'CODE19 Racing website hero — race car and brand',
    ),
    theme: { fill: '#111212', ink: '#ffffff' },
    variant: 'shipped',
    caseStudyPath: '/projects/code19',
  },
  {
    id: 'wing-hmi',
    slug: 'wing-hmi',
    indexLabel: '05',
    tabLabel: 'HMI',
    title: 'WING Automotive HMI',
    role: 'Product designer',
    organization: null,
    status: 'Independent concept',
    timeline: 'Two-week design sprint',
    team: null,
    date: 'Aug 18, 2025',
    summary:
      'Explored how cluster, HUD and voice interfaces could reduce attention shifts during common driving tasks.',
    metric: {
      kind: 'Testing result',
      value: '92% task success in simulator testing.',
    },
    primaryAction: primary('View case study', '/projects/wing-hmi'),
    secondaryActions: [],
    tags: ['Automotive UX', 'HMI', 'Interaction design'],
    media: mediaVideo(
      '/work/wing-hmi/demo-1.mp4',
      '/work/wing-hmi/hero.png',
      'WING automotive HMI cluster and HUD concept',
    ),
    theme: { fill: '#7C5CFF', ink: '#ffffff' },
    variant: 'concept',
    caseStudyPath: '/projects/wing-hmi',
  },
  {
    id: 'edge-ai',
    slug: 'edge-ai',
    indexLabel: '06',
    tabLabel: 'Edge AI',
    title: 'WING Edge AI',
    role: 'Product designer',
    organization: null,
    status: 'Independent concept',
    timeline: 'November 2025',
    team: null,
    date: 'Nov 2025',
    summary:
      'Explored on-device vehicle AI through local inference, transparent data controls and responsive in-car interactions.',
    metric: {
      kind: 'Design target',
      value: 'Under 20 ms edge-inference latency.',
    },
    primaryAction: primary('View concept', '/projects/edge-ai'),
    secondaryActions: [],
    tags: ['Edge AI', 'Data controls', 'Automotive UX'],
    media: mediaVideo(
      '/work/edge-ai/demo-1.mp4',
      '/work/edge-ai/hero.jpg',
      'WING Edge AI vehicle concept',
    ),
    theme: { fill: '#0891B2', ink: '#111212' },
    variant: 'concept',
    caseStudyPath: '/projects/edge-ai',
  },
].map((card, index) => {
  const next = {
    ...card,
    variant: variantFromStatus(String(card.status)),
    secondaryActions: card.secondaryActions.slice(0, 2),
    tags: card.tags.slice(0, 3) as FeaturedProjectCard['tags'],
  }
  assertFeaturedProjectCard(next, index)
  return next
})

/**
 * Homepage / pager compatibility layer — spreads case-study records onto card fields.
 */
export const featured = featuredProjects.map((card) => {
  const base = bySlug[card.slug] || {}
  return {
    ...base,
    slug: card.slug,
    index: card.indexLabel,
    tabLabel: card.tabLabel,
    tabLabelCompact: card.tabLabelCompact,
    displayTitle: card.title,
    company: card.organization,
    folderDate: card.date,
    role: card.role,
    status: card.status,
    timeline: card.timeline,
    team: card.team,
    outcome: card.summary,
    blurb: card.summary,
    metricKind: card.metric?.kind,
    metric: card.metric?.value,
    tags: [...card.tags],
    folderFill: card.theme.fill,
    folderInk: card.theme.ink,
    folderTitleFont: card.theme.titleFont,
    caseCta: card.primaryAction.label,
    liveCta: card.secondaryActions.find((a) => /live|visit/i.test(a.label))
      ?.label,
    variant: card.variant,
    // Card system view model
    card,
  }
})
