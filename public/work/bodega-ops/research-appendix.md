# Checkout Operations — Research evidence appendix

**Document type:** Rapid operational investigation → evidence trail for portfolio / resume / interview defense  
**Not:** A controlled academic study or a Framer webpage printout  

**Status:** Operational sample, correction volume, three-team workflow, and live validation method locked (2026-07-20). Remaining TODO: first-pass revalidation pass rate (e.g. X of ~2,000), timed stall sample N, participant headcounts, Odoo full-export date for the 6,890 composition table.

**How to use:**  
`/projects/bodega-ops` = short systems story.  
**This file** = research questions → method → sample → observations → hypotheses → insight → decision → measured/observed result → limitations.

**Locked architecture:** scan → normalize to **Datalogic / Odoo barcode contract** → **Excel** → **batch import to Odoo** → independent POS rescan. Not a public UPC API product path.

---

## Publishable claims (ceiling)

| Claim | Status | Public wording |
| --- | --- | --- |
| Store size | Locked | ~25,000 sq ft |
| Terminals | Locked | 4 shared POS · one Odoo catalog |
| Launch narrative | Locked | **Day-1 live launch week** |
| Timeline | Locked | First **72 hours** after launch · ~1 week monitoring handoff |
| Transactions (window) | Locked | **500+** customer transactions processed during the recovery window — **not** “500 failed scans” |
| Correction volume | Locked | **~2,000 UPC records** corrected — **not** automatically “2,000 unique physical products” unless the log confirms 1:1 |
| UPC-A scope | Locked | **3,000+** UPC-A-coded products in the active/relevant catalog; remaining products largely internal / specialized codes (retained when intentional and working) |
| Workflow | Locked | **Three teams:** collect+POS audit · normalize+Excel+Odoo · independent POS/scale verification |
| Validation method | Locked | Product validated only when the **physical sample** is successfully retrieved by Odoo via the **checkout scanner/scale** |
| Tool timing | Locked | First usable tool ~24h focused build inside the 72h window; staff teach staff by Day 3 |
| Recognition % | Soft / prefer process claim | Prefer the **defensible portfolio claim** below over “~100%” or unsubstantiated “near-complete” |
| Stall timing | Observed range | 2–5 min → toward &lt;30s on affected lines — timed sample N still soft |
| Out of scope | Do not claim | Loyalty lift · cart abandonment “near-eliminated” · formal usability % |

### Defensible portfolio claim (preferred)

> During the first 72 hours of a live store launch, I organized a three-team recovery workflow that combined checkout incidents with an aisle-by-aisle product audit. The team corrected approximately 2,000 UPC records and independently revalidated the products through the existing Odoo POS and Datalogic scanner/scale while supporting more than 500 customer transactions.

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

## Research questions → answers

### Q1. Where did the failure originate?

Primarily in the **upstream product-onboarding and catalog process**.

Products reached the sales floor with missing, inconsistent, or incompatible barcode records. Checkout became the first place many products were tested against Odoo. Because all four terminals shared one catalog, the failure followed the **product**, not a particular register.

### Q2. Which barcode patterns were most affected?

The relevant assortment included **3,000+ UPC-A-coded products**, plus products using **internal store codes** and specialized formats.

**~2,000 UPC records** required correction in the first 72 hours. Common problems: inconsistent barcode length, leading-zero differences, missing records, duplicates, and physical barcodes that did not match the code stored in Odoo.

**Internal codes were not automatically treated as errors** — retained when intentional and working correctly within the store’s catalog.

*(Secondary composition context from a full Odoo export — confirm export date before treating as launch-week fact: 6,890 total records · 6,208 with barcodes · 682 without · mixed digit lengths. Do not use 6,890 as the recognition denominator.)*

### Q3. How did staff respond to unidentified products?

**Live checkout:** unidentified products were escalated for manual identification or catalog correction (manager call, name search, Miscellaneous, manual price, etc.).

**In parallel, three-team workflow:**

1. Collect and initially scan product samples at a real POS  
2. Normalize barcodes and update Odoo via Excel batches  
3. Independently rescan corrected products through POS + Datalogic scanner/scale  

### Q4. What intervention prevented repeated failures?

A validation stage before products were considered checkout-ready:

```text
Physical product
→ POS scan test
→ normalization and catalog review
→ Excel batch
→ Odoo update
→ independent POS verification
→ approve or return for correction
```

Odoo remained system of record; existing Datalogic hardware retained.

### Q5. Could staff operate the intervention?

**Yes, operationally** — observed adoption, not a formal usability study.

Work was divided across three teams with clear handoffs. Staff collected products, generated a correction queue, updated records, and independently verified changes through POS. The workflow did not depend on one person performing every step.

---

# Launch-week investigation and correction workflow

During the first **72 hours** after launch, the store processed **more than 500** customer transactions across four shared POS terminals. Product-recognition failures were identified through **two parallel channels**:

1. **Live checkout incidents** — whenever a cashier scanned an item Odoo could not identify.  
2. **Proactive aisle-by-aisle audit** of the active launch assortment.

## Team 1 — Product collection and initial POS audit

Moved systematically through store aisles and collected **one representative sample of each active product**. Samples were brought to a designated POS counter and scanned using the **same checkout terminal and scanner configuration** used during customer transactions.

Recorded whether each product:

- Was immediately recognized by Odoo  
- Returned “Item Not Found”  
- Was associated with the wrong product  
- Used an internal store code rather than a standard UPC-A code  
- Required barcode normalization or catalog correction  

This tested products under **real checkout conditions**, not catalog rows in isolation.

## Team 2 — Barcode normalization and catalog correction

Handled products that failed the initial scan.

Used the barcode-normalization tool to convert inconsistent values into the format expected by the **Datalogic scanner and Odoo catalog**. Corrected records were organized in **Excel** and uploaded to Odoo through **batch updates**.

- **~2,000 UPC records** corrected during the initial 72-hour recovery  
- Active/relevant catalog included **3,000+ UPC-A-coded products**  
- Remaining products primarily used internal store codes or specialized formats  
- Effort **prioritized UPC-A products causing immediate checkout-recognition failures** rather than replacing every internal code  

Also reviewed cases that could not be safely fixed by normalization alone:

- Duplicate barcodes  
- Product-name mismatches  
- Unit-versus-case ambiguity  
- Variable-weight meat and produce  
- Missing or incorrect prices / cost  
- Internal-code products  
- Records that already existed in Odoo under a different barcode  

## Team 3 — Independent POS and scale verification

After Team 2 updated records, Team 3 **independently rescanned** corrected products using the POS terminal and Datalogic scanner/scale.

A product was considered **validated only when** the physical product was successfully retrieved by Odoo through the checkout scanner.

Failed verification items returned to the correction team — closed loop:

```text
Collect product sample
→ scan at POS
→ identify failure
→ normalize and update record
→ import into Odoo
→ independently rescan at POS
→ approve or return for correction
```

## Live-checkout feedback loop

The aisle audit ran **alongside** active customer checkout.

Whenever one of the four registers encountered an unidentified product during the **500+** transactions in the first 72 hours, the item entered the correction workflow — normalize, update Odoo, rescan — while store operations continued.

---

# 2. Methods and sample

| Method | Sample or participants | Purpose | Output | Status |
| --- | ---: | --- | --- | --- |
| Live checkout observation | **500+** transactions during first 72 hours | Identify real customer-facing scan failures and staff workarounds | Incident and correction queue | **Completed** operational sample |
| Aisle-by-aisle product audit | One representative sample from active products across the store | Test recognition before products hit checkout again | Initial scan-status dataset | **Completed** for prioritized launch assortment |
| Barcode and catalog review | **3,000+** UPC-A-coded products + internal-code products | Identify format and catalog mismatches | Affected-product dataset | **Completed** operational review |
| Barcode correction | **~2,000** UPC records | Normalize codes and correct Odoo records | Excel batches and Odoo updates | **Completed** during initial recovery |
| Cross-terminal diagnosis | Same affected products vs shared POS catalog | Rule out single-register / scanner-only failure | Eliminated hardware-only hypotheses | **Completed** |
| Post-update POS verification | Corrected physical samples rescanned via POS scanner/scale | Confirm successful product retrieval in Odoo | Pass/fail validation loop | **Completed** operationally |
| Staff workflow observation | Three operational teams + checkout staff | Evaluate divided operation by store staff | Role and handoff model | **Completed** qualitatively |
| Full Odoo export composition | **6,890** records (date **TODO confirm**) | Secondary format-mix context | Composition table | Pending date confirm |

## Participant table

| Group | Number | Contribution |
| --- | ---: | --- |
| Team 1 / 2 / 3 members | **TODO** headcount | Collection, correction, verification |
| Cashiers | **TODO** | Live incident queue |
| Store manager / leadership | **TODO** | Escalation and approvals |

## Denominators (do not mix)

| Denominator | Count | Notes |
| --- | ---: | --- |
| Launch-window transactions | **500+** | Total processed — **not** count of failed-scan transactions |
| UPC-A products in relevant catalog | **3,000+** | Prioritized correction scope |
| UPC records corrected in 72h | **~2,000** | Rows corrected — **not** proven unique physical SKUs 1:1 |
| First-pass revalidation pass rate | **TODO** | e.g. X of ~2,000 retrieved on first rescan |
| Full Odoo catalog export | **6,890** | Composition only · export date TODO |

---

# 3. Observed failure patterns

| ID | Observation | Confidence |
| --- | --- | --- |
| O1 | Same affected product fails across shared catalog / all registers | High |
| O2 | Failures cluster by barcode/catalog mismatch, not by terminal | High |
| O3 | Physical aisle samples fail/succeed under real POS + Datalogic config | High |
| O4 | Live checkout incidents feed the same correction queue as aisle audit | High |
| O5 | ~2,000 UPC records required correction in 72h within 3,000+ UPC-A scope | High |
| O6 | Internal codes often intentional — not auto-errors | High |
| O7 | Stall times 2–5 min common on affected lines (timed N soft) | Medium |

---

# 4. Hypothesis testing

| Hypothesis | Test | Result |
| --- | --- | --- |
| Scanner / one-terminal malfunction | Same products vs shared catalog; other products scan OK | **Rejected** |
| Terminal-specific config | Cross-register pattern | **Rejected** |
| Missing / mismatched catalog records | Aisle POS audit + Odoo updates | **Confirmed contributing** |
| Barcode normalization needed for UPC-A class | Tool + ~2,000 corrections | **Confirmed** |
| Receiving / onboarding gap | Shelf before checkout-ready validation | **Confirmed systemic** |

---

# 5. Synthesized insights

| Insight | Confidence |
| --- | --- |
| Checkout was the first barcode test — too late | High |
| Parallel live incidents + aisle audit beats reactive-only fixes | High |
| Separate detection / correction / verification teams prevent self-confirming updates | High |
| Prioritize UPC-A checkout failures; keep working internal codes | High |
| Independent POS rescan is the validation gate — not “Excel uploaded” | High |

### Residual risks

Duplicates · variable-weight · pack/unit · price/cost errors · import failures · historic rows outside prioritized set · correction log may count rows ≠ unique products.

---

# 6. Insight → decision map

| Finding | Decision |
| --- | --- |
| Failures follow product across shared catalog | Do not replace POS/scanners as first move |
| Need real checkout conditions | Team 1 scans physical samples at live POS config |
| Format mismatch on UPC-A class | Team 2 normalize → Excel → Odoo batch |
| Upload ≠ proof | Team 3 independent rescan required for pass |
| Launch still running | Live incident queue + aisle audit in parallel |

### Decision log

| Initial belief | Evidence | Concern | Options | Decision | Consequence |
| --- | --- | --- | --- | --- | --- |
| Scanners or one POS might be broken | Same barcodes fail across shared catalog; other products OK | Replace hardware = time, cost, disruption | Replace hardware; manual checkout fixes only; normalize upstream | Keep Odoo + Datalogic; three-team onboarding + normalize + independent verify | Shared recognition recovery without POS replacement; validation moved off the customer-only path |

---

# 7. Validation and outcomes

## What happened in the first 72 hours

- Supported **500+** customer transactions  
- Audited active assortment via **physical product samples**  
- Identified failures through **checkout incidents + aisle testing**  
- Corrected **~2,000 UPC records**  
- Ran **three-team** correction + independent verification  
- Confirmed corrected products by **rescanning through actual POS + Datalogic**  
- Retained Odoo and existing checkout hardware  

## Metric caveats (critical)

| Figure | Means | Does **not** mean |
| --- | --- | --- |
| 500+ | Transactions processed in the recovery window | 500 transactions with scan failures |
| ~2,000 | UPC **records** corrected | Proven unique physical products (unless log is 1:1) |
| 3,000+ | UPC-A-coded products in relevant catalog | Every product in the store |
| Independent rescan | Operational pass/fail loop completed | Published first-pass % until X of Y recovered |

**Stronger than inventing a recognition %:** describe the **correction and validation process** with the numbers above.  
**Next metric to recover:** first-pass revalidation rate — e.g. *“1,920 of 2,000 corrected records successfully retrieved on first revalidation.”*

## Soft claims

| Claim | Label |
| --- | --- |
| Staff three-team operation | Observed operational adoption |
| Day-3 staff teach staff | Observed transfer |
| Stall 2–5 min → &lt;30s | Observed range · N soft |
| Formal usability % | Do not publish |
| ~100% recognition | Do not publish |

---

# 8. Limitations and next steps

## Limitations

- Rapid live-launch investigation, not a controlled experiment.  
- 500+ is a **transaction window** sample, not a failure-count sample.  
- ~2,000 are **corrected records**, not proven unique SKUs without log confirmation.  
- First-pass independent-rescan **pass rate** not yet recovered from the validation log.  
- Timed identification-time sample N not locked.  
- Full 6,890 export composition awaits **export-date** confirmation.  
- No formal usability task-success study retained.

## Still TODO

1. [ ] First-pass revalidation: X of ~2,000 (or of unique products if log differs)  
2. [ ] Timed stall sample N / median  
3. [ ] Team / cashier headcounts  
4. [ ] Confirm whether ~2,000 rows = unique physical products  
5. [ ] Confirm Odoo 6,890 export date  

## Relationship to other documents

| Artifact | Role |
| --- | --- |
| Portfolio case `/projects/bodega-ops` | Short systems story — use **defensible portfolio claim** |
| **This appendix** | Research evidence trail |
| Old 9-page Framer PDF | Superseded for research claims |
| Lola / CRM / CW | Loyalty and pricing intelligence — not this recovery |
