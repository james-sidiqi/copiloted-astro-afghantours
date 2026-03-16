import type { RegionRow } from '../types/data.js';
import type { Region } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

export function loadRegions(): Omit<Region, 'provinces' | 'attractions'>[] {
  const rows = readCsv<RegionRow>('regions.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      regionCode: r.region_code,
      regionName: r.region_name,
      parentCode: r.parent_code,
      regionSlug: r.region_slug,
      description: r.description,
      imgPath: r.img_path,
      isActive: true,
      sortOrder: parseInt(r.sort_order, 10) || 0,
    }));
}
