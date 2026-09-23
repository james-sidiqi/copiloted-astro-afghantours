/**
 * Build-time guards: specialists must never appear as tour packages.
 */
import { readCsv } from './readCsv.js';
import type { TourRow, TourDateRow, ItineraryRow, SpecialistServiceRow } from '../types/data.js';

const SPECIALIST_SLUG_BLOCKLIST = new Set([
  'photography-tour',
  'scientific-expeditions',
]);

export type ProductValidationIssue = {
  level: 'error' | 'warn';
  message: string;
};

export function validateProductSeparation(): ProductValidationIssue[] {
  const issues: ProductValidationIssue[] = [];

  const tours = readCsv<TourRow>('tours.csv');
  const dates = readCsv<TourDateRow>('tour_dates.csv');
  const itinerary = readCsv<ItineraryRow>('tour_itinerary.csv');
  let specialists: SpecialistServiceRow[] = [];
  try {
    specialists = readCsv<SpecialistServiceRow>('specialist_services.csv');
  } catch {
    issues.push({ level: 'error', message: 'specialist_services.csv missing or unreadable' });
  }

  const specialistSlugs = new Set(specialists.map((s) => s.slug).filter(Boolean));
  const specialistCodes = new Set(specialists.map((s) => s.service_code).filter(Boolean));

  for (const t of tours) {
    if (SPECIALIST_SLUG_BLOCKLIST.has(t.slug) || specialistSlugs.has(t.slug)) {
      issues.push({
        level: 'error',
        message: `Tour row looks like a specialist service: ${t.tour_code}/${t.slug}`,
      });
    }
    const pc = (t.product_class || '').trim();
    if (pc && pc !== 'scheduled' && pc !== 'private-fixed') {
      issues.push({
        level: 'error',
        message: `Tour ${t.slug} has invalid product_class="${pc}"`,
      });
    }
    if ((t.travel_style || '').trim().toLowerCase() === 'custom') {
      issues.push({
        level: 'warn',
        message: `Tour ${t.slug} still has travel_style=Custom — prefer retag or custom_journeys.csv`,
      });
    }
  }

  for (const d of dates) {
    if (specialistSlugs.has(d.tour_slug) || SPECIALIST_SLUG_BLOCKLIST.has(d.tour_slug)) {
      issues.push({
        level: 'error',
        message: `tour_dates.csv contains specialist slug ${d.tour_slug}`,
      });
    }
    const codeBase = (d.tour_code || '').split('-')[0];
    if (specialistCodes.has(codeBase) || codeBase === 'PHOT' || codeBase === 'SCIE') {
      issues.push({
        level: 'error',
        message: `tour_dates.csv contains specialist code ${d.tour_code}`,
      });
    }
  }

  for (const day of itinerary) {
    if (specialistSlugs.has(day.tour_slug) || SPECIALIST_SLUG_BLOCKLIST.has(day.tour_slug)) {
      issues.push({
        level: 'error',
        message: `tour_itinerary.csv contains specialist slug ${day.tour_slug}`,
      });
    }
    if (specialistCodes.has(day.tour_code) || day.tour_code === 'PHOT' || day.tour_code === 'SCIE') {
      issues.push({
        level: 'error',
        message: `tour_itinerary.csv contains specialist code ${day.tour_code}`,
      });
    }
  }

  for (const s of specialists) {
    const raw = s as unknown as Record<string, string>;
    for (const banned of ['duration_days', 'price_from', 'itinerary', 'date_start', 'date_end']) {
      if (banned in raw && String(raw[banned] || '').trim() !== '') {
        issues.push({
          level: 'error',
          message: `Specialist ${s.slug} has forbidden field ${banned}`,
        });
      }
    }
  }

  return issues;
}

export function assertProductSeparation(): void {
  const issues = validateProductSeparation();
  for (const issue of issues) {
    const prefix = issue.level === 'error' ? '[product-separation ERROR]' : '[product-separation WARN]';
    if (issue.level === 'error') console.error(`${prefix} ${issue.message}`);
    else console.warn(`${prefix} ${issue.message}`);
  }
  if (issues.some((i) => i.level === 'error')) {
    throw new Error(
      `Product separation validation failed with ${issues.filter((i) => i.level === 'error').length} error(s)`,
    );
  }
}
