/**
 * WG3 — primary scheduled catalog for homepage / tours index featuring.
 * Do not invent additional featured products beyond this operator set.
 */
export const PRIMARY_SCHEDULED_SLUGS = [
  'weekend-in-kabul',
  'winter-circuit',
  'summer-circuit',
  'fall-eastern-afghanistan',
  'spring-afghanistan-tour',
  'buzkashi-expedition',
  'signature-afghan-tour',
] as const;

export type PrimaryScheduledSlug = (typeof PRIMARY_SCHEDULED_SLUGS)[number];

export function isPrimaryScheduledSlug(slug: string): boolean {
  return (PRIMARY_SCHEDULED_SLUGS as readonly string[]).includes(slug);
}

/** Order tours with primary set first (existing data only), then remaining scheduled. */
export function orderScheduledTours<T extends { slug: string }>(tours: T[]): T[] {
  const primary = PRIMARY_SCHEDULED_SLUGS.map((slug) => tours.find((t) => t.slug === slug)).filter(
    (t): t is T => Boolean(t),
  );
  const rest = tours.filter((t) => !isPrimaryScheduledSlug(t.slug));
  const seen = new Set<string>();
  const out: T[] = [];
  for (const t of [...primary, ...rest]) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
  }
  return out;
}
