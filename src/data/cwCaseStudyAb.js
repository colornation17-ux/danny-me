/**
 * Competitor Watch case-study A/B.
 *
 * Shareable test links (always live, not “attached”):
 *   /projects/competitor-watch-a  → classic (video / pre-rewrite)
 *   /projects/competitor-watch-b  → fixture-mock rewrite
 *
 * Portfolio attach (featured card + /projects/competitor-watch):
 *   Flip CW_CASE_STUDY_PRIMARY only when you want to promote a winner.
 *   Keep 'a' while A/B testing so home still opens classic.
 */
export const CW_CASE_STUDY_PRIMARY = /** @type {'a' | 'b'} */ ('a')

export const CW_AB_PATHS = {
  a: '/projects/competitor-watch-a',
  b: '/projects/competitor-watch-b',
}

/** Canonical portfolio URL — always the alias that follows PRIMARY. */
export const CW_CASE_STUDY_PATH = '/projects/competitor-watch'

/**
 * @param {string | undefined} slug
 * @returns {{ variant: 'a' | 'b' } | null}
 */
export function resolveCwCaseStudyRoute(slug) {
  if (slug === 'competitor-watch-a') return { variant: 'a' }
  if (slug === 'competitor-watch-b') return { variant: 'b' }
  if (slug === 'competitor-watch') return { variant: CW_CASE_STUDY_PRIMARY }
  return null
}

export function cwPrimaryVariantPath() {
  return CW_AB_PATHS[CW_CASE_STUDY_PRIMARY]
}
