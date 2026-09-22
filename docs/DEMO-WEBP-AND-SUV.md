# Demo WebP + premium SUV wiring

**Branch:** `feat/demo-sections-carousels-pricing`  
**Date:** 2026-09-23 (Asia/Kabul, AFT)

## WebP-only on rendered pages

- `preferWebpSibling()` in `src/lib/getAssetUrl.ts` rewrites `.jpg`/`.jpeg`/`.png` asset URLs to an existing same-path `.webp` sibling when present.
- Province square assets: converted siblings under `public/assets/images/province/square-size/*.webp`; CSV paths updated to `.webp`.
- Hotel Bamyan Gholghola property JPEGs: `.webp` siblings created; originals kept.
- **Exceptions (documented, kept as PNG):**
  - Favicons under `/favicon/*.png`
  - Leaflet marker/shadow icons under `/vendor/leaflet/*.png` (Leaflet expects these)
  - OpenStreetMap raster tiles (`*.png` remote URLs)

## Premium SUV “newer image not showing”

**Cause:** `TransportCard` / `resolveTransportAsset` only picked `hero.webp`. Newer shots lived as flat `gallery-2.webp` / `gallery-3.webp` (normalized from `.webp.webp`) and were never listed in UI.

**Fix:**

1. Previous hero archived as `hero-previous.webp` (not deleted).
2. `gallery-2.webp` (newer clean premium SUV) promoted to `hero.webp`.
3. `listTransportGallery()` + TransportCard gallery strip surfaces remaining gallery frames.
4. `pickInDir` now considers flat `gallery-N.webp` files.

Leaflet PNG exception remains intentional.
