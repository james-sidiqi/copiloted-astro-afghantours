import type { AttractionRow } from '../types/data.js';
import type { Attraction } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

function parseTags(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean);
}

type TimeRow = {
  attraction_code: string;
  visit_time_minutes?: string;
  trip_classification?: string;
  is_active?: string;
};

type AccessRow = {
  attraction_code: string;
  access_classification?: string;
  typical_access?: string;
  road_condition?: string;
  is_active?: string;
};

function loadTimeByCode(): Map<string, TimeRow> {
  try {
    const rows = readCsv<TimeRow>('attraction_time_profile.csv');
    return new Map(
      rows
        .filter((r) => String(r.is_active ?? '1').trim() !== '0')
        .map((r) => [r.attraction_code, r]),
    );
  } catch {
    return new Map();
  }
}

function loadAccessByCode(): Map<string, AccessRow> {
  try {
    const rows = readCsv<AccessRow>('attraction_access_classification.csv');
    return new Map(
      rows
        .filter((r) => String(r.is_active ?? '1').trim() !== '0')
        .map((r) => [r.attraction_code, r]),
    );
  } catch {
    return new Map();
  }
}

export function loadAttractions(): Attraction[] {
  const rows = readCsv<AttractionRow>('attractions_master.csv');
  const timeBy = loadTimeByCode();
  const accessBy = loadAccessByCode();
  return rows
    .filter((r) => r.is_active === '1')
    .map((r): Attraction => {
      const slug = cleanText(r.slug);
      const codedThumb = normalizeAssetPath(r.thumbnail_path);
      const codedImage = normalizeAssetPath(r.image_path);
      const codedSvg = normalizeAssetPath(r.svg_path);
      const mapSlug = (codedSvg.split('/').pop() || '').replace(/\.svg$/i, '') || slug;
      const time = timeBy.get(r.attraction_code);
      const access = accessBy.get(r.attraction_code);
      const visitMins = time?.visit_time_minutes ? parseInt(time.visit_time_minutes, 10) : NaN;
      return {
        attractionCode: r.attraction_code,
        name: cleanText(r.name),
        slug,
        province: cleanText(r.province),
        provinceCode: cleanText(r.province_code),
        region: cleanText(r.region),
        category: cleanText(r.category),
        descShort: cleanText(r.desc_short),
        descLong: cleanText(r.desc_long),
        tags: parseTags(r.tags),
        latitude: parseFloat(r.latitude) || 0,
        longitude: parseFloat(r.longitude) || 0,
        thumbnailPath: getAssetUrl(codedThumb, { slug, entity: 'attraction', kind: 'thumb' }),
        imagePath: getAssetUrl(codedImage, { slug, entity: 'attraction', kind: 'hero' }),
        svgPath: getAssetUrl(codedSvg, { slug: mapSlug, entity: 'map', kind: 'map' }),
        locationCode: cleanText(r.location_code),
        priority: parseInt(r.priority, 10) || 0,
        isActive: true,
        visitTimeMinutes: Number.isFinite(visitMins) ? visitMins : undefined,
        tripClassification: cleanText(time?.trip_classification || '') || undefined,
        accessClassification: cleanText(access?.access_classification || '') || undefined,
        typicalAccess: cleanText(access?.typical_access || '') || undefined,
        roadCondition: cleanText(access?.road_condition || '') || undefined,
      };
    });
}
