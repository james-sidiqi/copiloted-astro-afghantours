import type { ProvinceRow } from '../types/data.js';
import type { Province } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

export function loadProvinces(): Omit<Province, 'attractions' | 'tours'>[] {
  const rows = readCsv<ProvinceRow>('provinces.csv');
  return rows.map((r) => {
    const slug = cleanText(r.province_slug);
    return {
      provinceCode: cleanText(r.province_code),
      provinceName: cleanText(r.province_name),
      provinceSlug: slug,
      region: cleanText(r.region),
      shortBlurb: cleanText(r.short_blurb),
      fullBlurb: cleanText(r.full_blurb),
      centerLat: parseFloat(r.center_lat) || 0,
      centerLon: parseFloat(r.center_lon) || 0,
      coverImagePath: getAssetUrl(normalizeAssetPath(r.cover_image_path), { slug, entity: 'province', kind: 'hero' }),
      squareImagePath: getAssetUrl(normalizeAssetPath(r.square_image_path), { slug, entity: 'province', kind: 'thumb' }),
      svgMapPath: getAssetUrl(normalizeAssetPath(r.svg_map_path), { slug, entity: 'map', kind: 'map' }),
      isFeatured: r.is_featured === '1',
      featureRank: parseFloat(r.feature_rank) || 0,
    };
  });
}
