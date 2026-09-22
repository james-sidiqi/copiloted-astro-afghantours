/**
 * Build static JSON for the attractions Leaflet map from verified CSV coords.
 * Does not invent coordinates. Marks province-center / integer coords as approximate.
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, "public", "data", "maps");
fs.mkdirSync(outDir, { recursive: true });

function readCsv(relativePath) {
  return parse(fs.readFileSync(path.join(root, relativePath), "utf8"), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isActive(value) {
  return !["0", "FALSE", "false", "no", "NO"].includes(String(value || "").trim());
}

const provinces = readCsv("data/provinces.csv").map((p) => ({
  code: p.province_code,
  name: p.province_name,
  slug: p.province_slug,
  region: p.region,
  short_blurb: p.short_blurb,
  center_lat: numberOrNull(p.center_lat),
  center_lon: numberOrNull(p.center_lon),
  cover_image_path: p.cover_image_path,
  map_image_path: p.svg_map_path || p.map_image_path,
  is_featured: ["1", "TRUE", "true", "yes"].includes(String(p.is_featured)),
}));

const provinceCenters = new Map(
  provinces
    .filter((p) => p.center_lat !== null && p.center_lon !== null)
    .map((p) => [p.code, [p.center_lat, p.center_lon]]),
);

function classifyApprox(lat, lon, provinceCode) {
  if (lat === null || lon === null) return true;
  const intish = Math.abs(lat - Math.round(lat)) < 1e-9 && Math.abs(lon - Math.round(lon)) < 1e-9;
  const center = provinceCenters.get(provinceCode);
  const atCenter =
    center &&
    Math.abs(lat - center[0]) < 0.00015 &&
    Math.abs(lon - center[1]) < 0.00015;
  return Boolean(intish || atCenter);
}

const attractions = readCsv("data/attractions_master.csv")
  .filter((a) => isActive(a.is_active))
  .map((a) => {
    const latitude = numberOrNull(a.latitude);
    const longitude = numberOrNull(a.longitude);
    const approximate = classifyApprox(latitude, longitude, a.province_code);
    return {
      code: a.attraction_code,
      name: a.name,
      slug: a.slug,
      province_code: a.province_code,
      province: a.province,
      location_code: a.location_code,
      category: a.category,
      desc_short: a.desc_short,
      latitude,
      longitude,
      approximate,
      // Prefer hero over soft thumbs for map popups
      hero_image: a.image_path || a.thumbnail_path || "",
      card_image: a.image_path || a.thumbnail_path || "",
      priority: Number(a.priority) || 0,
      is_active: "1",
    };
  })
  .filter((a) => a.latitude !== null && a.longitude !== null);

const locations = readCsv("data/locations.csv").map((l) => ({
  code: l.location_code,
  name: l.name,
  type: l.type,
  parent_code: l.parent_code,
  slug: l.slug,
  is_hub: String(l.is_hub).toUpperCase() === "TRUE" || l.is_hub === "1",
  is_active: isActive(l.is_active),
}));

fs.writeFileSync(path.join(outDir, "afghanToursProvinces.json"), JSON.stringify(provinces, null, 2));
fs.writeFileSync(path.join(outDir, "afghanToursAttractions.json"), JSON.stringify(attractions, null, 2));
fs.writeFileSync(path.join(outDir, "afghanToursLocations.json"), JSON.stringify(locations, null, 2));

const approxCount = attractions.filter((a) => a.approximate).length;
const exactCount = attractions.length - approxCount;
console.log(`Wrote ${provinces.length} provinces.`);
console.log(`Wrote ${attractions.length} attractions with coordinates (${exactCount} exact-looking, ${approxCount} approximate).`);
fs.writeFileSync(path.join(outDir, 'provinces.json'), JSON.stringify(provinces, null, 2));
fs.writeFileSync(path.join(outDir, 'attractions.json'), JSON.stringify(attractions, null, 2));
fs.writeFileSync(path.join(outDir, 'locations.json'), JSON.stringify(locations, null, 2));
console.log(`Wrote ${locations.length} locations.`);
