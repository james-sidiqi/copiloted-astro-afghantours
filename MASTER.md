# AfghanTours — Master Copilot Instructions (Strict Enforcement)

## Status

This file is the highest-priority instruction file for this repository.  
Copilot must treat these instructions as binding unless the user explicitly overrides them.

---

## Mission

This repository powers AfghanTours.com, a premium expedition-style tourism website for Afghanistan.

The site must function as all of the following at once:

- a premium marketing site
- a logistics-aware tour operator platform
- a data-driven itinerary system
- a modular, maintainable Astro website

---

## Non-Negotiable Principles

1. Do not invent data.
2. Do not guess missing relationships.
3. Do not replace modular systems with hardcoded page content.
4. Do not break the hub-based operating model.
5. Do not remove major sections unless explicitly instructed.
6. Prefer section-level changes over global rewrites.
7. Preserve static-site compatibility.
8. Use reusable components wherever practical.
9. Do not silently bypass broken data by hardcoding visual-only fixes.
10. If a requested display depends on missing structured data, flag the issue clearly.

---

## Source of Truth

The source of truth for operational and tourism data is the CSV layer.  
Copilot must assume that data belongs in CSV files when relevant, not in hardcoded component strings.

Primary data files include:

- `locations.csv`
- `regions.csv`
- `provinces.csv`
- `attractions_master.csv`
- `attraction_time_profile.csv`
- `hub_to_attraction_access.csv`
- `route_matrix.csv`
- `route_groups.csv`
- `route_group_members.csv`
- `ground_transport.csv`
- `domestic_flights.csv`
- `hotel_properties.csv`
- `hotel_rooms.csv`
- `tours.csv`
- `tour_itinerary.csv`
- `tour_attractions_map.csv`
- `tour_dates.csv`
- `pricing_reference.csv`
- `faq.csv`
- `dishes.csv`
- `attraction_access_classification.csv`
- `route_access_classification.csv`

If a requested change depends on data that exists in CSVs, update the data-driven system rather than hardcoding a one-off display fix.

---

## Data Handling Rules

Copilot must prefer this pipeline:

1. CSV source data
2. typed loaders / transforms
3. build-time JSON or structured view models
4. reusable Astro components
5. lightweight client-side interactivity

### Rules

- Do not parse raw CSV repeatedly in scattered page files if a shared loader can be used.
- Prefer shared loader utilities and typed transformations.
- Prefer build-time conversion into clean JSON/view-model data for browser-side features.
- Do not duplicate business logic across multiple pages.

---

## Brand Positioning

AfghanTours should feel like:

- a premium expedition operator
- a culturally informed Afghan specialist
- a logistics-aware company
- a trustworthy planner
- a serious operator rather than a casual travel blog

Avoid:

- generic tourism fluff
- vague “adventure travel” clichés
- unrealistic luxury claims
- overpromising safety or access

---

## Tone of Voice

Use language that is:

- calm
- informed
- premium
- credible
- direct
- operationally grounded

Avoid:

- backpacker tone
- exaggerated copy
- hollow emotional sales language
- vague inspirational filler

---

## Core Operational Model

The site is based on hubs.

Primary operational hubs:

- `KBLC`
- `BMYC`
- `MAZC`
- `HERC`
- `KDRC`
- `JBDC`
- `FAIC`
- `GHZC`

Copilot must preserve this model in:

- tours
- itinerary logic
- hub pages
- route displays
- attraction grouping
- map logic

Do not invent new primary hubs unless explicitly instructed.

---

## Tier System

Use this exact tier system everywhere:

- Level 1 = Budget
- Level 2 = Standard
- Level 3 = Premium
- Level 4 = Luxury

Public-facing content should default to:

- Standard unless explicitly instructed otherwise

Never use VIP as a public service tier. Use Luxury instead.

---

## Expedition Logic

Expedition status is based on overnight logic, not vibes.

A tour is an expedition only if:

- the overnight leaves the hub / approved secondary-city network

Do not classify something as expedition merely because:

- it is in the mountains
- it is rugged
- it sounds remote

---

## Pricing Policy Rule

Copilot must follow `Pricing-Policy.md` wherever pricing appears.

### Required pricing distinction

- Fixed / featured tours from `tours.csv` must use **Starting from**
- Generated itinerary builder results must use **Estimated**
- Complex or uncertain trips must use **Custom Quote Required**

### Required pricing enforcement

- Every price display must include the correct disclaimer
- Every price display must include a CTA
- Do not present generated pricing as final
- Do not expose sensitive internal costing logic in client-side code

If pricing type is ambiguous, default to:

- **Estimated**

---

## Static Architecture Rule

This project is **static-first**.

The public website must:

- build to static output
- be deployable on standard cPanel hosting
- run without a Node.js server at runtime

### Copilot must avoid introducing:

- SSR as a dependency for public pages
- server-only rendering for normal page delivery
- required API routes for core site features
- Node runtime requirements for itinerary browsing, pricing display, or content delivery

### Allowed

- build-time data processing
- client-side interactivity
- optional third-party services for forms or CRM
- optional external APIs only when not required for core site function

### Required default

If a feature can be built either:
- as a static/client-side feature
- or as a server-dependent feature

Copilot must choose:

- the static/client-side implementation

---

## Itinerary Builder Rules

The itinerary builder is part of the public site experience and must remain compatible with static hosting.

### It must prefer:

- browser-side logic
- prebuilt JSON derived from CSVs
- deterministic route validation
- hub-based overnight assignment
- public-facing estimate generation
- graceful fallback states

### It must not require:

- a Node server runtime
- a required POST API for standard itinerary generation
- hidden backend dependency for basic public planning

### If route logic becomes too uncertain or complex:

Render:

- **Custom Quote Required**

and provide a strong CTA instead of inventing a precise result.

---

## Maps and Route Logic

Maps must remain modular and data-driven.

Copilot must:

- keep map logic isolated where practical
- avoid tightly coupling map state to unrelated page sections
- preserve route/hub/attraction relationships from structured data
- avoid hand-entered one-off map exceptions unless explicitly approved

For anything map-related, also follow `Map.md`.

---

## Page Architecture Rules

Copilot must prefer:

- Astro components
- modular sections
- reusable page structures
- clean data-loading boundaries
- isolated interaction logic

Copilot must avoid:

- monolithic page files
- repeating the same section markup across multiple pages
- tightly coupling map behavior to unrelated sections
- hardcoding route or attraction content when CSV-backed

---

## Change Management Rules

When changing a page:

1. read `MASTER.md`
2. read the relevant page-type instruction file
3. preserve unrelated systems
4. change the smallest stable scope possible

Do not tear down working systems when a section-level update is enough.

---

## Priority Order

When conflicts arise:

1. `MASTER.md`
2. page-specific instruction file
3. `Map.md` for anything map-related
4. `Pricing-Policy.md` for anything pricing-related
5. `Architecture.md` for anything deployment/runtime-related

---

## Enforcement Rule

If data is missing or inconsistent:

- flag it
- do not guess
- do not fabricate a workaround silently
- do not hardcode fake relationships to make the UI “look finished”

Instead:

- identify the missing field, dataset, or relationship
- preserve system integrity
- use safe fallback UI only when clearly labeled

---

## Safe Fallback Rules

Safe fallback behavior may include:

- hiding a section that cannot be truthfully populated
- showing “Information coming soon”
- showing “Custom Quote Required”
- showing a neutral placeholder image
- suppressing broken links or empty controls

Safe fallbacks must never:

- fabricate route durations
- invent hotel availability
- invent access classes
- invent attraction-hub relationships
- invent pricing

---

## Reusability Rule

If the same logic or markup appears in multiple places, Copilot should:

- extract a reusable component, utility, or loader

Do not copy and paste the same pricing, attraction, map, card, or itinerary logic into multiple files unless explicitly instructed.

---

## Final Principle

AfghanTours is a **static-first, data-driven, premium tour operator website** with modular client-side enhancements.

It is not:

- a generic travel blog
- a hardcoded brochure site
- a server-dependent web app

Copilot must preserve:

- data integrity
- modular architecture
- static deployability
- premium presentation
- operational credibility

---

End of Master Instructions
