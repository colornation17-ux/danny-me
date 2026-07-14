# Handoff: Road trip US map (About page)

**Goal:** `src/components/RoadTrip.jsx` is a pinned-scroll section on the About page that shows a real US map, highlights the 12-state road-trip corridor, and pops up a photo+caption panel per stop as the user scrolls. Currently only 6 of the 12 states have real stops.

**Consumer page:** `http://localhost:5178/about` (Vite port varies 5173–5178, check the terminal)
**Files:**
- `src/components/RoadTrip.jsx` — the component, all trip data lives here
- `src/data/usStatePaths.json` — raw SVG `d` path per US state (id → path string), MIT-licensed, pulled from [WebsiteBeaver/interactive-and-responsive-svg-map-of-us-states-capitals](https://github.com/WebsiteBeaver/interactive-and-responsive-svg-map-of-us-states-capitals)
- CSS: `src/index.css`, search `.road-trip`

---

## Current state

- `TRIP_STOPS` array (top of `RoadTrip.jsx`) has 20 stop objects across **6 states**: MO, CO, UT, AZ, NV, CA.
- `ROUTE_STATES` additionally includes **IN, IL, KS, NM, TX, OK** — but only for background tint (`BASE_COLOR`), since they were added later per user request without stop data. They never get visited/highlighted because nothing in `TRIP_STOPS` references them.
- Pinned scroll (GSAP ScrollTrigger, `pin: true`) drives: a marker dot moving stop-to-stop, each stop's state fill (dim → orange "active" → sage "visited"), and a single content panel that crossfades between stops (polaroid photo left, text right).

## What's needed

Add stop entries for the 6 missing states once the user supplies photos. See the table in the chat reply for suggested waypoints (Indianapolis/IN, Chicago or Springfield/IL, Galena/KS, Santa Fe or Albuquerque/NM, Amarillo/TX, Tulsa or OKC/OK).

**Per-stop shape** (copy an existing entry, e.g. `missouri`):
```js
{ id: 'kebab-id', title: 'Display Title', desc: 'Short location line', state: 'XX', fx: 0.NN, fy: 0.NN, note: 'One handwritten-font sentence, ~10 words max.', photo: '/travel/filename.jpg' }
```
- `state`: 2-letter USPS code, must exist in `usStatePaths.json`.
- `fx`/`fy`: fraction (0–1) of that state's **bounding box**, not the full map — `0,0` is the state shape's top-left, `1,1` is bottom-right. Get these by eyeballing the real city's position within the state's outline. The component resolves the actual `cx`/`cy` at runtime via `getBBox()` on the state path, so you don't hand-place absolute coordinates.
- `note` renders in the `Just Me Again Down Here` cursive font at a small size — keep it short, it clips to ~4 lines.
- `photo`: goes in `public/travel/`, referenced as `/travel/filename.jpg`.
- Insert new stops into `TRIP_STOPS` in the correct **west→east or east→west geographic order** matching where they sit on the real route — the array order IS the scroll/marker order.

**Where to insert them:** Indiana and Illinois should go at the very start (before the `missouri` entry) since they're the departure leg. Kansas fits between Missouri and the Colorado stops. New Mexico, Texas, Oklahoma are trickier — the existing data has Grand Canyon (AZ) as the very last stop, which is geographically odd for a Route 66 return leg through NM/TX/OK; **ask the user for the real chronological order** of the return leg rather than guessing — the existing stop order was provided by the user, not invented.

## Known gotchas from this session

1. **`getComputedStyle()` in this dev environment's browser-automation tool returned stale values** when checking SVG `fill` after a GSAP attribute tween — even `setAttribute` + inline `style.fill` both failed to show up via `getComputedStyle`. This was a tooling artifact, not a real bug. **To verify a fill/color change actually applied, rasterize the SVG to a `<canvas>` via `Image` + `XMLSerializer` and sample pixel color with `getImageData`** — that gave ground truth when `getComputedStyle` lied. See git history of this file for the exact snippet if needed again.
2. **The Browser pane's `computer` screenshot action is flaky** in this environment — frequently times out (30s) or, when it does return, can report the wrong effective viewport size vs. what `resize_window`/`window.innerWidth` claim. Cross-check with direct JS (`getBoundingClientRect`, `window.innerWidth`) rather than trusting a screenshot's pixel proportions blindly. Retrying the screenshot call once or twice usually works eventually.
3. **`resize_window` doesn't always take effect on the first call** — verify with `window.innerWidth` after resizing before trusting a screenshot taken at that size.
4. **Windows path quirks in Bash tool:** `python`/`node` invoked from the Git Bash shell need **Windows-style paths** (`C:\Users\...`), not the git-bash-mangled `/c/Users/...` form — the latter gets misinterpreted (e.g. `node` will prepend `C:\` to it, producing `C:\c\Users\...`). Use the scratchpad directory's Windows-style equivalent when writing helper Node/Python scripts.
5. **`ScrollTrigger.refresh()` must be called manually** after the GSAP timeline setup in this component, because client-side route navigation (Home → About) doesn't refire `window.load`, which is what GSAP's automatic refresh listeners are tied to. Already handled in the current code — don't remove it.
6. This component was rewritten **three times** this session (S-curve zigzag → smooth S-curve → real US map) based on evolving user feedback. The current (map) version is the one the user wants kept and extended — don't revert to an earlier abstract-diagram approach.

## Verification checklist for any change here

1. `npx oxlint src/components/RoadTrip.jsx` — must be clean.
2. Load `/about`, check `read_console_messages` for errors.
3. Confirm state count / stop count via `document.querySelectorAll('.road-trip__map path').length` (should stay 50) and `.road-trip__panel` count (should equal `TRIP_STOPS.length`).
4. Drive the GSAP timeline directly to check the sequence without needing to actually scroll — temporarily expose it via `window.__RT_DEBUG_TL = tl` inside the `gsap.context(...)` callback, then in a separate JS call do `tl.progress(fraction)` and inspect marker `cx`/`cy` and panel opacity. **Remove the debug line before finishing** — it was added/removed repeatedly this session, don't leave it in.
5. If verifying a color/fill change, use the canvas-rasterization technique from gotcha #1, not `getComputedStyle`.
