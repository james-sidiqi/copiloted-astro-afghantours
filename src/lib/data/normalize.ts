const PLACEHOLDER_VALUES = new Set(['tbd', 'undefined', 'null', 'n/a', '-']);

export function cleanText(value: string | null | undefined): string {
  const normalized = (value ?? '').trim();
  if (!normalized) return '';
  if (PLACEHOLDER_VALUES.has(normalized.toLowerCase())) return '';
  return normalized;
}

export function normalizeAssetPath(path: string | null | undefined): string {
  const cleaned = cleanText(path);
  if (!cleaned) return '';
  if (cleaned.startsWith('/')) return cleaned;
  if (cleaned.startsWith('assets/')) return `/${cleaned}`;
  return cleaned;
}
