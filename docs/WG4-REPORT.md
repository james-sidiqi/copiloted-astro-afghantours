# AfghanTours — WG4 Report (Explore & presentation)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Branch:** `chore/completion-wg4-explore`  
**Base:** `chore/completion-wg3-products` (PR #24 tip)  
**Direction:** James completion brief 2026-09-22 — Work Group 4  
**Rules honored:** No deploy · no force-push main · no invented coordinates / testimonials / prices / drive times

---

## Delivered

### 1) Maps (defined purpose)
- **Approach:** Real Leaflet (npm `leaflet@1.9.x`), adapted from zip1 patterns for Astro 5 — **not** a compiled bundle copy.
- **Where loaded:** `/attractions/` only via `AttractionMap.astro` (bundled client script). Homepage does **not** load Leaflet.
- **Data:** `scripts/build-map-data.mjs` → `public/data/maps/{provinces,attractions,locations}.json` from CSV only.
- **Coordinates:** 88 active attractions with lat/lon; **75** treated as exact-looking pins; **13** marked approximate (integer or province-center match). Approximate pins **hidden by default**; optional toolbar toggle labels them as approximate — never presented as survey-grade.
- **Sync:** Province / hub / category filters update map layers and attraction cards together. Cards remain fully usable if the map fails (`#at-map-fallback` + noscript).
- **UX:** OSM tiles + attribution, touch-friendly height (`min(68vh, 560px)`, min-height 320px), scroll-wheel zoom off.
- **Tour route maps:** Existing schematic day-order SVG retained; copy updated to **schematic connections — not proven roads / not drive-time estimates**.

### 2) Related tours
- Attractions / hubs / provinces / food / culture already resolve **scheduled** tours only from itinerary/location/province links (`relatedScheduled*` helpers, `strict` defaults).
- Custom inquiry CTAs remain on explore pages when links are empty.
- Hub hotels stay scoped by `destinationCode === hub.locationCode` (e.g. Herat hotels do not attach to Bamyan-only hubs).

### 3) Photography / assets
- Attraction cards already prefer **hero** (`imagePath || thumbnailPath`) — verified.
- Attraction detail aside now prefers hero over soft thumb.
- Hotel cards: `object-[center_30%]` for hotel/Peace-Corps-style crops; Peace Corps audience already had `object-top`.
- **Park Star / Gholghola:** binary MD5s are distinct across hotel trees; no in-repo swap found — no mass delete.
- **Chashma-e-Dogh:** identical hero/thumb trees under `experiences/culinary/chashma-e-dogh/` and `cultural-experiences/chashma-e-dogh/` (same hashes). Content points at culinary path; duplicate tree **kept** (no mass-delete). Likely source of prior duplicate-id/asset warnings.
- **Carpet loom replacements:** latest-images zip still absent — **skipped**; documented here.

### 4) Nav / a11y / mobile
- Restrained header retained; mobile menu Escape-to-close + `aria-expanded` wiring.
- Global `:focus-visible` rings in `BaseLayout`.
- Sticky WhatsApp: body `pb-24` clearance so CTAs stay reachable on ~360/390/430 widths.
- Hero: `prefers-reduced-motion` hides autoplay video and keeps poster/static image.

### 5) Transportation
- **Standard** language marked as default for most tours.
- Upgrades explicitly **Additional cost** (premium / luxury / armored copy + CTA).
- Mountain-access image wired when file exists (`expedition-grade-mountain-access.webp` / `mountain-access.webp`).

### 6) Docs / build
- This report.
- `npm run build` includes `build-map-data` then `astro build` → **253 pages** green (2026-09-22 ~10:47 AFT).

---

## Map approach summary
| Item | Choice |
|---|---|
| Library | Leaflet 1.9 via npm |
| Load scope | Attractions index only |
| Fallback | Filterable card grid always present |
| Approx coords | Omitted from default pins; optional labeled toggle |
| Tour maps | Schematic SVG (not Leaflet roads) |

---

## Remaining gaps
- No admin1 GeoJSON in-repo — province filter is select/hub based, not polygon highlight.
- Carpet loom / latest-images package still missing.
- Chashma duplicate asset directory not deleted (intentional — avoid mass deletes).
- WhatsApp number still UNVERIFIED (WG2).
- Legacy tour prices on non-primary catalog still need operator verify (WG3 residual).
- License UI is static about-page imagery — no modal/dialog to keyboard-tune.

---

## Stacked PR
- Targets `chore/completion-wg3-products` (PR #24) → this branch opens as **PR #25**.
