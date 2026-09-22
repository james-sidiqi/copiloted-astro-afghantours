# Open business facts — unresolved (WG1 + WG2 + WG3)

**Date:** 2026-09-22 (Asia/Kabul, AFT) · WG3 pass  
**Rule:** Do not invent prices, dates, testimonials, license numbers, payment/refund rules, or phone numbers to “fill gaps.”

---

## 1. WhatsApp / phone verification

| Current in repo | Source |
|---|---|
| Display `+93 780 123 456` / `+93-78-012-3456` | `src/lib/config.ts`, Footer, contact |
| wa.me `93780123456` | same |

**Status:** **UNVERIFIED** against an authoritative operator source (SIM ownership, live site confirmation by James, or cpanel/business listing).  
Comparison doc and live both show the same pattern — that is **not** proof it is the correct production line.  
**Action:** James confirm or supply the correct WhatsApp/E.164 number before any cutover marketing.  
**Flag:** Do **not** change the published number without evidence. WG2 wired UI to `siteConfig` only.

---

## 2. Sixth custom audience label

Repo custom audiences (`src/lib/content/customAudiences.ts`):

1. Diaspora  
2. Veterans  
3. Peace Corps alumni  
4. Business travelers  
5. Artists  
6. Media  

Live homepage audiences (per comparison): Private, Photographers, Journalists, Veterans, Diaspora, Researchers — **different set**.

**Status:** Which label is the locked “sixth” (or full set) for marketing cards is **unresolved**.  
Do not silently rename Artists↔Photographers or Media↔Journalists without operator decision.

---

## 3. Buzkashi match windows

Tour slug `buzkashi-expedition` exists; copy correctly avoids inventing a fixed match date.  

**Status:** Actual **match windows / seasons for marketing** still need operator confirmation before any “next game” or calendar claim.  
Proposed rows in `data/tour_dates.csv` (if any) remain **proposed / inquiry** — not bookable facts.

---

## 4. Prices and dates to verify

**WG3 note (2026-09-22 AFT):** Primary seven scheduled tours intentionally show **Price on request** / empty `price_from`. Custom Expedition no longer advertises 15-day / $3500 — duration and price are quotation outputs. Softened several legacy `open` placeholder dates to `proposed`. Operator must still verify every public price and every departure before calling it bookable.

Several non-primary catalog tours still carry legacy dollar amounts (e.g. central discovery, spring/fall discovery). Proposed dates ≠ confirmed departures.


## 5. Payment / refund terms (policies)

Draft `/terms/` stub explicitly **omits** deposit, cancellation, and refund schedules.  

**Status:** **BLOCKED** on operator-provided policy text. Do not port unchecked zip1 payment paragraphs as final without review.

---

## 6. Form backend choice for cPanel

Options in play:

| Option | Notes |
|---|---|
| PHP `tour-inquiry.php` + `mail()` | Matches live/zip1; needs PHP-capable host; **deliverability unproven** until inbox test |
| External endpoint (`FORM_ENDPOINT`) | Formspree / similar; works on pure static cPanel |
| Mailto-only | Works without backend; poor UX / no structured lead store |

**Status:** WG2 wires **dual path** (default `/tour-inquiry.php` + optional `PUBLIC_FORM_ENDPOINT`).  
Inbox deliverability still **UNPROVEN** until James runs `docs/INQUIRY-TEST-PLAN.md`.  
Reminder: mailto/PHP presence ≠ proven inbox delivery.

---

## 7. Other completion blockers (packages)

| Package | Status |
|---|---|
| cpanel-final | **Missing** — needed for historical URL / Sample.html / live file tree recovery |
| text csv handoff | **Missing** — repo CSVs in use; confirm if a newer master exists |
| latest-images | **Missing** — do not invent assets |
| html-handoff | **Missing** — not the same as zip1 Astro source |

---

## 8. License / legal claims

Do not invent or expand license identifiers on stubs. Any license number used in marketing must match operator documentation. zip1 terms mentioned a license string — **re-verify** before publishing on Astro 5 pages.

---

## 9. Privacy / Terms operator decisions (WG2)

Placeholders marked **[OPERATOR DECISION]** on `/privacy/` and `/terms/` drafts — do not invent values:

| Item | Status |
|---|---|
| Data retention / deletion window for inquiries | **[OPERATOR DECISION]** |
| Lawful-basis / cookie tooling language | **[OPERATOR DECISION]** |
| Named subprocessors / provider list | **[OPERATOR DECISION]** |
| Deposit % / payment schedule | **[OPERATOR DECISION]** |
| Cancellation / refund windows | **[OPERATOR DECISION]** |
| Governing law / venue | **[OPERATOR DECISION]** |
| License number string for public site | **[OPERATOR DECISION]** — re-verify before publish |

---

## 10. Form dry-run log

| Date (AFT) | Path tested | Result | Notes |
|---|---|---|---|
| 2026-09-22 | Local markup + build + `php -l` | lint OK | No production POST; inbox unproven |

