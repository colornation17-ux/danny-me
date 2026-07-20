/**
 * Featured folder-card contract — reusable component rules, not a full design system.
 *
 * Enforces:
 * - shared content model (summary + optional labeled metric + actions + ≤3 tags)
 * - max 2 secondary actions (no four-CTA Lola row)
 * - no connectSpine / connectPreviews on the portfolio summary card
 *
 * Interview framing: “reusable component system driven by structured project data.”
 */

/** @typedef {'Outcome' | 'Pilot signal' | 'Usage signal' | 'Testing result' | 'Design target'} MetricKind */

/** @typedef {'pilot' | 'production' | 'shipped' | 'concept'} FeaturedVariant */

export const METRIC_KINDS = /** @type {const} */ ([
  'Outcome',
  'Pilot signal',
  'Usage signal',
  'Testing result',
  'Design target',
])

export const MAX_FEATURED_TAGS = 3
export const MAX_SECONDARY_ACTIONS = 2

/**
 * @param {string | null | undefined} status
 * @returns {FeaturedVariant}
 */
export function featuredVariantFromStatus(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('pilot')) return 'pilot'
  if (s.includes('production')) return 'production'
  if (s.includes('shipped')) return 'shipped'
  return 'concept'
}

/**
 * @param {Record<string, unknown>} project
 * @param {{ showLive: boolean, liveLabel: string }} opts
 * @returns {{ href: string, label: string, kind: 'whatsapp' | 'connect' | 'live' }[]}
 */
export function buildFeaturedSecondaryActions(project, { showLive, liveLabel }) {
  /** @type {{ href: string, label: string, kind: 'whatsapp' | 'connect' | 'live' }[]} */
  const links = []

  if (typeof project.whatsappUrl === 'string' && project.whatsappUrl) {
    links.push({
      href: project.whatsappUrl,
      label: String(project.whatsappCta || 'Try Lola'),
      kind: 'whatsapp',
    })
  }
  if (typeof project.connectUrl === 'string' && project.connectUrl) {
    links.push({
      href: project.connectUrl,
      label: String(project.connectCta || 'Open Lola Connect'),
      kind: 'connect',
    })
  }
  if (showLive && links.length < MAX_SECONDARY_ACTIONS && project.liveUrl) {
    links.push({
      href: String(project.liveUrl),
      label: liveLabel,
      kind: 'live',
    })
  }

  return links.slice(0, MAX_SECONDARY_ACTIONS)
}

/**
 * @param {Record<string, any>} card
 * @param {number} index
 */
function assertFeaturedCard(card, index) {
  const label = `featured[${index}] (${card.slug || 'unknown'})`
  if (!card.slug) throw new Error(`${label}: slug is required`)
  if (!card.tabLabel) throw new Error(`${label}: tabLabel is required`)
  if (!card.displayTitle && !card.title) {
    throw new Error(`${label}: displayTitle or title is required`)
  }
  if (!card.role) throw new Error(`${label}: role is required`)
  if (!card.status) throw new Error(`${label}: status is required`)
  if (!card.timeline) throw new Error(`${label}: timeline is required`)
  const summary = card.outcome || card.blurb
  if (!summary || typeof summary !== 'string') {
    throw new Error(`${label}: summary (outcome/blurb) is required`)
  }
  if (summary.length > 220) {
    console.warn(`${label}: summary is ${summary.length} chars — target ≤145 on desktop`)
  }
  if (!Array.isArray(card.tags) || card.tags.length === 0) {
    throw new Error(`${label}: tags (1–3) are required`)
  }
  if (card.tags.length > MAX_FEATURED_TAGS) {
    throw new Error(`${label}: at most ${MAX_FEATURED_TAGS} tags`)
  }
  if (card.metric && !card.metricKind) {
    throw new Error(`${label}: metric requires metricKind`)
  }
  if (card.metricKind && !METRIC_KINDS.includes(card.metricKind)) {
    throw new Error(`${label}: invalid metricKind "${card.metricKind}"`)
  }
  if (card.connectSpine) {
    throw new Error(`${label}: connectSpine is not allowed on folder cards`)
  }
  if (card.connectPreviews) {
    throw new Error(`${label}: connectPreviews is not allowed on folder cards`)
  }
}

/**
 * Strip card-only density fields and enforce tag / metric rules.
 * Spreads still carry case-study fields for routing; spine never reaches the card UI.
 *
 * @param {Record<string, any>[]} cards
 */
export function normalizeFeaturedCards(cards) {
  return cards.map((raw, index) => {
    const {
      connectSpine: _spine,
      connectPreviews: _previews,
      ...rest
    } = raw

    const tags = Array.isArray(rest.tags)
      ? rest.tags.slice(0, MAX_FEATURED_TAGS)
      : []

    const card = {
      ...rest,
      tags,
      variant: featuredVariantFromStatus(rest.status),
    }

    if (import.meta.env?.DEV) {
      assertFeaturedCard(card, index)
    }

    return card
  })
}
