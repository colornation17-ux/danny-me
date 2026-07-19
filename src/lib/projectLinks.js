/** Card / next-prev destination — prefer external case study href when set. */
export function projectDestination(project) {
  if (!project) return null
  const to = project.href || `/projects/${project.slug}`
  const external = typeof to === 'string' && /^https?:\/\//i.test(to)
  return { to, external, slug: project.slug }
}

/** Short title for cards, heroes, pager */
export function projectNavLabel(project) {
  if (!project) return ''
  return project.displayTitle || project.title || project.outcome || project.slug
}

/** Supporting line under the short title */
export function projectNavBlurb(project) {
  if (!project) return ''
  return project.outcome || project.blurb || ''
}

/**
 * Shared CTA vocabulary:
 * - View case study — open the write-up
 * - View in Lab — concept / play-only
 * - Open live site / Open live app — product URL
 * - Ask about this work — mailto from case heroes
 */
export function projectCaseCtaLabel(project) {
  if (!project) return 'View case study'
  if (project.placeholder) return 'Case study soon'
  if (project.conceptOnly) return 'View in Lab'
  return project.liveCta || 'View case study'
}

export function projectLiveCtaLabel(project) {
  if (!project) return 'Open live site'
  if (project.liveCta && /case study/i.test(project.liveCta)) {
    // liveCta reserved for case-study entry; don't reuse on product links
    return project.whatsappUrl ? 'Open live site' : 'Open live app'
  }
  if (project.slug === 'competitor-watch') return 'Open live app'
  if (project.slug === 'lola') return 'Full interactive story'
  return 'Open live site'
}

export function projectCtaLabel(project, { direction = 'next' } = {}) {
  if (!project) return direction === 'prev' ? '← Previous' : 'View case study →'
  if (direction === 'prev') return '← Previous'
  const base = projectCaseCtaLabel(project)
  return /→$/.test(base) ? base : `${base} →`
}
