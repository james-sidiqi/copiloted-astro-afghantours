# AfghanTours — Components Instructions (Strict Enforcement)

## Purpose
This file defines component architecture rules.

Copilot must prefer reusable components and section modules over repeated custom markup.

---

## Component Rules
Use reusable components for repeated patterns such as:
- hero sections
- quick facts bars
- itinerary day cards / accordions
- route snapshot blocks
- attraction drawers
- hotel tier blocks
- add-on cards
- FAQ accordions
- hub profile sections

Do not copy-paste the same section structure into multiple pages unless explicitly instructed.

---

## Separation of Concerns
Keep these separated:
- page layout
- data loading
- interaction logic
- map behavior
- styling

Do not combine unrelated responsibilities into one file.

---

## Interaction Rules
Interactive components must fail gracefully.

If the interactive layer breaks, core content should still render in a usable static format.

This especially applies to:
- map interactions
- attraction drawers
- itinerary selection states

---

## Styling Rules
Components should:
- be visually consistent
- remain modular
- be easy to revise independently

Avoid component-specific one-off styles that cannot be reused.

---

## Rendering Rules
Tour and attraction content should not be embedded directly into component files when it is data-driven.
