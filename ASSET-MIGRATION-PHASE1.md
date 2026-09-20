# Asset Migration — Phase 1 (sync root assets into public/)

**Date:** 2026-09-20  
**Branch:** `chore/sync-root-assets-into-public`  
**Scope:** COPY ONLY. Root asset trees left in place. Nothing deleted from `public/` or root.

## Goals

- Make root-level asset dumps available under a canonical `public/` layout closer to live/dump.
- Preserve James’s existing uploads in `public/` (rsync `--ignore-existing`; no clobber).
- Do **not** redesign pages, change URLs, implement `getAssetUrl`, or run cleanup.

## Method

- `rsync -a --ignore-existing` for directory trees
- `cp -a` for lone root `hero.webp` / `thumb.webp` into clearly named staging paths
- Root copies remain untouched

## Source → destination mapping

### Named category trees

| Source (repo root) | Destination |
|---|---|
| `cultural-experiences/` | `public/assets/images/cultural-experiences/` |
| `hubs/` | `public/assets/images/hubs/` |
| `custom-tours/` | `public/assets/images/custom-tours/` |
| `page-assets/` | `public/assets/images/page-assets/` |
| `return-journeys/` | `public/assets/images/return-journeys/` |
| `maps/` | `public/assets/maps/` |
| `about/` | `public/assets/images/about/` |
| `activities/` | `public/assets/images/activities/` |
| `transport/` | `public/assets/images/transport/` |
| `logo/` | `public/assets/images/logo/` |
| `placeholders/` | `public/assets/images/placeholders/` |
| `faqs/` | `public/assets/images/faqs/` |
| `giving-back/` | `public/assets/images/giving-back/` |

### Food (substructure preserved)

| Source | Destination |
|---|---|
| `dishes/` | `public/assets/images/food/dishes/` |
| `dried-fruit/` | `public/assets/images/food/dried-fruit/` |
| `sweets/` | `public/assets/images/food/sweets/` |
| `produce/` | `public/assets/images/food/produce/` |
| `drinks/` | `public/assets/images/food/drinks/` |

### Hotel city trees

Inspected root city folders (`kabul/`, `herat/`, `kandahar/`, `bamyan/`, `jalalabad/`, `mazar/`, `ghazni/`, `faizabad/`): each contains hotel property subfolders (and often `gallery/`, `hero.webp`, `thumb.webp`).

**Choice:** copy into **`public/images/hotels/<city>/`** to match the existing public hotels layout (not `public/assets/images/hotels/`).

| Source | Destination |
|---|---|
| `kabul/` … `faizabad/` (8 cities) | `public/images/hotels/<city>/` |

Existing property files under `public/images/hotels/` were **not overwritten** (`--ignore-existing`). New files from root (e.g. city-level `gallery/`, `hero.webp`, property folders missing from public) were added.

### Province trees (non-hotel)

Root province folders with `gallery/` + `hero.webp` + `thumb.webp` (excluding hotel cities above) → structured under province:

| Source examples | Destination |
|---|---|
| `badakhshan/`, `panjshir/`, `nangarhar/`, … (28 provinces) | `public/assets/images/province/<slug>/` |

Note: flat coded province webps already in `public/assets/images/province/*.webp` were left as-is; new content is in per-slug subfolders.

### Attraction slug folders

All other image-bearing root slug folders (e.g. `band-e-amir-national-park/`, `baburs-gardens/`, …) →:

| Source | Destination |
|---|---|
| `<attraction-slug>/` | `public/assets/images/attractions/<attraction-slug>/` |

Existing flat coded files under `public/assets/images/attractions/` (e.g. `bmy001.webp`) and `thumbnails/` were **not deleted or overwritten**.

### Lone root images

| Source | Destination |
|---|---|
| `hero.webp` | `public/assets/images/heroes/hero-root-staging.webp` |
| `thumb.webp` | `public/assets/images/placeholders/staging/thumb-root-staging.webp` |

Existing heroes (`hero-home.webp`, etc.) left untouched.

## What stayed at root (intentionally)

All source trees remain at repo root for Phase 1 safety, including:

- Category trees (`cultural-experiences`, `hubs`, `maps`, food, …)
- Hotel city trees (`kabul`, `herat`, …)
- Province and attraction slug folders
- `hero.webp`, `thumb.webp`
- Docs (`*.md`), `data/`, `src/`, `package*`, `dist*`, etc.

## What old public/ remains

Unchanged / coexisting with new trees:

- `public/assets/images/attractions/*.webp` (flat coded assets) + `thumbnails/`
- `public/assets/images/province/*.webp` (flat) + `square-size/`
- `public/assets/images/heroes/hero-*.webp`
- `public/assets/images/logo/` prior files
- `public/assets/images/about/` prior files (`president.webp`, etc.)
- `public/assets/images/tours/`, `placeholders/`
- `public/images/hotels/**` prior property images (not clobbered)

## Conflict policy

If a destination path already existed, **James’s existing file won**. Root copy was not removed. Dual presence is OK until Phase 3.

## Counts (Phase 1)

- ~153 root trees/files mapped into `public/`
- `public/` size after copy: ~320M (was ~90M)
- Disk: ample headroom on codespace workspace volume

## Phase 2 (follow-up — do not do in this PR)

- Wire page/component references to new canonical `public/` paths
- Optionally introduce `getAssetUrl` / path helpers
- Verify broken-image audit against new paths
- No redesign of pages beyond path fixes

## Phase 3 (follow-up — only after James approves)

- Archive or remove **root** duplicate asset trees once references exclusively use `public/`
- Optionally retire obsolete flat coded assets in `public/` after parity check
- Never delete without explicit approval

## Verification checklist

- [x] Root trees still present after copy
- [x] New paths exist under `public/assets/...` and `public/images/hotels/...`
- [x] No `rm` of root or old public files
- [ ] `npm ci && npm run build` succeeds (recorded in PR notes)
