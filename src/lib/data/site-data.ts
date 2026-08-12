import type { SiteData } from '../types/view-models.js';
import { buildSiteData } from './buildRelations.js';

let cache: SiteData | null = null;

/** Return site data, building it only once per process. */
export function getSiteData(): SiteData {
  if (!cache) cache = buildSiteData();
  return cache;
}

/** Clear the memoized site data, primarily for tests. */
export function resetSiteDataCache(): void {
  cache = null;
}
