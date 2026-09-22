# Header match to live (fix/header-match-live)

## Intent
Make the completion-repo header **look and behave** like https://afghantours.com while keeping locked completion IA and brand rules.

## Before (repo on `chore/culinary-cultural-asset-fill`)
- White sticky Tailwind bar (`h-16`, shadow)
- Logo + blue title fallback; gray truncated tagline under logo column
- Nav: Tours, Custom Requests, Explore▾, Plan Your Trip▾, About, Contact
- CTA: gold pill, **white** text “Build My Journey”
- Mobile: hamburger + white dropdown panel

## After
- Dark gradient sticky bar matching live/zip1 (`#111a16` → `#121b17`, gold top border)
- Logo + **Afghan Tours** serif title + gold tagline stack (live brand layout)
- Same completion nav labels/URLs; dropdown styling matches live dark panels
- CTA: live gold pill (`#dda52f`) with **dark** text “Build My Journey”
- Mobile: dark-themed hamburger (needed because completion has more primary items than live)

## Remaining visual / IA diffs vs live
1. **Nav labels:** live = Tours▾, Explore▾, Plan▾, Information▾ + “Contact Us”; repo = Tours, Custom Requests, Explore▾, Plan Your Trip▾, About, Contact + “Build My Journey” (completion lock).
2. **Explore children:** live Attractions / Regional Map / Province Directory; repo Attractions / Regions / Provinces / Cities & Hubs / Food & Culture (locked IA + repo routes).
3. **Plan children:** live Travel Hubs / Transportation / Visa & Entry / FAQ under “Plan”; repo Visa & Entry / Safety / Hotels / Transportation / FAQ under “Plan Your Trip”.
4. **Mobile:** live uses horizontal-scroll nav (no hamburger); repo uses hamburger because six primary links + CTA do not fit the live scroll pattern cleanly.
5. **Breakpoint:** desktop nav hides at ≤1050px (live keeps scroll until 860px) so hamburger covers tablet widths with dense nav.
6. **Tagline punctuation:** rendered without trailing period to match live HTML; `siteConfig.tagline` still stores the locked string with period.
7. **Footer:** intentionally unchanged.
