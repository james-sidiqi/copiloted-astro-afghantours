/**
 * client-engine.ts
 *
 * Browser-safe itinerary engine — zero Node.js or filesystem dependencies.
 * All CSV-derived data is injected as parameters; this file may be bundled
 * for the browser by Astro/Vite without any polyfills.
 *
 * The algorithm is equivalent to the server-side engine but operates on
 * pre-serialised JSON payloads rather than on-demand CSV reads.
 */

// ─── Minimal types (mirror engine/types.ts — no import to avoid Node side-effects) ───

export type DayType = 'touring' | 'transit';
export type HotelTier = 'budget' | 'comfort' | 'premium';
export type VehicleType = 'sedan' | 'prado' | 'hiace' | 'coaster';

export interface ClientStop {
  code: string;
  name: string;
  category: string;
  province: string;
  provinceCode: string;
  visitMinutes: number;
}

export interface ClientRouteLeg {
  from: string;
  to: string;
  distanceKm: number;
  driveMinutes: number;
  roadClass: string;
  notes: string;
}

export interface ClientPlannedDay {
  dayNumber: number;
  type: DayType;
  origin: string;
  stops: ClientStop[];
  driveMinutes: number;
  visitMinutes: number;
  lunchMinutes: number;
  bufferMinutes: number;
  totalMinutes: number;
  overnight: string;
  overnightName: string; // human-readable hub name
}

export interface ClientPricingBreakdown {
  vehicleCost: number;
  hotelCost: number;
  guideCost: number;
  mealCost: number;
  fuelCost: number;
  subtotal: number;
  markup: number;
  total: number;
  perPax: number;
}

export interface ClientItineraryResult {
  days: ClientPlannedDay[];
  pricing: ClientPricingBreakdown;
  summary: {
    totalDays: number;
    touringDays: number;
    transitDays: number;
    overnights: number;
    totalDistanceKm: number;
    totalAttractions: number;
  };
}

// ─── Injected data shapes ─────────────────────────────────────────────────────

/** Minimal attraction record needed by the engine (a subset of Attraction view-model). */
export interface ClientAttraction {
  attractionCode: string;
  name: string;
  category: string;
  province: string;
  provinceCode: string;
  region: string;
}

/** Location record for hub name lookup. */
export interface ClientLocation {
  locationCode: string;
  name: string;
  isHub: boolean;
}

/** Hotel rate averaged per tier, derived from hotel_properties.csv at build time. */
export interface ClientHotelRates {
  budget: number;
  comfort: number;
  premium: number;
}

/** All data the engine needs, pre-serialised from CSVs at build time. */
export interface ClientData {
  attractions: ClientAttraction[];
  routeMatrix: ClientRouteLeg[];
  locations: ClientLocation[];
  hotelNightlyRates: ClientHotelRates;
}

// ─── Engine options ───────────────────────────────────────────────────────────

export interface ClientEngineOptions {
  attractionCodes: string[];
  groupSize: number;
  hotelTier: HotelTier;
  vehicleType: VehicleType;
}

export type ClientEngineResult =
  | { ok: true; result: ClientItineraryResult }
  | { ok: false; reason: string };

// ─── Province → route-matrix node mapping (mirrors route-builder.ts) ─────────

const PROVINCE_TO_ROUTE_NODE: Record<string, string> = {
  // Direct city-province matches
  KBL: 'KBLC',
  BMY: 'BMYC',
  GHZ: 'GHZC',
  HER: 'HERC',
  KDR: 'KDRC',
  // Province → nearest major hub
  BAL: 'MAZC', // Balkh → Mazar-i-Sharif
  BDK: 'FAIC', // Badakhshan → Faizabad
  NGH: 'JBDC', // Nangarhar → Jalalabad
  // Northern hub satellites
  SAM: 'MAZC',
  JOW: 'MAZC',
  FAR: 'MAZC',
  KDZ: 'MAZC',
  BAG: 'MAZC',
  TKH: 'FAIC',
  // Eastern/Kabul satellites
  PJR: 'KBLC',
  KPS: 'KBLC',
  PRW: 'KBLC',
  LGM: 'KBLC',
  WRD: 'KBLC',
  LGR: 'JBDC',
  KNR: 'JBDC',
  NRS: 'JBDC',
  KHT: 'JBDC',
  // Southern satellites
  HLM: 'KDRC',
  NIM: 'KDRC',
  ZBL: 'KDRC',
  URZ: 'KDRC',
  PTK: 'KDRC',
  // Western satellites
  FRA: 'HERC',
  BDG: 'HERC',
  // Central satellites
  GHO: 'BMYC',
  DYK: 'BMYC',
};

function provinceToRouteNode(provinceCode: string): string {
  return PROVINCE_TO_ROUTE_NODE[provinceCode] ?? provinceCode;
}

// ─── Visit duration by category (mirrors route-builder.ts) ───────────────────

const CATEGORY_VISIT_MINUTES: Record<string, number> = {
  Landmark: 90,
  Museum: 120,
  Nature: 60,
  'Nature & Adventure': 60,
  Market: 120,
  Religious: 60,
  Rural: 60,
  Heritage: 90,
  Cultural: 90,
  Default: 60,
};

// ─── Route builder (pure) ─────────────────────────────────────────────────────

function attractionToStop(attr: ClientAttraction): ClientStop {
  const visitMinutes =
    CATEGORY_VISIT_MINUTES[attr.category] ?? CATEGORY_VISIT_MINUTES['Default'];
  return {
    code: attr.attractionCode,
    name: attr.name,
    category: attr.category,
    province: attr.province,
    provinceCode: attr.provinceCode,
    visitMinutes,
  };
}

function findPath(
  from: string,
  to: string,
  legMap: Map<string, ClientRouteLeg>
): ClientRouteLeg[] | null {
  if (from === to) return [];

  const adjacency = new Map<string, string[]>();
  for (const [key] of legMap) {
    const [f, t] = key.split('→');
    if (!adjacency.has(f)) adjacency.set(f, []);
    adjacency.get(f)!.push(t);
  }

  const visited = new Set<string>();
  const queue: Array<{ node: string; path: ClientRouteLeg[] }> = [
    { node: from, path: [] },
  ];
  visited.add(from);

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    const neighbours = adjacency.get(node) ?? [];
    for (const next of neighbours) {
      if (visited.has(next)) continue;
      const leg = legMap.get(`${node}→${next}`)!;
      const newPath = [...path, leg];
      if (next === to) return newPath;
      visited.add(next);
      queue.push({ node: next, path: newPath });
    }
  }

  return null;
}

interface RouteBuilderResult {
  stops: ClientStop[];
  legs: ClientRouteLeg[];
  totalDistanceKm: number;
}

function buildRoute(
  attractionCodes: string[],
  attractions: ClientAttraction[],
  routeLegs: ClientRouteLeg[]
): RouteBuilderResult {
  if (attractionCodes.length === 0) {
    throw new Error('At least one attraction must be selected.');
  }

  const attractionByCode = new Map(attractions.map((a) => [a.attractionCode, a]));
  const legByKey = new Map(routeLegs.map((l) => [`${l.from}→${l.to}`, l]));

  const stops: ClientStop[] = attractionCodes.map((code) => {
    const attr = attractionByCode.get(code);
    if (!attr) throw new Error(`Unknown attraction: "${code}"`);
    return attractionToStop(attr);
  });

  // Deduplicate consecutive same-node entries
  const nodeSequence: string[] = [];
  for (const stop of stops) {
    const node = provinceToRouteNode(stop.provinceCode);
    if (nodeSequence.length === 0 || nodeSequence[nodeSequence.length - 1] !== node) {
      nodeSequence.push(node);
    }
  }

  const legs: ClientRouteLeg[] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < nodeSequence.length - 1; i++) {
    const from = nodeSequence[i];
    const to = nodeSequence[i + 1];
    if (from === to) continue;

    const pathLegs = findPath(from, to, legByKey);
    if (!pathLegs) {
      throw new Error(
        `No route found between "${from}" and "${to}". ` +
          `This combination may require a custom quote.`
      );
    }
    for (const leg of pathLegs) {
      legs.push(leg);
      totalDistanceKm += leg.distanceKm;
    }
  }

  return { stops, legs, totalDistanceKm };
}

// ─── Time engine (mirrors time-engine.ts) ────────────────────────────────────

const TOURING_DAY_MAX = 8.5 * 60;
const TRANSIT_DAY_MAX = 11 * 60;
const TRANSIT_DRIVE_TARGET = 9 * 60;
const LUNCH_MINUTES = 60;
const LUNCH_TRIGGER = 4 * 60;
const BUFFER_PER_STOP = 15;
const TRANSIT_QUICK_STOP_MAX = 45;
const TRANSIT_HEAVY_CATEGORIES = new Set(['Museum', 'Market']);

function clampTransitVisit(stop: ClientStop): number {
  if (TRANSIT_HEAVY_CATEGORIES.has(stop.category)) return 0;
  return Math.min(stop.visitMinutes, TRANSIT_QUICK_STOP_MAX);
}

function classifyDayType(driveMinutes: number): DayType {
  return driveMinutes >= TRANSIT_DRIVE_TARGET ? 'transit' : 'touring';
}

function dayLimit(type: DayType): number {
  return type === 'transit' ? TRANSIT_DAY_MAX : TOURING_DAY_MAX;
}

function newDay(dayNumber: number, origin: string): ClientPlannedDay {
  return {
    dayNumber,
    type: 'touring',
    origin,
    stops: [],
    driveMinutes: 0,
    visitMinutes: 0,
    lunchMinutes: 0,
    bufferMinutes: 0,
    totalMinutes: 0,
    overnight: origin,
    overnightName: origin,
  };
}

function computeTotal(day: ClientPlannedDay): number {
  return day.driveMinutes + day.visitMinutes + day.lunchMinutes + day.bufferMinutes;
}

function tryApplyLunch(day: ClientPlannedDay): void {
  if (day.lunchMinutes === 0 && day.totalMinutes >= LUNCH_TRIGGER) {
    day.lunchMinutes = LUNCH_MINUTES;
    day.totalMinutes += LUNCH_MINUTES;
  }
}

function planDays(
  stops: ClientStop[],
  legs: ClientRouteLeg[],
  locationNameMap: Map<string, string>
): ClientPlannedDay[] {
  if (stops.length === 0) return [];

  const days: ClientPlannedDay[] = [];
  const legMap = new Map<string, ClientRouteLeg>();
  for (const leg of legs) legMap.set(`${leg.from}→${leg.to}`, leg);

  let currentNode = provinceToRouteNode(stops[0].provinceCode);
  let currentDay = newDay(1, currentNode);

  for (const stop of stops) {
    const stopNode = provinceToRouteNode(stop.provinceCode);
    const needsDrive = stopNode !== currentNode;
    const leg = needsDrive ? legMap.get(`${currentNode}→${stopNode}`) : undefined;
    const legDriveMinutes = leg ? leg.driveMinutes : 0;

    const provisionalType = classifyDayType(currentDay.driveMinutes + legDriveMinutes);
    const visitTime =
      provisionalType === 'transit' ? clampTransitVisit(stop) : stop.visitMinutes;

    if (provisionalType === 'transit' && visitTime === 0) {
      if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
        days.push(currentDay);
        currentDay = newDay(days.length + 1, currentNode);
      }
      currentDay.stops.push(stop);
      currentDay.visitMinutes += stop.visitMinutes;
      currentDay.bufferMinutes += BUFFER_PER_STOP;
      currentDay.totalMinutes = computeTotal(currentDay);
      tryApplyLunch(currentDay);
      currentDay.totalMinutes = computeTotal(currentDay);
      currentDay.type = classifyDayType(currentDay.driveMinutes);
      currentDay.overnight = stopNode;
      currentNode = stopNode;
      continue;
    }

    const addedDrive = needsDrive ? legDriveMinutes : 0;
    const addedVisit = visitTime;
    const addedBuffer = BUFFER_PER_STOP;
    const tentativeLunch =
      currentDay.lunchMinutes === 0 &&
      currentDay.totalMinutes + addedDrive + addedVisit + addedBuffer >= LUNCH_TRIGGER
        ? LUNCH_MINUTES
        : 0;
    const tentativeTotal =
      currentDay.totalMinutes + addedDrive + addedVisit + addedBuffer + tentativeLunch;
    const tentativeType = classifyDayType(currentDay.driveMinutes + addedDrive);
    const limit = dayLimit(tentativeType);

    if (tentativeTotal <= limit) {
      currentDay.driveMinutes += addedDrive;
      currentDay.visitMinutes += addedVisit;
      currentDay.bufferMinutes += addedBuffer;
      currentDay.totalMinutes = computeTotal(currentDay);
      tryApplyLunch(currentDay);
      currentDay.totalMinutes = computeTotal(currentDay);
      currentDay.type = classifyDayType(currentDay.driveMinutes);
      currentDay.stops.push(stop);
      currentDay.overnight = stopNode;
      currentNode = stopNode;
    } else {
      if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
        days.push(currentDay);
      }
      currentDay = newDay(days.length + 1, currentNode);

      if (needsDrive && leg) {
        currentDay.driveMinutes += leg.driveMinutes;
        currentDay.totalMinutes = computeTotal(currentDay);
        currentDay.type = classifyDayType(currentDay.driveMinutes);
        currentDay.overnight = stopNode;
        currentNode = stopNode;
      }

      const newType = classifyDayType(currentDay.driveMinutes);
      const newVisit = newType === 'transit' ? clampTransitVisit(stop) : stop.visitMinutes;

      if (newVisit > 0) {
        currentDay.visitMinutes += newVisit;
        currentDay.bufferMinutes += BUFFER_PER_STOP;
        currentDay.totalMinutes = computeTotal(currentDay);
        tryApplyLunch(currentDay);
        currentDay.totalMinutes = computeTotal(currentDay);
        currentDay.type = classifyDayType(currentDay.driveMinutes);
        currentDay.stops.push(stop);
        currentDay.overnight = stopNode;
        currentNode = stopNode;
      } else {
        days.push(currentDay);
        currentDay = newDay(days.length + 1, stopNode);
        currentDay.stops.push(stop);
        currentDay.visitMinutes += stop.visitMinutes;
        currentDay.bufferMinutes += BUFFER_PER_STOP;
        currentDay.totalMinutes = computeTotal(currentDay);
        tryApplyLunch(currentDay);
        currentDay.totalMinutes = computeTotal(currentDay);
        currentDay.overnight = stopNode;
        currentNode = stopNode;
      }
    }
  }

  if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
    days.push(currentDay);
  }

  days.forEach((d, i) => {
    d.dayNumber = i + 1;
    d.overnightName = locationNameMap.get(d.overnight) ?? d.overnight;
  });

  return days;
}

// ─── Pricing engine (mirrors pricing-engine.ts, uses injected rates) ─────────

const DEFAULT_VEHICLE_DAILY_RATE: Record<VehicleType, number> = {
  sedan: 80,
  prado: 120,
  hiace: 180,
  coaster: 300,
};

const DEFAULT_HOTEL_NIGHTLY_RATE: ClientHotelRates = {
  budget: 40,
  comfort: 80,
  premium: 140,
};

const GUIDE_DAILY_RATE = 30;
const MEAL_PER_PAX_PER_DAY = 15;
const MARKUP_RATE = 0.2;

function estimateFuelCost(distanceKm: number): number {
  return (distanceKm / 100) * 12 * 1.2;
}

function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

function calculatePricing(
  days: ClientPlannedDay[],
  groupSize: number,
  hotelTier: HotelTier,
  vehicleType: VehicleType,
  totalDistanceKm: number,
  hotelNightlyRates: ClientHotelRates
): ClientPricingBreakdown {
  const totalDays = days.length;
  const hotelNights = Math.max(0, totalDays - 1);
  const pax = Math.max(1, groupSize);

  const vehicleRate = DEFAULT_VEHICLE_DAILY_RATE[vehicleType] ?? DEFAULT_VEHICLE_DAILY_RATE['prado'];
  const hotelRate = hotelNightlyRates[hotelTier] ?? DEFAULT_HOTEL_NIGHTLY_RATE[hotelTier] ?? 80;

  const vehicleCost = vehicleRate * totalDays;
  const hotelCost = hotelRate * hotelNights;
  const guideCost = GUIDE_DAILY_RATE * totalDays;
  const mealCost = MEAL_PER_PAX_PER_DAY * pax * totalDays;
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

// ─── Public entry point ───────────────────────────────────────────────────────

/**
 * Run the itinerary engine entirely in the browser.
 *
 * Returns { ok: true, result } on success, or { ok: false, reason } when
 * the route logic or pricing cannot be resolved confidently — the caller
 * should surface "Custom Quote Required" in that case.
 */
export function runClientEngine(
  data: ClientData,
  options: ClientEngineOptions
): ClientEngineResult {
  try {
    const { attractionCodes, groupSize, hotelTier, vehicleType } = options;

    if (!attractionCodes || attractionCodes.length === 0) {
      return { ok: false, reason: 'Please select at least one attraction.' };
    }
    if (groupSize < 1) {
      return { ok: false, reason: 'Group size must be at least 1.' };
    }

    // Build a hub name lookup
    const locationNameMap = new Map<string, string>(
      data.locations.map((l) => [l.locationCode, l.name])
    );

    // Build route
    const { stops, legs, totalDistanceKm } = buildRoute(
      attractionCodes,
      data.attractions,
      data.routeMatrix
    );

    // Plan days
    const days = planDays(stops, legs, locationNameMap);
    if (days.length === 0) {
      return { ok: false, reason: 'Could not build an itinerary from the selected attractions.' };
    }

    // Calculate pricing
    const pricing = calculatePricing(
      days,
      groupSize,
      hotelTier,
      vehicleType,
      totalDistanceKm,
      data.hotelNightlyRates
    );

    const touringDays = days.filter((d) => d.type === 'touring').length;
    const transitDays = days.filter((d) => d.type === 'transit').length;

    return {
      ok: true,
      result: {
        days,
        pricing,
        summary: {
          totalDays: days.length,
          touringDays,
          transitDays,
          overnights: Math.max(0, days.length - 1),
          totalDistanceKm: Math.round(totalDistanceKm),
          totalAttractions: days.reduce((n, d) => n + d.stops.length, 0),
        },
      },
    };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}
