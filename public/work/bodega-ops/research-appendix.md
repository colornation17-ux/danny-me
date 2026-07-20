# Checkout Operations — Research evidence appendix

**Document type:** Rapid operational investigation → evidence trail for portfolio / resume / interview defense  
**Not:** A controlled academic study or a Framer webpage printout  

**Status:** Structure locked to the research trail below. Cells marked **TODO** block harder public metrics until filled from source records. Do not invent denominators.

**How to use with the portfolio case:**  
`/projects/bodega-ops` = persuasive systems narrative.  
**This file** = research questions → method → sample → observations → hypotheses → insight → decision → measured/observed result → limitations.

**Locked architecture (do not regress):** scan → trim to **Datalogic EAN-13** → **Excel** → **batch import to Odoo**. Not a public UPC API product path.

---

## Publishable claims (ceiling until TODOs filled)

| Claim | Status | Public wording |
| --- | --- | --- |
| Store size | Locked | ~25,000 sq ft |
| Terminals | Locked | 4 shared POS · one Odoo catalog |
| Launch narrative | Locked | **Day-1 live launch week** (customers at registers) |
| Timeline | Locked | ~72h contain → diagnose → ship · ~1 week monitoring handoff |
| Tool timing | Locked | First usable version inside ~24h of focused build within the 72h window; staff taught staff by Day 3 |
| Fix | Locked | Datalogic EAN-13 trim → Excel → Odoo batch import + receiving-before-shelf |
| Recognition pre | Ops estimate | ~60% workable on **active launch assortment** — denominator **TODO** |
| Recognition post | Observed validation | Near-complete on **revalidated active assortment** — **do not publish ~100%** without N |
| Stall pre / post | Observed range | 2–5 min → toward &lt;30s identification on affected lines — sample N **TODO** |
| Soft outcomes | Observed only | Fewer manager escalations · fewer price disputes · independent staff use after Day 3 |
| Out of scope here | Do not claim | Loyalty lift · cart abandonment “near-eliminated” · complaint drop · “enforceable margins” as checkout metrics |

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

## Research questions

1. Where in the workflow does product-data failure originate (receiving, catalog, barcode format, terminal, or staff practice)?
2. Which barcode / catalog patterns are disproportionately affected across all four terminals?
3. How do staff currently respond when products fail at scan?
4. What upstream intervention can prevent failures before checkout without replacing Odoo?
5. Can floor staff operate the intervention without ongoing designer presence?

## Scope

**In scope:** Checkout recognition failure, barcode/catalog mismatch, receiving-before-shelf onboarding, scanner → Excel → Odoo import path, role ownership, launch-week validation.

**Out of scope (separate cases / appendix only):** Loyalty enrollment, broad grocery/restaurant menu pricing strategy, Competitor Watch benchmarking, CRM campaigns.

## Chronology (locked narrative)

```text
Day-1 public opening / live launch week
→ Customer-facing “Item Not Found” across shared catalog
→ Containment (split checkout roles + transparency script + early close for aisle walk)
→ Diagnosis (floor audit · invoice↔POS · cross-terminal tests)
→ Upstream fix (onboarding stage + Datalogic EAN-13 trim tool → Excel → Odoo)
→ Post-fix validation on active assortment
→ Staff teach staff (Day 3) · monitoring handoff (~1 week)
```

Do **not** mix a “store opening in 24 hours / pre-open dry run” story with Day-1 live failures. This recovery is **Day-1 live**.

---

# 2. Methods and sample

## Methods

| Method | Sample / participants | Purpose | Output | Status |
| --- | ---: | --- | --- | --- |
| Checkout observation | Affected lines · **N txns = TODO** | Failure patterns + workarounds | Incident notes | Partial |
| Floor / barcode audit | Active launch assortment · **N products = TODO** · aisles TODO | Affected set estimate | Failure dataset | Partial |
| Staff interviews / shadowing | Cashiers, manager, receiving, restaurant/produce · **counts = TODO** | Ownership + escalation | Workflow map | Partial |
| Invoice ↔ Odoo compare | Invoice lines · **N = TODO** | Format / pack mismatch | Root-cause evidence | Partial |
| Cross-terminal test | Same codes on all 4 terminals | Rule out hardware-only fix | Eliminated hypotheses | Done (qualitative) |
| Post-fix validation | Revalidated active assortment · **N = TODO** · 4 terminals? TODO | Recognition + timing | Outcome notes | Partial |

## Participant table (fill counts)

| Group | Number | Research contribution |
| --- | ---: | --- |
| Cashiers | TODO | Checkout observation and error handling |
| Receiving / stock | TODO | Intake and shelving workflow |
| Restaurant / produce | TODO | Specialty barcode / prep flows |
| Store manager | TODO | Escalation and floor decisions |
| CEO / investors | TODO | Constraints and approvals |
| Customers observed | TODO | Delay / abandonment behavior (observation only) |

## Catalog denominators (do not mix)

| Denominator | Count | Source / date |
| --- | ---: | --- |
| Total Odoo catalog records | TODO | Export date ____ |
| Active launch assortment | TODO | Floor audit date ____ |
| Affected format-mismatch set | TODO | Invoice / scan compare |
| Corrected in 72h window | TODO | Work log |
| Post-fix validation set | TODO | Validation log |

---

# 3. Observed failure patterns

Raw observations **before** interpretation. Prefer notes and examples over slogans.

| ID | Observation (fact) | Evidence type | Frequency | Confidence |
| --- | --- | --- | --- | --- |
| O1 | Same affected item fails on all four terminals | Cross-register test | Consistent | High |
| O2 | Failures cluster by barcode / catalog format, not by register | Floor + POS compare | Common on affected set | High |
| O3 | Datalogic scales output EAN-13; many catalog codes did not match that contract | Scale output vs catalog | Primary failure class | High |
| O4 | Products reached shelf before reliable POS registration | Receiving observation | Common at launch | High |
| O5 | Staff workarounds: manager call, Miscellaneous charge, English-name search | Checkout observation | Common on affected lines | High |
| O6 | Affected-line stalls commonly 2–5 minutes (ID time, not payment) | Timed observation | Common · **N = TODO** | Medium |
| O7 | When cashiers explained launch delay, customers often stayed patient | Floor observation | Anecdotal | Low |

**Do not publish O7 as an outcome.** Prefer: *During floor observation, customers appeared more receptive when cashiers explained that the store had just opened.*

### Evidence repository checklist (attach anonymized artifacts)

- [ ] Failed barcode photo / code samples  
- [ ] Odoo “Item Not Found” example  
- [ ] Invoice line vs catalog row  
- [ ] Observational notes excerpt  
- [ ] Staff quote (anonymized)  
- [ ] Import / Excel row example  
- [ ] Post-fix scan log  

---

# 4. Hypothesis testing

| Hypothesis | Test performed | Evidence | Result |
| --- | --- | --- | --- |
| Individual scanner malfunction | Same codes on multiple scanners / terminals | Same failure everywhere | **Rejected** |
| Terminal-specific config | Compared terminals | Failure followed product, not terminal | **Rejected** |
| Missing product records only | Invoice ↔ Odoo | Some absent; some present under altered codes | **Partial / contributing** |
| Format mismatch vs Datalogic EAN-13 | Scale output vs stored codes | Mismatch on affected class | **Confirmed** |
| Receiving workflow gap (shelf before validation) | Observed intake → shelf | Products shelved without onboarding | **Confirmed systemic cause** |

---

# 5. Synthesized insights

| Insight | Backed by | Confidence |
| --- | --- | --- |
| Checkout was acting as the first barcode test — too late | O4, O5 | High |
| The failure was catalog/format contract + shared DB, not four broken UIs | O1, O2, O3 | High |
| Upstream onboarding + EAN-13 normalization addresses recognition path without replacing Odoo | Hypotheses confirmed + tool path | High |
| Human review gate still required (price, name, pack, duplicates) | Tool design + residual risks | High |

### Residual risks (still possible after the fix)

Duplicate barcodes · variable-weight produce · incorrect pack/unit cost · bad sale price · Excel/import errors · stale or incomplete vendor data · manual review mistakes · historic catalog rows outside the active validation set.

**Better absolute wording (avoid):** “One structural insertion. Four failure categories resolved.”  
**Prefer:** One upstream onboarding stage addressed connected failure categories — product recognition, pricing integrity at setup, revenue attribution hygiene, and role ownership — without claiming permanent elimination of every data or staff error.

---

# 6. Insight → decision map

| Finding | Principle | Decision |
| --- | --- | --- |
| Checkout was first barcode test | Validate before customer | Mandatory onboarding before shelving |
| Codes mismatched Datalogic EAN-13 | Normalize to hardware/catalog contract | Scanner tool trims to EAN-13 |
| Catalog lived in Odoo | Keep system of record | Excel export → batch import to Odoo |
| Inconsistent escalation | Explicit ownership | Role owners + checklist (Receiving, Cashier, Stock, Restaurant) |
| Bad rows still possible after trim | Preserve human verification | Review gate before import |
| Containment needed before deep diagnosis | Protect revenue while investigating | Split checkout roles · early close for aisle walk · then diagnose |

### Decision log pattern (PDM evidence — fill examples)

| Initial belief | Evidence shown | Concern / disagreement | Option evaluated | Final decision | Consequence |
| --- | --- | --- | --- | --- | --- |
| TODO e.g. “fix one register / replace scanners” | Cross-terminal same failure | Time / cost | Replace POS vs upstream normalize | Upstream EAN-13 + onboarding | Shared catalog recovered without POS swap |
| TODO | | | | | |

### Stakeholder ownership (lightweight RACI)

| Activity | Receiving | Cashier | Stock | Restaurant | Designer | CEO |
| --- | --- | --- | --- | --- | --- | --- |
| Scan / trim / Excel row | R | C | C | C | A (tool) | I |
| Price / name review gate | C | C | R/C | R/C | C | A |
| Odoo batch import | R/C | I | C | C | C | A |
| Floor escalation | C | R | C | C | C | A |

R = responsible · A = accountable · C = consulted · I = informed — adjust when real RACI is recovered from launch notes.

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
| Pre | ~60% workable (ops estimate) | Active launch assortment · **N = TODO** · reconstructed from floor/ops notes if needed |
| Post | Near-complete on revalidated set | **X of Y** TODO · all four terminals? TODO · date TODO |

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

## Tool / usability evaluation (gap — do not fake)

Not yet documented as a formal usability study. Needed for research rigor:

| Item | Status |
| --- | --- |
| Who used the prototype | Staff on floor · counts TODO |
| Tasks tested | Scan · trim · review · export · import |
| Error states exercised | Duplicate · missing cost · bad price · import failure · **screens TBD** |
| Independent operation | Staff taught staff by Day 3 (observed) |

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
| Transparency script / customer patience | **Observation** (O7) — not measured goodwill |
| Fewer manager escalations | **Observed** — not counted |
| Fewer price disputes | **Observed** — not counted |
| Staff independent after Day 3 | **Observed** |
| Loyalty at checkout | **Out of scope** — Lola / CRM case |
| Cart abandonment near-eliminated | **Do not publish** without count |
| Complaints dropped | **Do not publish** without count |

---

# 8. Limitations and next steps

## Limitations

- This was a **rapid operational investigation**, not a controlled research study.  
- Some baseline measures (including ~60% recognition) may be **reconstructed from launch/ops notes**.  
- Post-fix validation focused on the **active launch assortment**, not every historic catalog row.  
- Longer-term adoption was assessed through workflow use and manager reports, not continuous instrumentation.  
- Observer effect on staff behavior is possible.  
- Participant counts, transaction Ns, and invoice Ns remain incomplete until source fill.  
- No formal usability protocol with error-rate logging was retained for the scanner tool.

## Next fill session (blocks harder metrics)

1. [ ] Active assortment N (+ optional total catalog N)  
2. [ ] Recognition pre/post counts · date · all four terminals?  
3. [ ] Timing sample N (pre and/or post)  
4. [ ] Participant counts  
5. [ ] Attach evidence repository artifacts (section 3)  
6. [ ] One filled decision-log row (section 6)  
7. [ ] Product-state screens for error paths (section 7)  

## Relationship to other documents

| Artifact | Role |
| --- | --- |
| Portfolio case `/projects/bodega-ops` | Short systems story for hiring managers |
| **This appendix** | Research evidence trail |
| Old 9-page Framer / PDF printout | Superseded for research claims — do not circulate as the evidence source |
| Lola / CRM / Competitor Watch | Loyalty, pricing strategy, Thursday intelligence — not checkout recovery |

When TODOs above are filled, update `src/data/projects.js` (bodega-ops) metrics to match — never exceed this ceiling.
