import type { ProvinceRow } from '../types/data.js';
import type { Province } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

export function loadProvinces(): Omit<Province, 'attractions' | 'tours'>[] {
  const rows = readCsv<ProvinceRow>('provinces.csv');
  return rows.map((r) => ({
    provinceCode: r.province_code,
    provinceName: r.province_name,
    provinceSlug: r.province_slug,
    region: r.region,
    shortBlurb: r.short_blurb,
    fullBlurb: r.full_blurb,
    centerLat: parseFloat(r.center_lat) || 0,
    centerLon: parseFloat(r.center_lon) || 0,
    coverImagePath: r.cover_image_path,
    squareImagePath: r.square_image_path,
    svgMapPath: r.svg_map_path,
    isFeatured: r.is_featured === '1',
    featureRank: parseFloat(r.feature_rank) || 0,
  }));
}
