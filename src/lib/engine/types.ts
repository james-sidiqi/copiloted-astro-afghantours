/**
 * Engine-specific TypeScript types for the itinerary, time, and pricing engine.
 * These are distinct from the site view-models and represent the planning domain.
 */

/** Day type: Touring = attraction-focused; Transit = movement-focused */
export type DayType = 'touring' | 'transit';

/** Hotel quality tier */
export type HotelTier = 'budget' | 'comfort' | 'premium';

/** Vehicle type for ground transport */
export type VehicleType = 'sedan' | 'prado' | 'hiace' | 'coaster';

/**
 * A resolved attraction stop used by the engine.
 * Derived from the attractions_master.csv via the loadAttractions loader.
 */
export interface Stop {
  code: string;        // attraction_code e.g. "KBL-001"
  name: string;
  category: string;
  province: string;
  provinceCode: string;  // e.g. "KBL", "BMY", "BAL"
  visitMinutes: number;  // computed from category mapping
}

/**
 * A route leg between two route-matrix nodes.
 * Derived from route_matrix.csv.
 */
export interface RouteLeg {
  from: string;          // from_code e.g. "KBL"
  to: string;            // to_code e.g. "BMY"
  distanceKm: number;
  driveMinutes: number;  // derived from drive_hours_high * 60 (conservative)
  roadClass: string;
  notes: string;
}

/**
 * A planned itinerary day produced by the time engine.
 */
export interface PlannedDay {
  dayNumber: number;
  type: DayType;
  origin: string;        // route-matrix node code for start of day
  stops: Stop[];
  driveMinutes: number;  // total driving time this day
  visitMinutes: number;  // total attraction visit time
  lunchMinutes: number;  // 0 or 60
  bufferMinutes: number; // 15 min per stop
  totalMinutes: number;  // drive + visit + lunch + buffer
  overnight: string;     // route-matrix node code where night is spent
}

/**
 * Input to the pricing engine.
 */
export interface PricingInput {
  days: PlannedDay[];
  groupSize: number;
  hotelTier: HotelTier;
  vehicleType: VehicleType;
  totalDistanceKm: number;
}

/**
 * Structured pricing breakdown returned by the pricing engine.
 */
export interface PricingBreakdown {
  vehicleCost: number;
  hotelCost: number;
  guideCost: number;
  mealCost: number;
  fuelCost: number;
  subtotal: number;
  markup: number;
  total: number;          // rounded to nearest 50 USD
  perPax: number;         // total / groupSize
}

/**
 * The final result returned by the itinerary engine.
 */
export interface ItineraryResult {
  days: PlannedDay[];
  pricing: PricingBreakdown;
  summary: {
    totalDays: number;
    touringDays: number;
    transitDays: number;
    overnights: number;
    totalDistanceKm: number;
    totalAttractions: number;
  };
}

/**
 * Request body shape expected by the API endpoint.
 */
export interface ItineraryRequest {
  attractions: string[];   // ordered list of attraction_code values
  groupSize: number;
  hotelTier: HotelTier;
  vehicleType: VehicleType;
}
