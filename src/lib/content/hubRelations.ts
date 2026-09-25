/**
 * Hub ↔ experience / activity relationship loaders.
 * Sources: data/{cultural,culinary}_experience_hubs.csv, data/activity_hubs.csv
 * hub_slug ALL expands to all active operational hubs.
 * Do not invent cultural↔hub links beyond the locked CSV rows.
 */
import { readCsv } from '../data/readCsv.js';

export type HubLink = {
  slug: string;
  hubSlug: string;
  accessType: string;
  availabilityNote: string;
  priority: number;
  isActive: boolean;
};

/**
 * Locked active operational hub page slugs (locations.csv is_hub=1 destinations).
 * Copiloted hub *page* for Faizabad is `faizabad` (preserve /hubs/faizabad/).
 * Runtime/compatibility token `faizabad-city` aliases to that page slug.
 */
export const ACTIVE_HUB_SLUGS = [
  'kabul-city',
  'jalalabad-city',
  'bamyan-city',
  'mazar-e-sharif',
  'faizabad',
  'kandahar-city',
  'herat-city',
  'ghazni-city',
] as const;

/** Map alternate runtime tokens → hub page slug used in this repo. */
export const HUB_SLUG_ALIASES: Record<string, string> = {
  kabul: 'kabul-city',
  'kabul-city': 'kabul-city',
  bamyan: 'bamyan-city',
  'bamyan-city': 'bamyan-city',
  ghazni: 'ghazni-city',
  'ghazni-city': 'ghazni-city',
  herat: 'herat-city',
  'herat-city': 'herat-city',
  kandahar: 'kandahar-city',
  'kandahar-city': 'kandahar-city',
  jalalabad: 'jalalabad-city',
  'jalalabad-city': 'jalalabad-city',
  // Preserve existing /hubs/faizabad/ URL; accept faizabad-city as the eight-runtime token.
  faizabad: 'faizabad',
  'faizabad-city': 'faizabad',
  'mazar-e-sharif': 'mazar-e-sharif',
  'mazar-e-sharif-city': 'mazar-e-sharif',
  mazar: 'mazar-e-sharif',
};

export function canonicalHubSlug(value: string): string {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return HUB_SLUG_ALIASES[slug] || slug;
}

/** Tokens that should match the same hub page (for relationship lookups). */
export function hubSlugMatchSet(hubSlug: string): Set<string> {
  const canon = canonicalHubSlug(hubSlug);
  const out = new Set<string>([canon, hubSlug.toLowerCase()]);
  for (const [alias, target] of Object.entries(HUB_SLUG_ALIASES)) {
    if (target === canon) out.add(alias);
  }
  return out;
}

export function listActiveHubSlugs(): string[] {
  return [...ACTIVE_HUB_SLUGS];
}

type RelRow = {
  experience_slug?: string;
  activity_slug?: string;
  hub_slug?: string;
  access_type?: string;
  availability_note?: string;
  priority?: string;
  is_active?: string;
};

function expandHub(hubSlug: string): string[] {
  const h = (hubSlug || '').trim();
  if (!h) return [];
  if (h === 'ALL' || h === '*') return listActiveHubSlugs();
  return [canonicalHubSlug(h)];
}

function toLink(
  slug: string,
  hubSlug: string,
  accessType: string,
  availabilityNote: string,
  priority: string,
  isActive: string,
): HubLink {
  return {
    slug,
    hubSlug,
    accessType: accessType || '',
    availabilityNote: availabilityNote || '',
    priority: Number(priority || '1') || 1,
    isActive: !['0', 'false', 'no'].includes(String(isActive || '1').toLowerCase()),
  };
}

function loadRows(filename: string, slugKey: 'experience_slug' | 'activity_slug'): HubLink[] {
  const rows = readCsv<RelRow>(filename);
  const out: HubLink[] = [];
  for (const row of rows) {
    const slug = (row[slugKey] || row.experience_slug || row.activity_slug || '').trim();
    if (!slug) continue;
    for (const hub of expandHub(row.hub_slug || '')) {
      out.push(
        toLink(
          slug,
          hub,
          row.access_type || '',
          row.availability_note || '',
          row.priority || '1',
          row.is_active || '1',
        ),
      );
    }
  }
  return out.filter((l) => l.isActive);
}

let culturalCache: HubLink[] | null = null;
let culinaryCache: HubLink[] | null = null;
let activityCache: HubLink[] | null = null;

export function getCulturalExperienceHubLinks(): HubLink[] {
  if (!culturalCache) culturalCache = loadRows('cultural_experience_hubs.csv', 'experience_slug');
  return culturalCache;
}

export function getCulinaryExperienceHubLinks(): HubLink[] {
  if (!culinaryCache) culinaryCache = loadRows('culinary_experience_hubs.csv', 'experience_slug');
  return culinaryCache;
}

export function getActivityHubLinks(): HubLink[] {
  if (!activityCache) activityCache = loadRows('activity_hubs.csv', 'activity_slug');
  return activityCache;
}

export function getCulturalForHub(hubSlug: string): HubLink[] {
  const hubs = hubSlugMatchSet(hubSlug);
  return getCulturalExperienceHubLinks()
    .filter((l) => hubs.has(l.hubSlug.toLowerCase()) || hubs.has(canonicalHubSlug(l.hubSlug)))
    .sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug));
}

export function getCulinaryLinksForHub(hubSlug: string): HubLink[] {
  const hubs = hubSlugMatchSet(hubSlug);
  return getCulinaryExperienceHubLinks()
    .filter((l) => hubs.has(l.hubSlug.toLowerCase()) || hubs.has(canonicalHubSlug(l.hubSlug)))
    .sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug));
}

export function getActivitiesForHub(hubSlug: string): HubLink[] {
  const hubs = hubSlugMatchSet(hubSlug);
  return getActivityHubLinks()
    .filter((l) => hubs.has(l.hubSlug.toLowerCase()) || hubs.has(canonicalHubSlug(l.hubSlug)))
    .sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug));
}

export function getHubsForCultural(experienceSlug: string): HubLink[] {
  const slug = experienceSlug.toLowerCase();
  return getCulturalExperienceHubLinks()
    .filter((l) => l.slug.toLowerCase() === slug)
    .sort((a, b) => a.priority - b.priority || a.hubSlug.localeCompare(b.hubSlug));
}

export function getHubsForActivity(activitySlug: string): HubLink[] {
  const slug = activitySlug.toLowerCase();
  return getActivityHubLinks()
    .filter((l) => l.slug.toLowerCase() === slug)
    .sort((a, b) => a.priority - b.priority || a.hubSlug.localeCompare(b.hubSlug));
}

export function culturalExperienceHref(slug: string): string {
  return `/cultural-experiences/${slug}/`;
}

export function activityHref(slug: string): string {
  return `/activities/${slug}/`;
}

export function hubHref(slug: string): string {
  return `/hubs/${canonicalHubSlug(slug)}/`;
}
