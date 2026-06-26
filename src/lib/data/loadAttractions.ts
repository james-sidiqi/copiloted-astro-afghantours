import type { AttractionRow } from '../types/data.js';
import type { Attraction } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';

function parseTags(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean);
}

export function loadAttractions(): Attraction[] {
  const rows = readCsv<AttractionRow>('attractions_master.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r): Attraction => ({
      attractionCode: r.attraction_code,
      name: cleanText(r.name),
      slug: cleanText(r.slug),
      province: cleanText(r.province),
      provinceCode: cleanText(r.province_code),
      region: cleanText(r.region),
      category: cleanText(r.category),
      descShort: cleanText(r.desc_short),
      descLong: cleanText(r.desc_long),
      tags: parseTags(r.tags),
      latitude: parseFloat(r.latitude) || 0,
      longitude: parseFloat(r.longitude) || 0,
      thumbnailPath: normalizeAssetPath(r.thumbnail_path),
      imagePath: normalizeAssetPath(r.image_path),
      svgPath: normalizeAssetPath(r.svg_path),
      locationCode: cleanText(r.location_code),
      priority: parseInt(r.priority, 10) || 0,
      isActive: true,
    }));
}
