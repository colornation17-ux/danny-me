# Handoff — Portfolio gaps: Lola + Competitor Watch

**Owner:** Danny Varghese  
**Date:** 2026-07-15  
**Why:** Real products shipped more than the portfolio currently shows. Resume updated to match design+build truth; portfolio still needs the additions below.

---

## Sources of truth

| Project | Product code | Live | Case study / portfolio |
|---------|--------------|------|------------------------|
| **Lola** | `C:\My Web Sites\wacrm\` | https://wacrm-i9f2.vercel.app/ · WhatsApp `wa.me/14043238325` | https://la-bodega-lola-nu.vercel.app/ · danny-me card → redirect |
| **Competitor Watch** | `C:\My Web Sites\competitor-watch\` | https://competitor-watch-1.onrender.com | danny-me `/projects/competitor-watch` (on-site case study) |

Resume mirror: `C:\Users\danny\.proficiently\resume\` (`build_spd_ga.py`, `resume.md`, `bullet-bank.md` LB2/LB5)

---

## Resume alignment (done 2026-07-15)

Use these La Bodega bullets (do not weaken back to “shipped / designed dashboards only”):

1. **Loyalty/CRM** — discount 0.29%→0.09%, 13% revenue lift (keep; separate from Lola/CW cases)
2. **Lola** — *Designed bilingual WhatsApp guest flows and built Lola Connect (staff PWA) solo — deals Q&A, pickup orders, reminders, and staff handoff; 96.3% of conversations closed without staff.*
3. **Competitor Watch** — *Designed and built Competitor Watch solo (React + Python) — competitor ads, weekend playbook, store pulse, demand forecast, and WhatsApp→POS visit attribution for Thursday merchandising decisions.*
4. **Ops PWA** — shift/approvals/vendor (separate product)
5. Partnered with store leadership…

**Portfolio header / forms:** GA default (`address-rule.md`). Portfolio URL always `https://danny-me-rho.vercel.app/`.

---

# A. Lola — what to add to portfolio

### Current state
- Homepage card + `projects.js` blurb OK after Jul 15 copy fix (design+build, ~1,200, 96.3%).
- Full depth lives **externally**; `/projects/lola` redirects. On-site stub is thin residue.
- Role must stay: **Design technologist / Solo design & build** (not “Product designer” only).

### Must-add (on-site or deepen external CS — pick one home)

| Priority | Add | Why | Product proof |
|----------|-----|-----|---------------|
| P0 | **Six guest flows** (named + short demo each) | Resume/case claim needs visible breadth | Broadcast, Greeting, Pickup, Reminders, Confused/coach, Staff handoff |
| P0 | **Lola Connect spine** — Home · Inbox · Orders · Tickets · Reminders | “Built staff PWA” needs UI proof beyond generic “inbox” | `wacrm` staff nav |
| P0 | **Two-tier alerts** (draft buzz → confirm; pickup-soon) | Distinguishes ops design from chatbot portfolio spam | Shop-orders / alert code in wacrm |
| P1 | **Craft / safety** — flyer-grounded answers, no invented prices, pause when human owns thread | Interview defense | Case study Reference appendix |
| P1 | **Metrics honesty block** | Trust | 96.3% closed without staff · 97.7% first reply &lt;2m · **Still Measuring:** pickup lead-time, escalate solve/expire (filter test traffic) |
| P1 | **Buttons-first** pickup (not `#order`-first) | Fix product grammar vs old stub | Meta templates / FLOW_TABS |
| P2 | Voice constraints (text-first TTS; remonder EN-only cron gap) | Honest craft | CS `PRODUCTION_GAPS` |
| P2 | Clarify ownership: Lola = flows + Connect spine; **not** entire CRM (Broadcasts / Pipelines / Automations) | Avoid overclaim | Eng handoff in wacrm |

### Do not publish as hero metrics
- ~39% escalations expired (contaminated by test tickets — case study already holds this back)
- 1,600+ as **loyalty reach** (use ~1,200 weekly flyer / loyalty; 1,600+ only if labeled total CRM size)
- Implying full SKU-bot / open inventory

### Copy checklist (danny-me)
- [x] Featured outcome: design+build + 96.3% + ~1,200  
- [x] `projects.js` role / timeline May–Jul / live pilot  
- [ ] Optional: embed 1 Connect screenshot strip on homepage card hover (Inbox + Orders)  
- [ ] Optional: add “What’s in Connect” 5-icon row so card isn’t guest-only  

### Files to touch
- `src/data/projects.js` · `src/data/featured.js` (card copy — largely done)
- External: `C:\My Web Sites\lola-case-study\` for P0 UI demos if keeping redirect model
- Motion: `public/work/lola/motion/` — add Connect spine clip if missing

---

# B. Competitor Watch — what to add to portfolio

### Current state
- Strong thesis: deals + weekend playbook + pulse + forecast + RFM + WhatsApp→POS (~6 marketing surfaces).
- Real product IA is **larger**: 5 primary tabs + nested owner tools + global store chat.
- Coverage ≈ **40–50%** of shipped surface.

### Product map (source of truth)

| Tab / area | In portfolio today? |
|------------|---------------------|
| Dashboard (hub) | Partial (split across stories) |
| Weekend playbook | Yes |
| Competitor deals | Partial (winners only) |
| Your store data → pulse | Yes |
| Your store data → **Competitive pricing** | **No** (was planned, dropped) |
| Your store data → Customers / RFM | Partial |
| Your store data → Actions / WA outreach | Yes (attribution) |
| Owner → Demand forecast | Yes |
| Owner → Merchandising ABC | **No** |
| Owner → Sales push / pace / rescue | **No** |
| **Market trends** (full tab) | **No** |
| Store chat / promo review | **No** |
| Combos + national rank + deal search | **No** |

### Must-add (priority)

| Priority | Add | Proof assets to record |
|----------|-----|------------------------|
| P0 | **Competitive pricing** — shelf/checkout avg vs live ad floor | Tab `insights` → Competitive (`#insights-pricing`); was beat in `docs/HANDOFF-cw-portfolio-motion.md` |
| P0 | **Market trends** — Latino vs mainstream national ad pulse | Tab `trending` / `TrendingSection.jsx` |
| P0 | **Deals depth** — combo packs + national ranking (+ deal search if space) | Deals subviews in `DealsSection.jsx` |
| P1 | **Store assistant** — paste promo → Flipp check / pulse answer | `StoreAssistant.jsx` (visible even on guest UI) |
| P1 | **Owner ops beyond attribution** — merchandising ABC **or** weekly sales push → WA tags | Owner tools (needs auth recording) |
| P2 | Trade-area map, basket/attach rates | Customers sub-tabs |
| P2 | Guest vs owner honesty callout | Foundation section |

### Copy / claim fixes
- [ ] Soften **“next-visit predictions”** → replenishment / visit-rhythm nudges (not ML visit forecast)
- [ ] Don’t collapse K-means RFM + outreach segments into one vague “5 RFM tiers” without labels
- [ ] Timeline: **MVP in ~2 weeks · ongoing production** (full system ≠ two-week surface)
- [ ] Prefer “ZIP markets / chains” over vague “seven U.S. metros” unless you show that exact UI

### Implementation sketch
1. Extend `CW_PROOF_CLIPS` / `CwModulesGrid` from 6 → 8–9 (add Pricing, Market trends, Combos or Chat).
2. Record owner-mode clips per `docs/HANDOFF-cw-portfolio-motion.md` (sign in required for pulse/RFM/forecast facts).
3. Update `CompetitorWatchCaseStudy.jsx` problem #1 to **link a Pricing proof** (today problem sells pricing, portfolio never shows it).
4. Update featured CW outcome to mention pricing + market trends once clips exist.

### Files to touch
- `src/components/motion/CompetitorWatchCaseStudy.jsx`
- `src/components/motion/CwModulesGrid.jsx`
- `src/data/competitorWatchMotion.js` · `competitorWatchBeats.js`
- `public/work/competitor-watch/motion/` (new clips)
- `src/data/projects.js` · `src/data/featured.js` (blurb — partially updated)

---

## Shared rules (both projects)

1. **Never invent metrics** — only case study / live-instrumented numbers.
2. Resume ↔ portfolio ↔ product **same verbs**: designed **and** built (solo).
3. Lola and CW are **pair products**: CW = plan + attribute; Lola = converse + order + handoff. Keep that split in overviews.
4. Prefer screen recordings of the **real app** over mock dashboards.
5. When unsure, ship fewer surfaces with real UI than more captions without proof.

---

## Suggested work order

1. **CW P0 clips** — Competitive pricing + Market trends + Combos (biggest “product is bigger than portfolio” gap)  
2. **Lola Connect spine** — 30–45s reel or 5 stills (proves build)  
3. Wire into case study modules + featured blurbs  
4. Re-read resume once new surfaces live — optional bullet trim if one-pager overflows  

---

## Done when

- [x] CW case study shows pricing (+ deals depth in copy: combos / national rank). Market trends called out in product IA; dedicated clip still TBD
- [x] Lola card/CS clearly shows Connect spine (Home · Inbox · Orders · Tickets · Reminders) + six guest flows + craft/metrics honesty in project data
- [x] No “prediction” language for visit-rhythm; no ~39% expire on danny-me
- [x] Lola Connect Inbox + Orders preview clips on homepage card (desktop)
- [ ] Resume bullets still match what visitors can click and see (re-read after Market trends clip ships)
- [ ] CW Market trends + owner ops clips recorded per `HANDOFF-cw-portfolio-motion.md`
