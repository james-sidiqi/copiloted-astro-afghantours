# Architecture.md

## Purpose

This document defines the required architecture and runtime constraints for the AfghanTours website.

The site must be deployable as a **fully static website** and must not require a Node.js server or backend runtime for normal operation.

---

## CORE RULE

The website MUST:

- Build into static HTML, CSS, and JavaScript
- Be deployable to standard cPanel hosting
- Run without any server-side JavaScript at runtime

---

## 1. STATIC OUTPUT REQUIREMENT

The site must:

- Use Astro static output mode
- Generate all pages at build time
- Produce a `/dist` folder containing:
  - HTML files
  - CSS assets
  - JS assets
  - images

### Prohibited

- No runtime SSR (server-side rendering)
- No dependency on Node server after build
- No dynamic server routes required for core features

---

## 2. NO REQUIRED API DEPENDENCY

Core site functionality must NOT depend on:

- POST API endpoints
- server-side logic
- backend services

This includes:

- tour pages
- attraction pages
- destinations
- pricing display
- itinerary generation (must work client-side where possible)

---

## 3. ITINERARY BUILDER RULE

The itinerary builder must:

- run in the browser (client-side)
- use prebuilt JSON data derived from CSVs
- not require a server API for standard functionality

### Allowed

- client-side route generation
- client-side pricing estimates
- client-side filtering and logic

### Fallback

If a route is too complex:

- display "Custom Quote Required"
- do NOT attempt server calculation

---

## 4. DATA HANDLING

All CSV data must be:

- converted to JSON at build time
- stored in static assets or imported via Astro

The browser may:

- read JSON
- process data
- generate UI dynamically

---

## 5. OPTIONAL EXTERNAL SERVICES

External services may be used ONLY for:

- form submissions
- CRM integration
- booking workflows
- payment processing

These must be:

- optional
- non-blocking
- not required for core browsing or itinerary generation

---

## 6. DEPLOYMENT TARGET

Primary deployment target:

- cPanel static hosting

The site must work when:

- uploaded via FTP
- served as static files
- opened without any backend

---

## 7. PERFORMANCE & OFFLINE FRIENDLINESS

The site should:

- load quickly with minimal JS
- degrade gracefully without JS where possible
- allow partial offline testing of pages

---

## 8. ENFORCEMENT RULES FOR COPILOT

Copilot must:

- avoid introducing server-only features
- avoid Node runtime dependencies
- avoid Astro SSR adapters unless explicitly approved
- prefer static generation and client-side logic

If unsure:

→ default to static implementation

---

## FINAL PRINCIPLE

The AfghanTours site is a **static-first platform with dynamic client-side enhancements**, not a server-dependent application.

---

End of Architecture Rules
