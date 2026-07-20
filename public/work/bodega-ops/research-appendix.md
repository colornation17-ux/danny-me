# Checkout Operations — Research & evidence appendix

**Status:** Working draft. Replace every `TODO` with locked numbers from source records before citing in the portfolio case study, resume, or LinkedIn.

**Relationship to the case study:** The portfolio page tells *what happened*. This document proves *how you know*.

---

## 1. Research brief

### Research questions

1. Why were products failing at checkout across multiple terminals?
2. Which failures came from workflow, product data, barcode formatting, pricing, or hardware?
3. What intervention could restore checkout without replacing the POS?

### Context (fill precisely)

| Field | Value |
| --- | --- |
| Store | La Bodega Supermercado |
| Store size (sq ft) | **25,000** — locked |
| Terminals | 4 shared POS |
| Launch window | TODO — pre-open dry run vs Day-1 live (pick one timeline) |
| Decision deadline | ~72 hours contain → diagnose → ship |
| Role / authority | Service designer · reported to CEO |
| Constraint | No POS replacement · no new hardware procurement in window |

---

## 2. Methods

| Method | Sample / participants | Purpose | Output |
| --- | ---: | --- | --- |
| Checkout observation | TODO transactions | Failure patterns + workarounds | Incident log |
| Barcode / floor audit | TODO products · TODO aisles | Affected assortment estimate | Failure dataset |
| Staff interviews | TODO roles | Ownership + escalation | Workflow map |
| Invoice ↔ POS compare | TODO invoice lines | Format / pack mismatch | Root-cause matrix |
| Scanner translation test | TODO devices | Rule out hardware fix | Eliminated hypothesis |
| Post-fix validation | TODO products / TODO txns | Recognition + timing | Outcome dataset |

---

## 3. Participants & sources

### Frontline (anonymize names)

- TODO cashiers  
- TODO store manager  
- TODO receiving / stock  
- TODO restaurant / produce  

### Leadership

- CEO / investor  
- Co-investor  
- Store manager  

### Artifacts

- Vendor invoices  
- POS product exports  
- Failed barcode examples  
- Register observations  
- Decision log (launch week)  

---

## 4. Facts vs interpretation vs conclusion

Use these labels in notes and in any published metric:

| Type | Meaning |
| --- | --- |
| **Observed fact** | Counted or recorded event |
| **Interpretation** | Working explanation |
| **Validated conclusion** | Survived competing hypotheses |

Example pattern (replace with real counts):

| Observation | Evidence | Frequency | Confidence |
| --- | --- | ---: | --- |
| Products shelved before POS registration | Receiving observation | TODO | High / Med / Low |
| Leading-zero EAN-13 failed lookup | Invoice vs POS | TODO | High / Med / Low |
| Same code failed on all terminals | Cross-register test | TODO | High / Med / Low |

---

## 5. Root-cause matrix

| Hypothesis | For | Against | Decision |
| --- | --- | --- | --- |
| Individual scanner fault | Failures at scan | Same items failed on all terminals | Rejected |
| Terminal-specific config | Multiple terminals | Pattern followed barcode type | Rejected |
| Missing product records | “Item Not Found” | Some items existed under altered codes | Partial |
| Leading-zero normalization | EAN-13 / UPC mismatch | Needed broader sample | Confirmed (pending TODO sample) |
| Receiving workflow gap | Shelf before validation | Didn’t explain all historic records | Contributing |

---

## 6. Insight → decision map

| Finding | Principle | Decision |
| --- | --- | --- |
| Checkout was first barcode test | Validate before customer | Mandatory onboarding before shelving |
| Leading-zero formats failed | Normalize upstream | EAN-13 → UPC-A in tool |
| Inconsistent escalation | Explicit ownership | Role owners + checklist |
| Manual name search | Reduce re-entry | Browser UPC lookup (public API; no custom backend) |
| Spreadsheet cleanup before import | Remove formatting work | POS-ready CSV + human review gate |

---

## 7. Metric definitions (lock before publishing)

### Recognition rate

```text
Products successfully retrieved by scan
÷ products in the named validation sample
```

- Pre value: TODO (e.g. ~60% of active assortment)  
- Post value: TODO (avoid “~100%” without numerator/denominator)  
- Sample: TODO products · date · all four terminals? Y/N  

### Checkout identification time

```text
Time from first affected-item scan attempt → product identified
(exclude payment processing)
```

- Pre: TODO (portfolio previously used 2–5 min as observed stall)  
- Post: TODO (portfolio previously used <30 sec)  
- Sample: TODO transactions  

### Catalog denominators (do not mix)

| Denominator | Count | Source |
| --- | ---: | --- |
| Total catalog records | TODO | POS export date ____ |
| Active launch assortment | TODO | Floor audit date ____ |
| Affected EAN-13 / leading-zero set | TODO | Invoice compare |
| Corrected in 72h window | TODO | Work log |

### Soft claims — label as observed, not measured

- Customer goodwill / complaint drop → observed unless counted  
- Cart abandonment “near-eliminated” → do not publish without count  
- “No ongoing maintenance” → hypothesis; state residual support  

---

## 8. Architecture note (for case study accuracy)

Browser client called a **public UPC lookup service**. No custom store backend, account system, or store-managed server was required for the first live tool. Competitor price checks used available public / web references — document sources in TODO before implying proprietary data partnerships.

---

## 9. Limitations

- Live launch recovery, not a controlled experiment  
- Some pre-fix figures may be reconstructed from ops notes — mark those  
- Validation may cover active assortment, not every historic catalog row  
- Observer effect on staff behavior possible  
- Longer-term adoption needs continuous instrumentation  

---

## 10. Next fill session (checklist)

1. [x] Store sq ft from lease / listing — **25,000**  
2. [ ] Lock SKU denominators (catalog vs active vs affected)  
3. [ ] Recognition sample N and exact post rate  
4. [ ] Checkout timing sample N  
5. [ ] Confirm Day-0 vs Day-1 narrative  
6. [ ] Strip resume / LinkedIn / portfolio to the same locked set  

When this checklist is done, update `src/data/projects.js` (bodega-ops) and the featured card so public claims match this appendix.
