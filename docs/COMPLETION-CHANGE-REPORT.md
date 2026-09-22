# AfghanTours — Completion Change Report (WG5 Release Review)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Direction:** James completion brief 2026-09-22 — Work Group 5  
**Status:** **Ready for James review. NOT for deploy. Do not merge until approval.**

---

## Tip under review

| Item | Value |
|---|---|
| Tip branch (code) | `chore/completion-wg4-explore` |
| Tip SHA | `512038f36b4d2929d6b1c49608c65233636ddae0` |
| Review branch (this package) | `chore/completion-wg5-review` |
| Stacked PRs | [#22](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/22) → [#23](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/23) → [#24](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/24) → [#25](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/25) → **this PR #26** |
| Base ready tip | `chore/ready-2026-09-21` @ `57feb46` |
| Site / host assumption | `https://www.afghantours.com` · static `dist/` + optional PHP on cPanel |

---

## 1. Source commits / PR stack #22–#25

| PR | Branch | Tip SHA | Role |
|---|---|---|---|
| [#22](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/22) | `chore/completion-wg1-baseline` | `82e54f2` (docs SHA note; scaffold `6732ae9`) | Baseline docs, reversible URL scaffolding (transportation / privacy / terms) |
| [#23](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/23) | `chore/completion-wg2-inquiries` | `d0104b1` | Inquiry architecture, `.htaccess` redirects, legal drafts, INQUIRY-TEST-PLAN |
| [#24](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/24) | `chore/completion-wg3-products` | `0fa2eb3` | Primary seven, custom-requests hub + diaspora, signature pattern |
| [#25](https://github.com/james-sidiqi/copiloted-astro-afghantours/pull/25) | `chore/completion-wg4-explore` | `512038f` | Leaflet attractions map, related-tour guardrails, a11y / transport polish |

**Linear commit messages (ready → tip):**

1. `6732ae9` chore(wg1): completion baseline docs + reversible URL scaffolding  
2. `82e54f2` docs(wg1): record baseline commit SHA in COMPLETION-BASELINE  
3. `d0104b1` chore(wg2): inquiry architecture, htaccess redirects, legal drafts  
4. `0fa2eb3` chore(wg3): primary scheduled catalog, custom requests, signature pattern  
5. `512038f` chore(wg4): attractions Leaflet map, related-tour guardrails, a11y/transport polish  

Supporting reports: `docs/COMPLETION-BASELINE.md`, `docs/WG2-REPORT.md`, `docs/WG3-REPORT.md`, `docs/WG4-REPORT.md`.

---

## 2. Changed pages / components / data (summary)

### WG1 — continuity scaffolding
- New/restored routes: `/transportation/`, `/privacy/`, `/terms/`; `/getting-around/` retained as alias.
- Docs: baseline, route inventory, redirect map, open business facts.

### WG2 — inquiries & redirects
- Shared `InquiryForm` + `src/lib/inquiry.ts` (scheduled / custom / general).
- `public/tour-inquiry.php` + optional `PUBLIC_FORM_ENDPOINT`.
- `docs/redirect-map.csv` + `scripts/generate-htaccess.mjs` → `public/.htaccess` (301/410).
- Expanded privacy/terms drafts with `[OPERATOR DECISION]` placeholders.
- Nav: Tours, Custom Requests, Explore, Plan, About, Contact.

### WG3 — products & content
- Homepage featured = **primary seven** scheduled tours only.
- `/custom-requests/` + `/custom-requests/diaspora/` pattern page.
- Signature Afghan Tour polished as proposed/enquiry template.
- Custom Expedition: removed fixed 15-day / $3500; planning-service framing.
- Tours index: Scheduled vs Custom; secondary catalog retained (incl. Heart of the Silk Road).

### WG4 — explore & presentation
- Leaflet on `/attractions/` only; map data from CSV via `build-map-data.mjs`.
- Related scheduled-tour links only; hub hotels destination-scoped.
- A11y (Escape menu, focus-visible, reduced-motion); transport Standard + Additional cost.

### WG5 — this package
- Release review docs only (`COMPLETION-CHANGE-REPORT.md`, `PREVIEW-CHECKLIST.md`). No product/code change beyond documentation.

---

## 3. redirect-map + `.htaccess` note

| Artifact | Role |
|---|---|
| `docs/redirect-map.csv` | Source of truth (~115 data rows + header): 301 province remaps, food nested→flat, hub aliases, 410 Sample/restaurants, 404 Wakhan region pending content |
| `scripts/generate-htaccess.mjs` | Regenerates Apache rules from CSV |
| `public/.htaccess` → copied to `dist/.htaccess` | **Must ship with `dist/`** on cPanel/Apache |
| Nginx | Needs equivalent map from CSV (not generated here) |

Canonical prefs: `/transportation/`, `/provinces/`, `/hubs/faizabad/`, `/privacy/`, `/terms/`.  
Still open: `/regions/wakhan-northeast/` content missing; UNMAPPED food rows flagged in CSV.

---

## 4. Inquiry architecture + INQUIRY-TEST-PLAN

| Path | When |
|---|---|
| `POST /tour-inquiry.php` | Default on PHP-capable cPanel |
| `PUBLIC_FORM_ENDPOINT` | Static-only host override |
| WhatsApp + mailto | Always available alternatives (`siteConfig`) |

Flows: **scheduled** (tour + departure prefills), **custom** (multi-step + review), **general**.

**Receipt NOT proven.** Local validation only: markup + build artifacts + prior `php -l`. Inbox deliverability requires James to run `docs/INQUIRY-TEST-PLAN.md` on a real host. Do **not** claim messages arrive at `info@afghantours.com` until that test passes.

---

## 5. Scheduled seven + custom audiences + polished patterns

**Primary seven (homepage featured):**  
`weekend-in-kabul`, `winter-circuit`, `summer-circuit`, `fall-eastern-afghanistan`, `spring-afghanistan-tour`, `buzkashi-expedition`, `signature-afghan-tour`

**Polished pattern:** `/tours/signature-afghan-tour/` (Price on request; Proposed · Enquire; real inclusions/exclusions).

**Custom audiences (repo):** Diaspora, Veterans, Peace Corps alumni, Business travelers, Artists, Media.  
**Pattern page:** `/custom-requests/diaspora/`. Hub: `/custom-requests/`.  
Live audience label set still differs — unresolved (see OPEN-BUSINESS-FACTS).

**Retained secondary:** e.g. `heart-of-the-silk-road`, Central Discovery, other scenic CSV tours — not homepage-featured.

---

## 6. Maps approach

| Item | Choice |
|---|---|
| Library | Leaflet 1.9 (npm), Astro 5 client bundle |
| Load scope | `/attractions/` only — **not** homepage |
| Data | CSV → `public/data/maps/{provinces,attractions,locations}.json` |
| Coords | 88 attractions with lat/lon; **75** exact-looking; **13** approximate (hidden by default, optional labeled toggle) |
| Fallback | Filterable cards always usable if map fails |
| Tour routes | Schematic day-order SVG — **not** proven roads / no drive times |

No admin1 GeoJSON polygons in-repo.

---

## 7. Validation results (build) — WG5 fresh run

| Metric | Result |
|---|---|
| Commands | `npm ci` then `npm run build` on tip `512038f` |
| When | 2026-09-22 ~10:48 AFT |
| Outcome | **Passed** |
| Pages built | **253** (`astro build` report) |
| `dist` `index.html` count | **252** (+ `/404.html` = **253** HTML) |
| Warnings | Browserslist caniuse-lite stale notice; npm engine wants ≥9.6.5 (have 9.2.0) — non-blocking |
| Node / Astro | Node **v20.19.2** · Astro **5.18.1** · output **static** |
| Artifacts present | `dist/.htaccess`, `dist/tour-inquiry.php` |
| Map build | 34 provinces · 88 attractions with coordinates · 54 locations |

### Optional local title curls (static serve `dist` @ `127.0.0.1:4321`)

All **200**:

| Path | Title |
|---|---|
| `/` | Afghan Tours – Experience Afghanistan |
| `/tours/signature-afghan-tour/` | Signature Afghan Tour – Afghan Tours |
| `/custom-requests/` | Custom Requests – Afghan Tours |
| `/custom-requests/diaspora/` | Diaspora Return Journeys – Custom Requests – Afghan Tours |
| `/attractions/` | Attractions – Afghan Tours |
| `/hubs/kabul-city/` | Kabul City Travel Hub – Afghan Tours |
| `/provinces/bamyan/` | Bamyan Province – Afghan Tours |
| `/food-culture/` | Food & Culture – Afghan Tours |
| `/hotels/` | Hotels – Afghan Tours |
| `/transportation/` | Transportation – Afghan Tours |
| `/about/` | About Us – Afghan Tours \| Kabul-Based, American-Led |
| `/contact/` | Contact – Afghan Tours \| Kabul-Based Planning |
| `/privacy/` | Privacy – Afghan Tours (Draft) |
| `/terms/` | Terms – Afghan Tours (Draft) |

---

## 8. Unresolved operator facts (from OPEN-BUSINESS-FACTS)

Do **not** invent answers. Full list in `docs/OPEN-BUSINESS-FACTS.md`:

1. WhatsApp / phone **UNVERIFIED** (`+93 780 123 456` / wa.me `93780123456`)  
2. Sixth / full custom audience label set vs live (Private, Photographers, Journalists, …)  
3. Buzkashi match windows for marketing  
4. Prices & dates — primary seven intentionally on request; legacy catalog $ amounts need verify  
5. Payment / refund / retention / governing law / license string — `[OPERATOR DECISION]`  
6. Form backend choice + **inbox receipt unproven**  
7. Missing packages: cpanel-final, text csv handoff, latest-images, html-handoff  
8. Wakhan region page still missing  

---

## 9. Rollback approach

**Do not merge this stack to production until James approves.**

If a cutover is later approved and fails:

1. Keep the **live cPanel backup** taken immediately before deploy (full public_html / site tree).  
2. Restore that backup to reverse the static site + `.htaccess` + PHP handler.  
3. Do **not** rely on git revert alone for production files already overwritten on host.  
4. Git-side: leave completion branches unmerged until approval; revert stacked PRs only if they were merged prematurely.

---

## 10. Production cutover steps — AFTER approval only

1. **Backup** live cPanel (files + any mail/PHP config).  
2. Build from approved tip: `npm ci && npm run build`.  
3. **Deploy** entire `dist/` including hidden `.htaccess` and `tour-inquiry.php`.  
4. **Verify redirects** from `redirect-map.csv` samples (provinces, getting-around→transportation, food nested, Sample 410).  
5. **Verify inquiry** per `INQUIRY-TEST-PLAN.md` (tokenized POSTs; inbox + spam).  
6. Spot-check primary seven, custom-requests, attractions map, privacy/terms drafts.  
7. **Search Console:** submit sitemap / inspect key URLs; monitor coverage after 301s.  
8. Confirm WhatsApp number and any legal `[OPERATOR DECISION]` items before marketing push.

---

## 11. Route inventory delta vs WG1

| Prefix / set | WG1 (`docs/route-inventory.md`) | Tip WG5 (`512038f`) | Delta |
|---|---|---|---|
| Astro pages built | **251** | **253** | **+2** |
| `/attractions/` | 89 | 89 | same |
| `/food-culture/` | 49 | 49 | same |
| `/provinces/` | 34 | 34 | same |
| `/tours/` | 23 (index + 22) | 23 | same |
| `/destinations/` | 15 | 15 | same |
| `/cultural-experiences/` | 14 | 14 | same |
| `/hubs/` | 9 | 9 | same |
| `/regions/` | 6 | 6 | same |
| `/custom-requests/` | *(absent)* | **2** (index + diaspora) | **+2 (WG3)** |
| Core singles | home, about, contact, faq, safety, visa, hotels, getting-around, transportation, privacy, terms | same set | no loss |

**No unexpected route loss vs WG1.** All WG1 prefixes and primary seven remain. Gains are intentional Custom Requests pages. Still missing vs live: `/regions/wakhan-northeast/` (documented 404 in redirect map).

---

## 12. Preview status (Codespace / tunnel)

| Check | Result |
|---|---|
| Existing Codespace `astro-preview-ready-2026-09-21-…` | **Shutdown**; still on `chore/ready-2026-09-21` (not completion tip) |
| Public GitHub preview port URL | **404** (e.g. `…-4321.app.github.dev`) — no running forwarded port |
| This agent environment | Local static serve of tip `dist/` only (not a public tunnel) |

### How James can preview

```bash
# Option A — Codespace on completion tip / review branch
gh codespace create -R james-sidiqi/copiloted-astro-afghantours -b chore/completion-wg5-review \
  -d "wg5-completion-review"
# Inside codespace: npm ci && npm run build && npx serve dist -l 4321
# Forward port 4321 (public if desired) from the Ports panel

# Option B — local
git fetch && git checkout chore/completion-wg5-review   # or chore/completion-wg4-explore for code tip
npm ci && npm run build && npx serve dist -l 4321
# open http://127.0.0.1:4321/
```

Use `docs/PREVIEW-CHECKLIST.md` for visual pass.

---

## Statement

**Ready for James review. Not for deploy.**  
Do not merge PR stack #22–#26 to production or overwrite live cPanel until explicit approval.
