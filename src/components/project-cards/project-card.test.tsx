/**
 * Vitest-ready contract tests. Prefer `npm run lint:cards` (tsx) until Vitest
 * is added to the portfolio toolchain.
 *
 * Mirrors scripts/check-project-cards.mjs.
 */
import {
  resolveLayoutMode,
  variantFromStatus,
} from './project-card.types'
import { featuredProjects } from '../../data/featuredProjects'

export function runProjectCardContractChecks() {
  if (featuredProjects.length !== 7) {
    throw new Error(`expected 7 cards, got ${featuredProjects.length}`)
  }
  const slugs = featuredProjects.map((p) => p.slug)
  const expected = [
    'lola',
    'bodega-ops',
    'la-bodega-ops',
    'competitor-watch',
    'code19',
    'wing-hmi',
    'edge-ai',
  ]
  if (slugs.join() !== expected.join()) {
    throw new Error(`unexpected slugs: ${slugs.join(',')}`)
  }
  for (const card of featuredProjects) {
    if (card.secondaryActions.length > 2) {
      throw new Error(`${card.id}: too many secondary actions`)
    }
    if (card.tags.length < 2 || card.tags.length > 3) {
      throw new Error(`${card.id}: tag count`)
    }
  }
  if (resolveLayoutMode(1280, 900) !== 'desktop') {
    throw new Error('desktop mode failed')
  }
  if (variantFromStatus('Live pilot') !== 'pilot') {
    throw new Error('variant mapping failed')
  }
  return true
}

// Allow direct execution under tsx without Vitest
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  runProjectCardContractChecks()
  console.log('project-card.test: ok')
}
