# Asset mapping gaps (for James)

**Branch:** `chore/map-new-asset-layout`  
**Date:** 2026-09-21 (Asia/Kabul)

This notes remaining coverage holes after wiring the new `public/assets/.../<slug>/{hero,thumb,gallery}` layout into `getAssetUrl` + loaders. **No assets were deleted.**

## Favicon / PWA

- Live site serves icons under `/favicon/*` and links `/favicon/site.webmanifest`.
- Uploaded dump had an **empty** `favicon/` tree and a webmanifest with **root** icon paths (`/web-app-manifest-*.png`), which 404 on live root.
- This PR adds `public/favicon/` with:
  - Corrected `site.webmanifest` icon `src`s → `/favicon/web-app-manifest-192x192.png` and `512`.
  - Icon binaries synced from the live site (not invented): `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-*.png`.
  - `BaseLayout.astro` `<link rel="manifest">` and icon links matching live paths.

## Maps inventory vs repo

- Source dump inventory reported **0 map images** under `assets/maps/` (dirs only in the folder tree).
- Phase 1 `public/assets/maps/` already contains province/region/route webp files (e.g. `provinces/*-map.webp`). Resolver continues to use those.
- **Do not invent maps.** If a newer dump ships map files, sync them in a later phase.

## Known entity gaps (from coverage + spot-check)

| Area | Slug / note | Status |
|---|---|---|
| Food | `sheer-khurma/IMG_4621.jpeg` | **Zero-byte** file present; `hero.webp` + `thumb.webp` exist and are preferred |
| Attractions | `darunta-dam`, `ghazni-minarets`, `wakhan-corridor` | Dump coverage flagged missing/malformed heroes; **Phase 1 public already has** `hero.webp`/`thumb.webp` for these |
| Cultural | `buzkashi` | Dump flagged missing hero/thumb; **public has** `hero.webp`/`thumb.webp`/`overview.webp` + gallery |
| Attractions | `malan-bridge`, `hadda-archaeological-site`, `bashgal-valley`, `barg-e-matal-highland-lakes`, `samangan-buddha-caves`, `jalalabad-city` (as attraction) | **No matching slug folder** under `public/assets/images/attractions/` — falls back to CSV coded path |
| Hubs | `zaranj`, `farah-city`, `khost-city`, `yakawlang` | No hub folder under `public/assets/images/hubs/` |
| Provinces | `bamyan`, `ghazni`, `kabul`, `kandahar`, `herat` | No slug **folder** (only flat `province/<slug>.webp`) — resolver uses flat file |
| Tours | `featured-tours/` | Present in source dump tree but **not** under `public/assets/images/` yet; tours still resolve via flat `/assets/images/tours/<slug>.webp` + `custom-tours/` |
| Hotels | Some properties use double extensions (`hero.webp.webp`) | Resolver now accepts alternate `hero*` / `thumb*` filenames |

## Mapping behavior (this PR)

- Prefer slug-folder `hero.webp` / `thumb.webp` when present; also accept alternate names (`hero.jpeg`, `hero.webp.webp`, `overview.webp`, `thumb.webp.jpeg`, …).
- Province paths: try `province/` (public) and `provinces/` (JSON dump naming); remap `provinces/` → `province/`.
- Hotels: remap `/assets/images/hotels/` → `/images/hotels/`; prefer folder hero/thumb.
- Maps: remap `/assets/images/maps/` → `/assets/maps/`; prefer `*-map.webp`.
- Expanded attraction + food slug aliases where CSV slugs differ from folder names.
- Tours: also check `featured-tours/` if/when synced; keep flat tour webp fallback.

## Intentionally not done

- No UI redesign, URL changes, brand-copy (Reimagined vs Discover), asset deletes, or cPanel deploy.
- `provinces.geojson` not copied to `public/data/maps/` (low priority; no existing `public/data/` consumer in this pass).
