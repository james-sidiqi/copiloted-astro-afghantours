# Header match to live (fix/header-match-live)

Authoritative references: `/workspace/afghantours-header-live-desktop.png`,
`/workspace/afghantours-header-live-mobile.png`, plus zip1 `Header.astro` and live HTML.

## After (this branch)
- Dark gradient bar; logo + **Afghan Tours** + gold tagline (no JTTA in header)
- Nav labels match live: **Tours | Explore | Plan | Information** + gold **Contact Us**
- All four primary items have ⌄ dropdowns (live)
- Desktop: single horizontal row
- Mobile: two-row (brand on top, horizontally scrolling nav below) — **no hamburger**
- Header is **not sticky** (per live screenshots)
- Dropdown hrefs use repo routes (`/regions/`, `/provinces/`, `/custom-requests/`, `/transportation/`, etc.)

## Before (repo white Tailwind header)
- White sticky bar, completion labels (Custom Requests, Plan Your Trip, Build My Journey), hamburger

## Remaining diffs vs live
1. **Featured Tours** points to `/tours/` (repo has no `#featured-section` / `#custom-tours` anchors like live).
2. **Custom Tours** → `/custom-requests/` (repo IA) instead of live `/tours/#custom-tours`.
3. **Regional Map** → `/regions/`; **Province Directory** → `/provinces/` (repo pages) vs live `/destinations/#regions|#provinces`.
4. Live CSS build still declares `position: sticky`; screenshots show non-sticky — we follow screenshots.
5. At ~390px CTA may still clip on the right during horizontal scroll (same as live mobile screenshot).
6. Footer unchanged.
