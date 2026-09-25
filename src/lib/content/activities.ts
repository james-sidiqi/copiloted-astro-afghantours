/**
 * Activities — hub-linked planning helpers.
 * Public routes: /activities/<slug>/
 * Assets: /assets/images/experiences/activities/<slug>/{hero,thumb}.webp + gallery/
 * Hub matrix: data/activity_hubs.csv
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { firstExisting, resolveActivityExperienceAsset } from '../getAssetUrl.js';
import { getHubsForActivity, type HubLink } from './hubRelations.js';

export type ActivityEntry = CollectionEntry<'activities'>;

const PLACEHOLDER = '/assets/images/placeholders/default-card.webp';

export async function getAllActivities(): Promise<ActivityEntry[]> {
  const entries = await getCollection('activities');
  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function activityHref(slug: string): string {
  return `/activities/${slug}/`;
}

export function activityImage(
  slug: string,
  hero?: string,
  image?: string,
  prefer: 'hero' | 'thumb' = 'hero',
): string {
  const resolved = resolveActivityExperienceAsset([slug], prefer);
  if (prefer === 'thumb') {
    return (
      firstExisting(
        resolved,
        `/assets/images/experiences/activities/${slug}/thumb.webp`,
        image,
        `/assets/images/experiences/activities/${slug}/hero.webp`,
        hero,
      ) || PLACEHOLDER
    );
  }
  return (
    firstExisting(
      resolved,
      `/assets/images/experiences/activities/${slug}/hero.webp`,
      hero,
      `/assets/images/experiences/activities/${slug}/thumb.webp`,
      image,
    ) || PLACEHOLDER
  );
}

export function listActivityGallery(slug: string, declared: string[] = []): string[] {
  const fromFront = (declared || []).map((u) => firstExisting(u)).filter(Boolean) as string[];
  if (fromFront.length) return fromFront;
  const base = `/assets/images/experiences/activities/${slug}/gallery`;
  const out: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const pad = String(i).padStart(2, '0');
    const hit = firstExisting(
      `${base}/${pad}.webp`,
      `${base}/${i}.webp`,
      `${base}/gallery-${i}.webp`,
      `${base}/gallery-${pad}.webp`,
    );
    if (hit) out.push(hit);
  }
  return out;
}

export function hubsForActivity(slug: string): HubLink[] {
  return getHubsForActivity(slug);
}
