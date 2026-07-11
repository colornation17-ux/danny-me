# Competitor Watch — Case Study & Presentation Handoff

**For:** whoever builds the portfolio case study / landing page around the 6 clips + reel.
**Goal:** decide *what to prioritize*, *where the videos live (containers)*, and *how to present the solution* like a product designer — not a feature dump.

**Canonical asset location in this repo:** `public/work/competitor-watch/motion/`
(Copy from Claude/Calude motion `out/` into that folder.)

**Assets:**
- `CompetitorWatch-Reel.mp4` — 6 beats + carousel chrome (~31s)
- `CW-01-SalesSummary` · `CW-02-CompetitorDeals` · `CW-03-WeekendPlaybook` · `CW-04-SalesForecast` · `CW-05-CustomersRetention` · `CW-06-WhatsAppCrm` — clean per-screen clips (~6s, no chrome)
- Poster stills `*.png` (use as `poster=` / reduced-motion fallback)

---

## 1. The one-sentence thesis (lead with this)

> **A neighborhood grocer's intelligence stack** — Competitor Watch turns Flipp ad-scrapes, POS data, weather, and WhatsApp into weekend merchandising decisions, demand forecasts, and win-back campaigns for a single Latino supermarket competing against mainstream and Latino competitors.

Everything in the case study should ladder up to that. Don't open with "I built a dashboard." Open with the *unfair fight* (one store vs chains) and how software evened it.

---

## 2. What to prioritize — the ranking logic

### Hero capabilities — go DEEP
1. **Competitor deals** (CW-02) — namesake + Flipp moat
2. **Demand forecast — Nixtla** (CW-04) — real ML depth
3. **WhatsApp CRM** (CW-06) — closed-loop outcomes

### Supporting — SHOW, don't belabor
- **Customers · RFM · Retention** (CW-05)
- **Weekend playbook** (CW-03)

### Foundation — CONTEXT
- **Sales pulse** (CW-01) — don't lead the whole case study with it

---

## 3. Where the videos go

| Container | Asset | Behavior |
|---|---|---|
| Case-study hero | Reel | muted · autoplay · loop · playsInline · poster still-01 |
| Capability deep-dives ×3 | CW-02 / 04 / 06 | play on scroll-into-view |
| Feature carousel / gallery | all 6 clean clips | container supplies chrome |
| Landing / social / deck | Reel + individuals | as noted in original brief |

**Chrome:** Reel has baked chrome → standalone. Clean clips → container owns captions. No double chrome.

---

## 4. Page order

1. Hook (thesis + hero reel)
2. Context / users
3. Insight (connect the data)
4. System overview
5. Hero deep-dives ×3 (Deals, Forecast, CRM)
6. Supporting (Customers + Weekend)
7. Impact / outcomes
8. Craft & role
9. Reflection

See original brief for captions and proof numbers.

---

## 5. Guardrails

- `aspect-ratio: 16/9`, lazy-load, IntersectionObserver play/pause
- `prefers-reduced-motion` → poster still
- Captions as HTML next to clean clips
- Never autoplay with sound
- Forecast copy: honest about Nixtla paused in prod when relevant

---

## Related

- `docs/HANDOFF-cw-portfolio-motion.md` — earlier recording/snapshot handoff
- Drop assets into `public/work/competitor-watch/motion/` then refresh the case study
