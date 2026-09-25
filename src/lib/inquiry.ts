/**
 * Shared inquiry architecture — three entry flows, one field vocabulary.
 * Persist via query params + client form state + hidden inputs (no invented backend store).
 */

export type InquiryFlow = 'scheduled' | 'custom' | 'specialist' | 'return' | 'general';

export const INQUIRY_FIELD_LIMITS = {
  name: 120,
  email: 160,
  whatsapp: 40,
  country: 80,
  tour_name: 200,
  tour_slug: 120,
  tour_code: 40,
  departure: 80,
  travel_dates: 200,
  flexibility: 120,
  travelers: 40,
  accommodation: 200,
  transport: 200,
  activities: 400,
  cultural_interests: 400,
  notes: 4000,
  message: 4000,
  audience: 80,
  subject: 200,
} as const;

export type InquiryQuery = {
  flow: InquiryFlow;
  tour?: string;
  tourName?: string;
  tourCode?: string;
  departure?: string;
  travel_dates?: string;
  flexibility?: string;
  travelers?: string;
  accommodation?: string;
  transport?: string;
  activities?: string;
  cultural_interests?: string;
  notes?: string;
  audience?: string;
};

export function resolveInquiryFlow(params: URLSearchParams | Record<string, string | undefined>): InquiryFlow {
  const get = (k: string) =>
    params instanceof URLSearchParams ? (params.get(k) || '').trim() : String(params[k] || '').trim();
  const explicit = get('flow').toLowerCase();
  if (explicit === 'scheduled' || explicit === 'custom' || explicit === 'specialist' || explicit === 'return' || explicit === 'general') return explicit;
  if (get('tour') || get('tourName') || get('tourCode') || get('departure')) return 'scheduled';
  if (get('service') || get('serviceSlug') || get('serviceCode')) return 'specialist';
  if (get('return') || get('returnSlug') || get('journey')) return 'return';
  if (get('audience') || get('build') === '1' || get('custom') === '1') return 'custom';
  return 'general';
}

export function buildScheduledInquiryHref(opts: {
  slug: string;
  name: string;
  code?: string;
  departure?: string;
  accommodation?: string;
  transport?: string;
}): string {
  const q = new URLSearchParams();
  q.set('flow', 'scheduled');
  q.set('tour', opts.slug);
  q.set('tourName', opts.name);
  if (opts.code) q.set('tourCode', opts.code);
  if (opts.departure) q.set('departure', opts.departure);
  if (opts.accommodation) q.set('accommodation', opts.accommodation);
  if (opts.transport) q.set('transport', opts.transport);
  return `/contact/?${q.toString()}`;
}

export function buildCustomInquiryHref(audience?: string): string {
  const q = new URLSearchParams();
  q.set('flow', 'custom');
  if (audience) q.set('audience', audience);
  return `/contact/?${q.toString()}`;
}

/** Booking sequence copy — inquiry ≠ booking */
export const BOOKING_SEQUENCE_STEPS = [
  'Share dates (or a flexible window) and trip goals',
  'Review preferences with our Kabul team',
  'Receive a written proposal / quotation',
  'Confirm and arrange deposit as agreed in writing',
  'Letter of Invitation (LOI) support for booked tours where applicable',
  'Arrival coordination in Afghanistan',
] as const;

export const AUDIENCE_LABELS: Record<string, string> = {
  diaspora: 'Diaspora return journey',
  veterans: 'Veterans return journey',
  'peace-corps': 'Peace Corps alumni journey',
  business: 'Business / investment specialist inquiry',
  artists: 'Artist / creative specialist inquiry',
  media: 'Media / journalist specialist inquiry',
  specialist: 'Specialist service proposal',
  return: 'Return journey inquiry',
};

export function buildSpecialistInquiryHref(opts: {
  slug: string;
  name: string;
  code?: string;
  category?: string;
}): string {
  const q = new URLSearchParams();
  q.set('flow', 'specialist');
  q.set('service', opts.slug);
  q.set('serviceSlug', opts.slug);
  q.set('tourName', opts.name);
  if (opts.code) q.set('serviceCode', opts.code);
  if (opts.category) q.set('audience', opts.category);
  return `/contact/?${q.toString()}`;
}

export function buildReturnInquiryHref(opts: {
  slug: string;
  name: string;
  code?: string;
  audience?: string;
}): string {
  const q = new URLSearchParams();
  q.set('flow', 'return');
  q.set('return', opts.slug);
  q.set('returnSlug', opts.slug);
  q.set('tourName', opts.name);
  if (opts.code) q.set('tourCode', opts.code);
  if (opts.audience) q.set('audience', opts.audience);
  return `/contact/?${q.toString()}`;
}
