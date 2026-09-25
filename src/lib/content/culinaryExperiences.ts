/**
 * Culinary Experiences — hub-based planning helpers.
 * Public routes: /cultural-experiences/culinary/<slug>/
 * Assets: /assets/images/experiences/culinary/<slug>/{hero,thumb}.webp + gallery/
 * Sibling trees: experiences/{cultural,culinary,activities}
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { firstExisting } from '../getAssetUrl.js';

export type CulinaryEntry = CollectionEntry<'culinary-experiences'>;

const PLACEHOLDER = '/assets/images/placeholders/default-card.webp';

export async function getAllCulinaryExperiences(): Promise<CulinaryEntry[]> {
  const entries = await getCollection('culinary-experiences');
  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getCulinaryByHub(hubSlug: string): Promise<CulinaryEntry[]> {
  const all = await getAllCulinaryExperiences();
  const hub = hubSlug.toLowerCase();
  const aliases = new Set<string>([
    hub,
    hub.replace(/-city$/, ''),
    hub.endsWith('-city') ? hub : `${hub}-city`,
  ]);
  if (hub.includes('mazar')) {
    aliases.add('mazar-e-sharif');
    aliases.add('mazar');
  }
  return all.filter((e) => aliases.has(e.data.hub_slug.toLowerCase()));
}

export async function getCulinaryByFoodSlug(foodSlug: string): Promise<CulinaryEntry[]> {
  const all = await getAllCulinaryExperiences();
  const target = foodSlug.toLowerCase();
  return all.filter((e) =>
    (e.data.related_food_slugs || []).some((s) => s.toLowerCase() === target),
  );
}

export function culinaryHref(slug: string): string {
  return `/cultural-experiences/culinary/${slug}/`;
}

export function culinaryImage(
  slug: string,
  hero?: string,
  image?: string,
  prefer: 'hero' | 'thumb' = 'hero',
): string {
  const base = `/assets/images/experiences/culinary/${slug}`;
  if (prefer === 'thumb') {
    return (
      firstExisting(`${base}/thumb.webp`, image, `${base}/hero.webp`, hero, `${base}/overview.webp`) ||
      PLACEHOLDER
    );
  }
  return (
    firstExisting(`${base}/hero.webp`, hero, `${base}/thumb.webp`, image, `${base}/overview.webp`) ||
    PLACEHOLDER
  );
}

export function listCulinaryGallery(slug: string, declared: string[] = []): string[] {
  const fromFront = (declared || []).map((u) => firstExisting(u)).filter(Boolean) as string[];

  const base = `/assets/images/experiences/culinary/${slug}/gallery`;
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
  return [...new Set([...fromFront, ...out])];
}
