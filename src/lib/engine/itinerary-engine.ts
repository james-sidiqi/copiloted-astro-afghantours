import type { Attraction } from '../types/view-models.js';
import type { RouteLeg, ItineraryResult, PricingInput, HotelTier, VehicleType } from './types.js';
import { loadAttractions } from '../data/loadAttractions.js';
import { loadRouteMatrix } from '../data/loadRouteMatrix.js';
import { buildRoute } from './route-builder.js';
import { planDays } from './time-engine.js';
import { calculatePricing } from './pricing-engine.js';

export interface ItineraryEngineOptions {
  attractions: string[];    // ordered attraction_code list
  groupSize: number;
  hotelTier: HotelTier;
  vehicleType: VehicleType;
  // Optional overrides for testing without CSV I/O
  attractionsOverride?: Attraction[];
  routeLegsOverride?: RouteLeg[];
}

/**
 * Orchestrator: loads data, builds the route, plans days, calculates pricing,
 * and returns a complete ItineraryResult.
 *
 * This is the single public entry point for the engine.
 * All sub-functions are pure and can be tested independently.
 */
export function runItineraryEngine(options: ItineraryEngineOptions): ItineraryResult {
  const { attractions, groupSize, hotelTier, vehicleType } = options;

  if (!attractions || attractions.length === 0) {
    throw new Error('runItineraryEngine: at least one attraction code is required');
  }
  if (groupSize < 1) {
    throw new Error('runItineraryEngine: groupSize must be at least 1');
  }

  // 1. Load CSV data (or use injected overrides for tests)
  const allAttractions = options.attractionsOverride ?? loadAttractions();
  const allLegs = options.routeLegsOverride ?? loadRouteMatrix();

  // 2. Build route: resolves codes → stops + route legs
  const { stops, legs, totalDistanceKm } = buildRoute(
    attractions,
    allAttractions,
    allLegs
  );

  // 3. Plan days using the time engine
  const days = planDays({ stops, legs });

  if (days.length === 0) {
    throw new Error('runItineraryEngine: time engine returned no days');
  }

  // 4. Calculate pricing
  const pricingInput: PricingInput = {
    days,
    groupSize,
    hotelTier,
    vehicleType,
    totalDistanceKm,
  };
  const pricing = calculatePricing(pricingInput);

  // 5. Build summary
  const touringDays = days.filter((d) => d.type === 'touring').length;
  const transitDays = days.filter((d) => d.type === 'transit').length;
  const overnights = Math.max(0, days.length - 1);
  const totalAttractions = days.reduce((n, d) => n + d.stops.length, 0);

  return {
    days,
    pricing,
    summary: {
      totalDays: days.length,
      touringDays,
      transitDays,
      overnights,
      totalDistanceKm: Math.round(totalDistanceKm),
      totalAttractions,
    },
  };
}
