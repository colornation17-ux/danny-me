/**
 * Project-card contract checks (no Vitest required).
 * Usage: npx tsx scripts/check-project-cards.mjs
 */
import assert from 'node:assert/strict'
import { featuredProjects } from '../src/data/featuredProjects.ts'
import {
  assertFeaturedProjectCard,
  MAX_SECONDARY_ACTIONS,
  MAX_TAGS,
  resolveLayoutMode,
  SUMMARY_TARGET_MAX,
  TAB_LABEL_MAX,
  variantFromStatus,
} from '../src/components/project-cards/project-card.types.ts'

assert.equal(featuredProjects.length, 7, 'seven featured projects')

assert.deepEqual(
  featuredProjects.map((p) => p.slug),
  [
    'lola',
    'bodega-ops',
    'la-bodega-ops',
    'competitor-watch',
    'code19',
    'wing-hmi',
    'edge-ai',
  ],
  'featured order including La Bodega Ops',
)

for (const [index, card] of featuredProjects.entries()) {
  assertFeaturedProjectCard(card, index)
  assert.ok(card.tabLabel.length <= TAB_LABEL_MAX, `${card.id} tabLabel`)
  assert.ok(
    card.secondaryActions.length <= MAX_SECONDARY_ACTIONS,
    `${card.id} secondary cap`,
  )
  assert.ok(card.tags.length <= MAX_TAGS, `${card.id} tag cap`)
  assert.ok(card.primaryAction?.href, `${card.id} primary`)
  assert.equal(card.variant, variantFromStatus(String(card.status)))
  if (card.summary.length > SUMMARY_TARGET_MAX) {
    console.warn(
      `[warn] ${card.id} summary ${card.summary.length}ch > target ${SUMMARY_TARGET_MAX}`,
    )
  }
}

assert.equal(resolveLayoutMode(375, 800), 'mobile')
assert.equal(resolveLayoutMode(900, 800), 'tablet')
assert.equal(resolveLayoutMode(1280, 900), 'desktop')
assert.equal(resolveLayoutMode(1440, 700), 'desktop')
assert.equal(resolveLayoutMode(1440, 600), 'mobile')

console.log('project-card contract: ok (%d cards)', featuredProjects.length)
