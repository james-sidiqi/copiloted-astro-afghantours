import type { APIRoute } from 'astro';
import { runItineraryEngine } from '@lib/engine/run-engine.js';
import type { ItineraryRequest } from '@lib/engine/run-engine.js';

export const prerender = false;

/**
 * POST /api/itinerary
 *
 * Accepts a JSON body with:
 * {
 *   "attractions": ["KBL-001", "BMY-001", "BAL-001"],
 *   "groupSize": 2,
 *   "hotelTier": "comfort",
 *   "vehicleType": "prado"
 * }
 *
 * Returns a full ItineraryResult including planned days and pricing breakdown.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate required fields
  const req = body as Partial<ItineraryRequest>;

  if (!Array.isArray(req.attractions) || req.attractions.length === 0) {
    return new Response(
      JSON.stringify({ error: '"attractions" must be a non-empty array of attraction codes' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (typeof req.groupSize !== 'number' || req.groupSize < 1) {
    return new Response(
      JSON.stringify({ error: '"groupSize" must be a positive integer' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validHotelTiers = ['budget', 'comfort', 'premium'] as const;
  if (!req.hotelTier || !validHotelTiers.includes(req.hotelTier as typeof validHotelTiers[number])) {
    return new Response(
      JSON.stringify({ error: `"hotelTier" must be one of: ${validHotelTiers.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validVehicleTypes = ['sedan', 'prado', 'hiace', 'coaster'] as const;
  if (!req.vehicleType || !validVehicleTypes.includes(req.vehicleType as typeof validVehicleTypes[number])) {
    return new Response(
      JSON.stringify({ error: `"vehicleType" must be one of: ${validVehicleTypes.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const result = runItineraryEngine({
      attractions: req.attractions,
      groupSize: req.groupSize,
      hotelTier: req.hotelTier,
      vehicleType: req.vehicleType,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
