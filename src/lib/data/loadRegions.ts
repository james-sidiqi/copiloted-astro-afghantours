import type { RegionRow } from '../types/data.js';
import type { Region } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';

export function loadRegions(): Omit<Region, 'provinces' | 'attractions'>[] {
  const rows = readCsv<RegionRow>('regions.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      regionCode: cleanText(r.region_code),
      regionName: cleanText(r.region_name),
      parentCode: cleanText(r.parent_code),
      regionSlug: cleanText(r.region_slug),
      description: cleanText(r.description),
      imgPath: normalizeAssetPath(r.img_path),
      isActive: true,
      sortOrder: parseInt(r.sort_order, 10) || 0,
    }));
}
