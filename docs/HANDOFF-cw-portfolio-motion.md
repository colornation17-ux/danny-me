# Handoff: Competitor Watch portfolio motion (screens + section videos)

**Goal:** Replace the broken/weak portfolio carousel with **real footage of the original Competitor Watch app** — either recorded screen clips or high-fidelity UI captures driven by the app’s real (or frozen snapshot) data. Do **not** invent fake mock dashboards unless recording fails and you must fall back.

**Consumer app:** `C:\My Web Sites\danny-me` (portfolio)  
**Source app:** `C:\My Web Sites\competitor-watch` (the real product)

**Portfolio page:** `http://localhost:5175/projects/competitor-watch` (Vite port may vary 5173–5176)  
**Live app:** `http://localhost:8000`  
**Production app:** `https://competitor-watch-1.onrender.com`

---

## Why previous attempts failed

| Approach | What went wrong |
|----------|-----------------|
| Live iframe + `postMessage` tab switching | Labels advanced; iframe often stayed on wrong tab / same screen |
| Full iframe reload per beat | Slow; Flipp scrape → **503** on Competitor deals; “loading…” stuck |
| CSS mock screens with alias data | Looked fake; user rejected |
| Playwright `.webm` recordings | Partial success; wait selectors matched **hidden sidebar** labels; some beats scrolled to wrong section; gentle scroll looked weak; quality uneven |

**User ask now:** Generate the **necessary screens and section motion video from the original app** (or original app UI + data). Prefer authenticity over clever embedding.

---

## Success criteria

1. **Six distinct beats** — each shows a *different* real UI surface (not the same deals page six times).
2. **Real data visible** — KPIs, deals, weather targets, RFM, forecast lists from the app (snapshot OK).
3. **No 503 / empty error states** in any beat.
4. **Motion** — subtle Ken Burns / scroll / UI micro-motion per beat; carousel chrome (counter, label, caption, progress, dots) already exists in portfolio.
5. **Fast & reliable** on the portfolio page — no dependency on Render cold starts or live Flipp scrape during viewing.
6. **Label ↔ content match** — if chrome says “Demand forecast”, the video/frame must show demand forecast, not merchandising ABC.

---

## The six beats (contract)

Defined in `danny-me/src/data/competitorWatchBeats.js`. Wire assets to these IDs.

| # | `id` | Label | Caption | Source URL (local, preferred) | Must show |
|---|------|-------|---------|-------------------------------|-----------|
| 01 | `sales-summary` | Sales summary | Store pulse · $46K week · daily bars & movers | `/?tab=insights&embed=portfolio&snapshot=portfolio#insights-pulse` | Store pulse KPIs, daily bars, movers (`#insights-pulse`) |
| 02 | `weekend-playbook` | Weekend playbook | Rain-day push/skip · category targets | `/?tab=weather&embed=portfolio&snapshot=portfolio` | Weather day cards + sales targets |
| 03 | `competitor-deals` | Competitor deals | Meat winners · 144 live ads indexed | `/?tab=deals&embed=portfolio&snapshot=portfolio` | Deal cards / winners — **not** 503 |
| 04 | `competitive-pricing` | Shelf vs market | Checkout avg vs local ad low | `/?tab=insights&embed=portfolio&snapshot=portfolio#insights-pricing` | Price comparison table (`#insights-pricing`, insights tab **competitive**) |
| 05 | `customers-rfm` | Customers & RFM | Top shoppers · loyalty tiers · trade area | `/?tab=insights&embed=portfolio&snapshot=portfolio#insights-top-customers` | Top customers table (`#insights-top-customers`) |
| 06 | `demand-forecast` | Demand forecast | Nixtla · buy / hold / reduce lists | `/?tab=insights&embed=portfolio&snapshot=portfolio#insights-demand` | Demand forecast panel — click **Owner tools** tab first; scroll `#insights-demand` |

**Header titles in the real app (sticky `h1`):**

- weather → “Weekend playbook”
- deals → “Competitor deals”
- insights → “Your store data”

**Important DOM notes (competitor-watch):**

- Page titles are often **`h2`**, not `h1` (`PageHeader` in `frontend/src/lib/sectionUi.jsx`). Sticky header uses `h1` with `TAB_LABELS`.
- Sidebar nav labels are often **hidden** in embed CSS — do **not** wait on `getByText(/Competitor deals/)` without scoping to `main` / visible heading.
- `#insights-demand` can appear **twice** in the DOM — always use `.first()` or a more specific locator.
- Hash → insights sub-tab mapping (`InsightsSection.jsx`):
  - `#insights-pulse` → sales
  - `#insights-pricing` → competitive
  - `#insights-top-customers` → customers
  - `#insights-demand` → **owner** (must open Owner tools)

**Embed mode:** `?embed=portfolio` hides sidebar, footer, connect panel, market settings expand.  
**Snapshot mode:** `?snapshot=portfolio` serves frozen `data/portfolio_snapshot.json` (no Flipp scrape, no 503).

---

## Owner login = real gated data (REQUIRED)

**Yes — recordings must be taken while signed in as owner**, so pulse / RFM / top customers / demand forecast show **real POS facts**, not guest-locked placeholders.

| Mode | What you see | Use for portfolio? |
|------|----------------|--------------------|
| Guest / not signed in | Deals + weather OK; insights often gated (“Sign in…”, redacted customers) | **No** for beats 01, 04, 05, 06 |
| Owner signed in (`APP_PASSWORD` Basic auth) | Full store pulse, pricing, RFM, demand forecast | **Yes — required** |
| `DEMO_MODE=1` | Public demo locks; uploads/sync blocked; data may be redacted | **No** for capture |

### How owner auth works

- Server: `APP_PASSWORD` env var. If **unset**, local server treats requests as authenticated (`_is_authenticated` returns true) — convenient for local capture.
- If `APP_PASSWORD` **is set**, Playwright/browser must send Basic auth `owner:{password}` or use the in-app Sign in UI (`sessionStorage` key `cw_team_password` via `frontend/src/lib/auth.js`).
- Frontend can auto-sign-in in builds with `VITE_APP_PASSWORD` (`tryAutoSignInFromEnv`).
- Embed showcase previously faked `owner_features_available` in UI only — **that does not unlock API data**. Capture must use a real authenticated session.

### Capture rules (owner)

1. Start server with **`DEMO_MODE=0`**. Prefer **no** `APP_PASSWORD` for local recording (auto-owner), **or** set password and sign in before every recording.
2. Confirm UI shows **OWNER** badge / signed-in state before recording.
3. Confirm beats show real numbers (e.g. week revenue ~$46K, named customers, buy/hold/reduce lists) — not “Sign in for top customers” / empty guest previews.
4. Regenerate `portfolio_snapshot.json` **while authenticated as owner** so `/api/data?snapshot=portfolio` includes owner facts:
   ```powershell
   # Warm cache as owner first (browser signed in, or curl with Basic auth), then:
   python "C:\My Web Sites\danny-me\scripts\snapshot-portfolio-cache.py"
   ```
5. Harden `record-cw-beats.mjs` to either:
   - `httpCredentials: { username: 'owner', password: process.env.APP_PASSWORD }` when password is set, **or**
   - inject `sessionStorage.setItem('cw_team_password', password)` via `addInitScript` before goto.

**Do not** record from the public Render demo as guest and expect owner screens.

---

## Recommended approach (do this)

### Phase A — Make the source app recordable (owner + snapshot)

1. Start competitor-watch with **patched** `server.py` (portfolio snapshot helpers) and built frontend:
   ```powershell
   cd "C:\My Web Sites\competitor-watch"
   # ensure data\portfolio_snapshot.json exists (~144 deals)
   $env:DEMO_MODE="0"
   # Optional: leave APP_PASSWORD unset for local auto-owner.
   # If set, you MUST sign in during recording (see Owner login section).
   Remove-Item Env:APP_PASSWORD -ErrorAction SilentlyContinue
   python server.py
   ```
2. Open `http://localhost:8000/?tab=insights` and confirm **owner** views (pulse, customers, Owner tools → Demand forecast) with real data.
3. Verify snapshot (must return fast + `portfolio_snapshot: true`):
   ```powershell
   # After server restart with patched code:
   # GET http://localhost:8000/api/data?snapshot=portfolio
   ```
4. If snapshot missing or guest-thin, warm `/api/data` as owner then regenerate:
   ```powershell
   python "C:\My Web Sites\danny-me\scripts\snapshot-portfolio-cache.py"
   ```
5. Manually open each beat URL (with owner session) and **confirm** the correct section is visible before recording.

### Phase B — Capture assets (pick one primary path)

#### Path 1 — Section motion videos (preferred if quality is good)

- Use Playwright `recordVideo` **or** manual OBS / Windows Game Bar / CapCut screen record.
- Viewport: **1280×900** (matches portfolio crop).
- Per beat: wait until content is painted → record **5.5–6.5s** of subtle motion (slow scroll 40–120px, or Ken Burns on a still if UI is static).
- Output: `danny-me/public/work/competitor-watch/videos/{id}.webm` (or `.mp4` + update beats).
- Existing script (needs hardening): `danny-me/scripts/record-cw-beats.mjs`
  ```powershell
  cd "C:\My Web Sites\danny-me"
  npm run record:cw
  # or one beat:
  $env:ONLY="demand-forecast"; npm run record:cw
  ```

**Hardening checklist for the recorder:**

- Wait on `header.sticky h1` or `main h2` with **visible** state — never bare sidebar text.
- After goto, wait for network + specific content (e.g. deal price, “$46”, “Demand forecast” heading inside `main`).
- For deals: abort if text “Server returned 503” appears in `main`.
- For demand: click Owner tools tab, then scroll `#insights-demand`.first() into view; assert heading “Demand forecast”.
- Prefer **one continuous session** with tab navigation (faster, warmer cache) over six cold loads — but only if navigation is reliable.
- Optional: also save a PNG poster frame per beat for LCP / reduced-motion.

#### Path 2 — High-quality stills + CSS motion (fallback / hybrid)

If video is too heavy or flaky:

1. Capture crisp PNGs at 1280×900 for each beat into `public/work/competitor-watch/slides/{id}.png`.
2. Reuse existing showcase CSS (`.cw-showcase`, Ken Burns, flash, chrome) in `src/styles/motion-previews.css`.
3. Drive carousel from images + light overlays — **but images must be real screenshots of the app**, not invented mocks.

Existing capture scripts (screenshots, not video):

- `scripts/capture-cw-slides.mjs`
- `scripts/capture-cw-insights.mjs`

Update them to use `embed=portfolio&snapshot=portfolio` and the beat URLs above.

#### Path 3 — Do **not** go back to live iframe for the hero

Live embed is fine as a secondary “Open live app” link (`liveUrl` already points to Render). The **hero motion** must be offline assets so the case study never shows 503 or wrong tabs.

### Phase C — Wire portfolio

1. Update `src/data/competitorWatchBeats.js` with final `video` and/or `src` (image) paths + durations matching clip length.
2. Keep `CompetitorWatchMotion.jsx` as video carousel **or** restore image showcase if using Path 2.
3. Delete or ignore unused mock screens (`CompetitorWatchMockScreens.jsx`) if not used.
4. Verify on case study + project card motion preview (`ProjectMotionPreview` → slug `competitor-watch`).

---

## File map

| Path | Role |
|------|------|
| `danny-me/src/components/motion/CompetitorWatchMotion.jsx` | Carousel player (currently video-based) |
| `danny-me/src/data/competitorWatchBeats.js` | Beat metadata + asset URLs |
| `danny-me/src/styles/motion-previews.css` | Chrome, transitions, video/mock styles |
| `danny-me/scripts/record-cw-beats.mjs` | Playwright video recorder |
| `danny-me/scripts/snapshot-portfolio-cache.py` | Freeze API payload → `portfolio_snapshot.json` |
| `danny-me/scripts/patch-cw-portfolio.py` | Embed CSS/JS patches into CW frontend |
| `danny-me/scripts/patch-cw-portfolio-snapshot.py` | Server + App.jsx snapshot query patches |
| `competitor-watch/data/portfolio_snapshot.json` | Frozen deals + forecast for embed |
| `competitor-watch/data/api_data_cache.json` | Source for regenerating snapshot |
| `competitor-watch/frontend/src/styles/portfolio-embed.css` | Hides chrome in embed |
| `competitor-watch/frontend/src/App.jsx` | `cw-portfolio-nav` postMessage + `snapshot=portfolio` fetches |

---

## Visual / motion direction (Rachel Chen–style)

- Full-bleed crop of the app UI (no fake phone chrome).
- Fast cut between beats (~5.5–6s), soft flash + label chrome at bottom.
- Motion inside the beat: slow drift/zoom or gentle scroll revealing the section — not frantic.
- Counter `01 / 06` … `06 / 06` already in chrome.
- Pause on hover.
- Prefer real green/owner UI language of Competitor Watch; don’t restyle into a generic purple AI dashboard.

---

## QA checklist (must pass before done)

- [ ] All 6 assets exist and play/load without 404
- [ ] Beat 03 shows real deals (meat winners / ad cards), never 503
- [ ] Beat 06 shows Demand forecast (buy/hold/reduce), not merchandising-only
- [ ] Beat 05 shows top customers / RFM, not basket analysis
- [ ] Beat 04 shows shelf vs market pricing table
- [ ] Labels match content for every beat
- [ ] Works with portfolio `npm run dev` with **no** CW server running (offline assets)
- [ ] Mobile crop still readable (object-position top/center)
- [ ] `prefers-reduced-motion`: show first frame / still, no auto-advance spam

---

## Suggested Claude work plan (execute in order)

1. Confirm CW server + snapshot; manually screenshot each beat URL as ground truth.
2. Harden `record-cw-beats.mjs` (visible locators, owner tab, deny 503) **or** record manually with OBS.
3. Drop videos/stills into `public/work/competitor-watch/...`.
4. Wire `competitorWatchBeats.js` + verify `CompetitorWatchMotion.jsx`.
5. Run through QA checklist on the case study page.
6. Optional: commit large videos with Git LFS, or compress WebM (target ~1–2 MB each).

---

## Out of scope / avoid

- Rebuilding fake “Mercado Norte” mock UIs as the primary hero.
- Depending on live Flipp scrape during portfolio viewing.
- postMessage-only navigation without verifying the iframe actually changed tabs.
- Recording production Render cold starts (30s+ blank) — always record from local + snapshot.

---

## One-line brief for Claude

> Capture six authentic Competitor Watch section clips (or screenshots) from `localhost:8000` while **signed in as owner** (`DEMO_MODE=0`, real POS/owner facts — not guest-gated UI), using `embed=portfolio&snapshot=portfolio`, one per beat in `competitorWatchBeats.js`; ensure each shows the correct real UI with real data and no 503s; then wire them into the danny-me portfolio carousel so the case study motion is reliable offline.
