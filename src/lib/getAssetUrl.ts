/**
 * Asset resolver: prefer new public/ slug-folder layout when files exist,
 * otherwise fall back to existing coded/CSV paths. Does not invent stock images.
 * Does not delete anything.
 *
 * Layout preference (existence-checked):
 *   public/assets/images/{attractions,provinces|province,hubs,cultural-experiences,
 *     food,custom-tours,return-journeys,page-assets,tours}/<slug>/{hero,thumb,gallery}
 *   (featured-tours optional/legacy if present — not a required source)
 *   public/images/hotels/<city>/<property>/  (CSV often still uses /assets/images/hotels/)
 *   public/assets/maps/{provinces,regions,routes}/
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { cleanText, normalizeAssetPath } from "./data/normalize.js";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

const dirCache = new Map<string, string[]>();
const existsCache = new Map<string, boolean>();
const fileListCache = new Map<string, string[]>();

/** Absolute filesystem check for a site URL path like `/assets/images/...`. */
export function publicUrlExists(urlPath: string | null | undefined): boolean {
  const cleaned = normalizeAssetPath(urlPath);
  if (!cleaned || !cleaned.startsWith("/")) return false;
  const hit = existsCache.get(cleaned);
  if (hit !== undefined) return hit;
  const abs = path.join(PUBLIC_ROOT, cleaned.slice(1));
  let ok = false;
  try {
    ok = fs.existsSync(abs) && fs.statSync(abs).isFile();
  } catch {
    ok = false;
  }
  existsCache.set(cleaned, ok);
  return ok;
}

/** Return the first candidate URL that exists under public/, else "". */

/**
 * Canonical experience asset trees (do not invent assets):
 *   /assets/images/experiences/cultural/<slug>/{hero,thumb}.webp + gallery/
 *   /assets/images/experiences/culinary/<slug>/{hero,thumb}.webp + gallery/
 *   /assets/images/experiences/activities/<...>/
 * Legacy mirrors under /assets/images/cultural-experiences/ may still exist; prefer experiences/*.
 */
export function firstExisting(...candidates: Array<string | null | undefined>): string {
  for (const c of candidates) {
    const n = normalizeAssetPath(c);
    if (n && publicUrlExists(n)) return preferWebpSibling(n);
  }
  return "";
}

/**
 * Prefer a same-path .webp sibling when it exists so rendered pages emit WebP.
 * Does not invent assets; leaves originals on disk.
 * Favicons, Leaflet vendor PNGs, and remote URLs are left unchanged by callers.
 */
export function preferWebpSibling(urlPath: string | null | undefined): string {
  const n = normalizeAssetPath(urlPath);
  if (!n) return "";
  if (/^https?:\/\//i.test(n)) return n;
  if (/\/vendor\//i.test(n) || n.startsWith("/favicon/")) return n;
  if (/\.webp$/i.test(n)) return n;
  if (/\.(jpe?g|png)$/i.test(n)) {
    const webp = n.replace(/\.(jpe?g|png)$/i, ".webp");
    if (publicUrlExists(webp)) return webp;
  }
  return n;
}

function listChildDirs(relFromPublic: string): string[] {
  const key = relFromPublic.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const cached = dirCache.get(key);
  if (cached) return cached;
  const abs = path.join(PUBLIC_ROOT, key);
  let names: string[] = [];
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      names = fs
        .readdirSync(abs, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    }
  } catch {
    names = [];
  }
  dirCache.set(key, names);
  return names;
}

function listFiles(relFromPublic: string): string[] {
  const key = relFromPublic.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const cached = fileListCache.get(key);
  if (cached) return cached;
  const abs = path.join(PUBLIC_ROOT, key);
  let names: string[] = [];
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      names = fs
        .readdirSync(abs, { withFileTypes: true })
        .filter((d) => d.isFile())
        .map((d) => d.name);
    }
  } catch {
    names = [];
  }
  fileListCache.set(key, names);
  return names;
}

function slugVariants(slug: string): string[] {
  const s = cleanText(slug).toLowerCase();
  if (!s) return [];
  const out = new Set<string>([s]);
  out.add(s.replace(/-and-/g, "-"));
  out.add(s.replace(/-/g, "-").replace(/-lakes$/, "-and-lakes"));
  if (s.startsWith("the-")) out.add(s.slice(4));
  if (s.startsWith("mt-")) out.add("mount-" + s.slice(3));
  if (s.startsWith("mount-")) out.add("mt-" + s.slice(6));
  if (s.endsWith("-lakes") && !s.includes("-and-lakes")) {
    out.add(s.replace(/-lakes$/, "-and-lakes"));
  }
  if (s.includes("-and-lakes")) out.add(s.replace("-and-lakes", "-lakes"));
  if (s.endsWith("-city")) out.add(s.slice(0, -5));
  else out.add(s + "-city");
  for (const suf of [
    "-unesco",
    "-hazarajat",
    "-farah-river",
    "-villages",
    "-bagh-e-babur",
    "-site",
    "-trek",
    "-and-tunnel",
    "-samangan",
    "-reservoir",
    "-lake-reservoir",
    "-tani-district-scenery",
    "-nomadic-meadows",
    "-dumplings",
    "-flatbread",
    "-pastry",
    "-pudding",
    "-yogurt-drink",
    "-drink",
    "-sweet",
    "-cookie",
    "-bread",
    "-soup",
  ]) {
    if (s.endsWith(suf)) out.add(s.slice(0, -suf.length));
  }
  // minaret-e-jam -> minaret-of-jam
  if (s.includes("-e-")) out.add(s.replace(/-e-/g, "-of-"));
  if (s.includes("-of-")) out.add(s.replace(/-of-/g, "-e-"));
  return Array.from(out).filter(Boolean);
}

/** Match a CSV slug to a directory name under a public-relative base. */
export function matchSlugDir(
  relBase: string,
  slug: string,
  extraAliases: string[] = [],
): string | null {
  const dirs = listChildDirs(relBase);
  if (!dirs.length) return null;
  const dirSet = new Set(dirs);
  const variants = [...slugVariants(slug), ...extraAliases.map((a) => a.toLowerCase())];
  for (const v of variants) {
    if (dirSet.has(v)) return v;
  }
  const s = cleanText(slug).toLowerCase();
  let best: string | null = null;
  for (const d of dirs) {
    if (s === d) return d;
    if (s.includes(d) || d.includes(s)) {
      if (!best || d.length > best.length) best = d;
    }
  }
  const compact = s.replace(/-and-|-of-|-the-/g, "-");
  for (const d of dirs) {
    const dc = d.replace(/-and-|-of-|-the-/g, "-");
    if (compact === dc || compact.includes(dc) || dc.includes(compact)) {
      if (!best || d.length > best.length) best = d;
    }
  }
  return best;
}

/** Prefer canonical hero/thumb; also accept malformed/alternate filenames present on disk. */
function pickInDir(dirUrl: string, prefer: "hero" | "thumb" | "any" = "any"): string {
  const base = dirUrl.replace(/\/$/, "");
  const rel = base.replace(/^\//, "");
  const files = listFiles(rel);

  const heroCanon = [`${base}/hero.webp`, `${base}/hero.jpg`, `${base}/hero.jpeg`, `${base}/hero.png`];
  const thumbCanon = [`${base}/thumb.webp`, `${base}/thumb.jpg`, `${base}/thumb.jpeg`, `${base}/thumb.png`];

  // Malformed / alternate names seen in inventory (hero.webp.webp, hero.web.jpeg, hero..webp, etc.)
  const heroAlts = files
    .filter((f) => /^(hero|cover|overview)(\.|$)/i.test(f) || /^hero\.\.?webp/i.test(f) || /^hero\.web\./i.test(f))
    .map((f) => `${base}/${f}`);
  const thumbAlts = files
    .filter((f) => /^(thumb|card)(\.|$)/i.test(f) || /^thumb\./i.test(f))
    .map((f) => `${base}/${f}`);
  const overview = files.filter((f) => /^overview\./i.test(f)).map((f) => `${base}/${f}`);
  const gallerySub = firstExisting(
    `${base}/gallery/01.webp`,
    `${base}/gallery/1.webp`,
    `${base}/gallery/hero.webp`,
    `${base}/gallery/01.jpg`,
  );
  // Flat gallery files at vehicle/property folder root (e.g. transport/.../gallery-2.webp)
  const flatGalleryFiles = files
    .filter((f) => /^gallery[-_]?\d*\.(webp|jpe?g|png)(\.(webp|jpe?g|png))?$/i.test(f))
    .sort((a, b) => {
      // Prefer clean .webp over double-extension (.webp.webp)
      const score = (name: string) => (name.toLowerCase().endsWith(".webp.webp") ? 1 : 0);
      const sa = score(a) - score(b);
      if (sa !== 0) return sa;
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .map((f) => `${base}/${f}`);
  const galleryFirst = gallerySub || firstExisting(...flatGalleryFiles);

  if (prefer === "hero") {
    return (
      firstExisting(...heroCanon, ...heroAlts, ...thumbCanon, ...thumbAlts, ...overview, galleryFirst) || ""
    );
  }
  if (prefer === "thumb") {
    return (
      firstExisting(...thumbCanon, ...thumbAlts, ...heroCanon, ...heroAlts, ...overview, galleryFirst) || ""
    );
  }
  return firstExisting(...heroCanon, ...thumbCanon, ...heroAlts, ...thumbAlts, ...overview, galleryFirst) || "";
}

/** List existence-checked gallery URLs for a transport vehicle folder (flat + gallery/). */
export function listTransportGallery(tier: string, vehicleType: string): string[] {
  const hero = resolveTransportAsset(tier, vehicleType, "hero");
  // Recover folder from hero path when possible
  const t = cleanText(tier).toLowerCase();
  const v = cleanText(vehicleType).toLowerCase().replace(/_/g, "-");
  const tierFolder =
    t === "armored" || t === "luxury"
      ? "luxury"
      : t === "premium"
        ? "premium"
        : t === "budget"
          ? "budget"
          : t === "standard"
            ? "standard"
            : t || "standard";
  const vehicleCandidates: string[] = [];
  if (v) vehicleCandidates.push(v);
  if (v.includes("suv")) vehicleCandidates.push("suv", "suv-4x4");
  const seenV = new Set<string>();
  const vehicles = vehicleCandidates.filter((x) => {
    if (!x || seenV.has(x)) return false;
    seenV.add(x);
    return true;
  });
  let base = "";
  for (const vehicle of vehicles) {
    const matched = matchSlugDir(`assets/images/transport/${tierFolder}`, vehicle);
    const folder = matched || vehicle;
    const rel = `assets/images/transport/${tierFolder}/${folder}`;
    if (listFiles(rel).length) {
      base = `/assets/images/transport/${tierFolder}/${folder}`;
      break;
    }
  }
  if (!base) return hero ? [hero] : [];
  const files = listFiles(base.replace(/^\//, ""));
  const urls: string[] = [];
  const push = (u: string) => {
    const p = preferWebpSibling(u);
    if (p && publicUrlExists(p) && !urls.includes(p)) urls.push(p);
  };
  if (hero) push(hero);
  for (const f of files
    .filter((name) => /^gallery[-_]?\d*\.(webp|jpe?g|png)(\.(webp|jpe?g|png))?$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    // Skip double-extension duplicates when clean sibling exists
    if (/\.webp\.webp$/i.test(f)) {
      const clean = f.replace(/\.webp\.webp$/i, ".webp");
      if (files.includes(clean)) continue;
    }
    if (/\.web\.webp$/i.test(f)) {
      const clean = f.replace(/\.web\.webp$/i, ".webp");
      if (files.includes(clean) || files.includes(f.replace(".web.webp", ".webp"))) continue;
    }
    push(`${base}/${f}`);
  }
  const subGallery = listFiles(`${base.replace(/^\//, "")}/gallery`);
  for (const f of subGallery.filter((name) => /\.(webp|jpe?g|png)$/i.test(name)).sort()) {
    push(`${base}/gallery/${f}`);
  }
  return urls;
}

/** Food CSV slug -> folder name aliases (folder names from Phase 1 sync). */
const FOOD_ALIASES: Record<string, string[]> = {
  "kabuli-pulao": ["kabuli-palaw"],
  "ghazni-qabili-pulao": ["kabuli-palaw", "chicken-kabuli"],
  "kandahar-rosht": ["kandahari-rosh"],
  "qaroot-khurti": ["yoghurt"],
  "korma-e-herati": ["chiken-korma", "qorma-e-gosht"],
  "aushak-dumplings": ["aushak"],
  "mantu-dumplings": ["mantu"],
  "chapli-kebab": ["chapli-kabob"],
  "herati-kebab": ["herat-kabob"],
  "afghan-naan": ["naan"],
  "bolani-flatbread": ["bolani"],
  "sambosa-pastry": ["samosa"],
  "sheer-e-yakh": ["sheer-yakh"],
  "sheer-pira": ["sheer-pira"],
  "gosh-e-fil": ["gosh-e-fil"],
  "firni-pudding": ["firni"],
  "afghan-halwa": ["halwa"],
  "afghan-green-tea": ["green-tea"],
  "saffron-tea": ["saffron-tea"],
  "kandahar-milk-tea": ["sheer-chai"],
  "bamyan-potatoes": ["potatoes"],
  "wardak-red-apples": ["apples"],
  "kandahar-pomegranate": ["pomegranate"],
  "herat-saffron": ["saffron"],
  "balkh-melon": ["honeydew-mellon", "sugar-mellon"],
  "kunduz-melon": ["honeydew-mellon", "sugar-mellon"],
  "panjshir-walnuts": ["walnuts"],
  "farah-watermelon": ["watermellons"],
  "ghor-grapes": ["raisins"],
  "jowzjan-gorgak": ["sugar-mellon", "honeydew-mellon"],
  "kabul-kebab": ["kabul-kabob", "kabob"],
  "chicken-qabili": ["chicken-kabuli"],
  "herati-pilaf": ["kabuli-palaw"],
  "kandahar-kebab": ["kabob", "kandahari-rosh"],
  "ash-soup": ["aush"],
  "shorwa-soup": ["aush"],
  "doogh-yogurt-drink": ["dogh"],
  "lassi-drink": ["dogh"],
  "herat-ice-cream": ["saffron-ice-cream", "sheer-yakh"],
  "afghan-dried-fruits": ["raisins", "almonds", "pistachios"],
  "samangan-pistachios": ["pistachios"],
  "herat-raisins": ["raisins"],
  "balkh-almonds": ["almonds"],
  "sheermal-bread": ["naan"],
  "kulcha-cookie": ["halwa"],
  "jalebi-sweet": ["jelabi"],
  "herat-baklava": ["halwa", "gosh-e-fil"],
  "kandahar-sweets": ["sheer-pira", "halwa"],
  "sheer-khurma": ["sheer-khurma"],
  "sheer-barinj": ["sheer-barinj"],
};

/** CSV attraction slug -> folder slug when fuzzy match alone is insufficient. */
const ATTRACTION_ALIASES: Record<string, string[]> = {
  "badakhshan-mountains-lakes": ["badakhshan-mountains-and-lakes"],
  "the-wakhan-corridor": ["wakhan-corridor"],
  "mt-noshaq": ["mount-noshaq"],
  "noh-gombad-nine-domes": ["haji-piyada-nine-domes"],
  "daykundi-highlands-hazarajat": ["daykundi-highlands"],
  "farah-citadel-farah-river": ["farah-citadel"],
  "minaret-e-jam-unesco": ["minaret-of-jam"],
  "rural-ghor-highlands-villages": ["rural-ghor-highlands"],
  "qala-e-bost": ["qala-e-bost-arch"],
  "baburs-gardens-bagh-e-babur": ["baburs-gardens"],
  "tape-nader-khan": ["tomb-of-nader-khan"],
  "khost-city-tani-district-scenery": ["khost-city-scenery"],
  "darunta-lake-reservoir": ["darunta-dam"],
  "gandamak-last-stand": ["gandamak-last-stand-site"],
  "paktika-highlands-villages": ["paktika-highlands"],
  "massoud-mausoleum": ["ahmad-shah-massoud-mausoleum"],
  "paryan-valley-trek": ["paryan-valley"],
  "salang-pass-and-tunnel": ["salang-pass"],
  "takht-e-rostam-samangan": ["takht-e-rostam"],
  "sar-e-pol-nomadic-meadows": ["sar-e-pol-meadows"],
  "wardak-highlands-villages": ["wardak-highlands"],
  "khurd-kabul-pass-1842": ["khurd-kabul-pass-1842"],
};

const FOOD_CATEGORIES = ["dishes", "sweets", "drinks", "produce", "dried-fruit", "setting_table"] as const;

export type AssetKind = "hero" | "thumb" | "image" | "map" | "any";
export type AssetEntity =
  | "attraction"
  | "province"
  | "hotel"
  | "dish"
  | "tour"
  | "hub"
  | "map"
  | "cultural"
  | "generic";

/**
 * Core resolver: given an existing/coded path, optionally rewrite known prefixes
 * and prefer new layout siblings when present.
 */
export function getAssetUrl(
  codedPath: string | null | undefined,
  options?: {
    slug?: string;
    kind?: AssetKind;
    entity?: AssetEntity;
  },
): string {
  const entity = options?.entity ?? "generic";
  const kind = options?.kind ?? "any";
  const slug = options?.slug ?? "";
  const coded = normalizeAssetPath(codedPath);

  let resolved = "";
  if (entity === "attraction" && slug) {
    resolved = resolveAttractionAsset(slug, coded, kind);
  } else if (entity === "province" && slug) {
    resolved = resolveProvinceAsset(slug, coded, kind);
  } else if (entity === "hotel") {
    resolved = resolveHotelAsset(coded, kind, slug);
  } else if (entity === "dish" && slug) {
    resolved = resolveDishAsset(slug, coded, kind);
  } else if (entity === "tour" && slug) {
    resolved = resolveTourAsset(slug, coded, kind);
  } else if (entity === "hub" && slug) {
    resolved = resolveHubAsset(slug, coded, kind);
  } else if (entity === "cultural" && slug) {
    const k = kind === "thumb" ? "thumb" : "hero";
    resolved =
      resolveExperienceSlugAsset("culinary", slug, k) ||
      resolveExperienceSlugAsset("cultural", slug, k) ||
      resolveCategorySlugAsset("cultural-experiences", slug, k) ||
      firstExisting(coded) ||
      coded;
  } else if (entity === "map" || kind === "map") {
    // Keep SVG/map assets as-is (not forced to webp)
    return resolveMapAsset(coded, slug);
  } else {
    const remapped = remapKnownPrefixes(coded);
    resolved = firstExisting(remapped, coded) || remapped || coded;
  }
  return preferWebpSibling(resolved) || resolved;
}

function remapKnownPrefixes(urlPath: string): string {
  if (!urlPath) return "";
  // Hotels live under public/images/hotels (Phase 1), not public/assets/images/hotels
  if (urlPath.startsWith("/assets/images/hotels/")) {
    return urlPath.replace("/assets/images/hotels/", "/images/hotels/");
  }
  // JSON dump uses provinces/ (plural); public layout uses province/ (singular)
  if (urlPath.startsWith("/assets/images/provinces/")) {
    return urlPath.replace("/assets/images/provinces/", "/assets/images/province/");
  }
  // Maps synced to public/assets/maps/
  if (urlPath.startsWith("/assets/images/maps/")) {
    return urlPath.replace("/assets/images/maps/", "/assets/maps/");
  }
  return urlPath;
}

export function resolveAttractionAsset(
  slug: string,
  codedPath: string,
  kind: AssetKind = "any",
): string {
  const aliases = ATTRACTION_ALIASES[slug] ?? [];
  const matched = matchSlugDir("assets/images/attractions", slug, aliases);
  if (matched) {
    const dir = `/assets/images/attractions/${matched}`;
    const prefer: "hero" | "thumb" | "any" =
      kind === "thumb" ? "thumb" : kind === "hero" || kind === "image" ? "hero" : "any";
    const fromDir = pickInDir(dir, prefer);
    if (fromDir) return fromDir;
  }
  // Prefer JSON-style path if coded already points at slug folder
  const remapped = remapKnownPrefixes(codedPath);
  return firstExisting(remapped, codedPath) || remapped || codedPath;
}

export function resolveProvinceAsset(
  slug: string,
  codedPath: string,
  kind: AssetKind = "any",
): string {
  if (kind === "map") {
    return resolveMapAsset(codedPath, slug);
  }
  const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
  // Prefer slug folders under province/ (public) or provinces/ (dump naming)
  for (const base of ["assets/images/province", "assets/images/provinces"]) {
    const matched = matchSlugDir(base, slug);
    if (matched) {
      const fromDir = pickInDir(`/${base}/${matched}`, prefer);
      if (fromDir) return fromDir;
    }
  }
  const remapped = remapKnownPrefixes(codedPath);
  const flat = firstExisting(
    remapped,
    codedPath,
    `/assets/images/province/${slug}.webp`,
    `/assets/images/provinces/${slug}/hero.webp`,
    `/assets/images/provinces/${slug}.webp`,
  );
  return flat || remapped || codedPath;
}

export function resolveHotelAsset(
  codedPath: string,
  kind: AssetKind = "any",
  slug: string = "",
): string {
  const remapped = remapKnownPrefixes(codedPath);
  const propPath = remapped || codedPath;

  // Specific gallery/property files: keep the remapped filename when it exists
  if (kind === "image") {
    const hit = firstExisting(remapped, codedPath);
    if (hit) return hit;
    // Fall through to folder hero/thumb when named property file is missing
  }

  // Primary card/hero: prefer hero.webp / thumb.webp in the property folder
  if (propPath && propPath.includes("/hotels/")) {
    const dir = propPath.replace(/\/[^/]+$/, "");
    const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
    const fromDir = pickInDir(dir, prefer);
    if (fromDir) return fromDir;
    // Also try the original coded dir before remap (in case assets/images/hotels exists later)
    if (codedPath && codedPath.includes("/hotels/") && codedPath !== propPath) {
      const codedDir = codedPath.replace(/\/[^/]+$/, "");
      const fromCoded = pickInDir(codedDir, prefer);
      if (fromCoded) return fromCoded;
    }
  }

  // Optional slug-based search under images/hotels/*/*/
  if (slug) {
    const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
    for (const city of listChildDirs("images/hotels")) {
      const matched = matchSlugDir(`images/hotels/${city}`, slug);
      if (matched) {
        const fromDir = pickInDir(`/images/hotels/${city}/${matched}`, prefer);
        if (fromDir) return fromDir;
      }
    }
  }

  return firstExisting(remapped, codedPath) || remapped || codedPath;
}

export function resolveDishAsset(
  slug: string,
  codedPath: string,
  kind: AssetKind = "any",
): string {
  const aliases = FOOD_ALIASES[slug] ?? [];
  const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
  for (const cat of FOOD_CATEGORIES) {
    const matched = matchSlugDir(`assets/images/food/${cat}`, slug, aliases);
    if (matched) {
      const fromDir = pickInDir(`/assets/images/food/${cat}/${matched}`, prefer);
      if (fromDir) return fromDir;
    }
  }
  for (const alias of aliases) {
    for (const cat of FOOD_CATEGORIES) {
      const fromDir = pickInDir(`/assets/images/food/${cat}/${alias}`, prefer);
      if (fromDir) return fromDir;
    }
  }
  return firstExisting(codedPath) || codedPath;
}

export function resolveTourAsset(
  slug: string,
  codedPath: string,
  kind: AssetKind = "any",
): string {
  const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
  // Prefer upgraded custom-tours / return-journeys folders; flat tours/*.webp are fallbacks.
  // featured-tours is optional/legacy if present — not required.
  const bases = [
    "assets/images/custom-tours",
    "assets/images/return-journeys",
    "assets/images/page-assets",
    "assets/images/tours",
    "assets/images/featured-tours",
  ];
  for (const base of bases) {
    const matched = matchSlugDir(base, slug);
    if (matched) {
      const fromDir = pickInDir(`/${base}/${matched}`, prefer);
      if (fromDir) return fromDir;
    }
  }
  // Flat tour cards under /assets/images/tours/<slug>.webp
  const flat = firstExisting(
    `/assets/images/tours/${slug}.webp`,
    `/assets/images/tours/${slug}.jpg`,
    codedPath,
  );
  return flat || codedPath;
}

export function resolveHubAsset(
  slug: string,
  codedPath: string = "",
  kind: AssetKind = "any",
): string {
  const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
  const extra = [
    slug.replace(/-city$/, ""),
    slug.endsWith("-city") ? slug : `${slug}-city`,
    slug === "jalalabad-city" ? "jalalabad" : "",
    slug === "mazar" ? "mazar-e-sharif" : "",
    slug === "mazar-city" ? "mazar-e-sharif" : "",
  ].filter(Boolean);
  const matched = matchSlugDir("assets/images/hubs", slug, extra);
  if (matched) {
    const fromDir = pickInDir(`/assets/images/hubs/${matched}`, prefer);
    if (fromDir) return fromDir;
  }
  return firstExisting(codedPath) || codedPath;
}

export function resolveMapAsset(codedPath: string, slug: string = ""): string {
  const remapped = remapKnownPrefixes(codedPath);
  const candidates: string[] = [];
  if (slug) {
    candidates.push(`/assets/maps/provinces/${slug}-map.webp`);
    candidates.push(`/assets/maps/regions/${slug}-afghanistan-region-map.webp`);
    candidates.push(`/assets/maps/regions/${slug}-region-map.webp`);
    candidates.push(`/assets/maps/provinces/${slug}.webp`);
  }
  if (remapped) {
    candidates.push(remapped);
    if (remapped.endsWith(".svg")) {
      candidates.push(remapped.replace(/\.svg$/, "-map.webp"));
      candidates.push(remapped.replace(/\.svg$/, ".webp"));
      const m = remapped.match(/\/([^/]+)\.svg$/);
      if (m) {
        candidates.push(remapped.replace(/\/[^/]+\.svg$/, `/${m[1]}-map.webp`));
        // /assets/maps/provinces/bamyan.svg -> /assets/maps/provinces/bamyan-map.webp
        candidates.push(`/assets/maps/provinces/${m[1]}-map.webp`);
      }
    }
  }
  if (codedPath) candidates.push(codedPath);
  return firstExisting(...candidates) || remapped || codedPath;
}

/** Canonical experiences tree: culinary | cultural under public/assets/images/experiences/. */
export function resolveExperienceSlugAsset(
  kindFolder: "culinary" | "cultural",
  slug: string,
  kind: "hero" | "thumb" = "hero",
): string {
  const matched = matchSlugDir(`assets/images/experiences/${kindFolder}`, slug);
  if (!matched) return "";
  return pickInDir(`/assets/images/experiences/${kindFolder}/${matched}`, kind);
}

/** Activity under experiences/activities/<path> with legacy activities/ fallback. */
export function resolveActivityExperienceAsset(
  relParts: string[],
  kind: "hero" | "thumb" = "hero",
): string {
  // Canonical spelling is "religious" (and shopping is top-level activities/shopping only).
  // Never treat "religous" as a canonical experiences path — typo folder is legacy fallback only.
  const parts = relParts.map((p) => (p === "religous" ? "religious" : p));
  const canon = `/assets/images/experiences/activities/${parts.join("/")}`;
  const legacy = `/assets/images/activities/${parts.join("/")}`;
  const legacyTypo =
    parts.includes("religious")
      ? `/assets/images/activities/${parts.map((p) => (p === "religious" ? "religous" : p)).join("/")}`
      : "";
  return (
    firstExisting(
      `${canon}/${kind}.webp`,
      `${canon}/01.webp`,
      `${legacy}/${kind}.webp`,
      `${legacy}/01.webp`,
      legacyTypo ? `${legacyTypo}/${kind}.webp` : "",
      legacyTypo ? `${legacyTypo}/01.webp` : "",
    ) ||
    pickInDir(canon, kind) ||
    pickInDir(legacy, kind) ||
    (legacyTypo ? pickInDir(legacyTypo, kind) : "")
  );
}

/** Convenience: cultural-experiences / activities / tours by slug folder. */
export function resolveCategorySlugAsset(
  category: "cultural-experiences" | "activities" | "custom-tours" | "return-journeys" | "featured-tours",
  slug: string,
  kind: "hero" | "thumb" = "hero",
): string {
  const matched = matchSlugDir(`assets/images/${category}`, slug);
  if (!matched) return "";
  return pickInDir(`/assets/images/${category}/${matched}`, kind);
}

/** Cultural / activities folder hero|thumb (existence-checked). */
export function pickExperienceImage(
  category: "cultural-experiences" | "activities",
  slug: string,
): string {
  if (category === "cultural-experiences") {
    return (
      resolveExperienceSlugAsset("culinary", slug, "hero") ||
      resolveExperienceSlugAsset("cultural", slug, "hero") ||
      resolveCategorySlugAsset(category, slug, "hero") ||
      resolveExperienceSlugAsset("culinary", slug, "thumb") ||
      resolveExperienceSlugAsset("cultural", slug, "thumb") ||
      resolveCategorySlugAsset(category, slug, "thumb")
    );
  }
  return (
    resolveActivityExperienceAsset([slug], "hero") ||
    resolveCategorySlugAsset(category, slug, "hero") ||
    resolveActivityExperienceAsset([slug], "thumb") ||
    resolveCategorySlugAsset(category, slug, "thumb")
  );
}

/**
 * Map ground-transport tier + vehicle to public/assets/images/transport/<tier>/<vehicle>/.
 * Existence-checked; does not invent assets.
 */
export function resolveTransportAsset(
  tier: string,
  vehicleType: string,
  kind: "hero" | "thumb" = "thumb",
): string {
  const t = cleanText(tier).toLowerCase();
  const v = cleanText(vehicleType).toLowerCase().replace(/_/g, "-");
  const tierFolder =
    t === "armored" || t === "luxury"
      ? "luxury"
      : t === "premium"
        ? "premium"
        : t === "budget"
          ? "budget"
          : t === "standard"
            ? "standard"
            : t || "standard";

  const vehicleCandidates: string[] = [];
  if (v) vehicleCandidates.push(v);
  if (v.includes("armored")) vehicleCandidates.push("armored-suv", "suv");
  if (v.includes("suv")) vehicleCandidates.push("suv", "suv_4x4".replace("_", "-"));
  if (v.includes("van")) vehicleCandidates.push("van", "van-old", "van_new".replace("_", "-"));
  if (v.includes("taxi")) vehicleCandidates.push("taxi");
  if (v.includes("bus")) vehicleCandidates.push("bus");
  if (v.includes("coach")) vehicleCandidates.push("coach", "bus");
  if (v.includes("coaster")) vehicleCandidates.push("bus", "coaster");
  if (v.includes("sedan")) vehicleCandidates.push("sedan");
  // unique preserve order
  const seen = new Set<string>();
  const vehicles = vehicleCandidates.filter((x) => {
    if (!x || seen.has(x)) return false;
    seen.add(x);
    return true;
  });

  for (const vehicle of vehicles.length ? vehicles : ["suv", "sedan", "van"]) {
    const matched = matchSlugDir(`assets/images/transport/${tierFolder}`, vehicle);
    if (matched) {
      const hit = pickInDir(`/assets/images/transport/${tierFolder}/${matched}`, kind);
      if (hit) return hit;
    }
    const direct = pickInDir(`/assets/images/transport/${tierFolder}/${vehicle}`, kind);
    if (direct) return direct;
  }
  // Tier folder overview / first vehicle
  for (const child of listChildDirs(`assets/images/transport/${tierFolder}`)) {
    const hit = pickInDir(`/assets/images/transport/${tierFolder}/${child}`, kind);
    if (hit) return hit;
  }
  return "";
}
