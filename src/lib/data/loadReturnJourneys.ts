import type { ReturnJourneyRow } from '../types/data.js';
import type { ReturnJourney } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

function splitList(raw: string): string[] {
  if (!raw) return [];
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
}

export function loadReturnJourneys(): ReturnJourney[] {
  const rows = readCsv<ReturnJourneyRow>('return_journeys.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => {
      const slug = cleanText(r.slug);
      return {
        journeyCode: cleanText(r.journey_code),
        name: cleanText(r.name),
        slug,
        audience: cleanText(r.audience),
        summary: cleanText(r.summary),
        description: cleanText(r.description),
        examplesOfSupport: cleanText(r.examples_of_support),
        possibleRegions: splitList(r.possible_regions),
        planningNotes: cleanText(r.planning_notes),
        accommodationNote: cleanText(r.accommodation_note),
        transportNote: cleanText(r.transport_note),
        availabilityNote: cleanText(r.availability_note),
        imagePath: getAssetUrl(normalizeAssetPath(r.image_path), { slug, entity: 'tour', kind: 'thumb' }),
        heroImagePath: getAssetUrl(normalizeAssetPath(r.hero_image_path), { slug, entity: 'tour', kind: 'hero' }),
        ctaLabel: cleanText(r.cta_label) || 'Request a Return Journey',
        isFeatured: r.is_featured === '1',
        isActive: true,
      };
    });
}
