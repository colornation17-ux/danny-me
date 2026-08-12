import { lab, work } from './projects'
import { CW_HERO_PROOF } from './cwMetrics'
import { CW_CASE_STUDY_PATH } from './cwCaseStudyAb'
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
 * Frozen featured-card content (seven projects).
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
      value:
        '96.3% of eligible conversations did not require staff escalation.',
    },
    primaryAction: primary('View case study', '/projects/lola'),
    secondaryActions: [
      secondary('Try Lola', bySlug['lola'].whatsappUrl),
      secondary('Open Lola Connect', bySlug['lola'].connectUrl),
    ],
    tags: ['Conversational UX', 'Service design', 'PWA'],
    media: mediaVideo(
      '/work/lola/motion/Lola-Reel-Horizontal.mp4',
      undefined,
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
    tabLabelCompact: 'Checkout',
    title: 'Checkout Ops',
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
    id: 'la-bodega-ops',
    slug: 'la-bodega-ops',
    indexLabel: '03',
    tabLabel: 'La Bodega Ops',
    tabLabelCompact: 'Ops',
    title: 'La Bodega Ops',
    role: 'Product designer',
    organization: 'La Bodega',
    status: 'Live pilot',
    timeline: 'Q1–Q2 2026',
    team: 'Solo product design and development',
    date: 'Jul 15, 2026',
    summary:
      'Designed the floor system that replaced spreadsheet ops at the supermarket — purchasing, receiving, and shift control on phone.',
    metric: {
      kind: 'Pilot signal',
      value: 'Live at the supermarket. One store. Solo design and build.',
    },
    primaryAction: primary('View case study', '/projects/la-bodega-ops'),
    secondaryActions: [
      secondary('Try the live app', bySlug['la-bodega-ops'].liveUrl),
    ],
    tags: ['Product design', 'Service design', 'PWA'],
    media: mediaImage(
      '/work/la-bodega-ops/hero.png',
      'La Bodega Ops — role homes on phone for staff, manager, and admin',
    ),
    theme: { fill: '#9F1239', ink: '#ffffff' },
    variant: 'pilot',
    caseStudyPath: '/projects/la-bodega-ops',
  },
  {
    id: 'competitor-watch',
    slug: 'competitor-watch',
    indexLabel: '04',
    tabLabel: 'Competitor Watch',
    tabLabelCompact: 'CW',
    title: 'Competitor Watch',
    role: 'Design technologist',
    organization: 'La Bodega',
    status: 'In production',
    timeline: 'Two-week MVP',
    team: 'Solo product design and development',
    date: 'Jun 10, 2026',
    summary:
      'Thursday order app for La Bodega: chain ads, weekend plan, WhatsApp→register.',
    metric: {
      kind: 'Usage signal',
      value: CW_HERO_PROOF,
    },
    primaryAction: primary('View case study', CW_CASE_STUDY_PATH),
    secondaryActions: [
      secondary('Open live app', bySlug['competitor-watch'].liveUrl),
    ],
    tags: ['Decision support', 'Retail intelligence', 'Full-stack'],
    media: mediaVideo(
      '/work/competitor-watch/motion/CW-02-CompetitorDeals.mp4',
      '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
      'Competitor Watch — competitor deals preview',
    ),
    theme: { fill: '#166534', ink: '#ffffff' },
    variant: 'production',
    caseStudyPath: CW_CASE_STUDY_PATH,
  },
  {
    id: 'code19',
    slug: 'code19',
    indexLabel: '05',
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
    indexLabel: '06',
    tabLabel: 'HMI',
    title: 'WING HMI',
    role: 'Product designer',
    organization: 'WING',
    status: 'Independent concept',
    timeline: 'Two-week design sprint',
    team: null,
    date: 'Aug 18, 2025',
    summary:
      'Explored how cluster, HUD and voice interfaces could reduce attention shifts during common driving tasks.',
    metric: {
      kind: 'Testing result',
      value: 'High task success in simulator testing.',
    },
    primaryAction: primary('View case study', '/projects/wing-hmi'),
    secondaryActions: [],
    tags: ['Automotive UX', 'HMI', 'Interaction design'],
    media: mediaVideo(
      '/work/wing-hmi/demo-1.mp4',
      '/work/wing-hmi/hero.png',
      'WING automotive HMI cluster and HUD concept',
    ),
    theme: { fill: '#5538D4', ink: '#ffffff' },
    variant: 'concept',
    caseStudyPath: '/projects/wing-hmi',
  },
  {
    id: 'edge-ai',
    slug: 'edge-ai',
    indexLabel: '07',
    tabLabel: 'Edge AI',
    title: 'WING Edge AI',
    role: 'Product designer',
    organization: 'WING',
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
    theme: { fill: '#9A3412', ink: '#ffffff' },
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
 * Homepage / FolderStack compatibility layer — spreads case-study records onto card fields.
 * FolderStack reads `reel` / `cover` / `reelPoster`, NOT `card.media`. Mapping those
 * is required or Lola/CW fall through to the wrong motion-preview mocks.
 */
export const featured = featuredProjects.map((card) => {
  const base = bySlug[card.slug] || {}
  const media = card.media
  const isVideo = media?.kind === 'video'
  const isImage = media?.kind === 'image'

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
    whatsappCta: card.secondaryActions.find((a) =>
      /try lola|whatsapp/i.test(a.label),
    )?.label,
    connectCta: card.secondaryActions.find((a) =>
      /staff|connect/i.test(a.label),
    )?.label,
    variant: card.variant,
    // Media — must win over base + motion-preview fallback
    reel: isVideo ? media.src : undefined,
    // Only an explicit poster — never fall back to cover PNG under the video
    reelPoster: isVideo && media.poster ? media.poster : undefined,
    reelAudioControl: isVideo ? Boolean(media.audioControl) : undefined,
    reelPortrait: undefined,
    cover: isImage ? media.src : isVideo ? undefined : base.cover,
    coverAlt: media?.alt || base.coverAlt,
    card,
  }
})
