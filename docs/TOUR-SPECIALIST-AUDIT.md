# AfghanTours — Tour / Specialist Separation AUDIT

**Date:** 2026-09-23 (Asia/Kabul, AFT)  
**Baseline branch:** `fix/separate-tours-specialist-services`  
**Baseline SHA:** `73a3634de7ad176ae2351466dcdc22031f91b6d9` (from `integration/afghantours-final`)  
**Status:** Written BEFORE code/data modifications.

## Scope searched

- `data/*.csv` (tours, tour_dates, tour_itinerary, tour_inclusions, tour_attractions_map / tour_attractions_map, site_search_index, faq)
- `src/lib/types`, `src/lib/data/*`, `src/lib/content/*`, `src/lib/inquiry.ts`
- `TourCard`, tours index/detail, homepage, custom-requests, RelatedTours*, inquiry form, Header/Footer
- Asset folders: `public/assets/images/custom-tours/*`, `public/assets/images/return-journeys/*`, `page-assets/travel/specialist-travel.webp`

## Product-class definitions (target)

| Class | Meaning |
|---|---|
| A. Scheduled Tours | Fixed itinerary + scheduled/proposed departures (primary seven) |
| B. Private Fixed-Itinerary | Fixed itinerary/duration; private dates; not in primary scheduled calendar unless approved departure rows exist |
| C. Custom Journey | Build My Journey — no preset duration/price/itinerary advertised |
| D. Specialist Services | Capability/logistics support — NO fixed itinerary/duration/dates/price_from/TourCard/tour calendar |
| E. Return Journeys | Diaspora/heritage; veterans/contractors/diplomats; Peace Corps — distinct from specialist |

## Classification table

| Existing item | Current source | Current route | Current classification | Correct classification | Has itinerary? | Has duration? | Has dates? | Has price? | Required action |
|---|---|---|---|---|---|---|---|---|---|
| Weekend in Kabul | tours.csv `WKND` | `/tours/weekend-in-kabul/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (3) | Yes (3) | Yes (4 proposed) | Empty (POR) | Keep in tours.csv; `product_class=scheduled` |
| Winter Circuit | tours.csv `WNTC` | `/tours/winter-circuit/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (9) | Yes (9) | Yes (3) | Empty (POR) | Keep; scheduled |
| Summer Circuit | tours.csv `SUMC` | `/tours/summer-circuit/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (10) | Yes (10) | Yes (3) | Empty (POR) | Keep; scheduled |
| Fall Eastern Afghanistan | tours.csv `FEAF` | `/tours/fall-eastern-afghanistan/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (8) | Yes (8) | Yes (3) | Empty (POR) | Keep; scheduled |
| Spring Afghanistan Tour | tours.csv `SPAT` | `/tours/spring-afghanistan-tour/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (10) | Yes (10) | Yes (3) | Empty (POR) | Keep; scheduled |
| Buzkashi Expedition | tours.csv `BUZE` | `/tours/buzkashi-expedition/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (9) | Yes (9) | Yes (3) | Empty (POR) | Keep; scheduled |
| Signature Afghan Tour | tours.csv `SIGA` | `/tours/signature-afghan-tour/` | Tour (featured scheduled) | **Scheduled Tour** | Yes (14) | Yes (14) | Yes (4) | Empty (POR) | Keep; scheduled |
| Central Afghanistan Discovery | tours.csv `CAD` | `/tours/central-afghanistan-discovery/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (7) | Yes (7) | Yes (2 proposed) | 1250 | Keep; `product_class=private-fixed`; not homepage primary |
| Afghanistan Discovery Tour Spring | tours.csv `ADTS` | `/tours/afghanistan-discovery-tour-spring/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (9) | Yes (9) | Yes (2) | 1890 | Keep; private-fixed |
| Afghanistan Discovery Tour Fall | tours.csv `ADTF` | `/tours/afghanistan-discovery-tour-fall/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (9) | Yes (9) | Yes (2) | 1950 | Keep; private-fixed |
| Bamyan Skiing Tour | tours.csv `BSKI` | `/tours/bamyan-skiing-tour/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (5) | Yes (5) | Yes (2) | 1300 | Keep; private-fixed |
| Kabul & Surroundings | tours.csv `KBLS` | `/tours/kabul-surroundings/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (6) | Yes (6) | Yes (2) | 990 | Keep; private-fixed |
| Treasures of the Silk Road | tours.csv `TSRA` | `/tours/treasures-of-silk-road-afghanistan/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (10) | Yes (10) | Yes (2) | 2450 | Keep; private-fixed |
| Timurid Grandeur of Herat | tours.csv `TGHT` | `/tours/timurid-grandeur-herat-tour/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (7) | Yes (7) | Yes (1) | 1850 | Keep; private-fixed |
| Timurid Grandeur — Minaret-e-Jam add-on | tours.csv `TGHT-EXT` | `/tours/timurid-grandeur-herat-tour-add-minaret-e-jam/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (9) | Yes (10) **mismatch** | Yes (1) | 2250 | Keep; flag duration↔itinerary mismatch; do NOT invent day |
| Trekking the Wakhan Corridor | tours.csv `TTWC` | `/tours/trek-the-wakhan-corridor/` | Tour tagged `travel_style=Custom` | **Private Fixed-Itinerary** | Yes (21) | Yes (21) | Yes (2) | 4850 | Keep as tour; retag style away from Custom; private-fixed |
| Panjshir Valley: Emeralds & History | tours.csv `PVEH` | `/tours/panjshir-valley-emeralds-history/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (4) | Yes (4) | Yes (2) | 750 | Keep; private-fixed |
| Kandahar: The Durrani Empire | tours.csv `KTDE` | `/tours/kandahar-durrani-empire-tour/` | Tour (secondary) | **Private Fixed-Itinerary** | Yes (6) | Yes (6) | Yes (2) | 1250 | Keep; private-fixed |
| Heart of the Silk Road | tours.csv `HSRA` | `/tours/heart-of-the-silk-road/` | Tour (secondary, no dates) | **Private Fixed-Itinerary** | Yes (10) | Yes (10) | No | Empty (POR) | Keep; private-fixed (no calendar rows) |
| Custom Expedition | tours.csv `CTME` | `/tours/custom-expedition/` | Tour tagged Custom, empty dur/price/itin | **Custom Journey** | No | No | No | No | Move to `data/custom_journeys.csv`; redirect old URL → `/custom-requests/` |
| **Photography Tour** | tours.csv `PHOT` | `/tours/photography-tour/` | Tour tagged Custom w/ fake 12-day TBD itin + $2850 + on_request date | **Specialist Service** | Fake TBD days (12) | Invented 12 | Placeholder date | Invented 2850 | **Remove from tours/dates/itinerary/inclusions**; migrate copy/imagery → specialist_services |
| **Scientific Expeditions** | tours.csv `SCIE` | `/tours/scientific-expeditions/` | Tour tagged Custom w/ fake TBD itin + $4500 + on_request date | **Specialist Service** | Fake TBD (12 rows / 14-day claim) | Invented 14 | Placeholder date | Invented 4500 | **Remove from tours/dates/itinerary/inclusions**; migrate → specialist_services |
| Diaspora audience card | `customAudiences.ts` + `/custom-requests/diaspora/` | `/custom-requests/diaspora/` | Custom audience pattern | **Return Journey** | N/A | N/A | N/A | N/A | Add `return_journeys.csv` + `/return-journeys/diaspora/`; redirect or alias from custom-requests/diaspora |
| Veterans audience card | `customAudiences.ts` (links contact) | `/contact/?flow=custom&audience=veterans` | Custom audience | **Return Journey** | N/A | N/A | N/A | N/A | New return journey page; assets from `custom-tours/veteran-return` + `return-journeys/veterans-contractors-diplomats` |
| Peace Corps alumni card | `customAudiences.ts` | contact custom flow | Custom audience | **Return Journey** | N/A | N/A | N/A | N/A | New return journey page; assets from `return-journeys/peace-corps` |
| Business travelers card | `customAudiences.ts` | contact custom flow | Custom audience | **Specialist Service** | N/A | N/A | N/A | N/A | Create specialist row (business/investment); keep Build My Journey path for true custom |
| Artists card | `customAudiences.ts` | contact custom flow | Custom audience | **Specialist Service** | N/A | N/A | N/A | N/A | Create specialist row (artist/creative) |
| Media card | `customAudiences.ts` | contact custom flow | Custom audience | **Specialist Service** | N/A | N/A | N/A | N/A | Create specialist row (media/journalist) |
| Academic / institutional | FAQ MED-01 only | none | Unstructured FAQ | **Specialist Service** | No | No | No | No | Create specialist row |
| NGO / development | FAQ HTL-03 mention | none | Unstructured | **Specialist Service** | No | No | No | No | Create specialist row |
| Film / production | FAQ MED-01 filming note | none | Unstructured | **Specialist Service** | No | No | No | No | Create specialist row |
| Specialist fieldwork / access | FAQ EXP-01 mountaineering | none | Unstructured | **Specialist Service** | No | No | No | No | Create specialist row (fieldwork/access) |

## Known wrong (confirmed)

1. **Scientific Expeditions** — fixed duration (14), price ($4500), TBD itinerary days, placeholder tour_dates row → **Specialist**.
2. **Photography Tour** — fixed duration (12), price ($2850), TBD itinerary, placeholder date → **Specialist** (no James-approved leisure photo tour assumed).

## tour_inclusions.csv findings (do not blindly migrate)

- Schema is **day-by-day identical to itinerary** (same columns: day_number, title, location, description…), not package inclusion bullets.
- PHOT/SCIE inclusions are **100% clone of their TBD itinerary** → invalid as specialist “inclusions”; replace with capability statements only.
- Many genuine tours also have clone-like inclusions (discovery, skiing, silk road, wakhan, etc.). Out of scope to rewrite those here; report only.
- Signature / Buzkashi / Weekend / Winter / Summer have more distinct inclusion rows.

## Architecture gaps to close

1. No `specialist_services.csv` / `return_journeys.csv` / `custom_journeys.csv`.
2. `Tour` type requires `durationDays` + `priceFrom` — specialists must not use it.
3. `/tours/` index still surfaces Custom-tagged rows (PHOT/SCIE/CTME) via TourCard (shows days + From $X).
4. Homepage “Custom Journeys” mixes return audiences with specialist audiences in one carousel.
5. Inquiry flows: only `scheduled | custom | general` — need `specialist` and `return`.
6. No `/specialist-services/` or `/return-journeys/` routes.
7. No build-time guard preventing specialist codes in tour_dates / tour_itinerary.

## Non-blocking (leave documented; do not fix in this task)

- Missing hero.webm
- Founder slides 6/8 JPEG-as-webp
- Malformed-original cleanup
- No cPanel deploy / no merge to main

## Planned URL mapping (to implement)

| Old | New |
|---|---|
| `/tours/photography-tour/` | `/specialist-services/photography-documentary/` (301) |
| `/tours/scientific-expeditions/` | `/specialist-services/scientific-research/` (301) |
| `/tours/custom-expedition/` | `/custom-requests/` (301) |
| `/custom-requests/diaspora/` | `/return-journeys/diaspora/` (301; page content migrated) |

