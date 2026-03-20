import type { RouteMatrixRow } from '../types/data.js';
import type { RouteLeg } from '../engine/types.js';
import { readCsv } from './readCsv.js';

/**
 * Conservative baseline speed (km/h) used to derive drive minutes from distance
 * when the CSV already provides drive_hours_high we use that directly.
 * This helper is kept here so it can be tuned independently.
 */
export function distanceToMinutes(distanceKm: number): number {
  // ~45 km/h baseline for Afghanistan mountain/highway mixed terrain
  return Math.round((distanceKm / 45) * 60);
}

export function loadRouteMatrix(): RouteLeg[] {
  const rows = readCsv<RouteMatrixRow>('route_matrix.csv');
  return rows.map((r): RouteLeg => {
    const distanceKm = parseFloat(r.distance_km) || 0;
    // Use the high (conservative) drive hours if available; else derive from distance
    const driveHoursHigh = parseFloat(r.drive_hours_high);
    const driveMinutes = isNaN(driveHoursHigh)
      ? distanceToMinutes(distanceKm)
      : Math.round(driveHoursHigh * 60);

    return {
      from: r.from_code.trim(),
      to: r.to_code.trim(),
      distanceKm,
      driveMinutes,
      roadClass: r.road_class ?? '',
      notes: r.notes ?? '',
    };
  });
}
