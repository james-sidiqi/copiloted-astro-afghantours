import type { LocationRow } from '../types/data.js';
import type { Location } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

export function loadLocations(): Location[] {
  const rows = readCsv<LocationRow>('locations.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      locationCode: r.location_code,
      name: r.name,
      type: r.type,
      parentCode: r.parent_code,
      slug: r.slug,
      isActive: true,
      sortOrder: parseInt(r.sort_order, 10) || 0,
    }));
}
