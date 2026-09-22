# Culinary / cultural / produce asset fill (zip6 + zip7)

**Date:** 2026-09-22 (AFT)  
**Branch:** `chore/culinary-cultural-asset-fill`  
**Base tip:** `feat/founder-story-eleven-slides` (PR #29 @ `6bfafaf`)  
**Sources:**
- zip6 cultural-experiences → `/workspace/afghantours-zips/zip6` (stripped `__MACOSX` / `.DS_Store`)
- zip7 produce → `/workspace/afghantours-zips/zip7` (stripped `__MACOSX` / `.DS_Store`)

**Policy:** copy-only; never overwrite non-empty dest; no deletes; no deploy.  
Culinary stays under `experiences/culinary/`. Produce stays under `food/produce/` (not culinary).

## Taxonomy

| Zip slug | Kind | Canonical dest |
|---|---|---|
| `arg-restaurant-herat` | culinary | `public/assets/images/experiences/culinary/<slug>/` |
| `spoghmai-restaurant` | culinary | `public/assets/images/experiences/culinary/<slug>/` |
| `aziz-bakery` | culinary | `public/assets/images/experiences/culinary/<slug>/` |
| `afghan-carpets` | cultural | `public/assets/images/experiences/cultural/<slug>/` (+ legacy `cultural-experiences/`) |
| `buzkashi` | cultural | `public/assets/images/experiences/cultural/<slug>/` (+ legacy `cultural-experiences/`) |
| `khurd-kabul-pass-1842` | cultural | `public/assets/images/experiences/cultural/<slug>/` (+ legacy `cultural-experiences/`) |
| `afghan-weddings` | cultural | `public/assets/images/experiences/cultural/<slug>/` (+ legacy `cultural-experiences/`) |
| `apples` | produce | `public/assets/images/food/produce/apples/` |
| `honeydew-mellon` | produce | `public/assets/images/food/produce/honeydew-mellon/` (zip misspelling = existing repo slug) |
| `pomegranate` | produce | `public/assets/images/food/produce/pomegranate/` |
| `sugar-mellon` | produce | `public/assets/images/food/produce/sugar-mellon/` (zip misspelling = existing repo slug) |
| `watermellons` | produce | `public/assets/images/food/produce/watermellons/` (zip misspelling = existing repo slug) |

## Zip inventories (webp only)

### zip6 culinary / cultural
- `arg-restaurant-herat/thumb.webp`
- `spoghmai-restaurant/gallery/{01,02,03}.webp`
- `aziz-bakery/gallery/{01,02,03}.webp`
- `afghan-carpets/thumb.webp`, `gallery/03.webp`
- `buzkashi/thumb.webp`
- `khurd-kabul-pass-1842/thumb.webp`, `gallery/{01,02}.webp`
- `afghan-weddings/thumb.webp`

### zip7 produce
- `apples/hero.webp`
- `honeydew-mellon/hero.webp`
- `pomegranate/thumb.webp`
- `sugar-mellon/hero.webp`
- `watermellons/hero.webp`

## Before / after

Every zip webp was already present at the required destination(s), non-empty, **byte-identical** (MD5 match) to the tip tree.

| Action | Culinary/cultural | Produce | Total |
|---|---|---|---|
| **Added** | **0** | **0** | **0** |
| **Skipped** (already present, non-empty, same content) | 14 unique zip files | 5 unique zip files | **19** |

### Skipped — culinary → `experiences/culinary/`

- `arg-restaurant-herat/thumb.webp` (32895)
- `spoghmai-restaurant/gallery/01.webp` (322025)
- `spoghmai-restaurant/gallery/02.webp` (307428)
- `spoghmai-restaurant/gallery/03.webp` (484483)
- `aziz-bakery/gallery/01.webp` (262166)
- `aziz-bakery/gallery/02.webp` (237970)
- `aziz-bakery/gallery/03.webp` (250342)

### Skipped — cultural → `experiences/cultural/` + `cultural-experiences/`

- `afghan-carpets/thumb.webp` (27227)
- `afghan-carpets/gallery/03.webp` (241000)
- `buzkashi/thumb.webp` (33648)
- `khurd-kabul-pass-1842/thumb.webp` (25573)
- `khurd-kabul-pass-1842/gallery/01.webp` (339731)
- `khurd-kabul-pass-1842/gallery/02.webp` (286822)
- `afghan-weddings/thumb.webp` (27919)

### Skipped — produce → `food/produce/`

- `apples/hero.webp` (15774)
- `honeydew-mellon/hero.webp` (126009)
- `pomegranate/thumb.webp` (33730)
- `sugar-mellon/hero.webp` (13390)
- `watermellons/hero.webp` (12089)

### Added

_(none — tip already had identical binaries)_

## Notes

- Zip6 had no `hero.webp` for culinary/cultural slugs; existing heroes left untouched.
- Culinary assets were **not** written into `cultural-experiences/` (locked taxonomy).
- Produce kept under `food/produce/` (site paths in `data/dishes.csv` / `getAssetUrl` FOOD_ALIASES); **not** under culinary.
- Zip7 misspellings (`mellon`, `watermellons`) match existing repo folder names — no rename.
- No files deleted or overwritten.

## Verify

- [x] Extract zip6 + zip7; strip Mac junk
- [x] Diff vs tip destinations (size + MD5)
- [x] `npm run build` on this branch (see PR)
