import type { TourRow } from '../types/data.js';
import type { Tour } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

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
      name: r.name,
      slug: r.slug,
      summary: r.summary,
      thumbnailImagePath: r.thumbnail_image_path,
      heroImagePath: r.hero_image_path,
      imageSlide1: r.image_path_slide1,
      imageSlide2: r.image_path_slide2,
      // Use the first occurrence of duplicated columns
      priceFrom: parseFloat(r.price_from) || 0,
      durationDays: parseInt(r.duration_days, 10) || 0,
      groupSize: r.group_size,
      travelStyle: r.travel_style,
      activityLevel: r.physical_activity_level || r.activity_level,
      regions: splitList(r.regions),
      provinces: splitList(r.provinces),
      accommodationNote: r.accommodation_note,
      transportNote: r.transport_note,
      season: r.season,
      isFeatured: r.is_featured === '1',
      isActive: true,
    }));
}
