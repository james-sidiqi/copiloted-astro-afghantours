import { r as readCsv, l as loadAttractions } from '../../chunks/loadAttractions_VegsSK9G.mjs';
export { renderers } from '../../renderers.mjs';

function distanceToMinutes(distanceKm) {
  return Math.round(distanceKm / 45 * 60);
}
function loadRouteMatrix() {
  const rows = readCsv("route_matrix.csv");
  return rows.map((r) => {
    const distanceKm = parseFloat(r.distance_km) || 0;
    const driveHoursHigh = parseFloat(r.drive_hours_high);
    const driveMinutes = isNaN(driveHoursHigh) ? distanceToMinutes(distanceKm) : Math.round(driveHoursHigh * 60);
    return {
      from: r.from_code.trim(),
      to: r.to_code.trim(),
      distanceKm,
      driveMinutes,
      roadClass: r.road_class ?? "",
      notes: r.notes ?? ""
    };
  });
}

const PROVINCE_TO_ROUTE_NODE = {
  // Direct city-province matches
  KBL: "KBL",
  // Kabul
  BMY: "BMY",
  // Bamyan
  GHZ: "GHZ",
  // Ghazni
  HER: "HER",
  // Herat
  KDR: "KDR",
  // Kandahar (province code matches route node)
  // Province → nearest major hub
  BAL: "MAZ",
  // Balkh → Mazar-i-Sharif
  BDK: "FAI",
  // Badakhshan → Faizabad
  NGH: "JBD",
  // Nangarhar → Jalalabad
  // Northern hub satellites
  SAM: "MAZ",
  // Samangan → Mazar
  JOW: "MAZ",
  // Jowzjan → Mazar
  FAR: "MAZ",
  // Faryab → Mazar (nearest northern hub)
  KDZ: "MAZ",
  // Kunduz → Mazar
  BAG: "MAZ",
  // Baghlan → Mazar (via northern corridor)
  TKH: "FAI",
  // Takhar → Faizabad
  // Eastern/Kabul satellites
  PJR: "KBL",
  // Panjshir → Kabul
  KPS: "KBL",
  // Kapisa → Kabul
  PRW: "KBL",
  // Parwan → Kabul
  LGM: "KBL",
  // Logar → Kabul
  WRD: "KBL",
  // Wardak → Kabul (midpoint Kabul–Bamyan)
  LGR: "JBD",
  // Laghman → Jalalabad
  KNR: "JBD",
  // Kunar → Jalalabad
  NRS: "JBD",
  // Nuristan → Jalalabad
  KHT: "JBD",
  // Khost → Jalalabad (rough southern-east approximation)
  // Southern satellites
  HLM: "KDR",
  // Helmand → Kandahar
  NIM: "KDR",
  // Nimroz → Kandahar
  ZBL: "KDR",
  // Zabul → Kandahar
  URZ: "KDR",
  // Uruzgan → Kandahar
  PTK: "KDR",
  // Paktika → Kandahar (rough)
  // Western satellites
  FRA: "HER",
  // Farah → Herat
  BDG: "HER",
  // Badghis → Herat
  // Central satellites
  GHO: "BMY",
  // Ghor → Bamyan (rough central)
  DYK: "BMY"
  // Daykundi → Bamyan
};
const CATEGORY_VISIT_MINUTES = {
  Landmark: 90,
  Museum: 120,
  Nature: 60,
  "Nature & Adventure": 60,
  Market: 120,
  Religious: 60,
  Rural: 60,
  Heritage: 90,
  Cultural: 90,
  Default: 60
};
function provinceToRouteNode(provinceCode) {
  return PROVINCE_TO_ROUTE_NODE[provinceCode] ?? provinceCode;
}
function attractionToStop(attr) {
  const visitMinutes = CATEGORY_VISIT_MINUTES[attr.category] ?? CATEGORY_VISIT_MINUTES["Default"];
  return {
    code: attr.attractionCode,
    name: attr.name,
    category: attr.category,
    province: attr.province,
    provinceCode: attr.provinceCode,
    visitMinutes
  };
}
function findPath(from, to, legMap) {
  if (from === to) return [];
  const adjacency = /* @__PURE__ */ new Map();
  for (const [key] of legMap) {
    const [f, t] = key.split("→");
    if (!adjacency.has(f)) adjacency.set(f, []);
    adjacency.get(f).push(t);
  }
  const visited = /* @__PURE__ */ new Set();
  const queue = [{ node: from, path: [] }];
  visited.add(from);
  while (queue.length > 0) {
    const { node, path } = queue.shift();
    const neighbours = adjacency.get(node) ?? [];
    for (const next of neighbours) {
      if (visited.has(next)) continue;
      const leg = legMap.get(`${node}→${next}`);
      const newPath = [...path, leg];
      if (next === to) return newPath;
      visited.add(next);
      queue.push({ node: next, path: newPath });
    }
  }
  return null;
}
function buildRoute(attractionCodes, attractionsOverride, routeLegsOverride) {
  if (attractionCodes.length === 0) {
    throw new Error("buildRoute: attractionCodes must not be empty");
  }
  const allAttractions = attractionsOverride ?? loadAttractions();
  const allLegs = routeLegsOverride ?? loadRouteMatrix();
  const attractionByCode = new Map(allAttractions.map((a) => [a.attractionCode, a]));
  const legKey = (from, to) => `${from}→${to}`;
  const legByKey = new Map(allLegs.map((l) => [legKey(l.from, l.to), l]));
  const stops = attractionCodes.map((code) => {
    const attr = attractionByCode.get(code);
    if (!attr) {
      throw new Error(`buildRoute: unknown attraction code "${code}"`);
    }
    return attractionToStop(attr);
  });
  const nodeSequence = [];
  for (const stop of stops) {
    const node = provinceToRouteNode(stop.provinceCode);
    if (nodeSequence.length === 0 || nodeSequence[nodeSequence.length - 1] !== node) {
      nodeSequence.push(node);
    }
  }
  const legs = [];
  let totalDistanceKm = 0;
  for (let i = 0; i < nodeSequence.length - 1; i++) {
    const from = nodeSequence[i];
    const to = nodeSequence[i + 1];
    if (from === to) continue;
    const pathLegs = findPath(from, to, legByKey);
    if (!pathLegs) {
      throw new Error(
        `buildRoute: no route path found from "${from}" to "${to}" (even via intermediate nodes). Check route_matrix.csv coverage or the province→node mapping.`
      );
    }
    for (const leg of pathLegs) {
      legs.push(leg);
      totalDistanceKm += leg.distanceKm;
    }
  }
  return { stops, legs, totalDistanceKm };
}

const TOURING_DAY_MAX = 8.5 * 60;
const TRANSIT_DAY_MAX = 11 * 60;
const TRANSIT_DRIVE_TARGET = 9 * 60;
const LUNCH_MINUTES = 60;
const LUNCH_TRIGGER = 4 * 60;
const BUFFER_PER_STOP = 15;
const TRANSIT_QUICK_STOP_MAX = 45;
const TRANSIT_HEAVY_CATEGORIES = /* @__PURE__ */ new Set(["Museum", "Market"]);
function clampTransitVisit(stop) {
  if (TRANSIT_HEAVY_CATEGORIES.has(stop.category)) {
    return 0;
  }
  return Math.min(stop.visitMinutes, TRANSIT_QUICK_STOP_MAX);
}
function classifyDayType(driveMinutes) {
  return driveMinutes >= TRANSIT_DRIVE_TARGET ? "transit" : "touring";
}
function dayLimit(type) {
  return type === "transit" ? TRANSIT_DAY_MAX : TOURING_DAY_MAX;
}
function newDay(dayNumber, origin) {
  return {
    dayNumber,
    type: "touring",
    origin,
    stops: [],
    driveMinutes: 0,
    visitMinutes: 0,
    lunchMinutes: 0,
    bufferMinutes: 0,
    totalMinutes: 0,
    overnight: origin
  };
}
function computeTotal(day) {
  return day.driveMinutes + day.visitMinutes + day.lunchMinutes + day.bufferMinutes;
}
function tryApplyLunch(day) {
  if (day.lunchMinutes === 0 && day.totalMinutes >= LUNCH_TRIGGER) {
    day.lunchMinutes = LUNCH_MINUTES;
    day.totalMinutes += LUNCH_MINUTES;
  }
}
function planDays(input) {
  const { stops, legs } = input;
  if (stops.length === 0) {
    return [];
  }
  const days = [];
  const legMap = /* @__PURE__ */ new Map();
  for (const leg of legs) {
    legMap.set(`${leg.from}→${leg.to}`, leg);
  }
  let currentNode = provinceToRouteNode(stops[0].provinceCode);
  let currentDay = newDay(1, currentNode);
  for (const stop of stops) {
    const stopNode = provinceToRouteNode(stop.provinceCode);
    const needsDrive = stopNode !== currentNode;
    const leg = needsDrive ? legMap.get(`${currentNode}→${stopNode}`) : void 0;
    const legDriveMinutes = leg ? leg.driveMinutes : 0;
    const provisionalType = classifyDayType(currentDay.driveMinutes + legDriveMinutes);
    const visitTime = provisionalType === "transit" ? clampTransitVisit(stop) : stop.visitMinutes;
    if (provisionalType === "transit" && visitTime === 0) {
      if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
        days.push(currentDay);
        currentDay = newDay(days.length + 1, currentNode);
      }
      const freshVisit = stop.visitMinutes;
      const freshBuffer = BUFFER_PER_STOP;
      currentDay.stops.push(stop);
      currentDay.visitMinutes += freshVisit;
      currentDay.bufferMinutes += freshBuffer;
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
    const tentativeLunch = currentDay.lunchMinutes === 0 && currentDay.totalMinutes + addedDrive + addedVisit + addedBuffer >= LUNCH_TRIGGER ? LUNCH_MINUTES : 0;
    const tentativeTotal = currentDay.totalMinutes + addedDrive + addedVisit + addedBuffer + tentativeLunch;
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
      const newVisit = newType === "transit" ? clampTransitVisit(stop) : stop.visitMinutes;
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
  });
  return days;
}

const VEHICLE_DAILY_RATE = {
  sedan: 80,
  prado: 120,
  hiace: 180,
  coaster: 300
};
const HOTEL_NIGHTLY_RATE = {
  budget: 40,
  comfort: 80,
  premium: 140
};
const GUIDE_DAILY_RATE = 30;
const MEAL_PER_PAX_PER_DAY = 15;
const MARKUP_RATE = 0.2;
function estimateFuelCost(distanceKm) {
  const litresPer100km = 12;
  const fuelPricePerLitre = 1.2;
  return distanceKm / 100 * litresPer100km * fuelPricePerLitre;
}
function roundToNearest50(value) {
  return Math.round(value / 50) * 50;
}
function countHotelNights(days) {
  return Math.max(0, days.length - 1);
}
function calculatePricing(input) {
  const { days, groupSize, hotelTier, vehicleType, totalDistanceKm } = input;
  const totalDays = days.length;
  const hotelNights = countHotelNights(days);
  const pax = Math.max(1, groupSize);
  const vehicleRate = VEHICLE_DAILY_RATE[vehicleType] ?? VEHICLE_DAILY_RATE["prado"];
  const hotelRate = HOTEL_NIGHTLY_RATE[hotelTier] ?? HOTEL_NIGHTLY_RATE["comfort"];
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
    perPax
  };
}

function runItineraryEngine(options) {
  const { attractions, groupSize, hotelTier, vehicleType } = options;
  if (!attractions || attractions.length === 0) {
    throw new Error("runItineraryEngine: at least one attraction code is required");
  }
  if (groupSize < 1) {
    throw new Error("runItineraryEngine: groupSize must be at least 1");
  }
  const allAttractions = options.attractionsOverride ?? loadAttractions();
  const allLegs = options.routeLegsOverride ?? loadRouteMatrix();
  const { stops, legs, totalDistanceKm } = buildRoute(
    attractions,
    allAttractions,
    allLegs
  );
  const days = planDays({ stops, legs });
  if (days.length === 0) {
    throw new Error("runItineraryEngine: time engine returned no days");
  }
  const pricingInput = {
    days,
    groupSize,
    hotelTier,
    vehicleType,
    totalDistanceKm
  };
  const pricing = calculatePricing(pricingInput);
  const touringDays = days.filter((d) => d.type === "touring").length;
  const transitDays = days.filter((d) => d.type === "transit").length;
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
      totalAttractions
    }
  };
}

const prerender = false;
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const req = body;
  if (!Array.isArray(req.attractions) || req.attractions.length === 0) {
    return new Response(
      JSON.stringify({ error: '"attractions" must be a non-empty array of attraction codes' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (typeof req.groupSize !== "number" || req.groupSize < 1) {
    return new Response(
      JSON.stringify({ error: '"groupSize" must be a positive integer' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const validHotelTiers = ["budget", "comfort", "premium"];
  if (!req.hotelTier || !validHotelTiers.includes(req.hotelTier)) {
    return new Response(
      JSON.stringify({ error: `"hotelTier" must be one of: ${validHotelTiers.join(", ")}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const validVehicleTypes = ["sedan", "prado", "hiace", "coaster"];
  if (!req.vehicleType || !validVehicleTypes.includes(req.vehicleType)) {
    return new Response(
      JSON.stringify({ error: `"vehicleType" must be one of: ${validVehicleTypes.join(", ")}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const result = runItineraryEngine({
      attractions: req.attractions,
      groupSize: req.groupSize,
      hotelTier: req.hotelTier,
      vehicleType: req.vehicleType
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
