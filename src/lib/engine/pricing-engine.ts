import type { PlannedDay, PricingInput, PricingBreakdown, VehicleType, HotelTier } from './types.js';

// ─── Baseline rate tables ─────────────────────────────────────────────────────

const VEHICLE_DAILY_RATE: Record<VehicleType, number> = {
  sedan: 80,
  prado: 120,
  hiace: 180,
  coaster: 300,
};

const HOTEL_NIGHTLY_RATE: Record<HotelTier, number> = {
  budget: 40,
  comfort: 80,
  premium: 140,
};

const GUIDE_DAILY_RATE = 30;    // local guide per day
const MEAL_PER_PAX_PER_DAY = 15;
const MARKUP_RATE = 0.20; // 20% commercial markup — standard for Afghan ground-ops packages

// ─── Fuel logic (isolated for easy replacement) ───────────────────────────────

/**
 * Estimate fuel cost from total distance.
 * Baseline: Toyota Land Cruiser (Prado) at ~12 L/100km, diesel ~1.20 USD/L.
 * Kept modular — swap formula here without touching other pricing logic.
 */
export function estimateFuelCost(distanceKm: number): number {
  const litresPer100km = 12;
  const fuelPricePerLitre = 1.20;
  return (distanceKm / 100) * litresPer100km * fuelPricePerLitre;
}

// ─── Rounding helper ──────────────────────────────────────────────────────────

/** Round to nearest 50 USD. */
export function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

// ─── Hotel night count ────────────────────────────────────────────────────────

/**
 * Count how many hotel nights are needed.
 * Each day in the itinerary ends at an overnight location except the final day.
 */
function countHotelNights(days: PlannedDay[]): number {
  // Every day except the last requires a hotel night
  return Math.max(0, days.length - 1);
}

// ─── Main pricing function ────────────────────────────────────────────────────

/**
 * Calculate a structured pricing breakdown for a planned itinerary.
 *
 * All costs are in USD. Returns subtotal before markup, markup amount,
 * rounded total, and per-pax price.
 */
export function calculatePricing(input: PricingInput): PricingBreakdown {
  const { days, groupSize, hotelTier, vehicleType, totalDistanceKm } = input;

  const totalDays = days.length;
  const hotelNights = countHotelNights(days);
  const pax = Math.max(1, groupSize);

  const vehicleRate = VEHICLE_DAILY_RATE[vehicleType] ?? VEHICLE_DAILY_RATE['prado'];
  const hotelRate = HOTEL_NIGHTLY_RATE[hotelTier] ?? HOTEL_NIGHTLY_RATE['comfort'];

  // Transport: vehicle daily rate × number of days
  const vehicleCost = vehicleRate * totalDays;

  // Hotel: nightly rate × hotel nights (per room; assumes 1 room baseline — scale separately for groups)
  const hotelCost = hotelRate * hotelNights;

  // Guide: local guide daily rate × total days
  const guideCost = GUIDE_DAILY_RATE * totalDays;

  // Meals: per person per day × group size × total days
  const mealCost = MEAL_PER_PAX_PER_DAY * pax * totalDays;

  // Fuel: derived from total route distance
  const fuelCost = estimateFuelCost(totalDistanceKm);

  const subtotal = vehicleCost + hotelCost + guideCost + mealCost + fuelCost;
  const markup = subtotal * MARKUP_RATE;
  const rawTotal = subtotal + markup;
  const total = roundToNearest50(rawTotal);
  const perPax = Math.round(total / pax);

  return {
    vehicleCost: Math.round(vehicleCost),
    hotelCost: Math.round(hotelCost),
    guideCost: Math.round(guideCost),
    mealCost: Math.round(mealCost),
    fuelCost: Math.round(fuelCost),
    subtotal: Math.round(subtotal),
    markup: Math.round(markup),
    total,
    perPax,
  };
}
