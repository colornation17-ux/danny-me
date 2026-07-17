# AGENTS

Project-specific guidance for AI coding agents.

## Stack

- React 19 + Vite portfolio site (`src/`)
- Styling: custom CSS in `src/index.css` (+ `src/styles/case-study-system.css`, `src/styles/motion-previews.css`)
- Motion: GSAP / Motion where needed
- Deploy: `npm run deploy:prod` → Vercel production

**Astryx** (`@astryxdesign/*`) is **opt-in only** via `src/providers/AstryxProvider.jsx`. Do **not** wrap the whole app or import Astryx global CSS in `main.jsx` — it breaks light-theme ink under OS dark mode. Ignore any Astryx “no div / AppShell” rules for this repo.

## Design tokens

Single source: `:root` in `src/index.css`.

### Layers

| Layer | Examples | Rule |
|-------|----------|------|
| Primitive | `--white`, `--black` | Raw values only here |
| Semantic | `--bg`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-cool`, `--ok` | Intent, not appearance |
| Compat aliases | `--folio-*` → semantic | Prefer semantic names in new CSS |
| Component | `--cs-*` on `.cs`, `--folder-*` inline | Scope to a surface |

### Color (use these — no new raw hex in chrome CSS)

```css
/* Surface */
--bg --bg-elevated --bg-paper --bg-folio

/* Text */
--ink --ink-soft --muted --muted-cool

/* Line / grid */
--line --line-cool --grid --grid-light

/* Accent */
--accent --accent-soft --accent-text
--accent-cool --accent-cool-ink
--ok --tone-forest --tone-slate --tone-navy

/* Folio aliases (compat) */
--folio-ink --folio-muted --folio-line --folio-cyan …
```

Also: `--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--ease*`, `--dur-*`, `--focus-ring`.

### Rules for UI work

1. Prefer `var(--token)` over hex/px for color, space, radius, type.
2. Project brand fills (folder cards) may stay as data (`featured.js`) injected via `--folder-fill` / `--folder-ink`.
3. Mock UI chrome in `motion-previews.css` may keep product-specific hex; shared brand colors should still use tokens.
4. Run `npm run lint:tokens` before shipping CSS — fails on new unallowlisted hex in `index.css` / `case-study-system.css`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Vite |
| `npm run build` | Production build |
| `npm run lint` | oxlint + CSS token check |
| `npm run lint:tokens` | Hex-outside-`:root` guard |
| `npm run deploy:prod` | Build + Vercel production |
