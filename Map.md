# AfghanTours — Map Instructions (Strict Enforcement)

## Purpose
This file isolates all map-related logic and behavior.

Map changes should be possible without destabilizing tours, attractions, hubs, or static content.

---

## Non-Negotiable Rules
- The map is a modular system.
- Map logic must remain isolated.
- The map must not become a hidden dependency for core page content.
- Pages must remain usable if the map is unavailable.

---

## Core Responsibilities
The map may:
1. show hubs
2. show attraction context
3. show route lines
4. highlight itinerary selections
5. sync with attraction drawer interactions

---

## Tour Page Map Rules
On tour pages, the map should:
- show overnight hubs
- show route order
- optionally highlight selected day
- optionally highlight selected attraction

Do not let the map replace the itinerary as the primary information source.

---

## Attraction Interaction
Clicking an attraction in itinerary context should:
- focus or highlight it on the map if available
- open the attraction drawer if configured
- not force a page change by default

---

## Fallback Rules
If map features fail:
- itinerary still works
- cards still work
- drawer still works
- page still renders cleanly

---

## Data Rules
Use only real data-backed location and attraction information.
Do not invent coordinates.
Do not guess unsupported route geometry.

---

## UI Rules
Maps should feel:
- calm
- premium
- useful
- uncluttered

Avoid noisy overlays and crowded markers.
