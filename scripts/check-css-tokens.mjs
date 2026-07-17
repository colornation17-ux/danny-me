/**
 * Fail if chrome CSS (index + case-study system) uses raw hex outside :root.
 * Mock/product UI in motion-previews.css is warned, not failed.
 *
 * Usage: node scripts/check-css-tokens.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

const STRICT = [
  'src/index.css',
  'src/styles/case-study-system.css',
].map((f) => path.join(root, f))

const WARN = ['src/styles/motion-previews.css'].map((f) => path.join(root, f))

/** Hex allowed outside :root — brand one-offs / stickers / third-party / mocks. */
const ALLOW = new Set(
  [
    // Stickers & hero
    '#ff4d7a',
    '#ecb22e',
    '#2eb67d',
    '#e01e5a',
    '#ffd166',
    '#fff3a3',
    '#e6d56a',
    // Third-party brands
    '#0077b5', // LinkedIn
    '#1d9bf0', // X/Twitter
    '#25d366', // WhatsApp
    '#075e54', // WhatsApp dark
    '#36c5f0', // Slack-ish
    // Folio / UI chrome one-offs still migrating
    '#043844',
    '#042f38',
    '#f5f0eb',
    '#f4f1ea',
    '#ececec',
    '#e8e8e8',
    '#e9e9e9',
    '#e6e6e6',
    '#2a3038',
    '#0f1419',
    '#536471',
    '#5a6570',
    '#6a7280',
    '#6b7684',
    '#6b7a8a',
    '#0b0b0b',
    '#1a1a1a',
    '#333333',
    '#333',
    '#555555',
    '#555',
    '#666666',
    '#666',
    '#888888',
    '#888',
    '#aaaaaa',
    '#aaa',
    '#000000',
    '#000',
    '#f0f2f5',
    '#f7f9fb',
    '#f7f8fa',
    '#f3f5f8',
    '#f3f5f7',
    '#f4f4f4',
    '#f4f6f8',
    '#f4f7f9',
    '#f4f7f6',
    '#f8fafc',
    '#f9f9f9',
    '#eef1f4',
    '#eef6fa',
    '#eff3f4',
    '#e2e8f0',
    '#dbe4ee',
    '#d5dbe3',
    '#dfe3e8',
    '#e8eef4',
    '#4a5560',
    '#3d4652',
    '#445',
    '#444455',
    '#767676',
    '#e0245e',
    '#b8154a',
    '#1ea8d1',
    '#0b7fab',
    '#3d6be8',
    '#2440b8',
    '#e09a00',
    '#d49e1e',
    '#25925f',
    '#2f6f52',
    '#64748b',
    '#94a3b8',
    '#1e293b',
    '#334155',
    '#475569',
    '#cbd5e1',
    '#f1f5f9',
    '#f1f5f4',
    '#1f2a33',
    '#32404f',
    '#3d8b6a',
    '#7dcea0',
    '#dcfce7',
    '#b45309',
    '#92400e',
    '#efeae2',
    '#1fa97a',
    '#1d4ed8',
    '#2563eb',
    '#0f766e',
    '#5b4cdb',
    '#3a2c1a',
    '#2a1d10',
    '#fbecc4',
    '#ecd8ae',
    '#f8d7c4',
    '#9ec5e8',
    '#2f4a63',
    '#c9b8a0',
    '#b9c5d1',
    '#8fa0b0',
    '#fffcf7',
    '#ddd6cb',
    '#e7f9ff',
    '#ffd0dc',
    '#fff3',
    '#ffffff33',
    '#4a4318',
    '#1f2937',
    '#f4c27a',
    '#e8a030',
    '#d9fdd3',
    '#eff6ff',
    '#bfdbfe',
    '#1e40af',
    '#f59e0b',
    '#d97706',
    '#fffbeb',
    '#fde68a',
    '#dbeafe',
    '#fef3c7',
    '#fee2e2',
    '#b91c1c',
  ].map((h) => h.toLowerCase()),
)

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function stripRootBlocks(css) {
  return css.replace(/:root\s*\{[\s\S]*?\n\}/g, '')
}

function normalizeHex(h) {
  let x = h.toLowerCase()
  if (x.length === 4) {
    x = `#${x[1]}${x[1]}${x[2]}${x[2]}${x[3]}${x[3]}`
  }
  if (x.length === 5) {
    // #rgba
    x = `#${x[1]}${x[1]}${x[2]}${x[2]}${x[3]}${x[3]}${x[4]}${x[4]}`
  }
  return x
}

function collect(file) {
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf8')
  const body = stripRootBlocks(stripComments(raw))
  const found = []
  const re = /#([0-9a-fA-F]{3,8})\b/g
  let m
  while ((m = re.exec(body))) {
    const short = `#${m[1]}`.toLowerCase()
    const hex = normalizeHex(short)
    if (ALLOW.has(hex) || ALLOW.has(short)) continue
    found.push(short)
  }
  return found
}

function summarize(list) {
  const byHex = new Map()
  for (const h of list) byHex.set(h, (byHex.get(h) || 0) + 1)
  return [...byHex.entries()].sort((a, b) => b[1] - a[1])
}

const strictHits = STRICT.flatMap(collect)
const warnHits = WARN.flatMap(collect)

if (warnHits.length) {
  console.warn('css-token-check: warn — motion mock hex still outside tokens:')
  for (const [hex, n] of summarize(warnHits).slice(0, 12)) {
    console.warn(`  ${n}×  ${hex}`)
  }
  if (summarize(warnHits).length > 12) {
    console.warn(`  … +${summarize(warnHits).length - 12} more`)
  }
}

if (strictHits.length) {
  console.error('css-token-check: fail — raw hex in chrome CSS (not allowlisted):\n')
  for (const [hex, n] of summarize(strictHits)) {
    console.error(`  ${n}×  ${hex}`)
  }
  console.error(
    `\n${strictHits.length} occurrence(s). Move to :root or allowlist in scripts/check-css-tokens.mjs.`,
  )
  process.exit(1)
}

console.log('css-token-check: ok — chrome CSS uses tokens (or allowlisted one-offs)')
