# Inquiry test plan — James verification

**Date:** 2026-09-22 (Asia/Kabul, AFT)  
**Rule:** Do **not** claim inbox receipt without a controlled test. WG2 only validates markup + local PHP syntax when available.

## Architecture under test

| Path | When |
|---|---|
| `POST /tour-inquiry.php` | Default; cPanel host must execute PHP |
| `PUBLIC_FORM_ENDPOINT` | Static-only host (Formspree / similar) |
| WhatsApp + mailto | Always visible alternatives (`siteConfig`) |

Flows: `scheduled` (tour + departure prefills), `custom` (multi-step + review), `general`.

## Automated / local (no spam)

1. `npm run build` — must pass; `dist/tour-inquiry.php` and `dist/.htaccess` present.
2. Form markup: open `/contact/`, `/contact/?flow=custom`, `/contact/?flow=scheduled&tour=weekend-in-kabul&tourName=Weekend%20in%20Kabul`.
3. Confirm honeypot fields `website` / `company_url` are present but visually hidden.
4. Confirm review step appears only on custom flow step 3.
5. PHP lint (if `php` installed): `php -l public/tour-inquiry.php`.
6. **Do not** POST to production `info@afghantours.com` from CI or agents without James approval.

## Controlled inbox test (James)

**Prerequisite:** Deploy `tour-inquiry.php` to a PHP-capable host (or set `PUBLIC_FORM_ENDPOINT`).

1. Use a **unique subject token** in the message, e.g. `WG2-TEST-2026-09-22-<your-initials>`.
2. Submit once via each path you intend to support:
   - Scheduled tour inquiry from a tour sidebar link
   - Custom “Build My Journey” through review → Send
   - General contact
3. Check **inbox + spam** for `info@afghantours.com` within 15 minutes.
4. Confirm Reply-To is your test email when provided.
5. Record results in OPEN-BUSINESS-FACTS § Form backend (pass/fail + host type).
6. If PHP `mail()` fails: keep WhatsApp/email live; switch to `PUBLIC_FORM_ENDPOINT` or fix host mail relay — do not claim success.

## Failure UX expectations

- Failed send keeps form values on the page.
- Status banner shows error + points to WhatsApp/email.
- Success copy must **not** promise booking; inquiry ≠ booking.

## WhatsApp number

Published number remains **UNVERIFIED** until operator confirmation. Do not change without evidence.
