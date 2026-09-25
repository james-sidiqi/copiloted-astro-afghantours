# Attraction folder reorg (Phase 3 slice)

**Branch:** `chore/reorganize-root-attraction-folders`  
**Date:** 2026-09-25 (Asia/Kabul)

## Problem
Attraction slug folders from the initial asset dump sat at **repo root** (wrong parent), after Phase 1 had already copied them into the canonical tree:

`public/assets/images/attractions/<slug>/`

Site loaders (`getAssetUrl` / `loadAttractions`) already prefer the public path. CSV paths already use `/assets/images/attractions/...`.

## Action (attractions only)
- Removed **96** root-level attraction slug folders that duplicated `public/assets/images/attractions/<slug>/`.
- **95** were byte-identical (or root was a subset of public) — safe removal of misplaced copies.
- **1** differed (`shrine-of-mirwais-hotak`): public had newer/corrected assets + gallery; root dump variants quarantined at  
  `public/assets/images/placeholders/staging/root-attraction-dupes/shrine-of-mirwais-hotak/`  
  (not deleted).

## Not moved (flagged for later)
Root still has duplicate category trees left from Phase 1 copy-only:
- **Provinces:** `badakhshan/`, `panjshir/`, … → already under `public/assets/images/province/<slug>/`
- **Hotels (city trees):** `kabul/`, `herat/`, `bamyan/`, … → already under `public/images/hotels/<city>/`
- **Food:** `dishes/`, `sweets/`, `produce/`, `dried-fruit/`, `drinks/` → already under `public/assets/images/food/...`
- **Categories:** `about/`, `activities/`, `cultural-experiences/`, `custom-tours/`, `hubs/`, `return-journeys/`, `transport/`, `page-assets/`, `faqs/`, `giving-back/`, `logo/`, `placeholders/`, `maps/`
- **Note:** `public/assets/images/activities/` also exists alongside locked `public/assets/images/experiences/activities/` — separate cleanup.

No code/CSV path updates required for this attractions pass (canonical refs already pointed at public).
