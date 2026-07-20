# Checkout Operations — Research evidence appendix

**Document type:** Rapid operational investigation → evidence trail for portfolio / resume / interview defense  
**Not:** A controlled academic study or a Framer webpage printout  

**Status:** Qualitative research trail filled from launch investigation (2026-07-20). **Transaction counts, participant counts, active-assortment denominators, and timed-sample Ns remain TODO** — do not invent them. Catalog export composition is included **pending export-date confirmation**.

**How to use with the portfolio case:**  
`/projects/bodega-ops` = persuasive systems narrative.  
**This file** = research questions → method → sample → observations → hypotheses → insight → decision → measured/observed result → limitations.

**Locked architecture:** scan → trim to **Datalogic EAN-13** → **Excel** → **batch import to Odoo**. Not a public UPC API product path.

---

## Publishable claims (ceiling)

| Claim | Status | Public wording |
| --- | --- | --- |
| Store size | Locked | ~25,000 sq ft |
| Terminals | Locked | 4 shared POS · one Odoo catalog |
| Launch narrative | Locked | **Day-1 live launch week** (customers at registers) |
| Timeline | Locked | ~72h contain → diagnose → ship · ~1 week monitoring handoff |
| Tool timing | Locked | First usable version inside ~24h of focused build within the 72h window; staff taught staff by Day 3 |
| Fix | Locked | Datalogic EAN-13 trim → Excel → Odoo batch import + receiving-before-shelf |
| Catalog composition | **Pending export-date confirm** | 6,890 Odoo records (see §2) — **not** the active-assortment recognition denominator |
| Recognition pre | Ops estimate | ~60% workable on **active launch assortment** — active N still **TODO** |
| Recognition post | Observed validation | Near-complete on **revalidated active assortment** — **do not publish ~100%** without N |
| Stall pre / post | Observed range | 2–5 min → toward &lt;30s identification on affected lines — sample N **TODO** |
| Soft outcomes | Observed only | Fewer manager escalations · fewer price disputes · staff teach staff by Day 3 |
| Out of scope | Do not claim | Loyalty lift · cart abandonment “near-eliminated” · complaint drop · formal usability % |

---

# 1. Research brief

## Context

| Field | Value |
| --- | --- |
| Store | La Bodega Supermercado |
| Size | **25,000 sq ft** (locked) |
| POS | Odoo · 4 shared terminals · one shared product catalog |
| Role | Service designer · reported to CEO |
| Constraint | No POS replacement · no new hardware procurement in the recovery window |
| Decision deadline | ~72 hours |

## Research questions → answers

### Q1. Where in the workflow does product-data failure originate?

**Answer:** Primarily **upstream, between receiving and catalog setup**, not at the register.

Products reached shelves before barcode, name, price, cost, and pack configuration were reliably validated in Odoo. Stored barcode formats did not consistently match **Datalogic EAN-13** scanner/scale output. Because all four terminals shared one catalog, one bad or missing record failed everywhere. Checkout became the first place product data was tested — too late, with a customer waiting.

**Root-cause cluster:**

- Products shelved before POS validation  
- Missing product records  
- Stored formats not matching Datalogic EAN-13 output  
- UPC-A / EAN-13 / shortened / leading-zero / custom codes stored inconsistently  
- No clearly owned receiving → Odoo onboarding process  
- Insufficient review of price, cost, unit, pack size, and duplicates before import  

### Q2. Which barcode / catalog patterns are disproportionately affected?

**Answer — affected patterns:**

- Missing barcodes  
- Shortened or altered barcode values  
- UPC-A leading-zero added/removed inconsistently  
- 10–14 digit codes without one normalization rule  
- Variable-weight meat and produce labels  
- Odoo barcode ≠ Datalogic-transmitted barcode  
- Products missing from Odoo entirely  
- Duplicate / near-duplicate names forcing manual search  
- Case-versus-unit ambiguity  
- Vendor invoice lines that did not match Odoo name or barcode  

**Catalog composition from prior Odoo export** (add only after confirming export = launch catalog + recording **export date**):

| Metric | Count |
| --- | ---: |
| Total product records | **6,890** |
| Unique product names / SKUs | **6,496** |
| Duplicate product names | **306** |
| Products without barcodes | **682** |
| Products with barcodes | **6,208** |
| Ten-digit codes | **3,462** |
| Twelve-digit UPC-A | **1,893** |
| Thirteen-digit EAN | **420** |
| Other (11-, 14-digit, EAN-8, PLU, custom) | Smaller residual groups |

**Caution:** These counts describe **catalog composition**. They are **not** automatically the denominator for “active launch assortment” recognition rate.

### Q3. How do staff currently respond when products fail?

**Answer — improvised workarounds:**

- Call manager to identify / approve  
- Search by English product name  
- Look for a similar product in Odoo  
- Enter via generic / **Miscellaneous** item  
- Manually enter a price  
- Ask another cashier or floor employee  
- Temporarily set the product aside  
- Explain to customers that the store had just opened and the catalog was still being corrected  

**Risks of workarounds:** incorrect prices · poor product-level attribution · inventory discrepancies · unreliable margins · longer lines · manager interruptions · inconsistent customer experience  

**Containment (temporary):** split roles so one person continued checkout while another searched/corrected; early-close aisle walk to flag merchandise outside active checkout pressure. Protected revenue; did not fix the data problem.

### Q4. What upstream intervention can prevent failures without replacing Odoo?

**Answer — mandatory receiving-before-shelf onboarding:**

```text
Receive product
→ scan barcode
→ normalize to Datalogic EAN-13 contract
→ verify name, cost, sale price, unit and pack
→ check missing / duplicate records
→ approved rows → Excel
→ batch import into Odoo
→ test scan at POS
→ release to shelf
```

The tool handled repeatable formatting. Humans still reviewed identity, unit vs case, cost, sale price, tax, duplicates, variable-weight, and import errors. Odoo stayed system of record; no POS replacement or new hardware purchase.

### Q5. Can floor staff operate the intervention without technical assistance?

**Answer:** **Operationally yes — observed adoption, not a formal usability result.**

Evidence available:

- Usable version within ~24 hours of focused development  
- Recovery within ~72-hour window  
- Staff taught staff by Day 3  
- ~1 week monitoring handoff  
- Reduced designer involvement for scan → normalize → review → Excel → import  

**Defensible wording:**  
*Staff adopted the workflow during launch week and were observed teaching it to other staff by Day 3. This demonstrated operational transfer; no formal usability study or task-success measurement was retained.*

Do **not** claim measured task-success %, error rate, or time-on-task.

## Scope

**In scope:** Checkout recognition failure, barcode/catalog mismatch, receiving-before-shelf onboarding, scanner → Excel → Odoo path, role ownership, launch-week validation.

**Out of scope:** Loyalty enrollment, broad pricing strategy, Competitor Watch, CRM campaigns.

## Chronology (locked)

```text
Day-1 public opening / live launch week
→ Customer-facing “Item Not Found” across shared catalog
→ Containment (split roles + transparency script + early close aisle walk)
→ Diagnosis (floor audit · invoice↔POS · cross-terminal tests)
→ Upstream fix (onboarding + Datalogic EAN-13 trim → Excel → Odoo)
→ Post-fix validation on active assortment
→ Staff teach staff (Day 3) · monitoring handoff (~1 week)
```

---

# 2. Methods and sample

## Methods

| Method | Sample / participants | Purpose | Output | Status |
| --- | ---: | --- | --- | --- |
| Checkout observation | Affected lines · **N txns = TODO** | Failure patterns + workarounds | Incident notes | Qualitative filled; N TODO |
| Floor / barcode audit | Active launch assortment · **N = TODO** | Affected set estimate | Failure dataset | Patterns filled; N TODO |
| Staff interviews / shadowing | Cashiers, manager, receiving, restaurant/produce · **counts = TODO** | Ownership + escalation | Workflow map | Behaviors filled; counts TODO |
| Invoice ↔ Odoo compare | Invoice lines · **N = TODO** | Format / pack mismatch | Root-cause evidence | Pattern confirmed; N TODO |
| Cross-terminal test | Same affected codes on **all 4 terminals** | Rule out hardware-only fix | Eliminated hypotheses | **Done** |
| Odoo catalog export review | **6,890** records · **export date = TODO confirm** | Format composition | Composition table | **Pending date confirm** |
| Post-fix validation | Revalidated active assortment · **N = TODO** · all 4 terminals for full set? **TODO** | Recognition + timing | Outcome notes | Qualitative; N TODO |

## Participant table

| Group | Number | Research contribution |
| --- | ---: | --- |
| Cashiers | **TODO** | Checkout observation and error handling |
| Receiving / stock | **TODO** | Intake and shelving workflow |
| Restaurant / produce | **TODO** | Specialty barcode / prep flows |
| Store manager | **TODO** | Escalation and floor decisions |
| CEO / investors | **TODO** | Constraints and approvals |
| Customers observed | **TODO** | Delay behavior (observation only) |

## Catalog denominators

| Denominator | Count | Source / date |
| --- | ---: | --- |
| Total Odoo catalog records | **6,890** | Prior export — **confirm date ____** |
| Unique names / SKUs | **6,496** | Same export |
| Duplicate product names | **306** | Same export |
| Products with barcodes | **6,208** | Same export |
| Products without barcodes | **682** | Same export |
| Active launch assortment | **TODO** | Floor audit — **do not substitute 6,890** |
| Affected format-mismatch set (active) | **TODO** | Launch investigation |
| Corrected in 72h window | **TODO** | Work log |
| Post-fix validation set | **TODO** | Validation log |

---

# 3. Observed failure patterns

| ID | Observation (fact) | Evidence type | Frequency | Confidence |
| --- | --- | --- | --- | --- |
| O1 | Same affected item fails on all four terminals | Cross-register test | Consistent | **High** |
| O2 | Failures cluster by barcode / catalog format, not by register | Floor + POS compare | Common on affected set | **High** |
| O3 | Datalogic scales/scanners output EAN-13; many catalog codes did not match | Scale/scanner vs catalog | Primary failure class | **High** |
| O4 | Products reached shelf before reliable POS registration | Receiving observation | Common at launch | **High** |
| O5 | Staff workarounds: manager call, Miscellaneous, English-name search, manual price | Checkout observation | Common on affected lines | **High** |
| O6 | Affected-line stalls commonly 2–5 minutes (ID time, not payment) | Timed observation | Common · **N = TODO** | **Medium** |
| O7 | When cashiers explained launch delay, customers often stayed patient | Floor observation | Anecdotal | **Low** |
| O8 | Catalog contained mixed digit lengths and many missing barcodes | Odoo export (date TODO) | Composition fact | **Medium** until date confirmed |

**Do not publish O7 as an outcome.** Prefer: *During floor observation, customers appeared more receptive when cashiers explained that the store had just opened.*

### Evidence repository checklist

- [ ] Failed barcode photo / code samples  
- [ ] Odoo “Item Not Found” example  
- [ ] Invoice line vs catalog row  
- [ ] Observational notes excerpt  
- [ ] Staff quote (anonymized)  
- [ ] Import / Excel row example  
- [ ] Post-fix scan log  
- [ ] Odoo export file + **confirmed export date** (backs 6,890 table)  

---

# 4. Hypothesis testing

| Hypothesis | Test performed | Evidence | Result |
| --- | --- | --- | --- |
| Individual scanner malfunction | Same codes on multiple scanners / terminals | Same failure everywhere; other products scanned OK | **Rejected** |
| Terminal-specific config | Compared terminals | Failure followed product, not terminal | **Rejected** |
| Missing product records only | Invoice ↔ Odoo | Some absent; some present under altered codes | **Partial / contributing** |
| Format mismatch vs Datalogic EAN-13 | Scanner/scale output vs stored codes | Mismatch on affected class | **Confirmed** |
| Receiving workflow gap (shelf before validation) | Observed intake → shelf | Products shelved without onboarding | **Confirmed systemic cause** |

---

# 5. Synthesized insights

| Insight | Backed by | Confidence |
| --- | --- | --- |
| Checkout was acting as the first barcode test — too late | O4, O5, Q1 | High |
| Failure was catalog/format contract + shared DB, not four broken UIs | O1, O2, O3, Q2 | High |
| Upstream onboarding + EAN-13 normalization addresses recognition without replacing Odoo | Q4 + confirmed hypotheses | High |
| Human review gate still required | Tool design + residual risks | High |
| Staff can operate the path with observed transfer by Day 3 | Q5 | Medium (observed, not measured usability) |

### Residual risks (still possible after the fix)

Duplicate barcodes · variable-weight produce · incorrect pack/unit cost · bad sale price · Excel/import errors · stale or incomplete vendor data · manual review mistakes · historic catalog rows outside the active validation set · mixed digit-length legacy rows still in the 6,890 catalog.

**Prefer:** One upstream onboarding stage addressed connected failure categories — product recognition, pricing integrity at setup, revenue attribution hygiene, and role ownership — without claiming permanent elimination of every data or staff error.

---

# 6. Insight → decision map

| Finding | Principle | Decision |
| --- | --- | --- |
| Checkout was first barcode test | Validate before customer | Mandatory onboarding before shelving |
| Codes mismatched Datalogic EAN-13 | Normalize to hardware/catalog contract | Scanner tool trims to EAN-13 |
| Catalog lived in Odoo | Keep system of record | Excel export → batch import to Odoo |
| Inconsistent escalation | Explicit ownership | Role owners + checklist |
| Bad rows still possible after trim | Preserve human verification | Review gate before import |
| Containment needed before deep diagnosis | Protect revenue while investigating | Split checkout roles · early close aisle walk · then diagnose |

### Decision log (filled)

| Initial belief | Evidence shown | Concern / disagreement | Option evaluated | Final decision | Consequence |
| --- | --- | --- | --- | --- | --- |
| The scanners or one POS terminal might be malfunctioning | The same affected barcodes failed across all four terminals, while other products scanned successfully | Replacing scanners or the POS would require time, money, retraining, and launch disruption without addressing the shared catalog | Replace scanners/POS; manually correct items at checkout; or normalize product data upstream | Keep Odoo and existing hardware; introduce receiving-before-shelf onboarding with Datalogic EAN-13 normalization, human review, Excel, and Odoo batch import | Addressed the shared recognition problem without replacing the POS and moved product validation away from customer-facing checkout |

### Stakeholder ownership (lightweight RACI)

| Activity | Receiving | Cashier | Stock | Restaurant | Designer | CEO |
| --- | --- | --- | --- | --- | --- | --- |
| Scan / trim / Excel row | R | C | C | C | A (tool) | I |
| Price / name review gate | C | C | R/C | R/C | C | A |
| Odoo batch import | R/C | I | C | C | C | A |
| Floor escalation | C | R | C | C | C | A |

---

# 7. Validation and outcomes

## Metric definitions

### Recognition rate

```text
Products successfully retrieved by scan
÷ products in the named validation sample
```

| | Value | Evidence note |
| --- | --- | --- |
| Pre | ~60% workable (ops estimate) | Active launch assortment · **active N = TODO** — do not use 6,890 as this denominator |
| Post | Near-complete on revalidated set | **X of Y = TODO** · full set on all four terminals? **TODO** · date TODO |

**Public template when locked:**  
*Recognition rate: X of Y tested active products scanned successfully across four terminals after deployment.*

### Checkout identification time

```text
Time from first affected-item scan attempt → product identified
(exclude payment processing)
```

| | Value | Evidence note |
| --- | --- | --- |
| Pre | 2–5 min common | Observed stall range · **N = TODO** |
| Post | Toward &lt;30 sec | Observed post-fix · **N = TODO** |

**Public template when locked:**  
*Checkout identification time: median of X seconds across Y observed transactions, excluding payment.*

## Tool / usability evaluation

| Item | Status |
| --- | --- |
| Who used the prototype | Floor staff · **counts = TODO** |
| Tasks | Scan · trim · review · export · import |
| Independent operation | **Observed** — staff taught staff by Day 3 |
| Formal task-success / error rates | **Not retained** — do not invent |

### Product states to capture (screens / flows)

1. Recognized barcode  
2. EAN-13 trim / normalization  
3. Product not found  
4. Duplicate barcode  
5. Unit-vs-case ambiguity  
6. Missing cost  
7. Invalid sale price  
8. Excel / import validation failure  
9. Successful Odoo import  

## Soft claims — label correctly

| Claim | Label |
| --- | --- |
| Transparency script / customer patience | **Observation** (O7) |
| Fewer manager escalations | **Observed** — not counted |
| Fewer price disputes | **Observed** — not counted |
| Staff independent after Day 3 | **Observed operational transfer** |
| Loyalty at checkout | **Out of scope** |
| Cart abandonment near-eliminated | **Do not publish** |
| Complaints dropped | **Do not publish** |
| Formal usability success rate | **Do not publish** |

---

# 8. Limitations and next steps

## Limitations

- Rapid operational investigation, not a controlled research study.  
- ~60% recognition may be reconstructed from launch/ops notes; **active assortment N not locked**.  
- Post-fix validation focused on the **active launch assortment**, not every historic row in the 6,890 catalog.  
- Odoo composition table (6,890 / barcode digit lengths) awaits **export-date confirmation** before treating as launch-week fact.  
- Longer-term adoption assessed via workflow use and manager reports, not continuous instrumentation.  
- No formal usability protocol (task-success, error rate, time on task) was retained.  
- Transaction Ns, timing sample Ns, and participant counts remain incomplete.

## Still TODO (blocks harder public metrics)

1. [ ] Confirm Odoo export **date** (and that it matches the launch catalog)  
2. [ ] Active launch assortment N  
3. [ ] Recognition pre/post counts (X of Y) · validation date · whether full set on all 4 terminals  
4. [ ] Timing sample N (pre and/or post) · median if available  
5. [ ] Participant counts  
6. [ ] Exact count corrected in 72h window  
7. [ ] Attach evidence repository artifacts  

## Relationship to other documents

| Artifact | Role |
| --- | --- |
| Portfolio case `/projects/bodega-ops` | Short systems story for hiring managers |
| **This appendix** | Research evidence trail |
| Old 9-page Framer / PDF printout | Superseded for research claims |
| Lola / CRM / Competitor Watch | Loyalty, pricing strategy, Thursday intelligence — not checkout recovery |

When remaining TODOs are filled, update `src/data/projects.js` (bodega-ops) metrics to match — never exceed this ceiling.
