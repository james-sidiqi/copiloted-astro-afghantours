# Asset Migration — Phase 2 (wire site to public/ layout)

**Date:** 2026-09-20  
**Branch:** `chore/sync-root-assets-into-public`  
**Scope:** Wire loaders/pages to prefer the Phase 1 `public/` slug-folder layout. **Nothing deleted** (no root purge, no old public file deletes).

## Goals completed

1. Prefer new slug-folder assets under:
   - `public/assets/images/attractions/<slug>/`
   - `public/assets/images/cultural-experiences/`
   - `public/assets/images/hubs/`
   - `public/assets/images/custom-tours/`
   - `public/assets/images/page-assets/`
   - `public/assets/images/food/...`
   - `public/assets/images/province/<slug>/`
   - `public/assets/maps/`
   - `public/images/hotels/<city>/`
2. Added `src/lib/getAssetUrl.ts` with existence-aware resolution and fallbacks.
3. Updated data loaders (minimum change) so attractions/tours/provinces/dishes/hotels resolve through the helper.
4. Hub cards on Destinations prefer hub slug folders when present.
5. No route/URL changes, no UI redesign, no PR #11 merge, no deletes.

## Helper behavior (`src/lib/getAssetUrl.ts`)

- `publicUrlExists` / `firstExisting` — filesystem checks under `public/`.
- `matchSlugDir` — fuzzy slug-to-folder matching.
- `getAssetUrl(codedPath, { slug, entity, kind })` — entity-aware resolver.
- Prefix remaps when needed:
  - `/assets/images/hotels/...` to `/images/hotels/...`
  - `/assets/images/maps/...` to `/assets/maps/...`
- Prefer `hero.webp` / `thumb.webp` inside slug folders when present.
- Fall back to existing coded/CSV paths when new files are absent.
- Does **not** invent Unsplash/stock images.

## Loader wiring

| Loader | Change |
|---|---|
| `loadAttractions.ts` | thumb/hero from attraction slug folders; maps via map resolver |
| `loadProvinces.ts` | cover/square from province slug folders; map webp under assets/maps |
| `loadDishes.ts` | food slug folders + aliases; else coded path |
| `loadTours.ts` | prefer custom-tours slug folders when present; else existing tours paths |
| `buildRelations.ts` (hotels) | remap hotel prefix; prefer property hero.webp for primary image |
| `destinations/index.astro` | resolveHubAsset for hub images |

CSV files left as-is where loader remap is sufficient.

## What was intentionally not done

- Phase 3 archive/delete of root duplicate trees
- Homepage Reimagined work
- PR #11 merge
- Any deletion of root or old public assets
- Route or UI redesign beyond path resolution

## Verification

- `npm run build` must succeed
- Spot-check: hotels under `/images/hotels/...`; attractions prefer slug-folder hero/thumb when present; hubs under `/assets/images/hubs/...`; food under food slug folders when aliases match

## Follow-ups (Phase 3+)

- Archive root duplicate asset trees after exclusive public/ usage is confirmed
- Optionally retire obsolete flat coded assets in public/ after parity check
- Expand food/attraction alias tables where fuzzy match still misses
