# BUILD.md — AfghanTours Static Build Guide

This document describes how to build and package the AfghanTours website
for static hosting (cPanel, shared hosting, or local preview on iPad).

---

## Prerequisites

- GitHub Codespaces (or any Linux environment with Node.js 20+)
- The repository cloned and open

---

## Workflow

### 1. Install dependencies

```bash
npm install
```

This installs all required packages. No server runtime is required.

### 2. Build the static site

```bash
npm run build
```

Astro compiles the full site into `dist/`.
The build reads all CSV data files at compile time and outputs
**217 pre-rendered HTML pages** with zero server-side dependencies.

Output:
```
dist/
├── index.html
├── tours/
├── attractions/
├── plan/          ← interactive itinerary builder (fully client-side)
├── regions/
├── provinces/
├── _astro/        ← CSS + JS bundles
└── assets/
```

No `dist/server/` directory is created — the output is pure static files.

### 3. Create the downloadable zip

```bash
npm run build:zip
```

Creates `dist.zip` in the project root containing the entire `dist/` folder.

### 4. Download to iPad

In GitHub Codespaces:

1. Open the Explorer panel (left sidebar).
2. Right-click `dist.zip`.
3. Select **Download**.
4. The file downloads to your iPad's Files app (via Safari or the browser).

---

## Local preview on iPad

After extracting `dist.zip`, the files can be previewed with any local
static server. The site has **no server-side requirements** — every page
is a plain HTML file.

If you have a static server app available (e.g. Liveserver, Servez,
or similar), open the extracted `dist/` folder and point the server at it.

---

## cPanel upload

1. Log into cPanel → **File Manager**.
2. Navigate to `public_html/` (or your target subdirectory).
3. Upload `dist.zip`.
4. Extract it in place.
5. If the site is at the domain root, move the contents of
   `dist/` up into `public_html/`.

No `.htaccess` changes are required for standard static hosting.
Astro generates clean URLs with `index.html` files in subdirectories.

---

## Summary of scripts

| Script | Command | Description |
|--------|---------|-------------|
| Install | `npm install` | Install all dependencies |
| Build | `npm run build` | Compile static site into `dist/` |
| Zip | `npm run build:zip` | Package `dist/` as `dist.zip` |
| Dev server | `npm run dev` | Local development with hot reload |
| Preview | `npm run preview` | Preview the built `dist/` locally |

---

## Architecture notes

- **Output mode**: `static` — no Node.js server is required after build.
- **Itinerary builder** (`/plan`): runs entirely in the browser.
  All CSV data is embedded into the page at build time.
  If a route or pricing cannot be resolved, the page shows
  **"Custom Quote Required"** rather than failing.
- **No API routes**: the server-side `/api/itinerary` endpoint has been
  removed. All functionality is client-side or build-time.
- **Contact identity**: WhatsApp and email are sourced from
  `src/lib/config.ts` — a single shared config file.
