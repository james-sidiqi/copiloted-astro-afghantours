import type { SpecialistServiceRow } from '../types/data.js';
import type { SpecialistService } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

function splitList(raw: string): string[] {
  if (!raw) return [];
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
}

export function loadSpecialistServices(): SpecialistService[] {
  const rows = readCsv<SpecialistServiceRow>('specialist_services.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => {
      const slug = cleanText(r.slug);
      return {
        serviceCode: cleanText(r.service_code),
        name: cleanText(r.name),
        slug,
        category: cleanText(r.category),
        summary: cleanText(r.summary),
        description: cleanText(r.description),
        audience: cleanText(r.audience),
        serviceType: cleanText(r.service_type),
        regionsSupported: splitList(r.regions_supported),
        planningNotes: cleanText(r.planning_notes),
        accommodationNote: cleanText(r.accommodation_note),
        transportNote: cleanText(r.transport_note),
        supportNote: cleanText(r.support_note),
        availabilityNote: cleanText(r.availability_note),
        imagePath: getAssetUrl(normalizeAssetPath(r.image_path), { slug, entity: 'tour', kind: 'thumb' }),
        heroImagePath: getAssetUrl(normalizeAssetPath(r.hero_image_path), { slug, entity: 'tour', kind: 'hero' }),
        ctaLabel: cleanText(r.cta_label) || 'Request a Proposal',
        isFeatured: r.is_featured === '1',
        isActive: true,
      };
    });
}
