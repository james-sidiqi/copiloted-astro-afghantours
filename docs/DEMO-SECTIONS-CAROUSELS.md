# Demo sections + carousels

**Branch:** `feat/demo-sections-carousels-pricing`

## Section distinction

- New `PageSection` tones: `white` / `mist` / `sand` / `navy` with light borders.
- Homepage alternates mist → sand → white → mist → sand → navy.
- Tour detail odd/even section surfaces; transport arrangements borders/padding rhythm.
- `SectionHeader` eyebrow tracking + optional `onDark`.

## Horizontal carousels

- `HorizontalCarousel`: scroll-snap, prev/next, keyboard arrows, focusable track.
- Wired on homepage (scheduled tours, custom audiences, destinations) and tours index (primary/secondary/audiences).
- “Explore Destinations” / View Scheduled / Custom CTAs remain **outside** the track (not broken).

## Tour stay & transport defaults

- `TourStayTransportOptions` on tour detail: defaults to **standard** hub hotel when present; standard transport (SUV if available).
- User can upgrade hotel/transport from existing data only; inquiry link gets `accommodation` + `transport` query params.
