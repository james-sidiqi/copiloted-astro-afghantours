import type { Attraction } from '../types/view-models.js';
import type { RouteLeg, Stop } from './types.js';
import { loadAttractions } from '../data/loadAttractions.js';
import { loadRouteMatrix } from '../data/loadRouteMatrix.js';

/**
 * Maps an attraction's province_code to the nearest route-matrix node code.
 *
 * The route matrix uses city/hub codes (KBL, MAZ, BMY, etc.) while attractions
 * use standard Afghan province codes. Many smaller provinces are mapped to the
 * nearest major hub city that has route-matrix coverage.
 *
 * Mapping criteria:
 * - Provinces with a same-named major city match directly (KBL, BMY, GHZ, HER, KDR).
 * - Balkh (BAL) → Mazar-i-Sharif (MAZ), the provincial capital.
 * - Badakhshan (BDK) → Faizabad (FAI), the provincial capital.
 * - Nangarhar (NGH) → Jalalabad (JBD), the provincial capital.
 * - Outlying provinces route to the nearest hub with reasonable road access.
 * - Source: Afghan road network knowledge; see route_matrix.csv for coverage.
 *
 * Extendable: add new province codes here as route matrix coverage grows.
 */
const PROVINCE_TO_ROUTE_NODE: Record<string, string> = {
  // Direct city-province matches
  KBL: 'KBL', // Kabul
  BMY: 'BMY', // Bamyan
  GHZ: 'GHZ', // Ghazni
  HER: 'HER', // Herat
  KDR: 'KDR', // Kandahar (province code matches route node)
  // Province → nearest major hub
  BAL: 'MAZ', // Balkh → Mazar-i-Sharif
  BDK: 'FAI', // Badakhshan → Faizabad
  NGH: 'JBD', // Nangarhar → Jalalabad
  // Northern hub satellites
  SAM: 'MAZ', // Samangan → Mazar
  JOW: 'MAZ', // Jowzjan → Mazar
  FAR: 'MAZ', // Faryab → Mazar (nearest northern hub)
  KDZ: 'MAZ', // Kunduz → Mazar
  BAG: 'MAZ', // Baghlan → Mazar (via northern corridor)
  TKH: 'FAI', // Takhar → Faizabad
  // Eastern/Kabul satellites
  PJR: 'KBL', // Panjshir → Kabul
  KPS: 'KBL', // Kapisa → Kabul
  PRW: 'KBL', // Parwan → Kabul
  LGM: 'KBL', // Logar → Kabul
  WRD: 'KBL', // Wardak → Kabul (midpoint Kabul–Bamyan)
  LGR: 'JBD', // Laghman → Jalalabad
  KNR: 'JBD', // Kunar → Jalalabad
  NRS: 'JBD', // Nuristan → Jalalabad
  KHT: 'JBD', // Khost → Jalalabad (rough southern-east approximation)
  // Southern satellites
  HLM: 'KDR', // Helmand → Kandahar
  NIM: 'KDR', // Nimroz → Kandahar
  ZBL: 'KDR', // Zabul → Kandahar
  URZ: 'KDR', // Uruzgan → Kandahar
  PTK: 'KDR', // Paktika → Kandahar (rough)
  // Western satellites
  FRA: 'HER', // Farah → Herat
  BDG: 'HER', // Badghis → Herat
  // Central satellites
  GHO: 'BMY', // Ghor → Bamyan (rough central)
  DYK: 'BMY', // Daykundi → Bamyan
};

/**
 * Visit duration in minutes by attraction category.
 * Used when planning day timings.
 */
export const CATEGORY_VISIT_MINUTES: Record<string, number> = {
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

/** Resolve a province code to the nearest route-matrix node. Falls back to the code itself. */
export function provinceToRouteNode(provinceCode: string): string {
  return PROVINCE_TO_ROUTE_NODE[provinceCode] ?? provinceCode;
}

/** Convert an Attraction view-model into an engine Stop. */
function attractionToStop(attr: Attraction): Stop {
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

/**
 * Find a path between two route-matrix nodes using BFS.
 * Returns the sequence of legs to traverse, or null if no path exists.
 * This handles indirect routes that require passing through hub cities (e.g., BMY → KBL → MAZ).
 */
function findPath(from: string, to: string, legMap: Map<string, RouteLeg>): RouteLeg[] | null {
  if (from === to) return [];

  // Build adjacency from all available legs
  const adjacency = new Map<string, string[]>();
  for (const [key] of legMap) {
    const [f, t] = key.split('→');
    if (!adjacency.has(f)) adjacency.set(f, []);
    adjacency.get(f)!.push(t);
  }

  // BFS
  const visited = new Set<string>();
  const queue: Array<{ node: string; path: RouteLeg[] }> = [{ node: from, path: [] }];
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

  return null; // no path found
}

export interface RouteBuilderResult {
  stops: Stop[];
  legs: RouteLeg[];
  totalDistanceKm: number;
}

/**
 * Build a route from an ordered list of attraction codes.
 *
 * Steps:
 * 1. Resolve each code to an Attraction → Stop.
 * 2. Map each Stop's provinceCode to a route-matrix node.
 * 3. Look up the route leg between consecutive distinct nodes.
 * 4. Return stops, legs, and total distance.
 *
 * Throws meaningful errors on unknown attraction codes or missing route legs.
 */
export function buildRoute(
  attractionCodes: string[],
  attractionsOverride?: Attraction[],
  routeLegsOverride?: RouteLeg[]
): RouteBuilderResult {
  if (attractionCodes.length === 0) {
    throw new Error('buildRoute: attractionCodes must not be empty');
  }

  const allAttractions = attractionsOverride ?? loadAttractions();
  const allLegs = routeLegsOverride ?? loadRouteMatrix();

  const attractionByCode = new Map(allAttractions.map((a) => [a.attractionCode, a]));
  const legKey = (from: string, to: string) => `${from}→${to}`;
  const legByKey = new Map(allLegs.map((l) => [legKey(l.from, l.to), l]));

  // Resolve all attraction codes to Stops
  const stops: Stop[] = attractionCodes.map((code) => {
    const attr = attractionByCode.get(code);
    if (!attr) {
      throw new Error(`buildRoute: unknown attraction code "${code}"`);
    }
    return attractionToStop(attr);
  });

  // Build ordered node sequence (deduplicate consecutive same-node entries)
  const nodeSequence: string[] = [];
  for (const stop of stops) {
    const node = provinceToRouteNode(stop.provinceCode);
    if (nodeSequence.length === 0 || nodeSequence[nodeSequence.length - 1] !== node) {
      nodeSequence.push(node);
    }
  }

  // Look up legs between consecutive distinct nodes (supports multi-hop via BFS)
  const legs: RouteLeg[] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < nodeSequence.length - 1; i++) {
    const from = nodeSequence[i];
    const to = nodeSequence[i + 1];
    if (from === to) continue;

    const pathLegs = findPath(from, to, legByKey);
    if (!pathLegs) {
      throw new Error(
        `buildRoute: no route path found from "${from}" to "${to}" ` +
          `(even via intermediate nodes). ` +
          `Check route_matrix.csv coverage or the province→node mapping.`
      );
    }
    for (const leg of pathLegs) {
      legs.push(leg);
      totalDistanceKm += leg.distanceKm;
    }
  }

  return { stops, legs, totalDistanceKm };
}
