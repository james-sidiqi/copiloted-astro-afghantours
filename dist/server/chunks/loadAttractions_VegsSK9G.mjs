import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

function readCsv(filename) {
  const dataDir = join(process.cwd(), "data");
  const filePath = join(dataDir, filename);
  const content = readFileSync(filePath, "utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true
  });
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
}
function loadAttractions() {
  const rows = readCsv("attractions_master.csv");
  return rows.filter((r) => r.is_active === "1").map((r) => ({
    attractionCode: r.attraction_code,
    name: r.name,
    slug: r.slug,
    province: r.province,
    provinceCode: r.province_code,
    region: r.region,
    category: r.category,
    descShort: r.desc_short,
    descLong: r.desc_long,
    tags: parseTags(r.tags),
    latitude: parseFloat(r.latitude) || 0,
    longitude: parseFloat(r.longitude) || 0,
    thumbnailPath: r.thumbnail_path,
    imagePath: r.image_path,
    svgPath: r.svg_path,
    priority: parseInt(r.priority, 10) || 0,
    isActive: true
  }));
}

export { loadAttractions as l, readCsv as r };
