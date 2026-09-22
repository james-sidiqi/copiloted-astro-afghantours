# Missing province maps

As of 2026-09-22 AFT (branch `fix/image-reference-repairs-2026-09-22`).

## Status

Interactive Leaflet maps (AttractionMap) use OpenStreetMap tiles + verified coordinates. They do **not** require province SVG geometry.

Static province map images (`*-map.webp`) exist under `/assets/maps/provinces/` for **32 of 34** provinces. References in `provinces.json`, `afghanToursProvinces.json`, and `provinces.csv` now point at those WebPs where present.

## Still missing (do not invent)

| Province | Expected WebP | Expected legacy SVG | Notes |
|----------|---------------|---------------------|-------|
| Daykundi | `/assets/maps/provinces/daykundi-map.webp` | `/assets/images/maps/provinces/daykundi.svg` | No verified asset in repo, live site, or zip packs |
| Panjshir | `/assets/maps/provinces/panjshir-map.webp` | `/assets/images/maps/provinces/panjshir.svg` | No verified asset in repo, live site, or zip packs |

JSON/CSV for these two still cite the legacy `.svg` paths. `resolveMapAsset` will fall through until real assets are added from a verified source.

## Do not

- Invent or redraw Daykundi / Panjshir maps
- Delete existing `*-map.webp` files
- Replace Leaflet OSM basemap with static SVGs without a verified source
