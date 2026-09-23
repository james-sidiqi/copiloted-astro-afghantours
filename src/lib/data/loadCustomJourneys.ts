import type { CustomJourneyRow } from '../types/data.js';
import type { CustomJourney } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

export function loadCustomJourneys(): CustomJourney[] {
  const rows = readCsv<CustomJourneyRow>('custom_journeys.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => {
      const slug = cleanText(r.slug);
      return {
        journeyCode: cleanText(r.journey_code),
        name: cleanText(r.name),
        slug,
        summary: cleanText(r.summary),
        description: cleanText(r.description),
        audience: cleanText(r.audience),
        imagePath: getAssetUrl(normalizeAssetPath(r.image_path), { slug, entity: 'tour', kind: 'thumb' }),
        heroImagePath: getAssetUrl(normalizeAssetPath(r.hero_image_path), { slug, entity: 'tour', kind: 'hero' }),
        ctaLabel: cleanText(r.cta_label) || 'Build My Journey',
        isFeatured: r.is_featured === '1',
        isActive: true,
      };
    });
}
