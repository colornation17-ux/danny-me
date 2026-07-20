# Checkout Operations — Research evidence appendix

**Document type:** Rapid operational investigation → evidence trail for portfolio / resume / interview defense  
**Sources:** Live launch checkout investigation (first 72 hours) + February–March pricing / unit-cost work folded into product onboarding  

**Status:** Operational workflow, 500+ transaction window, ~2,000 UPC corrections, three-team structure, and independent POS revalidation **method** locked (2026-07-20). **First-pass revalidation rate remains unrecovered** — do not publish recognition %. Later product-master snapshot (7,408 rows) recorded as post-launch composition only. Older portfolio KPI graphics/percentages are **not** research evidence without denominators.

**How to use:**  
`/projects/bodega-ops` = short systems story.  
**This file** = research questions → method → sample → observations → hypotheses → insight → decision → measured/observed result → limitations.

**Locked architecture:**

```text
Receive / collect physical sample
→ POS scan test
→ confirm exact product, brand, size
→ normalize barcode to Datalogic EAN-13 contract
→ normalize case cost → unit cost
→ same-UPC or equivalent competitor price
→ viability check
→ review name, cost, price, duplicates
→ Excel batch → Odoo import
→ independent POS / Datalogic rescan
→ approve for sale
```

Not a public UPC API product path. Not a separate “pricing strategy” case — pricing enters only as **onboarding data integrity**.

---

## Publishable claims (ceiling)

| Claim | Status | Public wording |
| --- | --- | --- |
| Store size | Locked | ~25,000 sq ft |
| Terminals | Locked | 4 shared POS · one Odoo catalog |
| Launch narrative | Locked | **Day-1 live launch week** |
| Timeline | Locked | First **72 hours** after launch · ~1 week monitoring handoff |
| Transactions (window) | Locked | **500+** customer transactions — **not** “500 failed scans” |
| Correction volume | Locked | **~2,000 UPC records** corrected — **not** automatically unique physical SKUs |
| UPC-A scope | Locked | **3,000+** UPC-A-coded products; internal codes retained when intentional and working |
| Workflow | Locked | **Three teams:** collect+POS audit · normalize+Excel+Odoo · independent POS/scale verification |
| Pricing in onboarding | Locked | Unit-cost normalization from case cost + same-UPC / equivalent market check + individual price set (not one universal markup) |
| Temporary trust method | Locked | Contested prices could be temporarily compared to visible competitor rates — **not** the permanent pricing system |
| Validation method | Locked | Pass only when **physical sample** is retrieved by Odoo via checkout scanner/scale — **pass-rate N unrecovered** |
| Peak register workaround | Locked | Three functional roles at affected registers: **cashier · price matcher/runner · POS editor** (structure, not headcount) |
| Tool timing | Locked | First usable tool ~24h focused build inside 72h; staff teach staff by Day 3 |
| Recognition % | **Do not publish** | No first-rescan numerator/denominator in source records; old portfolio % graphics are not evidence |
| Later catalog snapshot | Composition only | 7,408 source rows / 6,366 unique GTINs — **not** active launch assortment |
| Out of scope | Do not claim | Loyalty · cart abandonment “near-eliminated” · formal usability % · merging conflicting denominators into one recognition rate |

### Defensible portfolio claim (preferred)

> A three-team launch recovery corrected approximately 2,000 UPC records and independently revalidated affected products through the existing POS and Datalogic scanner/scale while supporting more than 500 transactions in 72 hours.

*(Longer form may add unit-cost and market-price verification into onboarding — still without a recognition percentage.)*

---

# 1. Research brief

## Context

| Field | Value |
| --- | --- |
| Store | La Bodega Supermercado |
| Size | **25,000 sq ft** |
| POS | Odoo · 4 shared terminals · one shared product catalog |
| Role | Service designer · reported to CEO |
| Constraint | No POS replacement · no new hardware procurement |
| Decision deadline | ~72 hours after live launch |
| Related pricing work | Feb–Mar unit-cost / market-check method folded into onboarding |

## Research questions → answers

### Q1. Where did the product-data failure originate?

Two connected upstream problems:

#### Product-recognition problem

Products reached the sales floor before their physical barcode was validated against Odoo. Many standard UPC-A records also did not match the **EAN-13** value produced by the Datalogic scanner/scale.

Because all four checkout terminals used the same Odoo catalog, the problem followed the **product record**, not an individual register.

#### Pricing-data problem

Vendor costs were sometimes entered as **total case cost** without correctly dividing by sellable units — an incorrect unit-cost basis.

Prices were then entered without consistently comparing them against the **same product or an equivalent product** in the local market. A price could look fine inside Odoo while still being:

- Above the local market price  
- Below the actual unit cost  
- Based on the wrong pack size  
- Attached to the wrong product variation  
- Impossible to defend during a checkout dispute  

**Compounding failure:** incorrect unit-cost basis + absence of a market benchmark.

### Q2. Which barcode and catalog patterns were disproportionately affected?

Correction effort principally involved the store’s **UPC-A** assortment: **3,000+** UPC-A-coded products; remaining assortment largely **internal store codes** and specialized formats. **~2,000 UPC records** corrected in the first 72 hours.

**Affected patterns:**

- UPC-A values that did not match Datalogic EAN-13 output  
- Leading-zero differences  
- Shortened or inconsistently stored barcode values  
- Products missing from Odoo  
- Products registered under a different barcode  
- Duplicate products or duplicate product names  
- Case-versus-unit ambiguity  
- Similar products with different brands, package sizes, or prices  
- Variable-weight meat and produce  
- Internal store codes requiring separate handling (not automatic UPC normalization)  

**Why a product name alone was insufficient:** the same product family could contain multiple brands, sizes, and prices. Examples from the pricing catalog (catalog variation evidence — **not** proof that every price variation caused a scan failure):

- Jarritos 1.5 L products at **$2.49** and **$2.99**  
- Goya 15.5 oz bean variations at **$1.77** and **$2.20**  

Workflow needed:

```text
Physical barcode
→ exact product
→ brand
→ package size
→ unit or case
→ cost
→ sale price
```

*(Secondary full-export composition — confirm export date: 6,890 records · digit-length mix. Do not use as recognition denominator.)*

### Q3. How did staff respond when products failed at checkout?

During the first 72 hours the store processed **500+ transactions** (total window — **not** failed-scan count).

When a product was not identified:

- Cashier escalated for identification  
- Physical item entered the correction queue  
- Staff searched Odoo  
- Price and product identity reviewed manually  
- Contested prices could be **temporarily** compared with visible competitor-market prices  
- Barcode and catalog record corrected  
- Product independently rescanned through POS + Datalogic  

**Temporary trust-stabilization:** matching disputed items to visible competitor rates while the cost/catalog pipeline was corrected — **not** treated as the permanent pricing system.

In parallel: proactive aisle audit (not only customer-facing failures) + three-team workflow.

### Q4. What upstream intervention prevented failures without replacing Odoo?

Barcode validation + cost normalization + market-based price verification in **one product-onboarding process**:

```text
Receive product
→ collect physical sample
→ scan through POS
→ confirm exact product, brand and size
→ normalize barcode to Datalogic EAN-13
→ normalize case cost to unit cost
→ identify same-UPC or equivalent competitor price
→ evaluate financial viability
→ review name, cost, price and duplicates
→ prepare Excel batch
→ import into Odoo
→ independently rescan through POS
→ approve product for sale
```

**Pricing method (four core steps):**

1. Normalize vendor cost to the actual sellable unit  
2. Find market price for the **same UPC** or an **equivalent** product  
3. Compare market price with corrected unit cost  
4. Set product price **individually** — not one universal markup  

Retained: Odoo · four POS terminals · Datalogic scanner/scale · Excel batch bridge · human review for ambiguous products.

### Q5. Could floor staff operate the intervention without continuous designer involvement?

**Operationally yes** — observed transfer, not formal usability %.

**Team 1 — Collection and initial scan:** aisle-by-aisle samples → designated counter → POS scan  

**Team 2 — Normalization and Odoo update:** failed queue → normalize UPC · verify product info · Excel · Odoo  

**Team 3 — Independent POS revalidation:** rescan physical products; fails return to Team 2  

```text
Initial scan → failed-item queue → correction → Odoo update → independent physical rescan → pass or return
```

Staff observed teaching other staff by Day 3. No systematic participant counts, task-error rates, or assistance levels retained.

---

# Launch-week investigation and correction workflow

## Parallel channels

1. **Live checkout incidents** during **500+** transactions  
2. **Aisle-by-aisle audit** of the active launch assortment  

## Three teams

### Team 1 — Product collection and initial POS audit

One representative sample of each active product; scanned at a designated POS using the **same terminal/scanner config** as customer checkout.

Recorded: recognized · Item Not Found · wrong product · internal store code · needs normalization/catalog correction.

### Team 2 — Barcode normalization, cost/price review, catalog correction

- Normalize inconsistent UPC values to Datalogic / Odoo contract  
- Normalize case → unit cost where needed  
- Same-UPC or equivalent market check before locking sale price  
- Excel batches → Odoo updates  
- **~2,000 UPC records** corrected in 72 hours  
- Prioritized UPC-A checkout failures; kept working internal codes  

Also reviewed: duplicates · name mismatches · unit vs case · variable-weight · missing/incorrect price or cost · internal codes · existing records under a different barcode.

### Team 3 — Independent POS and scale verification

Pass only if physical product is retrieved by Odoo via checkout scanner/scale. Failures returned to Team 2.

## Live-checkout feedback loop

Unidentified register scans joined the same correction queue as aisle-audit failures while operations continued.

**Peak register workaround (role structure, not participant count):** at affected registers, three functional roles were used — **cashier**, **price matcher / runner**, and **POS editor** — so identification and catalog edits could happen without stopping every transaction.

---

# 2. Methods and sample

| Method | Sample / participants | Purpose | Output | Status |
| --- | ---: | --- | --- | --- |
| Checkout observation | **500+** total transactions in first 72h; failed-scan count **not retained** | Identify live recognition failures and workarounds | Operational incident queue | **Partial** |
| Floor / barcode audit | Aisle-by-aisle physical product sampling; exact product **N unresolved** | Proactively identify scan failures | Initial POS scan queue | **Partial** |
| Recovery workflow | **Three operational teams** | Separate discovery, correction, and independent verification | Closed-loop recovery process | **Done** qualitatively |
| Peak register roles | Cashier · price matcher/runner · POS editor | Keep selling while correcting | Role structure | **Done** as structure; headcount open |
| Cross-terminal test | Same affected codes vs four shared POS terminals | Rule out terminal-specific failure | Hardware-only hypothesis rejected | **Done** qualitatively |
| UPC correction | **~2,000** UPC records | Normalize affected records and update Odoo | Excel / Odoo correction batches | **Done** operationally |
| Post-fix validation | Corrected physical samples independently rescanned via POS/Datalogic; **N unresolved** | Confirm Odoo retrieval after correction | Pass / return-for-correction loop | **Partial** |
| Unit-cost / market-price review | Feb–Mar pricing method on onboarding path | Correct cost basis + defendable price | Onboarding pricing steps | Method locked; not every row dated to one competitor |

## Catalog denominators — do not merge

These figures may all be true for **different** populations. **Never** collapse them into one recognition-rate denominator.

| Denominator | Count | Source / qualification |
| --- | ---: | --- |
| Launch-window transactions | **500+** | Total processed; **not** failed-scan count |
| Older portfolio “active SKUs” | **2,500+** | Older artifact — possibly physically active launch SKUs; **unverified** against floor audit |
| Approximate UPC-A launch/recovery population | **3,000+** | Operational recollection; exact export not recovered |
| Corrected in first 72 hours | **~2,000** UPC records | Operational recollection; **not** proven unique SKUs |
| Active launch assortment (floor audit) | **TODO** | Exact floor-audit denominator not recovered |
| Post-fix validation set | **TODO** | Rescan log not recovered |
| First-pass revalidation rate | **TODO** | No numerator or validation denominator found |
| Later source catalog rows | **7,408** | Normalized product-master snapshot — **not** confirmed as launch assortment |
| Later rows with barcode values | **6,669** | Same snapshot |
| Later rows without barcode | **739** | Same snapshot |
| Later rows ready for lookup | **6,476** | Same snapshot |
| Later rows requiring barcode review | **52** | Same snapshot |
| Later internal / non-GTIN / unresolved | **141** | Same snapshot |
| Later unique normalized GTINs | **6,366** | Same snapshot |
| Later UPC groups with multiple names/prices | **137** | Same snapshot |
| Earlier Odoo export (prior note) | **6,890** | Prior export recollection — supersede only after reconciling dates with the 7,408 snapshot |

### Do not write

> Active launch assortment: 7,408 products.

### Write instead

> A later normalized catalog snapshot contained 7,408 source product rows, including 6,366 unique normalized GTINs. The exact active launch assortment remains unrecovered.

### Also do not write

> Recognition improved from X% to Y% …

…unless contemporaneous scan logs with denominators are recovered. Older portfolio KPI graphics with outcome percentages **lack underlying scan logs** and must not be treated as research evidence.

## Participant counts

| Group | Status |
| --- | --- |
| Three recovery teams (structure) | Known |
| Peak register roles (structure) | Known |
| Number of individual staff members | **TODO** |
| Customers observed (count) | **TODO** |
| Invoice-line comparison N | **TODO** |

---

# 3. Observed failure patterns

| ID | Observation | Confidence |
| --- | --- | --- |
| O1 | Failure follows product across shared catalog | High |
| O2 | UPC-A / EAN-13 / leading-zero / missing / wrong-code patterns dominate recognition failures | High |
| O3 | Case cost entered as unit cost creates bad pricing basis | High |
| O4 | Price without same-UPC/equivalent market check is hard to defend at checkout | High |
| O5 | Same name family can have multiple brands/sizes/prices (e.g. Jarritos, Goya) | High (catalog variation) |
| O6 | Temporary competitor-visible price match used for dispute trust — not permanent system | High |
| O7 | Stall 2–5 min common on affected lines (timed N soft) | Medium |

---

# 4. Hypothesis testing

| Hypothesis | Result |
| --- | --- |
| Scanner / one-terminal malfunction | **Rejected** |
| Terminal-specific config | **Rejected** |
| Barcode / catalog mismatch on UPC-A class | **Confirmed** |
| Receiving before validation | **Confirmed systemic** |
| Case→unit cost error + missing market check | **Confirmed contributing** (pricing-data problem) |
| Name-only matching is safe for price/barcode | **Rejected** |

---

# 5. Synthesized insights

| Insight | Confidence |
| --- | --- |
| Recognition and pricing integrity share one onboarding gate | High |
| Physical POS scan is the recognition test; independent rescan is the proof | High |
| Brand + size + unit/case are required identity fields, not optional | High |
| Individual pricing beats universal markup for this assortment | High |
| Three-team separation prevents self-confirming uploads | High |

### Residual risks

Duplicates · variable-weight · pack/unit mistakes · wrong variation priced · import errors · historic rows outside prioritized set · correction rows ≠ unique SKUs · competitor match temporary vs permanent governance.

---

# 6. Insight → decision map

| Finding | Decision |
| --- | --- |
| Shared catalog failures | Keep Odoo; don’t replace POS first |
| Need real checkout conditions | Team 1 physical POS audit |
| UPC-A format mismatch | Team 2 normalize → Excel → Odoo |
| Case cost / no market check | Fold unit-cost + same-UPC/equivalent check into onboarding |
| Upload ≠ proof | Team 3 independent rescan |
| Checkout disputes | Temporary visible-competitor match while pipeline fixed |

### Decision log

| Initial belief | Evidence | Concern | Options | Decision | Consequence |
| --- | --- | --- | --- | --- | --- |
| Scanners or one POS might be broken | Same barcodes fail on shared catalog; other products OK | Hardware swap = time/cost/disruption | Replace hardware; manual-only fixes; normalize upstream | Keep Odoo + Datalogic; three-team onboarding with barcode + unit-cost + market check + independent verify | Shared recognition recovery; pricing integrity moved into onboarding; no POS replacement |

---

# 7. Validation and outcomes

## What the evidence supports

- Individual product prices reviewed rather than one fixed markup  
- Unit cost needed normalization from case cost  
- Competitor prices checked using same UPC or equivalent product  
- Brand and package size matter when selecting a price  
- Pricing moved upstream into product onboarding  
- Physical POS validation required after catalog updates  
- ~2,000 UPC records corrected; 500+ transactions supported; three-team closed loop  

## What it does **not** prove

- All ~2,000 corrected records = unique SKUs  
- All 500+ transactions contained failures  
- All ~2,000 records were in the first-pass revalidation set  
- A specific pre/post recognition percentage  
- The number that passed on first independent rescan  
- That 7,408 later catalog rows = active launch assortment  
- That 2,500+ / 3,000+ / 7,408 describe the same denominator  
- Every February price came from one named competitor and collection date  
- Outcome percentages in older portfolio PDFs (no scan log / denominator)  

## Highest-value remaining metric

```text
Corrected products successfully retrieved on first independent rescan
÷ corrected products included in the first-pass validation set
```

**Searches did not recover this.** Public claims stay process-based until the rescan log is found.

Preferred once recovered:

> X of Y corrected UPC records were successfully retrieved during the first independent POS rescan.

---

# 8. Limitations and next steps

## Limitations

- Rapid live-launch investigation + Feb–Mar pricing method — not a controlled experiment.  
- Floor-audit **product N** and post-fix **validation N** remain open even though methods are known.  
- Later product-master workbook is a **post-launch snapshot**, not launch-week active assortment.  
- Conflicting assortment figures (2,500+ / 3,000+ / ~2,000 / 7,408 / 6,366) must stay separate.  
- Older portfolio KPI percentages lack source denominators — **not research evidence**.  
- Temporary competitor matching ≠ permanent pricing system / Competitor Watch.  
- No formal usability study retained.

## Still TODO (harder metrics only)

1. [ ] **First-pass revalidation: X of Y** (highest value)  
2. [ ] Active launch assortment N (floor audit)  
3. [ ] Confirm ~2,000 rows vs unique physical products  
4. [ ] Timed stall sample N / median  
5. [ ] Individual staff participant counts  
6. [ ] Invoice-line comparison N  
7. [ ] Reconcile catalog snapshots (6,890 vs 7,408) with export dates  

## Closed / partial (do not re-open as blank)

1. [x] 500+ transaction window (with failed-scan caveat)  
2. [x] Three-team recovery structure  
3. [x] ~2,000 UPC records corrected (with unique-SKU caveat)  
4. [x] Aisle-by-aisle + designated POS scan method  
5. [x] Independent POS/Datalogic revalidation **method**  
6. [x] Cross-terminal shared-catalog diagnosis  
7. [x] Peak register three-role workaround structure  
8. [x] Later catalog snapshot composition (7,408 / 6,366) as non-launch denominator  

## Relationship to other documents

| Artifact | Role |
| --- | --- |
| Portfolio case `/projects/bodega-ops` | Short systems story — use **defensible portfolio claim** (no recognition %) |
| **This appendix** | Research evidence trail |
| Older Framer / portfolio KPI PDFs | Narrative / graphics only — **not** metric source without logs |
| Competitor Watch | Ongoing Thursday market intelligence — not the temporary dispute match |
| Lola / CRM | Loyalty — out of scope here |
