# Copiloted Hub Experience — Asset Migration Table
Date: 2026-09-25 (AFT)
Branch: feat/hub-experience-architecture
Policy: copy into canonical experiences/* ; KEEP legacy folders; no bulk delete.

## Culinary slug rename
| From | To | Action | Legacy kept |
|---|---|---|---|
| experiences/culinary/band-e-amir-dairy-market-quroot/ | experiences/culinary/band-e-amir-quroot-dairy/ | copied hero/thumb/gallery | YES (old folder retained) |
| content band-e-amir-dairy-market-quroot.md | band-e-amir-quroot-dairy.md | renamed | N/A |
| URL /cultural-experiences/culinary/band-e-amir-dairy-market-quroot/ | /cultural-experiences/culinary/band-e-amir-quroot-dairy/ | 301 via astro.config + redirect-map + .htaccess | old redirect page in dist |

Also updated: /cultural-experiences/qurut-markets-of-bamyan/ → new culinary slug (301).

## Activities → experiences/activities/<slug>/{hero,thumb}.webp
| Canonical slug | Source | Action | Notes |
|---|---|---|---|
| fishing | already at experiences/activities/fishing/ | kept | pre-existing canonical |
| sightseeing | experiences/activities/sightseeing/historical/ | copied hero/thumb to sightseeing root | subtypes retained under sightseeing/* |
| shopping | public/assets/images/activities/shopping/ | copied 01→hero, 02→thumb | KEEP legacy activities/shopping |
| skiing | public/assets/images/activities/backcountry-skiing/ | copied 01→hero, 02→thumb | KEEP legacy; temporary alias of backcountry-skiing assets |
| horse-riding | public/assets/images/activities/other/horseback-riding.webp | copied to hero+thumb | KEEP legacy |
| hiking | experiences/activities/sightseeing/scenic/ | TEMPORARY FALLBACK copy | replace with hiking-specific shoot |
| trekking | public/assets/images/tours/trek-the-wakhan-corridor*.webp | TEMPORARY FALLBACK copy | replace with trekking-specific shoot |
| cycling | experiences/activities/sightseeing/scenic/ | TEMPORARY FALLBACK copy | replace with cycling-specific shoot |

## Temporary fallbacks (documented — not invented photography)
- hiking → sightseeing/scenic
- cycling → sightseeing/scenic
- trekking → tours/trek-the-wakhan-corridor* (else scenic)
- skiing → backcountry-skiing legacy folder
- horse-riding → activities/other/horseback-riding.webp

## Legacy retained (no bulk delete)
- public/assets/images/activities/**
- root activities/**
- experiences/culinary/band-e-amir-dairy-market-quroot/
- experiences/culinary/qurut-markets-of-bamyan/ (if present)
- experiences/activities/birding/ (not in locked 8; retained)
- experiences/activities/sightseeing/{historical,religious,scenic,markets}/

## Resolver priority (updated)
getAssetUrl.pickExperienceImage('activities') now prefers resolveActivityExperienceAsset (experiences/activities) before legacy activities/ category folders.
