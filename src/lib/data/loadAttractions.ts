import type { AttractionRow } from '../types/data.js';
import type { Attraction } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

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
      locationCode: r.location_code,
      isActive: true,
    }));
}
