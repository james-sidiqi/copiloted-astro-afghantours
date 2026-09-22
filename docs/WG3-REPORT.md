# AfghanTours — WG3 Report (Products & content)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Branch:** `chore/completion-wg3-products`  
**Base:** `chore/completion-wg2-inquiries` (PR #23 tip `d0104b1`)  
**Direction:** James completion brief 2026-09-22 — Work Group 3  
**Rules honored:** No deploy · no force-push main · no invented prices/dates/testimonials/safety guarantees

---

## Delivered

### A) Homepage
- Featured scheduled set = **primary seven** only (data-backed):
  1. `weekend-in-kabul`
  2. `winter-circuit`
  3. `summer-circuit`
  4. `fall-eastern-afghanistan`
  5. `spring-afghanistan-tour`
  6. `buzkashi-expedition`
  7. `signature-afghan-tour`
- Shared helper: `src/lib/content/primaryScheduled.ts`
- Six custom audiences unchanged (Diaspora, Veterans, Peace Corps alumni, Business, Artists, Media)
- Priority CTAs: **Tour Packages** · **Custom Requests** · **Contact**

### B) Pattern scheduled tour page
- Polished **`signature-afghan-tour`** as the template (richest itinerary + new true inclusions/exclusions)
- Clear proposed/enquiry framing; price **Price on request** when unverified
- Prefilled inquiry CTA primary (contact form); WhatsApp secondary
- Date badges: proposed/open → **Proposed · Enquire** (not fake Available)
- Inclusions/exclusions split; accommodation/transport from verified notes
- Duplicate itinerary-as-inclusions still suppressed by existing clone guard

### C) Custom Requests
- New planning hub: `/custom-requests/`
- Diaspora pattern: `/custom-requests/diaspora/`
  - Family origins, reconnect, elders/children, language, pace, practical support
  - James family photos labeled **personal history ≠ access guarantee**
  - CTA → Build My Journey with `audience=diaspora`
- **Custom Expedition** CSV cleaned: removed fixed **15-day / $3500**; empty price & duration; planning-service summary
- Removed fake TBD itinerary / inclusion / date / attraction-map rows for `custom-expedition`
- Tour detail shows planning-service panel when Custom + empty itinerary

### D) Tours index
- Clear Scheduled vs Custom panels
- Primary seven featured first; other scheduled routes secondary (retained, not deleted)
- Custom audience cards + planning-service data rows

### E) Proposed ≠ confirmed
- Language kept/strengthened on homepage, tours index, tour detail, dates UI
- Softened legacy `open` placeholder dates → `proposed` where notes indicated placeholders

### F) Docs
- This report + `OPEN-BUSINESS-FACTS.md` updated for price/date verification needs

### G) Build
- `npm run build` → **253 pages** green (2026-09-22 ~10:37 AFT)

---

## Catalog reconciliation

| Product | Action |
|---|---|
| Heart of the Silk Road (`heart-of-the-silk-road`) | **Retain** — distinct 10-day Kabul→Bamyan→north circuit; **not** homepage-featured |
| Central Afghanistan Discovery | **Retain** — shorter central+Panjshir shape; secondary on tours index; legacy price still needs verify |
| Other scenic/cultural CSV tours | Secondary on tours index; not homepage |

---

## Residual catalog issues
- Legacy dollar amounts remain on several non-primary tours (discovery spring/fall, Herat, etc.) — **operator verify before advertising**
- Buzkashi match windows still unconfirmed (proposed windows only)
- Text CSV / latest-images / cpanel-final / html-handoff packages still missing
- WhatsApp number still UNVERIFIED (WG2 flag unchanged)
- Live vs repo custom audience label set still unresolved (do not invent a seventh)

---

## Stacked PR
- Targets `chore/completion-wg2-inquiries` (PR #23) → becomes PR #24 when opened
