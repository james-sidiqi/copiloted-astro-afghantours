# AfghanTours — Preview checklist (WG5)

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Tip:** `512038f` (`chore/completion-wg4-explore`) · review branch `chore/completion-wg5-review`  
**Purpose:** Focused visual / UX checks for James. **No deploy.**

Preview locally or in Codespace: `npm ci && npm run build && npx serve dist -l 4321` → `http://127.0.0.1:4321/`.  
Public Codespace tunnel for the older ready preview was **404** (Codespace Shutdown) — recreate on this branch if a shareable URL is needed.

Mark each row after checking desktop + one mobile width (~390).

---

## Core marketing

| # | Route | Checks |
|---|---|---|
| 1 | `/` **Home** | H1 Experience Afghanistan; **primary seven** only in featured scheduled; six custom audiences; CTAs Tour Packages / Custom Requests / Contact; no invented prices; sticky WhatsApp clears primary CTAs |
| 2 | `/tours/signature-afghan-tour/` **Scheduled pattern** | Price on request; Proposed · Enquire (not fake Available); inclusions ≠ itinerary clone; inquire CTA prefills scheduled flow; schematic map labeled not proven roads |
| 3 | `/custom-requests/diaspora/` **Diaspora** | Family/origins framing; personal history ≠ access; CTA → Build My Journey with `audience=diaspora` |
| 4 | `/custom-requests/` | Planning hub lists audiences; links to diaspora pattern + contact custom flow |

Also spot one other primary tour (e.g. `/tours/weekend-in-kabul/`) for consistent enquire framing.

---

## Explore

| # | Route | Checks |
|---|---|---|
| 5 | `/attractions/` **+ map** | Leaflet loads; approx pins **off** by default; filters sync map ↔ cards; cards usable if map fails / JS off; OSM attribution |
| 6 | `/hubs/kabul-city/` (or Bamyan) | Hub narrative; related **scheduled** tours only; hotels scoped to hub destination (no wrong-city hotels) |
| 7 | `/provinces/bamyan/` | Province page; related scheduled links; no false drive times |
| 8 | `/food-culture/` | Index + one dish page; related tours when linked; hero/media present |

Optional: `/regions/`, `/destinations/`, `/cultural-experiences/` smoke (200, no broken chrome).

---

## Plan / ops

| # | Route | Checks |
|---|---|---|
| 9 | `/hotels/` | Tier cards; crop/object-position looks intentional; no invented star ratings beyond data |
| 10 | `/transportation/` | **Standard** default language; upgrades **Additional cost**; mountain-access image if asset present; `/getting-around/` still works + points here |
| 11 | `/about/` | Reimagined / Kabul-based voice; no invented license numbers |
| 12 | `/contact/` | General form; `?flow=custom` multi-step + review; `?flow=scheduled&tour=…` prefills; honeypot hidden; WhatsApp/email alternatives; **do not** claim inbox receipt |

Also: `/visa-entry/`, `/safety/`, `/faq/` 200 + footer links.

---

## Legal drafts

| # | Route | Checks |
|---|---|---|
| 13 | `/privacy/` | Draft banner; no invented retention/subprocessors; `[OPERATOR DECISION]` respected |
| 14 | `/terms/` | Draft banner; inquiry ≠ booking; no invented deposit/refund % |

Footer links to privacy/terms/socials resolve.

---

## Global chrome (every page)

- [ ] Header nav: Tours, Custom Requests, Explore, Plan, About, Contact  
- [ ] Mobile menu: open/close; Escape closes; `aria-expanded` sensible  
- [ ] Focus-visible rings on keyboard tab  
- [ ] `prefers-reduced-motion`: hero video suppressed where applicable  
- [ ] No console-breaking Leaflet errors on non-attractions pages (map should not load on home)

---

## Redirect / artifact spot (local file check)

- [ ] `dist/.htaccess` and `dist/tour-inquiry.php` present after build  
- [ ] Primary seven HTML dirs exist under `dist/tours/`  
- [ ] `/privacy/`, `/terms/`, `/transportation/`, `/custom-requests/` present  

Host 301 QA only **after** approved cutover (see COMPLETION-CHANGE-REPORT §10).

---

## Sign-off

| Role | Result | Date (AFT) |
|---|---|---|
| James visual review | ☐ Pass / ☐ Issues noted | |
| Deploy approved | ☐ No (default) / ☐ Yes | |

**Default: ready for review, not for deploy.**
