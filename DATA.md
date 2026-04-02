# AfghanTours — Data Instructions (Strict Enforcement)

## Purpose
This file defines how Copilot must handle data, joins, CSV relationships, and source-of-truth logic.

These rules are mandatory.

---

## Data Discipline
Use codes for logic.
Use names for display.

Never use names as the primary join key when a code exists.

---

## Required Key Fields
- region_code
- province_code
- location_code
- attraction_code
- tour_slug

These should be treated as authoritative keys.

---

## CSV Source of Truth Rule
If a value already exists in a CSV file:
- do not duplicate it in hardcoded page markup
- do not create a second conflicting source of truth
- do not silently override it in the frontend

---

## Relationships That Must Be Preserved

### Geography
- provinces must map to regions
- locations must map to provinces / region hierarchy where required

### Attractions
- attraction_code must exist in attractions_master.csv
- attraction references in itinerary or tours must match attraction_code exactly
- location_code on attractions must map to a valid operational location

### Tours
- tour_slug must exist in tours.csv
- tour_itinerary.csv must use valid tour_slug
- tour_attractions_map.csv must use valid tour_slug and attraction_code

### Hotels
- hotel destination / location field must match the location system
- hotel tier must match the allowed tier vocabulary:
  - budget
  - standard
  - premium
  - luxury

### Pricing
- pricing_reference.csv is the source of truth for operational cost logic
- do not hardcode alternative pricing logic in components

---

## No Guessing Rule
If a route, attraction, hotel, or location relationship is missing:
- flag it
- do not invent one
- do not assume one based on text similarity

---

## Known System Rules
- Standard is the default tour tier unless explicitly changed
- SATCOM is optional for standard/adventure itineraries and required for expeditions
- Expedition logic is tied to overnight location behavior, not just attraction remoteness
- Hotel prices are internal cost, not public retail claims
- Dubai escort service is a fixed package cost in the pricing system

---

## Required Validation Mindset
Before changing data-driven UI, Copilot should verify:
1. does the referenced code exist?
2. is the relationship valid?
3. does the page already have a data source?
4. would this change create duplicate truth?

If yes, stop and preserve the data model.
