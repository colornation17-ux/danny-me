/**
 * Featured project-card contract (portfolio component system — not a full DS).
 */

export type MetricKind =
  | 'Outcome'
  | 'Pilot signal'
  | 'Usage signal'
  | 'Testing result'
  | 'Design target'

export type ProjectStatus =
  | 'Live pilot'
  | 'In production'
  | 'Shipped'
  | 'Independent concept'
  | 'Concept project'

export type ProjectVariant = 'pilot' | 'production' | 'shipped' | 'concept'

export type LayoutMode = 'desktop' | 'tablet' | 'mobile'

export type ProjectAction = {
  label: string
  href: string
  external?: boolean
}

export type ProjectMetric = {
  kind: MetricKind
  value: string
}

export type ProjectMedia =
  | {
      kind: 'video'
      src: string
      poster?: string
      alt: string
      audioControl?: boolean
    }
  | {
      kind: 'image'
      src: string
      alt: string
    }
  | {
      kind: 'motion'
      slug: string
      alt: string
    }

export type FeaturedProjectCard = {
  id: string
  slug: string
  indexLabel: string
  tabLabel: string
  tabLabelCompact?: string
  title: string
  role: string
  organization: string | null
  status: ProjectStatus | string
  timeline: string
  team: string | null
  date: string
  summary: string
  metric?: ProjectMetric
  primaryAction: ProjectAction
  secondaryActions: ProjectAction[]
  tags: [string, string] | [string, string, string]
  media: ProjectMedia
  theme: {
    fill: string
    ink: string
    titleFont?: string
  }
  variant: ProjectVariant
  /** Case-study / routing fields kept for pager compatibility */
  caseStudyPath: string
}

export const METRIC_KINDS: readonly MetricKind[] = [
  'Outcome',
  'Pilot signal',
  'Usage signal',
  'Testing result',
  'Design target',
] as const

export const MAX_TAGS = 3
export const MAX_SECONDARY_ACTIONS = 2
export const TAB_LABEL_MAX = 18
export const SUMMARY_MAX = 220
export const SUMMARY_TARGET_MAX = 145

export function variantFromStatus(status: string): ProjectVariant {
  const s = status.toLowerCase()
  if (s.includes('pilot')) return 'pilot'
  if (s.includes('production')) return 'production'
  if (s.includes('shipped')) return 'shipped'
  return 'concept'
}

export function resolveLayoutMode(
  width: number,
  height: number,
): LayoutMode {
  // Handoff: short height always non-sticky; desktop only ≥1200 and ≥720 tall
  if (height < 680 || width < 768) return 'mobile'
  if (width < 1200 || height < 720) return 'tablet'
  return 'desktop'
}

export function assertFeaturedProjectCard(
  card: FeaturedProjectCard,
  index: number,
): void {
  const label = `featured[${index}] (${card.id})`
  if (!card.id || !card.slug) throw new Error(`${label}: id/slug required`)
  if (!card.tabLabel || card.tabLabel.length > TAB_LABEL_MAX) {
    throw new Error(
      `${label}: tabLabel required and ≤${TAB_LABEL_MAX} characters`,
    )
  }
  if (!card.title || !card.role || !card.status || !card.timeline) {
    throw new Error(`${label}: title/role/status/timeline required`)
  }
  if (!card.summary || card.summary.length > SUMMARY_MAX) {
    throw new Error(`${label}: summary required and ≤${SUMMARY_MAX} chars`)
  }
  if (!card.primaryAction?.href || !card.primaryAction?.label) {
    throw new Error(`${label}: primaryAction required`)
  }
  if (card.secondaryActions.length > MAX_SECONDARY_ACTIONS) {
    throw new Error(`${label}: max ${MAX_SECONDARY_ACTIONS} secondary actions`)
  }
  if (card.tags.length < 2 || card.tags.length > MAX_TAGS) {
    throw new Error(`${label}: 2–${MAX_TAGS} tags required`)
  }
  if (card.metric && !METRIC_KINDS.includes(card.metric.kind)) {
    throw new Error(`${label}: invalid metric kind`)
  }
}
