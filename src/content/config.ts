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

/**
 * Hub-based Culinary Experiences (planning hub may differ from physical stop).
 * Public URLs: /cultural-experiences/culinary/<slug>/
 * Assets: /assets/images/experiences/culinary/<slug>/{hero,thumb}.webp + gallery/
 * Documented siblings: experiences/{cultural,culinary,activities}
 */
const culinaryExperiences = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    card_description: z.string().optional(),
    experience_code: z.string(),
    experience_type: z.literal('culinary'),
    hub_slug: z.string(),
    route_context: z.enum(['in-hub', 'near-hub', 'day-trip', 'excursion']),
    venue_name: z.string().default(''),
    venue_type: z.enum(['restaurant', 'bakery', 'roadside-stop', 'food-stop', 'market']),
    venue_status: z.string(),
    signature_food: z.string(),
    related_food_slugs: z.array(z.string()).default([]),
    /** Optional tour↔culinary links — do not invent itinerary day assignments. */
    related_tour_slugs: z.array(z.string()).default([]),
    hero_image: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    provinces: z.array(z.string()).default([]),
    best_season: z.string().optional(),
    duration: z.string().optional(),
    nearby: z.array(z.string()).default([]),
  }),
});

export const collections = {
  hubs,
  'cultural-experiences': culturalExperiences,
  'culinary-experiences': culinaryExperiences,
};
