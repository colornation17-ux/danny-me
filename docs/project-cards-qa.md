# Project cards — QA matrix

**Version:** 1.0 · July 20, 2026  
**System:** `src/components/project-cards/` + `src/data/featuredProjects.ts`

## Automated

| Check | How | Status |
|---|---|---|
| Schema / content contract | `node scripts/check-project-cards.mjs` | Required in CI/local before ship |
| Production build | `npm run build` | Required |
| CSS token lint | `npm run lint:tokens` | Existing |

> Axe: run against local preview with browser DevTools or `@axe-core/cli` when available. No critical/serious folder-card violations allowed.

## Manual matrix

| Viewport | Expect |
|---|---|
| 320 / 375 / 430 | Accordion; no horizontal page scroll; Lola CTAs in details |
| 768 / 1024 | Tab rail + one panel |
| 1280 / 1440 × ≥720 | Folder stack |
| Any × &lt;680 | Non-sticky accordion |
| 1440 × 700 | Tablet (not sticky folder) |
| 200% / 400% zoom | Stacked/tablet behavior; usable focus |

## Keyboard / SR

- All six triggers focusable; Enter/Space toggles
- No focus move on scroll-driven active change
- No interactive controls inside `aria-hidden`
- Panels use `hidden` when inactive
- `:focus-visible` outline on tabs and CTAs

## Motion / media

- `prefers-reduced-motion`: no slide; posters preferred
- Only active card video plays

## Interview framing

> “I built the project section as a reusable component system driven by structured project data, shared design tokens and responsive variants. I’m now formalizing its accessibility and content rules into a small portfolio design system.”
