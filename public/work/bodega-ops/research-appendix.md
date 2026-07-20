# Checkout Operations — Research & evidence appendix

**Status:** Partial lock. Store size, architecture, Day-1 narrative, and claim labels are locked. **SKU denominators and sample Ns stay unpublished** until filled from source records.

**Relationship to the case study:** The portfolio page tells *what happened*. This document proves *how you know*. Public copy must match the **Publishable claims** section below — nothing stronger.

---

## Publishable claims (use these only)

| Claim | Status | Public wording |
| --- | --- | --- |
| Store size | **Locked** | ~25,000 sq ft |
| Terminals | **Locked** | 4 shared POS · one Odoo catalog |
| Timeline | **Locked** | ~72 hours contain → diagnose → ship · ~1 week monitoring handoff |
| Launch narrative | **Locked** | **Day-1 live launch week** (customers at registers) — not a pre-open dry run |
| Fix architecture | **Locked** | Scan → trim to Datalogic EAN-13 → Excel → batch import to Odoo |
| Recognition pre | **Ops estimate** | Roughly ~60% workable scans on the **active launch assortment** (reconstructed from floor audit / ops notes — not a locked N) |
| Recognition post | **Observed validation** | Near-complete success on the **revalidated active assortment** after EAN-13-aligned import — **do not publish “~100%”** without numerator/denominator |
| Checkout stall pre | **Observed range** | 2–5 minutes common on affected lines (timed observation, sample N not locked) |
| Checkout ID time post | **Observed range** | Toward &lt;30 seconds identification on affected lines post-fix (sample N not locked) |
| Soft outcomes | **Observed only** | Fewer manager escalations · fewer price disputes · staff taught staff by Day 3 |
| Loyalty at checkout | **Hypothesis** | Do not attribute to recovery |

---

## 1. Research brief

### Research questions

1. Why were products failing at checkout across multiple terminals?
2. Which failures came from workflow, product data, barcode formatting, pricing, or hardware?
3. What intervention could restore checkout without replacing the POS?

### Context

| Field | Value |
| --- | --- |
| Store | La Bodega Supermercado |
| Store size (sq ft) | **25,000** — locked |
| Terminals | 4 shared POS |
| Launch window | **Day-1 live launch week** — customers at registers (locked) |
| Decision deadline | ~72 hours contain → diagnose → ship |
| Role / authority | Service designer · reported to CEO |
| Constraint | No POS replacement · no new hardware procurement in window |

---

## 2. Methods

| Method | Sample / participants | Purpose | Output |
| --- | ---: | --- | --- |
| Checkout observation | Observed stalls on affected lines · **N = TODO** | Failure patterns + workarounds | Incident log |
| Barcode / floor audit | Active launch assortment · **N = TODO** products · aisles TODO | Affected assortment estimate | Failure dataset |
| Staff interviews | Cashiers, manager, receiving, restaurant / produce | Ownership + escalation | Workflow map |
| Invoice ↔ POS compare | Invoice lines · **N = TODO** | Format / pack mismatch | Root-cause matrix |
| Scanner translation test | Shared catalog across 4 terminals | Rule out hardware fix | Eliminated hypothesis |
| Post-fix validation | Revalidated active assortment · **N = TODO** | Recognition + timing | Outcome dataset |

---

## 3. Participants & sources

### Frontline (anonymize names in public materials)

- Cashiers (all four shared terminals)
- Store manager
- Receiving / stock
- Restaurant / produce

### Leadership

- CEO / investor
- Co-investor
- Store manager

### Artifacts

- Vendor invoices
- POS / Odoo product exports
- Failed barcode examples
- Register observations
- Decision log (launch week)

---

## 4. Facts vs interpretation vs conclusion

| Type | Meaning |
| --- | --- |
| **Observed fact** | Counted or recorded event |
| **Interpretation** | Working explanation |
| **Validated conclusion** | Survived competing hypotheses |

| Observation | Evidence | Frequency | Confidence |
| --- | --- | ---: | --- |
| Products shelved before POS registration | Receiving observation | Common during launch | High |
| Codes mismatched Datalogic EAN-13 scale output | Invoice vs POS / scale | Primary failure class | High |
| Same code failed on all terminals | Cross-register test | Consistent | High |

---

## 5. Root-cause matrix

| Hypothesis | For | Against | Decision |
| --- | --- | --- | --- |
| Individual scanner fault | Failures at scan | Same items failed on all terminals | Rejected |
| Terminal-specific config | Multiple terminals | Pattern followed barcode type | Rejected |
| Missing product records | “Item Not Found” | Some items existed under altered codes | Partial |
| Format mismatch with Datalogic EAN-13 | Scale output vs catalog codes | Broader historic catalog may still need cleanup | Confirmed — tool trims to Datalogic EAN-13 |
| Receiving workflow gap | Shelf before validation | Didn’t explain all historic records | Contributing |

---

## 6. Insight → decision map

| Finding | Principle | Decision |
| --- | --- | --- |
| Checkout was first barcode test | Validate before customer | Mandatory onboarding before shelving |
| Codes didn’t match Datalogic EAN-13 scale output | Normalize to hardware/catalog contract | Scanner tool trims barcodes to EAN-13 |
| Catalog lived in Odoo | Keep existing system of record | Excel export → batch import to Odoo |
| Inconsistent escalation | Explicit ownership | Role owners + checklist |
| Bad rows still possible after trim | Preserve human verification | Review gate before import |

---

## 7. Metric definitions

### Recognition rate

```text
Products successfully retrieved by scan
÷ products in the named validation sample
```

| | Value | Notes |
| --- | --- | --- |
| Pre | ~60% workable (ops estimate) | Active launch assortment — **denominator TODO** |
| Post | Near-complete on revalidated sample | **Do not publish ~100%** until N locked |
| Sample | TODO products · date ____ · all four terminals? ____ |

### Checkout identification time

```text
Time from first affected-item scan attempt → product identified
(exclude payment processing)
```

| | Value | Notes |
| --- | --- | --- |
| Pre | 2–5 min common | Observed stall range on affected lines |
| Post | Toward &lt;30 sec | Observed post-fix on affected lines |
| Sample | TODO transactions · date ____ |

### Catalog denominators (do not mix) — fill to unlock harder claims

| Denominator | Count | Source |
| --- | ---: | --- |
| Total catalog records | TODO | Odoo export date ____ |
| Active launch assortment | TODO | Floor audit date ____ |
| Affected EAN-13 / format-mismatch set | TODO | Invoice compare |
| Corrected in 72h window | TODO | Work log |

### Soft claims — observed, not measured

- Customer goodwill / complaint drop → observed unless counted  
- Cart abandonment “near-eliminated” → do not publish without count  
- “No ongoing maintenance” → hypothesis; state residual support  

---

## 8. Architecture note (locked)

**Pipeline:** scan barcode → **trim to match Datalogic scales’ EAN-13 output** → save to **Excel** → **batch import to Odoo**.

No POS replacement. Odoo remained the system of record. The tool’s job was format alignment with Datalogic EAN-13 so imported rows matched what checkout and scales already expected.

---

## 9. Limitations

- Live launch recovery, not a controlled experiment  
- Pre-fix recognition (~60%) may be reconstructed from ops notes — mark as ops estimate  
- Validation may cover active assortment, not every historic catalog row  
- Observer effect on staff behavior possible  
- Longer-term adoption needs continuous instrumentation  

---

## 10. Fill session (blocks harder public metrics)

Paste or reply with these five fields to upgrade “ops estimate / observed” → locked measured:

1. [x] Store sq ft — **25,000**
2. [ ] Active launch assortment N (and optional total catalog N)
3. [ ] Recognition: pre count / post count / sample date / all four terminals?
4. [ ] Checkout timing: sample N transactions (pre and/or post)
5. [x] Day-0 vs Day-1 — **Day-1 live launch week**
6. [ ] Strip resume / LinkedIn / portfolio to the same locked set

### Resume / LinkedIn alignment (when Ns locked)

- Prefer decision + architecture language over “60% → 100%”
- Suggested shape: *Led launch-week checkout recovery on Odoo (4 shared terminals): diagnosed Datalogic EAN-13 format mismatch, moved validation upstream, shipped scanner → Excel → Odoo batch import; restored workable recognition on the active assortment within ~72 hours.*
- Do not use “~100% SKU recognition” until appendix section 7 sample is filled.
- Keep Lola wording aligned: “did not require staff escalation” (not “closed without staff”).
