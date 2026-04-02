# AfghanTours — Master Copilot Instructions

## Purpose
This repository powers AfghanTours.com, a premium expedition-style tourism website for Afghanistan.

The site must balance:
- premium presentation
- operational realism
- trust and safety signaling
- CSV-driven maintainability

## Core Principles
- Do not hardcode tourism data when it exists in CSV files.
- Use the existing data architecture as the source of truth.
- Preserve the hub-based operating model.
- Keep the design premium, clear, and modular.
- Do not remove or rewrite major sections unless explicitly instructed.
- Prefer additive, section-specific improvements over sweeping rewrites.

## Default Site Positioning
AfghanTours should feel like:
- a premium expedition operator
- a serious logistics-aware company
- a culturally informed local expert
- a trustworthy and operationally competent planner

## Design Priorities
1. Trust
2. Clarity
3. Route realism
4. Premium visual presentation
5. Strong conversion flow

## Tier System
Use:
- Level 1 = Budget
- Level 2 = Standard
- Level 3 = Premium
- Level 4 = Luxury

Default public-facing pricing and presentation should assume:
- Standard unless otherwise specified

## Operational Model
Primary hubs:
- KBLC
- BMYC
- MAZC
- HERC
- KDRC
- JBDC
- FAIC
- GHZC

Do not invent new operational hubs unless instructed.

## Data Rules
Always respect:
- locations.csv
- attractions_master.csv
- attraction_time_profile.csv
- hub_to_attraction_access.csv
- route_matrix.csv
- hotel_properties.csv
- hotel_rooms.csv
- tours.csv
- tour_itinerary.csv
- tour_attractions_map.csv
- pricing_reference.csv

Never invent:
- attractions
- routes
- hotels
- costs

## Engineering Rules
- Prefer reusable Astro components.
- Keep page sections modular.
- Keep styling maintainable.
- Do not embed large content blocks directly in components if they belong in data files.
- Do not break current route structure.
- Preserve static-site compatibility.

## Content Rules
- Avoid generic travel fluff.
- Use concise, premium, operationally credible language.
- Emphasize route logic, overnights, terrain, and experience.
- Do not overpromise safety, comfort, or access.
