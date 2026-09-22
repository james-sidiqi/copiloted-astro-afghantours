import { defineCollection, z } from 'astro:content';

/** Optional prose overlays for operational hubs (CSV remains source of truth for relations). */
const hubs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    hub_slug: z.string().optional(),
    slug: z.string().optional(),
    section: z.string().optional(),
    save_to: z.string().optional(),
  }),
});

/** Cultural experience articles — inspire only; related tours resolved from CSV by province. */
const culturalExperiences = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    card_description: z.string().optional(),
    category: z.string().optional(),
    experience_type: z.string().optional(),
    hero_image: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    provinces: z.array(z.string()).default([]),
    best_season: z.string().optional(),
    duration: z.string().optional(),
    nearby: z.array(z.string()).default([]),
    paired_foods: z.array(z.string()).default([]),
  }),
});

export const collections = {
  hubs,
  'cultural-experiences': culturalExperiences,
};
