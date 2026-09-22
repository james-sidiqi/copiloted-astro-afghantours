# FAQ verification notes

**Branch:** `feat/faq-master-integration`  
**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Scope:** Master FAQ integration + factual corrections. No merge/deploy.

## Sources used

1. **zip1 master** — `/workspace/afghantours-zips/zip1/data/faqs/faqs_master.csv` (47 Qs: FAQ-001…FAQ-047)
2. **Live FAQ** — `/workspace/afghantours-audit/copy-compare/live_faq_.html` (28 booking/ops accordion answers; category IA)
3. **Repo `data/faq.csv`** — prior home + tour-specific rows (IDs preserved where possible)
4. **James FAQ task mandatory corrections** — visas/LOI, provincial coordination, mahram ≠ guide, money/ATMs/cash USD, insurance/evac honesty, food mantu/aushak nuance, photography/drones, fitness/accessibility
5. Supporting copy: zip1 `src/content/pages/faq.md`, `operational-faq.md`

## Architecture

- Canonical file: `data/faq.csv`
- Required columns unchanged for loaders: `faq_id`, `page_assignment`, `category`, `tour_slug`, `question`, `answer`, `is_active`
- Optional columns (non-breaking): `sort_order`, `related_links`, `image_path`, `verification_note`, `source_ref`
- `/faq/` filters to assignments containing `faq` (or empty/global) — home-only and tour-only rows stay off the FAQ page
- Tour pages keep `page_assignment=tour` + `tour_slug` rows
- Home teaser keeps `page_assignment=home`
- No FAQPage JSON-LD (Google discontinued FAQ rich results May 2026)

## Corrections applied (outdated claims removed/rewritten)

| Topic | Old / incorrect claim | Corrected stance |
|---|---|---|
| Visas / LOI | Universal LOI required; consulate-only path | LOI **not** universal; e-Visa / mission channels vary; LOI support when required for confirmed bookings; we do not issue visas |
| Provincial permits | Oversimplified “Maktub” as always required | Provincial registrations / coordination letters where itinerary requires; varies by province |
| Women / mahram | “Lead guide often fulfills mahram” | **Guide ≠ mahram**; discuss current accompaniment rules honestly |
| Money | Cash-only, no cards/ATMs; universal post-2013 USD bills | Cash important; cards limited; ATMs possible but unreliable backup; bill-year not asserted as universal |
| Insurance | High-risk insurance “mandatory” as obligation | Strongly recommended, not framed as legal mandate; no named provider; no arbitrary minimums on page |
| Evacuation | Guaranteed medevac to Dubai/Istanbul via mandatory policy | On-ground coordination; evacuation depends on insurer/access — **not guaranteed** |
| Food | Ashak as always-vegetarian staple | Mantu/aushak described with meat-sauce/yogurt nuance; vegetarian with advance notice |
| Photography | Weak | Consent + checkpoint/gov/military restrictions |
| Drones | Permit timeline claimed as fixed 3 months | No drones without authorization; contact before packing |
| Fitness / accessibility | Thin | Honest physical demand + limited mobility realism |

## Remaining claims needing ops confirmation

Items below still carry `verification_note` in CSV and must not be treated as locked facts:

1. **Current e-Visa eligibility** by nationality (and any exceptions)
2. **Exact provincial coordination-letter** names/process language used with travelers
3. **Mahram / accompaniment enforcement** wording for 2026 briefings
4. **ATM / card / USD bill-quality** guidance ops actually gives clients today
5. **Preferred insurers / coverage minimums** (intentionally omitted until written confirmation)
6. **Deposit / payment / refund schedule** (blocked on operator policy text — see OPEN-BUSINESS-FACTS)
7. **Buzkashi match windows** for marketing calendars
8. Whether to **name eSIM vendors** (Saily/Airalo) in public copy — currently avoided on FAQ page answers; zip1 mentioned them historically
9. **WhatsApp number** still unverified for cutover marketing

## Related product fix (same PR)

**InquiryForm static false-Sent:** success only when `response.ok` **and** JSON body `ok === true`. HTML/text/PHP-source responses on static hosts show a clear error directing travelers to WhatsApp/email or `PUBLIC_FORM_ENDPOINT`.

## Counts (post-integration)

See PR body / build verification for live `/faq/` displayed count after `npm run build`.
