/**
 * Helpers for linking informational content to Scheduled tours (not Custom).
 * Explore pages should pass strict=true so unrelated tours are never forced.
 */
import type { Tour } from "../types/view-models.js";
import { isCustomTravelStyle } from "./customAudiences.js";

export function scheduledToursOnly(tours: Tour[]): Tour[] {
  return tours.filter((t) => t.isActive && (t.productClass === 'scheduled' || t.productClass === 'private-fixed'));
}

export function sortScheduled(tours: Tour[]): Tour[] {
  return [...tours].sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
  );
}

export function relatedScheduledByProvinceNames(
  tours: Tour[],
  provinceNames: string[],
  limit = 3,
  options?: { strict?: boolean },
): Tour[] {
  const strict = options?.strict !== false; // default strict for explore safety
  const names = new Set(
    provinceNames.map((n) => n.trim().toLowerCase()).filter(Boolean),
  );
  if (!names.size) return strict ? [] : sortScheduled(scheduledToursOnly(tours)).slice(0, limit);
  const matched = scheduledToursOnly(tours).filter((t) =>
    t.provinces.some((p) => names.has(p.trim().toLowerCase())),
  );
  if (matched.length > 0) return sortScheduled(matched).slice(0, limit);
  return strict ? [] : sortScheduled(scheduledToursOnly(tours)).slice(0, limit);
}

export function relatedScheduledByAttractionCode(
  tours: Tour[],
  attractionCode: string,
  provinceName: string,
  limit = 3,
): Tour[] {
  const byAttraction = scheduledToursOnly(tours).filter(
    (t) =>
      t.attractions.some((a) => a.attractionCode === attractionCode) ||
      t.itinerary.some((d) => d.attractionCodes.includes(attractionCode)),
  );
  if (byAttraction.length > 0) return sortScheduled(byAttraction).slice(0, limit);
  // Province fallback only when the attraction itself is linked in data — still strict to that province
  return relatedScheduledByProvinceNames(tours, provinceName ? [provinceName] : [], limit, {
    strict: true,
  });
}

export function relatedScheduledByHubSlug(
  tours: Tour[],
  hubSlug: string,
  provinceName: string,
  limit = 3,
): Tour[] {
  const byHub = scheduledToursOnly(tours).filter((t) => t.primaryLocationSlug === hubSlug);
  if (byHub.length > 0) return sortScheduled(byHub).slice(0, limit);
  return relatedScheduledByProvinceNames(tours, provinceName ? [provinceName] : [], limit, {
    strict: true,
  });
}
