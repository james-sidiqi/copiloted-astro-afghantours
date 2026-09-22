# Demo price gaps (do not invent)

**Branch:** `feat/demo-sections-carousels-pricing`  
**Date:** 2026-09-23 (Asia/Kabul, AFT)  
**Rule:** Cards show numeric `price_from` only when present and &gt; 0 in `data/tours.csv`. Otherwise **Price on request**. No invented dollars.

## Primary scheduled catalog (homepage / featured)

| Slug | `price_from` in CSV | Card display |
|---|---|---|
| `weekend-in-kabul` | empty | Price on request |
| `winter-circuit` | empty | Price on request |
| `summer-circuit` | empty | Price on request |
| `fall-eastern-afghanistan` | empty | Price on request |
| `spring-afghanistan-tour` | empty | Price on request |
| `buzkashi-expedition` | empty | Price on request |
| `signature-afghan-tour` | empty | Price on request |

**James input needed:** verified per-person `price_from` (USD) for each primary slug above before marketing them as priced packages.

## Other empty / POR rows

| Slug | Notes |
|---|---|
| `custom-expedition` | Planning service — duration/price by quotation (intentional) |
| `heart-of-the-silk-road` | Concept / pending operational costing |

## Legacy catalog rows with numeric prices (still need operator verify)

These already surface as `From $…` via TourCard when listed (secondary scheduled). Treat as **unverified legacy** until James confirms:

- central-afghanistan-discovery — 1250
- afghanistan-discovery-tour-spring — 1890
- afghanistan-discovery-tour-fall — 1950
- bamyan-skiing-tour — 1300
- kabul-surroundings — 990
- photography-tour — 2850
- scientific-expeditions — 4500
- treasures-of-silk-road-afghanistan — 2450
- timurid-grandeur-herat-tour — 1850
- timurid-grandeur-herat-tour-add-minaret-e-jam — 2250
- trek-the-wakhan-corridor — 4850
- panjshir-valley-emeralds-history — 750
- kandahar-durrani-empire-tour — 1250

No CSV/live handoff prices were silently copied onto primary empty rows.

## Hotel night rates

`hotel_properties.per_night_price_from` is shown in the tour stay selector **only when &gt; 0** in source data. Empty hotel rates stay unlabeled (no invented nightly prices).
