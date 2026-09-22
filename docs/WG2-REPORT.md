# AfghanTours — WG2 Report (Inquiries & continuity)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Branch:** `chore/completion-wg2-inquiries`  
**Base:** `chore/completion-wg1-baseline` (PR #22)  
**Direction:** James completion brief 2026-09-22 — Work Group 2

---

## Delivered

### 1. Inquiry architecture
- Shared vocabulary: `src/lib/inquiry.ts` + `InquiryForm.astro`
- Three flows: **scheduled** (prefilled tour/departure), **custom** (adaptive + review), **general**
- Persist via query params + hidden fields + client state (`history.replaceState` on change)
- Dual submit path: hardened `public/tour-inquiry.php` **and** `PUBLIC_FORM_ENDPOINT` override in `siteConfig.form`
- Docs: PHP only if host executes PHP; static-only → FORM_ENDPOINT
- Pending / success / failure UI; values preserved on error
- WhatsApp + email alternatives from config; OPEN-BUSINESS-FACTS flags number verification
- Booking sequence explained on form + terms (inquiry ≠ booking)
- `docs/INQUIRY-TEST-PLAN.md` — no inbox receipt claim without James test

### 2. Redirects / continuity
- Expanded `docs/redirect-map.csv` (+ legacy .html, maps→regions note, cultural-experiences continuity)
- `scripts/generate-htaccess.mjs` → `public/.htaccess` (301/410 RewriteRules; hand block preserved)
- Nav: Tours, Custom Requests, Explore, Plan Your Trip, About, Contact + Build My Journey
- Explore children: Attractions, Regions, Provinces, Cities & Hubs, Food & Culture (Cultural Experiences via F&C anchor)
- Regional Map not in nav
- Tagline only under site title in header (already sole UI use of `siteConfig.tagline`)
- Canonical prefs: `/transportation/`, `/provinces/`, `/hubs/faizabad/`, `/privacy/`, `/terms/`

### 3. Privacy / Terms
- Expanded drafts around JTTA, inquiry handling, providers, booking process, traveler responsibilities
- No invented payment %, refund windows, or retention periods
- `[OPERATOR DECISION]` placeholders recorded in OPEN-BUSINESS-FACTS

### 4. Build / PR
- `npm run build` → **Passed** (251 pages) · 2026-09-22 ~10:28 AFT
- `php -l public/tour-inquiry.php` → No syntax errors
- `dist/.htaccess` + `dist/tour-inquiry.php` present after build
- Stacked PR targeting `chore/completion-wg1-baseline` (PR #22)

---

## Custom audiences (confirmed in repo only — do not invent a sixth)

From `src/lib/content/customAudiences.ts`:

1. Diaspora  
2. Veterans  
3. Peace Corps alumni  
4. Business travelers  
5. Artists  
6. Media  

Live homepage set (Private, Photographers, Journalists, Veterans, Diaspora, Researchers) remains **different** — unresolved; no silent rename.

---

## Missing packages (still absent)

| Package | Status |
|---|---|
| cpanel-final | **Missing** |
| text csv handoff | **Missing** |
| latest-images | **Missing** |
| html-handoff | **Missing** |

zip1 present; zip3/zip4 empty.

---

## Hosting notes
- Deploy `dist/` **including** `.htaccess` and `tour-inquiry.php` on Apache/cPanel.
- Nginx needs an equivalent redirect map (CSV is source of truth).
- Do not deploy from this PR without James go-ahead.
