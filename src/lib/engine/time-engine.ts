import type { Stop, RouteLeg, PlannedDay, DayType } from './types.js';
import { provinceToRouteNode } from './route-builder.js';

// ─── Time constants (minutes) ────────────────────────────────────────────────

const TOURING_DAY_MAX = 8.5 * 60;  // 510 min  (~17:30 target end)
const TRANSIT_DAY_MAX = 11 * 60;   // 660 min
const TRANSIT_DRIVE_TARGET = 9 * 60; // 540 min — preferred max driving on transit day
const LUNCH_MINUTES = 60;
const LUNCH_TRIGGER = 4 * 60;      // apply lunch once day reaches 4 h activity
const BUFFER_PER_STOP = 15;

// Quick-stop cap on transit days (minutes per stop)
const TRANSIT_QUICK_STOP_MAX = 45;

// Heavy categories not suitable for transit days
const TRANSIT_HEAVY_CATEGORIES = new Set(['Museum', 'Market']);

// ─── Internal helpers ─────────────────────────────────────────────────────────


function clampTransitVisit(stop: Stop): number {
  if (TRANSIT_HEAVY_CATEGORIES.has(stop.category)) {
    return 0; // skip heavy attractions on transit days
  }
  return Math.min(stop.visitMinutes, TRANSIT_QUICK_STOP_MAX);
}

/** Decide day type based on cumulative drive minutes for the day so far. */
function classifyDayType(driveMinutes: number): DayType {
  return driveMinutes >= TRANSIT_DRIVE_TARGET ? 'transit' : 'touring';
}

function dayLimit(type: DayType): number {
  return type === 'transit' ? TRANSIT_DAY_MAX : TOURING_DAY_MAX;
}

/** Create a fresh empty day accumulator. */
function newDay(dayNumber: number, origin: string): PlannedDay {
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
  };
}

function computeTotal(day: PlannedDay): number {
  return (
    day.driveMinutes + day.visitMinutes + day.lunchMinutes + day.bufferMinutes
  );
}

function tryApplyLunch(day: PlannedDay): void {
  if (day.lunchMinutes === 0 && day.totalMinutes >= LUNCH_TRIGGER) {
    day.lunchMinutes = LUNCH_MINUTES;
    day.totalMinutes += LUNCH_MINUTES;
  }
}

// ─── Main planner ─────────────────────────────────────────────────────────────

export interface PlannerInput {
  stops: Stop[];
  legs: RouteLeg[];
}

/**
 * Plan day-by-day itinerary from an ordered list of stops and the route legs
 * connecting their nodes.
 *
 * Algorithm:
 * 1. Maintain a current day accumulator.
 * 2. For each stop:
 *    a. Determine whether we need to move (drive leg) before visiting.
 *    b. Check if adding the leg + stop exceeds the current day's limit.
 *    c. If it fits → add to current day.
 *    d. If it doesn't fit → close the current day and open a new one.
 *    e. Re-attempt placing the stop on the new day.
 * 3. Handle transit vs touring classification dynamically.
 */
export function planDays(input: PlannerInput): PlannedDay[] {
  const { stops, legs } = input;

  if (stops.length === 0) {
    return [];
  }

  const days: PlannedDay[] = [];

  // Build a lookup: (fromNode, toNode) → RouteLeg
  const legMap = new Map<string, RouteLeg>();
  for (const leg of legs) {
    legMap.set(`${leg.from}→${leg.to}`, leg);
  }

  // Track current route-matrix node position
  let currentNode = provinceToRouteNode(stops[0].provinceCode);
  let currentDay = newDay(1, currentNode);

  for (const stop of stops) {
    const stopNode = provinceToRouteNode(stop.provinceCode);
    const needsDrive = stopNode !== currentNode;

    // Find the leg for this move (if any)
    const leg = needsDrive ? legMap.get(`${currentNode}→${stopNode}`) : undefined;
    const legDriveMinutes = leg ? leg.driveMinutes : 0;

    // On a transit day, clamp visit time; on touring day, use full visit time
    // We don't know the type yet until we account for drive; use a provisional type
    const provisionalType = classifyDayType(currentDay.driveMinutes + legDriveMinutes);
    const visitTime =
      provisionalType === 'transit'
        ? clampTransitVisit(stop)
        : stop.visitMinutes;

    // Skip heavy attractions that would be zero minutes on a transit day
    if (provisionalType === 'transit' && visitTime === 0) {
      // Force an overnight and carry stop to next day instead
      if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
        days.push(currentDay);
        currentDay = newDay(days.length + 1, currentNode);
      }
      // Re-evaluate on the fresh day (no drive needed within same node,
      // but stop needs a full touring day)
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

    // Tentative new day total (include possible lunch)
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
      // Fits on current day
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
      // Doesn't fit → close current day, start a new one
      if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
        days.push(currentDay);
      }
      currentDay = newDay(days.length + 1, currentNode);

      // If we need to drive, the new day is primarily a transit day
      if (needsDrive && leg) {
        currentDay.driveMinutes += leg.driveMinutes;
        currentDay.totalMinutes = computeTotal(currentDay);
        currentDay.type = classifyDayType(currentDay.driveMinutes);
        currentDay.overnight = stopNode;
        currentNode = stopNode;
      }

      // Re-evaluate visit for the new day type
      const newType = classifyDayType(currentDay.driveMinutes);
      const newVisit =
        newType === 'transit' ? clampTransitVisit(stop) : stop.visitMinutes;

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
        // Heavy stop that can't fit on transit day → push another day for it
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

  // Push the final day
  if (currentDay.stops.length > 0 || currentDay.driveMinutes > 0) {
    days.push(currentDay);
  }

  // Renumber days sequentially (in case of push/re-open logic above)
  days.forEach((d, i) => {
    d.dayNumber = i + 1;
  });

  return days;
}
