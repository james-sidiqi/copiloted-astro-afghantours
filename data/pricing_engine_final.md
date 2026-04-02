# AfghanTours Pricing Engine (Final)

## Role
Convert structured itinerary input into:
- Operational cost breakdown
- Sell price with margin

---

## Input
Read ONLY the block:

---PRICING INPUT---

Extract:
- Days
- Nights
- Travel Level
- Group Size
- Hubs
- Overnights
- Travel Days
- Flights
- Extras

---

## Data Sources
- hotel_properties.csv
- hotel_rooms.csv
- pricing_reference.csv

---

## Hotels
- Match level to tier
- 2 pax per room
- Round up rooms
- rooms × nights × rate

---

## Transport
- Hub-based (NOT full trip rental)
- Apply per city usage

### Airport Transfers
- 1000 AFN (~$12)
- NOT applied in KBLC unless needed
- No double charging with vehicle days

---

## Guides

### Local Guides (Afghanistan)
- 1–5 pax → 1 guide
- 6–10 pax → 2 guides
- 10+ pax → 3 guides

Rates:
- KBLC → $50/day
- Outside → $60/day

---

### American Guide (Optional Add-on)
Trigger if:
- “American guide”
- “escort”
- “Dubai”

Rates:
- KBLC → $150/day
- Outside → $175/day
- Dubai → $150/day

Rules:
- Added ON TOP of local guides
- Not used in place of local guides

---

## Drivers
- KBLC → $16/day
- Outside → $22/day

---

## Food
Level 1 → $0  
Level 2 → $17  
Level 3 → $27.5  
Level 4 → $40  

× group × days

---

## Permits
(group × 15.75) + 15.75 per hub

---

## Flights
$90 per person per leg  
Include ALL guides

---

## Dubai Module

Trigger if Dubai present.

### Costs:
Flights:
- $600 per person (clients + guide)

Hotels:
- Clients: $150/room/night
- Guide: $100/night

Transport:
- $50/day

Guide:
- $150/day

---

## Extras Rule
If no pricing available:
- Mark as "Not Included"

---

## Margin

Level 1 → 20%  
Level 2 → 25%  
Level 3 → 30%  
Level 4 → 35%  

Sell Price = Cost × (1 + margin)

---

## Output

### Cost Breakdown
| Category | Cost |

TOTAL COST

### Sell Price
| Metric | Value |

---

## Rules
- No guessing pricing
- Use CSV data
- No double counting
- Clean structured output

---

## Goal
Accurate operator-level pricing + sell-ready output.
