# AfghanTours — Tour / Specialist Separation REPORT

**Date:** 2026-09-23 (Asia/Kabul / AFT)  
**Branch:** `fix/separate-tours-specialist-services`  
**Baseline SHA:** `73a3634de7ad176ae2351466dcdc22031f91b6d9` (`integration/afghantours-final`)  
**PR base:** `integration/afghantours-final`  
**Head SHA:** `5f25af301f0f5e12c298a6b21ec1f8912582bdaf`  
**Status:** Unmerged · Not deployed  

---

## 1. Every product + final classification

### A. Scheduled Tours (primary seven)
| Name | Slug | Duration | Price | Itinerary days | Departure rows |
|---|---|---|---|---|---|
| Weekend in Kabul | weekend-in-kabul | 3 | Price on request | 3 | 4 |
| Winter Circuit | winter-circuit | 9 | Price on request | 9 | 3 |
| Summer Circuit | summer-circuit | 10 | Price on request | 10 | 3 |
| Fall Eastern Afghanistan | fall-eastern-afghanistan | 8 | Price on request | 8 | 3 |
| Spring Afghanistan Tour | spring-afghanistan-tour | 10 | Price on request | 10 | 3 |
| Buzkashi Expedition | buzkashi-expedition | 9 | Price on request | 9 | 3 |
| Signature Afghan Tour | signature-afghan-tour | 14 | Price on request | 14 | 4 |

### B. Private Fixed-Itinerary Tours
| Name | Slug | Duration | Price | Itinerary days | Departure rows | Notes |
|---|---|---|---|---|---|---|
| Central Afghanistan Discovery | central-afghanistan-discovery | 7 | 1250 | 7 | 2 | |
| Afghanistan Discovery Tour Spring | afghanistan-discovery-tour-spring | 9 | 1890 | 9 | 2 | Legacy price — operator verify |
| Afghanistan Discovery Tour Fall | afghanistan-discovery-tour-fall | 9 | 1950 | 9 | 2 | Legacy price — operator verify |
| Bamyan Skiing Tour | bamyan-skiing-tour | 5 | 1300 | 5 | 2 | |
| Kabul & Surroundings | kabul-surroundings | 6 | 990 | 6 | 2 | |
| Treasures of the Silk Road | treasures-of-silk-road-afghanistan | 10 | 2450 | 10 | 2 | |
| The Timurid Grandeur of Herat | timurid-grandeur-herat-tour | 7 | 1850 | 7 | 1 | |
| The Timurid Grandeur of Herat — Additional Minaret-e-Jam | timurid-grandeur-herat-tour-add-minaret-e-jam | 10 | 2250 | 9 | 1 | ⚠️ duration 10 ≠ itinerary 9 — flagged, days not invented |
| Trekking the Wakhan Corridor | trek-the-wakhan-corridor | 21 | 4850 | 21 | 2 | Retagged from Custom → Expedition / Trekking |
| Panjshir Valley: Emeralds & History | panjshir-valley-emeralds-history | 4 | 750 | 4 | 2 | |
| Kandahar: The Durrani Empire | kandahar-durrani-empire-tour | 6 | 1250 | 6 | 2 | |
| The Heart of the Silk Road | heart-of-the-silk-road | 10 | Price on request | 10 | 0 | No calendar rows |

### C. Custom Journey
| Name | Slug | Location |
|---|---|---|
| Custom Expedition / Build My Journey | custom-expedition | `data/custom_journeys.csv` → `/custom-requests/` |

### D. Specialist Services (`data/specialist_services.csv`)
| Code | Name | Slug |
|---|---|---|
| SCIE | Scientific & Research Support | scientific-research |
| PHOT | Photography & Documentary Support | photography-documentary |
| MEDIA | Media & Journalist Support | media-journalist |
| ARTS | Artist & Creative Fieldwork | artist-creative |
| BIZZ | Business & Investment Visits | business-investment |
| ACAD | Academic & Institutional Travel | academic-institutional |
| NGOD | NGO & Development Support | ngo-development |
| FILM | Film & Production Support | film-production |
| FILD | Specialist Fieldwork & Access | specialist-fieldwork |

### E. Return Journeys (`data/return_journeys.csv`)
| Code | Name | Slug |
|---|---|---|
| DIAS | Diaspora & Heritage Return | diaspora |
| VETS | Veterans, Contractors & Diplomats | veterans-contractors-diplomats |
| PCEA | Peace Corps Alumni Return | peace-corps-alumni |

---

## 2. Final list of actual tours eligible for public pricing

Tours that currently carry a numeric `price_from` (still subject to operator verification before advertising):

1. Central Afghanistan Discovery — From $1,250  
2. Afghanistan Discovery Tour Spring — From $1,890  
3. Afghanistan Discovery Tour Fall — From $1,950  
4. Bamyan Skiing Tour — From $1,300  
5. Kabul & Surroundings — From $990  
6. Treasures of the Silk Road — From $2,450  
7. The Timurid Grandeur of Herat — From $1,850  
8. The Timurid Grandeur of Herat — Additional Minaret-e-Jam — From $2,250  
9. Trekking the Wakhan Corridor — From $4,850  
10. Panjshir Valley: Emeralds & History — From $750  
11. Kandahar: The Durrani Empire — From $1,250  

Primary seven scheduled tours: **Price on request** (empty `price_from` — not invented).  
Heart of the Silk Road: **Price on request**.  
Specialists / returns / custom: **Custom quotation / Request a Proposal** — never From $0.

---

## 3. Every specialist item removed from tours.csv, tour_dates.csv, tour_itinerary.csv

| Code | Old slug | Removed from |
|---|---|---|
| PHOT | photography-tour | tours.csv, tour_dates.csv (PHOT-1), tour_itinerary.csv (12 TBD days), tour_inclusions.csv (12 clone rows) |
| SCIE | scientific-expeditions | tours.csv, tour_dates.csv (SCIE-1), tour_itinerary.csv (12 TBD days), tour_inclusions.csv (12 clone rows) |

Also removed Custom Expedition (CTME) from tours.csv (moved to `custom_journeys.csv`; no dates/itinerary/inclusions remained).

Invented fields dropped for PHOT/SCIE: duration 12/14, prices $2850/$4500, placeholder on_request dates, TBD day-by-day itineraries.

---

## 4. New / migrated specialist and return-journey data structures

- `data/specialist_services.csv` — 9 services; fields: service_code, name, slug, category, summary, description, audience, service_type, regions_supported, planning_notes, accommodation_note, transport_note, support_note, availability_note, image_path, hero_image_path, cta_label, is_featured, is_active. **No** duration_days / price_from / itinerary / dates.
- `data/return_journeys.csv` — 3 journeys; fields per brief.
- `data/custom_journeys.csv` — Custom Expedition planning entry.
- `tours.csv` — added `product_class` (`scheduled` | `private-fixed`); 19 itinerary tours remain.
- Loaders: `loadSpecialistServices`, `loadReturnJourneys`, `loadCustomJourneys`.
- Types: `SpecialistService`, `ReturnJourney`, `CustomJourney` (SpecialistService does **not** require durationDays/priceFrom).
- Validation: `validateProductSeparation.ts` fails build if specialists reappear in tour_dates/tour_itinerary or tours.csv.

`tour_inclusions.csv` audit: largely itinerary clones for many tours (including PHOT/SCIE TBD clones). Specialist inclusions were removed, not migrated as package inclusions — capability statements used instead. Remaining clone-like inclusions for genuine tours left as pre-existing (not blindly rewritten).

---

## 5. Old URL → retained URL / redirect mapping

| Old | New | Mechanism |
|---|---|---|
| `/tours/photography-tour/` | `/specialist-services/photography-documentary/` | Astro redirect page + `.htaccess` 301 |
| `/tours/scientific-expeditions/` | `/specialist-services/scientific-research/` | Astro redirect page + `.htaccess` 301 |
| `/tours/custom-expedition/` | `/custom-requests/` | Astro redirect page + `.htaccess` 301 |
| `/custom-requests/diaspora/` | `/return-journeys/diaspora/` | Astro redirect page + `.htaccess` 301 |

Canonical retained tour URLs under `/tours/[slug]/` unchanged for the 19 itinerary tours.  
New indexes: `/specialist-services/`, `/return-journeys/`.  
`/custom-requests/` remains Build My Journey hub.

---

## 6. Confirmation — no specialist displays fixed duration / price / scheduled dates / day-by-day itinerary

Verified in production build HTML:

- `/specialist-services/photography-documentary/` — shows **Request a Proposal**, **Custom quotation**, explicit “not a tour package” copy; inquiry `flow=specialist`. No From $X, no Day 1, no Next departure, no duration badge.
- `/specialist-services/scientific-research/` — same pattern.
- Specialist cards on `/tours/` and homepage use SpecialistCard (not TourCard) — “Custom quotation / Request a Proposal”.
- `/return-journeys/diaspora/` — **Request a Return Journey**, `flow=return`; no package fields.
- `/tours/` catalog grid contains only itinerary-based TourCards (scheduled + private-fixed).

---

## 7. Production build status + page count

- Command: `rm -rf node_modules .astro dist && npm ci && npm run build`
- Result: **SUCCESS**
- Page count: **271 pages** (after removing duplicate custom-expedition route collision)
- Warnings: one transient route-collision warning before duplicate flat redirect removed; final rebuild clean of that collision
- Product-separation validation: no errors (PHOT/SCIE absent from tour CSVs)

---

## 8. Preview URL

- Local preview (box): `http://localhost:4324/` (astro preview; ports 4321–4323 were occupied)
- Codespace `afghantours-completion-demo`: present under `/workspace/afghantours-tour-demo` (screenshots only); branch refresh for live Codespace URL not wired in this task — use local preview / PR checks
- Production: **not deployed** (per brief)

---

## A. Classification audit

See `/workspace/afghantours-tour-specialist-AUDIT.md` and `docs/TOUR-SPECIALIST-AUDIT.md` (written before modifications).

Known wrong fixed: Scientific Expeditions → Specialist; Photography Tour → Specialist.

---

## B. Data changes

- Removed PHOT, SCIE, CTME from tours.csv
- Stripped PHOT/SCIE from tour_dates, tour_itinerary, tour_inclusions
- Added product_class to remaining tours
- Retagged trek-the-wakhan-corridor travel_style Custom → Expedition / Trekking
- Created specialist_services.csv, return_journeys.csv, custom_journeys.csv
- Updated site_search_index.csv entity types
- FAQ PHO-01 tour_slug cleared / links redirected conceptually
- redirect-map.csv + regenerated public/.htaccess

---

## C. Routing

- `/tours/` — itinerary tours only (+ outbound sections to specialist/return/custom)
- `/specialist-services/`, `/specialist-services/[slug]/`
- `/return-journeys/`, `/return-journeys/[slug]/`
- `/custom-requests/` retained for Build My Journey
- Nav: Header Tours dropdown + Footer Plan links distinguish Custom / Specialist / Return

---

## D. Components

- New: `SpecialistCard.astro`, `ReturnJourneyCard.astro`
- TourCard unchanged (duration/price for itinerary tours only)
- RelatedToursSection filters to productClass scheduled|private-fixed
- Inquiry flows extended: `specialist`, `return` (+ builders)
- Homepage distinct sections: Scheduled Tours, Custom Journeys, Specialist Services, Return Journeys

---

## E. Validation confirmations

| Check | Result |
|---|---|
| Specialist not in tour_dates | PASS |
| Specialist not in tour_itinerary | PASS |
| Specialist not in tours.csv | PASS |
| Specialist CSV has no duration/price fields | PASS |
| Build-time assertProductSeparation | PASS (no errors) |
| /tours/ excludes specialists as TourCards | PASS |
| Specialist pages CTA = Request a Proposal | PASS |
| Return pages CTA = Request a Return Journey | PASS |
| Primary seven prices empty (POR) | PASS |
| No invented specialist itineraries | PASS |

---

## F. Actual tour catalog (post-cleanup)

| Central Afghanistan Discovery | private-fixed | 7 | private | 1250 | Year-round | 7 | 2 |
| Afghanistan Discovery Tour Spring | private-fixed | 9 | private | 1890 | Apr-Jun | 9 | 2 |
| Afghanistan Discovery Tour Fall | private-fixed | 9 | private | 1950 | Sep-Nov | 9 | 2 |
| Bamyan Skiing Tour | private-fixed | 5 | private | 1300 | Jan-Mar | 5 | 2 |
| Buzkashi Expedition | scheduled | 9 | scheduled | Price on request | Dec–Mar | 9 | 3 |
| Kabul & Surroundings | private-fixed | 6 | private | 990 | Year-round | 6 | 2 |
| Weekend in Kabul | scheduled | 3 | scheduled | Price on request | Year-round | 3 | 4 |
| Winter Circuit | scheduled | 9 | scheduled | Price on request | Dec–Mar | 9 | 3 |
| Summer Circuit | scheduled | 10 | scheduled | Price on request | Jun–Sep | 10 | 3 |
| Treasures of the Silk Road | private-fixed | 10 | private | 2450 | Year-round | 10 | 2 |
| The Timurid Grandeur of Herat | private-fixed | 7 | private | 1850 | Year-round | 7 | 1 |
| The Timurid Grandeur of Herat — Additional Minaret-e-Jam | private-fixed | 10 | private | 2250 | Apr–Oct | 9 | 1 | ⚠️ duration≠itinerary day count
| Trekking the Wakhan Corridor | private-fixed | 21 | private | 4850 | Jun–Aug | 21 | 2 |
| Panjshir Valley: Emeralds & History | private-fixed | 4 | private | 750 | Apr–Oct | 4 | 2 |
| Kandahar: The Durrani Empire | private-fixed | 6 | private | 1250 | Year-round | 6 | 2 |
| Fall Eastern Afghanistan | scheduled | 8 | scheduled | Price on request | Sep–Nov | 8 | 3 |
| Spring Afghanistan Tour | scheduled | 10 | scheduled | Price on request | Mar–May | 10 | 3 |
| Signature Afghan Tour | scheduled | 14 | scheduled | Price on request | Apr–May; Oct–Nov | 14 | 4 |
| The Heart of the Silk Road | private-fixed | 10 | private | Price on request | Concept · by quotation | 10 | 0 |

---

## G. Build result

```
npm run build → 271 page(s) built — Complete!
Preview: http://localhost:4324/
```

Non-blocking left documented (not fixed here): missing hero.webm, founder slides 6/8 JPEG-as-webp, malformed-original cleanup.

---

READY FOR JAMES REVIEW — TOUR / SPECIALIST SEPARATION COMPLETE — NOT MERGED / NOT DEPLOYED
