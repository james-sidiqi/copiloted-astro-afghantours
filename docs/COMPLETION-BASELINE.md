# AfghanTours — Completion Baseline (WG1)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Direction:** James completion direction 2026-09-22  
**Branch:** `chore/completion-wg1-baseline`  
**Base tip:** `chore/ready-2026-09-21` @ `57feb46a6490ba78222aa3b312085d06999081f9`  
**Working tree at branch create:** clean (verified `git fetch` + `git status`; no reset)  
**This baseline commit:** `6732ae9c11b0e573658ce8e39096ec74591e8850`  

---

## Environment

| Item | Value |
|---|---|
| Node | v20.19.2 |
| npm | 9.2.0 (Astro engine wants npm ≥9.6.5 — warning only; build succeeded) |
| Astro (installed) | **5.18.1** (`package.json` range `^5.15.8`) |
| Tailwind | 3.x via `@astrojs/tailwind` |
| Output | **static** (`astro.config.mjs` `output: 'static'`) |
| Site URL | `https://www.afghantours.com` |
| Hosting assumption | **cPanel static** HTML from `dist/` + **optional PHP** for inquiry (`tour-inquiry.php` pattern from zip1 / live) — Node SSR **not** required at runtime |

**Do not:** deploy, downgrade Astro to 4.x, replace the project with a ZIP, invent prices/dates/testimonials/license claims.

---

## Architecture summary

- **Stack:** Astro 5 + Tailwind, CSV-driven site data (`data/*.csv` via `getSiteData`), Markdown content collections for hubs + cultural-experiences.
- **Product model:** **Scheduled Tours** + **Custom Journeys** (inquiry-led audiences). `is_featured` is ordering only — not “Featured Tours” framing.
- **IA:** Explore (destinations, hubs, attractions, regions, cultural experiences, food) · Tours · Custom · Plan (visa, safety, hotels, **transportation**, FAQ) · About · Contact.
- **Brand voice:** Reimagined / Grounded / Kabul-based; current ready tip home H1 is **Experience Afghanistan** (live still **Afghanistan, Reimagined** — confirm marketing before cutover).
- **Forms:** Contact web form gated (`FORM_ENDPOINT` empty); WhatsApp + mailto fallback. Live uses mailto + `tour-inquiry.php`.
- **Maps:** Static map assets in repo; **no Leaflet** (zip1/live had interactive maps). Map UX needs **verified GeoJSON / attraction coordinates** before claiming parity.

---

## Build result (WG1)

| Metric | Result |
|---|---|
| Command | `npm ci` (lockfile) then `npm run build` |
| Outcome | **Passed** |
| Pages built | **251** after WG1 scaffolding (+3: transportation, privacy, terms; base was 248) |
| `dist` `index.html` routes (pre-scaffold) | **247** (+ `/404.html` = 248 HTML files) |
| Warnings | Browserslist caniuse-lite stale notice only; no Astro route errors |
| Engine note | npm 9.2.0 &lt; Astro’s stated ≥9.6.5; Node 20.19.2 OK |

### Route count (pre-scaffold prefix tallies)

| Prefix | Count |
|---|---|
| `/attractions/` | 89 |
| `/food-culture/` | 49 (index + 48 dishes) |
| `/provinces/` | 34 |
| `/tours/` | 23 (index + **22** tour slugs) |
| `/destinations/` | 15 |
| `/cultural-experiences/` | 14 |
| `/hubs/` | 9 |
| `/regions/` | 6 (index + 5 regions) |
| Core singles | home, about, contact, faq, safety, visa-entry, hotels, getting-around |

**22 tours vs 23 routes:** `data/tours.csv` has **22** active rows; dist has **23** `/tours/*` HTML paths because `/tours/` index is included. No missing/extra tour slug beyond the CSV set.

---

## Open PRs #16–#21 (status as of baseline)

All still **open** and stacked into ready tip `#21`:

| PR | Title | Head | Role |
|---|---|---|---|
| [#16](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/16) | lock Reimagined / Kabul-based voice | `chore/lock-reimagined-voice` | Voice lock |
| [#17](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/17) | Scheduled vs Custom | `feat/scheduled-and-custom-tours` | Product model |
| [#18](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/18) | inspire→book conversion | `feat/inspire-to-book-conversion` | CTAs / getting-around |
| [#19](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/19) | 2026–27 scheduled catalog | `feat/scheduled-catalog-2026-27` | Catalog tours |
| [#20](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/20) | hubs + cultural handoff slice | `chore/live-handoff-hubs-cultural` | Hubs/cultural |
| [#21](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/21) | build-ready 2026-09-21 | `chore/ready-2026-09-21` @ `57feb46` | Stack + assets |

**WG1 PR** targets `chore/ready-2026-09-21` (or `main` via ready) — completion docs + reversible URL scaffolding only.

---

## Comparison corrections (do not over-trust live-vs-repo notes)

Verified against current source / zip1 before relying:

1. **mailto / PHP ≠ proven inbox delivery.** Live/zip1 `tour-inquiry.php` uses PHP `mail()`. Presence of a form or mailto link does **not** prove messages arrive in `info@afghantours.com`. Treat as “handler present,” not “deliverability proven.”
2. **Legal pages were brief.** zip1 `privacy.md` / `terms.md` are short operational notices — not full counsel-reviewed policies. WG1 restores **draft stubs** labeled pending operator review; do not paste unchecked license/payment claims.
3. **Do not migrate front-matter defects.** zip1 MD / CSV quirks (typos like `chiken-korma`, broken image paths, front-matter inconsistencies) must not be copied blindly into Astro 5 collections.
4. **Reconcile 22 tours vs 23 routes.** See above — index + 22 slugs.
5. **Map needs verified data.** Interactive Leaflet from zip1 requires verified `public/data/maps/*.json` (and deps). Repo static maps are not a silent substitute for “map parity.”
6. **Phone / WhatsApp needs authoritative check.** Repo + footer use `+93 780 123 456` / `93780123456`. Treat as **placeholder-until-verified**, not confirmed operator line (see `OPEN-BUSINESS-FACTS.md`).

---

## Reference packages on box

| Path | Status |
|---|---|
| `/workspace/afghantours-zips/zip1` | **Present** — Astro 4 live-aligned source handoff (NOT HTML prototype) |
| `/workspace/afghantours-zips/zip2` | Present — image quarantine/duplicate audit CSVs |
| `/workspace/afghantours-zips/zip3`, `zip4` | **Empty** |
| `/workspace/afghantours-live-vs-repo-comparison.md` | Present — used after verification |
| **cpanel-final** | **BLOCKED — not found** under `/workspace` / attachments |
| **text csv** package | **BLOCKED — not found** (repo already has `data/*.csv`) |
| **latest-images** package | **BLOCKED — not found** (zip1 has import script only) |
| **html-handoff** | **BLOCKED — not found** |
| `Sample.html` historical | **Not discoverable** in zip1 or workspace — redirect map uses **410** pending cpanel-final |

Continue WG1 with **zip1 + repo** only for recoveries that need missing zips.

---

## WG1 scaffolding (reversible)

| Change | Risk | Notes |
|---|---|---|
| `/transportation/` | Low | Reuses shared `TransportArrangements` body; nav/footer point here |
| `/getting-around/` | Low | Kept as alias with notice; host **301 → /transportation/** |
| `/privacy/`, `/terms/` | Low | Draft stubs; footer links added; no invented refund/payment rules |
| Social footer | Already present | FB / IG / X / Google Business (approved URLs) |

Wakhan region page, nested food URL restructure, Leaflet, PHP form wiring → **WG2+** (documented in redirect map / open facts).

---

## Primary scheduled set (inventory check)

All present in CSV + dist:

`weekend-in-kabul`, `winter-circuit`, `summer-circuit`, `fall-eastern-afghanistan`, `spring-afghanistan-tour`, `buzkashi-expedition`, `signature-afghan-tour`  
(+ exemplar `heart-of-the-silk-road`)

---

## Recommended WG2 start

1. Operator confirm WhatsApp/phone + sixth custom audience label.  
2. Host redirect rules from `docs/redirect-map.csv` (301/410).  
3. Decide form backend for cPanel (PHP mail vs Formspree/other) and wire `FORM_ENDPOINT` / `tour-inquiry.php` **with deliverability test**.  
4. Operator-reviewed Privacy/Terms (replace stubs); payment/refund language only when provided.  
5. Nested food redirects QA for UNMAPPED rows; optional Wakhan region content.  
6. Map strategy: verified JSON + Leaflet **or** accept static maps.  
7. Do **not** merge zip1 tour template / CSV wholesale without gated review.

---

## WG2 pointer

See **`docs/WG2-REPORT.md`** on branch `chore/completion-wg2-inquiries` for inquiry architecture, `.htaccess` redirects, privacy/terms expansion, and test plan.
Inquiry wiring + redirects landed in WG2 (not this baseline commit).

