/**
 * Phase 2 asset resolver: prefer new public/ slug-folder layout when files exist,
 * otherwise fall back to existing coded/CSV paths. Does not invent stock images.
 * Does not delete anything.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { cleanText, normalizeAssetPath } from "./data/normalize.js";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

const dirCache = new Map<string, string[]>();
const existsCache = new Map<string, boolean>();

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
export function firstExisting(...candidates: Array<string | null | undefined>): string {
  for (const c of candidates) {
    const n = normalizeAssetPath(c);
    if (n && publicUrlExists(n)) return n;
  }
  return "";
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

function slugVariants(slug: string): string[] {
  const s = cleanText(slug).toLowerCase();
  if (!s) return [];
  const out = new Set<string>([s]);
  out.add(s.replace(/-and-/g, "-"));
  if (s.startsWith("the-")) out.add(s.slice(4));
  if (s.startsWith("mt-")) out.add("mount-" + s.slice(3));
  if (s.startsWith("mount-")) out.add("mt-" + s.slice(6));
  if (s.endsWith("-lakes") && !s.includes("-and-lakes")) {
    out.add(s.replace(/-lakes$/, "-and-lakes"));
  }
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

function pickInDir(dirUrl: string, prefer: "hero" | "thumb" | "any" = "any"): string {
  const base = dirUrl.replace(/\/$/, "");
  const hero = `${base}/hero.webp`;
  const thumb = `${base}/thumb.webp`;
  if (prefer === "hero") return firstExisting(hero, thumb);
  if (prefer === "thumb") return firstExisting(thumb, hero);
  return firstExisting(hero, thumb);
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
  "kabul-kebab": ["kabul-kabob", "kabob"],
  "chicken-qabili": ["chicken-kabuli"],
  "kandahar-kebab": ["kabob"],
  "ash-soup": ["aush"],
  "doogh-yogurt-drink": ["dogh"],
  "herat-ice-cream": ["saffron-ice-cream", "sheer-yakh"],
  "samangan-pistachios": ["pistachios"],
  "herat-raisins": ["raisins"],
  "balkh-almonds": ["almonds"],
  "jalebi-sweet": ["jelabi"],
};

const FOOD_CATEGORIES = ["dishes", "sweets", "drinks", "produce", "dried-fruit"] as const;

export type AssetKind = "hero" | "thumb" | "image" | "map" | "any";
export type AssetEntity =
  | "attraction"
  | "province"
  | "hotel"
  | "dish"
  | "tour"
  | "hub"
  | "map"
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

  if (entity === "attraction" && slug) {
    return resolveAttractionAsset(slug, coded, kind);
  }
  if (entity === "province" && slug) {
    return resolveProvinceAsset(slug, coded, kind);
  }
  if (entity === "hotel") {
    return resolveHotelAsset(coded, kind);
  }
  if (entity === "dish" && slug) {
    return resolveDishAsset(slug, coded, kind);
  }
  if (entity === "tour" && slug) {
    return resolveTourAsset(slug, coded, kind);
  }
  if (entity === "hub" && slug) {
    return resolveHubAsset(slug, coded, kind);
  }
  if (entity === "map" || kind === "map") {
    return resolveMapAsset(coded, slug);
  }

  const remapped = remapKnownPrefixes(coded);
  return firstExisting(remapped, coded) || remapped || coded;
}

function remapKnownPrefixes(urlPath: string): string {
  if (!urlPath) return "";
  // Hotels live under public/images/hotels (Phase 1), not public/assets/images/hotels
  if (urlPath.startsWith("/assets/images/hotels/")) {
    return urlPath.replace("/assets/images/hotels/", "/images/hotels/");
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
  const matched = matchSlugDir("assets/images/attractions", slug);
  if (matched) {
    const dir = `/assets/images/attractions/${matched}`;
    const prefer: "hero" | "thumb" | "any" =
      kind === "thumb" ? "thumb" : kind === "hero" || kind === "image" ? "hero" : "any";
    const fromDir = pickInDir(dir, prefer);
    if (fromDir) return fromDir;
    const galleryFirst = firstExisting(
      `${dir}/gallery/01.webp`,
      `${dir}/gallery/1.webp`,
      `${dir}/gallery/hero.webp`,
    );
    if (galleryFirst) return galleryFirst;
  }
  return firstExisting(codedPath) || codedPath;
}

export function resolveProvinceAsset(
  slug: string,
  codedPath: string,
  kind: AssetKind = "any",
): string {
  if (kind === "map") {
    return resolveMapAsset(codedPath, slug);
  }
  const matched = matchSlugDir("assets/images/province", slug);
  if (matched) {
    const dir = `/assets/images/province/${matched}`;
    const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
    const fromDir = pickInDir(dir, prefer);
    if (fromDir) return fromDir;
  }
  const flat = firstExisting(codedPath, `/assets/images/province/${slug}.webp`);
  return flat || codedPath;
}

export function resolveHotelAsset(codedPath: string, kind: AssetKind = "any"): string {
  const remapped = remapKnownPrefixes(codedPath);
  const propPath = remapped || codedPath;

  // Specific gallery/property files: keep the remapped filename when it exists
  if (kind === "image") {
    return firstExisting(remapped, codedPath) || remapped || codedPath;
  }

  // Primary card/hero: prefer hero.webp / thumb.webp in the property folder
  if (propPath && propPath.includes("/hotels/")) {
    const dir = propPath.replace(/\/[^/]+$/, "");
    const prefer: "hero" | "thumb" = kind === "thumb" ? "thumb" : "hero";
    const fromDir = pickInDir(dir, prefer);
    if (fromDir) return fromDir;
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
  const matched = matchSlugDir("assets/images/custom-tours", slug);
  if (matched) {
    const fromDir = pickInDir(`/assets/images/custom-tours/${matched}`, prefer);
    if (fromDir) return fromDir;
  }
  for (const base of ["assets/images/return-journeys", "assets/images/page-assets"]) {
    const m = matchSlugDir(base, slug);
    if (m) {
      const fromDir = pickInDir(`/${base}/${m}`, prefer);
      if (fromDir) return fromDir;
    }
  }
  return firstExisting(codedPath) || codedPath;
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
  }
  if (remapped) {
    candidates.push(remapped);
    if (remapped.endsWith(".svg")) {
      candidates.push(remapped.replace(/\.svg$/, "-map.webp"));
      candidates.push(remapped.replace(/\.svg$/, ".webp"));
      const m = remapped.match(/\/([^/]+)\.svg$/);
      if (m) {
        candidates.push(remapped.replace(/\/[^/]+\.svg$/, `/${m[1]}-map.webp`));
      }
    }
  }
  if (codedPath) candidates.push(codedPath);
  return firstExisting(...candidates) || remapped || codedPath;
}

/** Convenience: cultural-experiences / activities by slug folder. */
export function resolveCategorySlugAsset(
  category: "cultural-experiences" | "activities" | "custom-tours" | "return-journeys",
  slug: string,
  kind: "hero" | "thumb" = "hero",
): string {
  const matched = matchSlugDir(`assets/images/${category}`, slug);
  if (!matched) return "";
  return pickInDir(`/assets/images/${category}/${matched}`, kind);
}
