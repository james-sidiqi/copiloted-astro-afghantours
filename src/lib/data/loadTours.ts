import type { TourRow } from '../types/data.js';
import type { Tour } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';

function splitList(raw: string): string[] {
  if (!raw) return [];
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
}

export function loadTours(): Omit<Tour, 'itinerary' | 'inclusions' | 'dates' | 'attractions'>[] {
  const rows = readCsv<TourRow>('tours.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      tourCode: r.tour_code,
      name: cleanText(r.name),
      slug: cleanText(r.slug),
      summary: cleanText(r.summary),
      thumbnailImagePath: normalizeAssetPath(r.thumbnail_image_path),
      heroImagePath: normalizeAssetPath(r.hero_image_path),
      imageSlide1: normalizeAssetPath(r.image_path_slide1),
      imageSlide2: normalizeAssetPath(r.image_path_slide2),
      priceFrom: parseFloat(r.price_from) || 0,
      durationDays: parseInt(r.duration_days, 10) || 0,
      groupSize: cleanText(r.group_size_display || r.group_size || ''),
      travelStyle: cleanText(r.travel_style),
      activityLevel: cleanText(r.activity_level || r.physical_activity_level || ''),
      regions: splitList(r.regions),
      provinces: splitList(r.provinces),
      primaryLocationSlug: cleanText(r.primary_location_slug),
      accommodationNote: cleanText(r.accommodation_note),
      transportNote: cleanText(r.transport_note),
      season: cleanText(r.season),
      isFeatured: r.is_featured === '1',
      isActive: true,
    }));
}
