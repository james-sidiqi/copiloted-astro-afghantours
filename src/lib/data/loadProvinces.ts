import type { ProvinceRow } from '../types/data.js';
import type { Province } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';

export function loadProvinces(): Omit<Province, 'attractions' | 'tours'>[] {
  const rows = readCsv<ProvinceRow>('provinces.csv');
  return rows.map((r) => ({
    provinceCode: cleanText(r.province_code),
    provinceName: cleanText(r.province_name),
    provinceSlug: cleanText(r.province_slug),
    region: cleanText(r.region),
    shortBlurb: cleanText(r.short_blurb),
    fullBlurb: cleanText(r.full_blurb),
    centerLat: parseFloat(r.center_lat) || 0,
    centerLon: parseFloat(r.center_lon) || 0,
    coverImagePath: normalizeAssetPath(r.cover_image_path),
    squareImagePath: normalizeAssetPath(r.square_image_path),
    svgMapPath: normalizeAssetPath(r.svg_map_path),
    isFeatured: r.is_featured === '1',
    featureRank: parseFloat(r.feature_rank) || 0,
  }));
}
