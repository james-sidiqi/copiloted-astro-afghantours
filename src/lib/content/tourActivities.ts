/**
 * Explicit tour ↔ activity relationships only (data/tour_activities.csv).
 * Do not invent links from name similarity.
 */
import { readCsv } from '../data/readCsv.js';
import type { Tour } from '../types/view-models.js';
import { scheduledToursOnly, sortScheduled } from './relatedScheduled.js';

export type TourActivityRow = {
  tour_code: string;
  tour_slug: string;
  activity_slug: string;
  notes?: string;
  is_active?: string;
};

let cached: TourActivityRow[] | null = null;

export function loadTourActivityRows(): TourActivityRow[] {
  if (cached) return cached;
  try {
    cached = readCsv<TourActivityRow>('tour_activities.csv').filter(
      (r) => String(r.is_active ?? '1').trim() !== '0',
    );
  } catch {
    cached = [];
  }
  return cached;
}

export function toursFeaturingActivity(tours: Tour[], activitySlug: string, limit = 6): Tour[] {
  const slugs = new Set(
    loadTourActivityRows()
      .filter((r) => r.activity_slug === activitySlug)
      .map((r) => r.tour_slug.trim().toLowerCase()),
  );
  if (!slugs.size) return [];
  const matched = scheduledToursOnly(tours).filter((t) => slugs.has(t.slug.toLowerCase()));
  return sortScheduled(matched).slice(0, limit);
}
