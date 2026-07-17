/**
 * One-shot: unify folio + root tokens, replace high-traffic hex with vars.
 * Safe to re-run — skips :root / .folio token definition blocks.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const cssPath = path.join(root, 'src', 'index.css')
const csPath = path.join(root, 'src', 'styles', 'case-study-system.css')

const NEW_ROOT_PREFIX = `:root {
  color-scheme: light;

  /* ── Primitive ─────────────────────────────────── */
  --white: #ffffff;
  --black: #111212;

  /* ── Semantic: surface & text ───────────────────── */
  --bg: #fdfdfd;
  --bg-elevated: var(--white);
  --bg-paper: var(--white);
  --bg-folio: #f4f7fa;
  --ink: #0d0d0d;
  --ink-soft: #12151a;
  /* Reference: #807e7e measured off madhurima.me — only 3.97:1 on this bg,
     fails AA. Darkened to #747272 (4.70:1), same warm-neutral hue/character. */
  --muted: #747272;
  --muted-cool: #5c6670;
  --line: #e4e9ee;
  --line-cool: #d5dde5;
  --grid: #d7e0ea;
  --grid-light: #e2e7ee;

  /* ── Semantic: accent ───────────────────────────── */
  --accent: #e65f2e;
  --accent-soft: #fde8df;
  /* Same hue as --accent, darkened to clear WCAG AA 4.5:1 as text/icon color
     (--accent itself only hits ~3.5:1 on white — fine for fills/borders/large
     text, not for small text). */
  --accent-text: #cd4919;
  --accent-cool: #4f7cff;
  --accent-cool-ink: #2952cc;
  --ok: #2f9b7a;
  --tone-forest: #166534;
  --tone-slate: #0f172a;
  --tone-navy: #0b1220;

  /* ── Folio aliases → single source (compat) ─────── */
  --folio-cyan: var(--accent-cool);
  --folio-cyan-ink: var(--accent-cool-ink);
  --folio-grid: var(--grid);
  --folio-panel: var(--bg-elevated);
  --folio-ink: var(--ink-soft);
  --folio-muted: var(--muted-cool);
  --folio-line: var(--line-cool);
  --folio-paper: var(--bg-paper);
  --folio-grid-light: var(--grid-light);
`

function replaceRootBlock(css) {
  const start = css.indexOf(':root {')
  if (start < 0) throw new Error(':root not found')
  // Find end of first :root — after focus-ring line historically ends before fonts…
  // Keep fonts/spacing/radius/motion from the existing :root.
  const focusIdx = css.indexOf('--focus-ring:', start)
  const afterFocus = css.indexOf(';', focusIdx)
  const rootClose = css.indexOf('\n}', afterFocus)
  if (rootClose < 0) throw new Error(':root close not found')

  const existing = css.slice(start, rootClose)
  const fontStart = existing.indexOf('  /* Type stack:')
  const typeStart = existing.indexOf('  --font-display:')
  const keepFrom = fontStart >= 0 ? fontStart : typeStart
  if (keepFrom < 0) throw new Error('font tokens not found in :root')

  const keep = existing.slice(keepFrom)
  // Rebuild focus-ring to use accent-cool
  const keepFixed = keep.replace(
    /--focus-ring:[^;]+;/,
    '--focus-ring: 0 0 0 3px color-mix(in srgb, var(--accent-cool) 55%, transparent);',
  )

  return css.slice(0, start) + NEW_ROOT_PREFIX + '\n' + keepFixed + css.slice(rootClose)
}

function stripFolioLocalTokens(css) {
  return css
    .replace(
      /\.folio \{\n(?:  --folio-[^;]+;\n)+/,
      `.folio {\n`,
    )
    .replace(
      /\.folio--fullgrid \{\n  --folio-paper:[^;]+;\n  --folio-grid-light:[^;]+;\n/,
      `.folio--fullgrid {\n`,
    )
}

/** Hex → token, longest match first. Applied outside protected blocks. */
const REPLACEMENTS = [
  [/#ffffff\b/gi, 'var(--white)'],
  [/#fff\b/gi, 'var(--white)'],
  [/#111212\b/gi, 'var(--black)'],
  [/#111\b/gi, 'var(--black)'],
  [/#4f7cff\b/gi, 'var(--accent-cool)'],
  [/#2952cc\b/gi, 'var(--accent-cool-ink)'],
  [/#d5dde5\b/gi, 'var(--line-cool)'],
  [/#12151a\b/gi, 'var(--ink-soft)'],
  [/#166534\b/gi, 'var(--tone-forest)'],
  [/#d7e0ea\b/gi, 'var(--grid)'],
  [/#e2e7ee\b/gi, 'var(--grid-light)'],
  [/#5c6670\b/gi, 'var(--muted-cool)'],
  [/#f4f7fa\b/gi, 'var(--bg-folio)'],
  [/#0f172a\b/gi, 'var(--tone-slate)'],
  [/#0b1220\b/gi, 'var(--tone-navy)'],
  [/#0d0d0d\b/gi, 'var(--ink)'],
  [/#fdfdfd\b/gi, 'var(--bg)'],
  [/#747272\b/gi, 'var(--muted)'],
  [/#e65f2e\b/gi, 'var(--accent)'],
  [/#cd4919\b/gi, 'var(--accent-text)'],
  [/#fde8df\b/gi, 'var(--accent-soft)'],
  [/#2f9b7a\b/gi, 'var(--ok)'],
  [/#e4e9ee\b/gi, 'var(--line)'],
]

function maskProtectedBlocks(css) {
  const masks = []
  let out = css
  // Protect :root { ... } first block only
  out = out.replace(/:root\s*\{[\s\S]*?\n\}/, (m) => {
    masks.push(m)
    return `/*__MASK_${masks.length - 1}__*/`
  })
  return { out, masks }
}

function unmask(css, masks) {
  return css.replace(/\/\*__MASK_(\d+)__\*\//g, (_, i) => masks[Number(i)])
}

function replaceHexOutsideRoot(css) {
  const { out, masks } = maskProtectedBlocks(css)
  let next = out
  for (const [re, rep] of REPLACEMENTS) {
    next = next.replace(re, rep)
  }
  return unmask(next, masks)
}

function fixCaseStudyFallbacks(css) {
  return css
    .replace(/var\(--line,\s*#[0-9a-fA-F]+\)/g, 'var(--line)')
    .replace(/var\(--folio-line,\s*#[0-9a-fA-F]+\)/g, 'var(--folio-line)')
    .replace(/var\(--bg-elevated,\s*#[0-9a-fA-F]+\)/g, 'var(--bg-elevated)')
}

let css = fs.readFileSync(cssPath, 'utf8')
css = replaceRootBlock(css)
css = stripFolioLocalTokens(css)
css = replaceHexOutsideRoot(css)
fs.writeFileSync(cssPath, css)

let cs = fs.readFileSync(csPath, 'utf8')
cs = fixCaseStudyFallbacks(cs)
fs.writeFileSync(csPath, cs)

const rest = css.slice(css.indexOf('}', css.indexOf(':root')) + 1)
const left = (rest.match(/#[0-9a-fA-F]{3,8}\b/g) || []).length
console.log(`unify-tokens: wrote ${path.relative(root, cssPath)}; hex outside :root ≈ ${left}`)
