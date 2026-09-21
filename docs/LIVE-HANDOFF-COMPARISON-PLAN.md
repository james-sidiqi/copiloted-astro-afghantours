# Live Astro handoff vs copiloted repo — comparison & merge plan

**Date:** 2026-09-21 (Asia/Kabul)  
**Handoff:** `/workspace/afghantours-zips/zip1` (Astro 4 live-site source, no images) + zip2 cleanup audits  
**Repo base for this work:** `feat/scheduled-catalog-2026-27` (product stack through PR #19)  
**Why not `main`:** `main` lacks Reimagined voice, Scheduled vs Custom model, conversion CTAs, and 2026–27 catalog. Merging live architecture onto `main` would fight the open PR stack.

## Architecture snapshot

| Area | Live handoff (zip1) | Copiloted (`feat/scheduled-catalog-2026-27`) |
|---|---|---|
| Astro | 4.x static | 5.x static (`@astrojs/node` present but output static) |
| Data | Content collections (MD) + CSVs + `buildRelations` | CSV loaders only (`getSiteData`) — no `src/content` before this PR |
| Hubs | `/hubs`, `/hubs/[slug]` + hub MD | Hubs = destinations via `locations.isHub` → `/destinations/[slug]` |
| Cultural | `/cultural-experiences` + 12 MD pages | `ExperienceStrip` cards only (href → scheduled tours / contact) |
| Transport | Rich `/transportation` | Lean `/getting-around` + CSV transport cards + conversion band |
| Tours detail | ~80KB `tours/[slug].astro` | ~29KB production template (PR #15/#19) — keep |
| Inquiry | `public/tour-inquiry.php` (`mail()`) | Contact form `FORM_ENDPOINT` empty; WhatsApp/mailto |
| Maps JSON | `public/data/maps/*.json` | Image maps under `public/assets/maps/` (no handoff JSON) |
| Search index | Withheld (malformed) | Existing `data/site_search_index.csv` — do not invent |
| Assets | None in zip | Full `public/` + root dumps — never delete |

## Changes since ~Sep 15 (repo)

Product/voice stack on top of main (tour template + asset mapping):  
`chore/lock-reimagined-voice` → `feat/scheduled-and-custom-tours` → `feat/inspire-to-book-conversion` → `feat/scheduled-catalog-2026-27` (open PRs #16–#19).  
Also: public slug-folder asset wiring (#13/#14), tour detail template (#15).

## Path-by-path plan

### A — Safe to port now (this PR slice)

| Path | Action |
|---|---|
| `src/pages/hubs/index.astro` | **Add** — CSV hubs via `getSiteData`, same voice/CTAs as destinations |
| `src/pages/hubs/[slug].astro` | **Add** — reuse destinations relation logic; optional hub MD prose when present |
| `src/content/hubs/*.md` | **Add** — overview prose only; no Featured framing |
| `src/pages/cultural-experiences/index.astro` | **Add** — index from content collection |
| `src/pages/cultural-experiences/[...slug].astro` | **Add** — MD body + soft CTA + strict related Scheduled tours by province |
| `src/content/cultural-experiences/*.md` | **Add** — strip featured-tour relation lists; resolve images from `public/assets/images/cultural-experiences/` |
| `src/content/config.ts` | **Add** — collections for hubs + cultural-experiences only |
| Nav Header/Footer | **Link** Hubs + Cultural Experiences under Explore |
| `experienceCards.ts` | **Point** cultural card `href` to `/cultural-experiences/{slug}` when page exists |
| `HubCard.astro` | **Optional** `basePath` so hubs index links to `/hubs/...` |

### B — Conflicts / needs James approval (do not implement in this PR)

| Path | Why blocked |
|---|---|
| Wholesale replace `tours/[slug].astro` with ~80KB handoff | Would overwrite PR #15/#19 template, catalog honesty, Custom CTA |
| Merge/replace `data/tours.csv`, itinerary, dates | PR #19 catalog is authoritative for scheduled products |
| Replace destinations with hubs-only | Destinations URLs already live in copiloted; keep both until redirect decision |
| Port full content collections (attractions, tours, food, hotels MD) | Dual source of truth vs CSV loaders — high conflict |
| Replace `/getting-around` with `/transportation` handoff | Richer copy OK later; keep CSV tiers + inquire framing; may add alias |
| Add `hotels/[slug]` marketplace pages | Product rules: hotels = how we house guests, not book-a-room |
| Wire `FORM_ENDPOINT` → `tour-inquiry.php` | Needs PHP host confirmation; static hosts will not run PHP |
| Import handoff map JSON over existing maps | Verify against Leaflet usage + quarantined image refs (zip2) |
| Rebuild `site_search_index.csv` from handoff | Forbidden to invent; validate from current authoritative data later |
| Resurrect `_inactive` or Featured-as-primary | Explicitly forbidden |
| Delete/rename assets from zip2 audits | Quarantine/duplicate review only — no deletes |
| Astro 4 package downgrade / leaflet add | Stay on Astro 5; add map deps only with approval |

### C — Deferred safe follow-ups

- Enrich `/getting-around` with vetted handoff route-support copy (no invented prices).
- Optional `/hubs` ←→ `/destinations` canonical redirect.
- Add `tour-inquiry.php` to `public/` as **optional** artifact + docs note (unwired).
- Hotel detail pages only if framed as tour-stay context (not inventory booking).
- Map JSON + TourMap alignment after path audit vs zip2 quarantined heroes.

## Locked product rules (must survive)

1. Reimagined, Grounded, Kabul-Based voice  
2. Scheduled tours + Custom journeys (audiences) — not Featured as primary  
3. Catalog tours from PR #19 when data exists  
4. Informational pages inspire → relevant scheduled / custom inquire  
5. Hubs as operational discovery → tours  

## PHP inquiry note

Handoff `public/tour-inquiry.php` uses PHP `mail()` to `info@afghantours.com`, honeypot field `website`, requires name/email/tour_name. **cPanel/PHP host required**; static-only Astro hosting will not execute it. Copiloted contact currently relies on WhatsApp/mailto until endpoint is approved.

## Build policy

Implement only slice A on branch from `feat/scheduled-catalog-2026-27`. Preserve all `public/` paths. No force-push. No asset deletes. Full `npm run build` in repo with existing assets.
