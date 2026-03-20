/**
 * Public entry point for the itinerary/time/pricing engine.
 *
 * Import this in API endpoints, scripts, or other server-side code.
 * Do not import this in static Astro page frontmatter that runs at build time
 * without a server environment — use the individual loaders instead.
 */
export { runItineraryEngine } from './itinerary-engine.js';
export type {
  ItineraryEngineOptions,
} from './itinerary-engine.js';
export type {
  Stop,
  RouteLeg,
  DayType,
  PlannedDay,
  PricingInput,
  PricingBreakdown,
  ItineraryResult,
  ItineraryRequest,
  HotelTier,
  VehicleType,
} from './types.js';
