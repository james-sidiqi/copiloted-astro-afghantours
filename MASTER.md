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

---

## Source of Truth
The source of truth for operational and tourism data is the CSV layer.

Copilot must assume that data belongs in CSV files when relevant, not in hardcoded component strings.

Primary data files include:
- locations.csv
- regions.csv
- provinces.csv
- attractions_master.csv
- attraction_time_profile.csv
- hub_to_attraction_access.csv
- route_matrix.csv
- route_groups.csv
- route_group_members.csv
- ground_transport.csv
- domestic_flights.csv
- hotel_properties.csv
- hotel_rooms.csv
- tours.csv
- tour_itinerary.csv
- tour_attractions_map.csv
- tour_dates.csv
- pricing_reference.csv
- faq.csv
- dishes.csv
- attraction_access_classification.csv
- route_access_classification.csv

If a requested change depends on data that exists in CSVs, update the data-driven system rather than hardcoding a one-off display fix.

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
- KBLC
- BMYC
- MAZC
- HERC
- KDRC
- JBDC
- FAIC
- GHZC

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

## Architecture Rules
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
1. read MASTER.md
2. read the relevant page-type file
3. preserve unrelated systems
4. change the smallest stable scope possible

Do not tear down working systems when a section-level update is enough.

---

## Priority Order
When conflicts arise:
1. MASTER.md
2. page-specific instruction file
3. map-specific instructions in Map.md for anything map-related

---

## Enforcement Rule
If data is missing or inconsistent:
- flag it
- do not guess
- do not fabricate a workaround silently
