import type {
  SiteData,
  Tour,
  Province,
  Region,
  Attraction,
  ItineraryDay,
  InclusionDay,
  TourDate,
  HotelProperty,
  HubAttractionAccess,
  Faq,
} from '../types/view-models.js';
import type {
  ItineraryRow,
  InclusionRow,
  TourDateRow,
  TourAttractionMapRow,
  FaqRow,
  HotelPropertyRow,
  HubAttractionAccessRow,
} from '../types/data.js';
import { readCsv } from './readCsv.js';
import { loadAttractions } from './loadAttractions.js';
import { loadTours } from './loadTours.js';
import { loadProvinces } from './loadProvinces.js';
import { loadRegions } from './loadRegions.js';
import { loadLocations } from './loadLocations.js';
import { loadDishes } from './loadDishes.js';
import { loadGroundTransport } from './loadGroundTransport.js';
import { cleanText, normalizeAssetPath } from './normalize.js';

function splitCodes(raw: string): string[] {
  if (!raw) return [];
  return raw.split(/[;,|]/).map((s) => s.trim()).filter(Boolean);
}

function loadItinerary(): ItineraryDay[] {
  const rows = readCsv<ItineraryRow>('tour_itinerary.csv');
  return rows.map((r) => ({
    tourCode: r.tour_code,
    dayNumber: parseInt(r.day_number, 10) || 0,
    title: cleanText(r.title),
    location: cleanText(r.location),
    description: cleanText(r.description),
    flightId: cleanText(r.flight_id),
    driveTimeNotes: cleanText(r.drive_time_notes),
    attractionCodes: splitCodes(r.attraction_codes),
    attractions: [], // enriched later in buildSiteData()
  }));
}

function loadInclusions(): InclusionDay[] {
  const rows = readCsv<InclusionRow>('tour_inclusions.csv');
  return rows.map((r) => ({
    tourCode: r.tour_code,
    dayNumber: parseInt(r.day_number, 10) || 0,
    title: cleanText(r.title),
    location: cleanText(r.location),
    description: cleanText(r.description),
    flightId: cleanText(r.flight_id),
    driveTimeNotes: cleanText(r.drive_time_notes),
    attractionCodes: splitCodes(r.attraction_codes),
  }));
}

function loadTourDates(): TourDate[] {
  const rows = readCsv<TourDateRow>('tour_dates.csv');
  return rows.map((r) => ({
    tourCode: r.tour_code,
    tourSlug: r.tour_slug,
    dateStart: r.date_start,
    dateEnd: r.date_end,
    status: cleanText(r.status),
    notes: cleanText(r.notes),
  }));
}

function loadFaqs(): Faq[] {
  const rows = readCsv<FaqRow>('faq.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      faqId: r.faq_id,
      pageAssignment: cleanText(r.page_assignment),
      category: cleanText(r.category),
      tourSlug: cleanText(r.tour_slug),
      question: cleanText(r.question),
      answer: cleanText(r.answer),
      isActive: true,
    }));
}

function loadHotels(): HotelProperty[] {
  const rows = readCsv<HotelPropertyRow>('hotel_properties.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      hotelId: cleanText(r.hotel_id || r.Hotel_id || ''),
      hotelSlug: cleanText(r.hotel_slug),
      hotelName: cleanText(r.hotel_name),
      destinationsCode: cleanText(r.destination_code || r.destinations_code || ''),
      tier: cleanText(r.tier),
      starRating: parseFloat(r.star_rating) || 0,
      perNightPriceFrom: parseFloat(r.per_night_price_from) || 0,
      description: cleanText(r.description),
      imagePaths: [r.image_path_property_1, r.image_path_property_2, r.image_path_property_3]
        .map((path) => normalizeAssetPath(path))
        .filter(Boolean),
      isActive: true,
    }));
}

function loadHubAccess(): HubAttractionAccess[] {
  const rows = readCsv<HubAttractionAccessRow>('hub_to_attraction_access.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      baseLocationCode: cleanText(r.base_location_code),
      attractionCode: cleanText(r.attraction_code),
      transportMode: cleanText(r.transport_mode),
      nominalMinutes: parseInt(r.nominal_minutes, 10) || 0,
      planningMinutes: parseInt(r.planning_minutes, 10) || 0,
      accessType: cleanText(r.access_type),
      roadCondition: cleanText(r.road_condition),
      notes: cleanText(r.notes),
      isActive: true,
    }));
}

export function buildSiteData(): SiteData {
  // Load raw data
  const attractions = loadAttractions();
  const tourBases = loadTours();
  const provincesBases = loadProvinces();
  const regionBases = loadRegions();
  const locations = loadLocations();
  const dishes = loadDishes();
  const faqs = loadFaqs();
  const hotels = loadHotels();
  const transports = loadGroundTransport();
  const hubAccess = loadHubAccess();

  const itineraryRows = loadItinerary();
  const inclusionRows = loadInclusions();
  const tourDates = loadTourDates();
  const tourAttractionMapRows = readCsv<TourAttractionMapRow>('tour_attractions_map.csv');

  // Index attractions by code for fast lookup
  const attractionByCode = new Map<string, Attraction>(
    attractions.map((a) => [a.attractionCode, a])
  );

  // Build tour attractions map: tourCode → Set<attractionCode>
  const tourAttractionCodes = new Map<string, Set<string>>();
  // Build tour+day attractions map: `${tourCode}:${dayNumber}` → Set<attractionCode>
  const tourDayAttractionCodes = new Map<string, Set<string>>();
  for (const row of tourAttractionMapRows) {
    if (!row.attraction_code) continue;
    let set = tourAttractionCodes.get(row.tour_code);
    if (!set) {
      set = new Set();
      tourAttractionCodes.set(row.tour_code, set);
    }
    set.add(row.attraction_code);

    const dayKey = `${row.tour_code}:${row.day_number}`;
    let daySet = tourDayAttractionCodes.get(dayKey);
    if (!daySet) {
      daySet = new Set();
      tourDayAttractionCodes.set(dayKey, daySet);
    }
    daySet.add(row.attraction_code);
  }

  // Build itinerary map: tourCode → ItineraryDay[] (with resolved attractions)
  const itineraryByTour = new Map<string, ItineraryDay[]>();
  for (const day of itineraryRows) {
    const dayKey = `${day.tourCode}:${day.dayNumber}`;
    const mapCodes = tourDayAttractionCodes.get(dayKey) ?? new Set<string>();
    const allCodes = new Set([...day.attractionCodes, ...mapCodes]);
    const dayAttractions = Array.from(allCodes)
      .map((c) => attractionByCode.get(c))
      .filter((a): a is Attraction => a !== undefined);
    const enrichedDay: ItineraryDay = { ...day, attractions: dayAttractions };

    let arr = itineraryByTour.get(day.tourCode);
    if (!arr) {
      arr = [];
      itineraryByTour.set(day.tourCode, arr);
    }
    arr.push(enrichedDay);
  }

  // Build inclusions map: tourCode → InclusionDay[]
  const inclusionsByTour = new Map<string, InclusionDay[]>();
  for (const day of inclusionRows) {
    let arr = inclusionsByTour.get(day.tourCode);
    if (!arr) {
      arr = [];
      inclusionsByTour.set(day.tourCode, arr);
    }
    arr.push(day);
  }

  // Build dates map: tourCode → TourDate[]
  const datesByTour = new Map<string, TourDate[]>();
  for (const date of tourDates) {
    let arr = datesByTour.get(date.tourCode);
    if (!arr) {
      arr = [];
      datesByTour.set(date.tourCode, arr);
    }
    arr.push(date);
  }

  // Assemble full Tour objects
  const tours: Tour[] = tourBases.map((base) => {
    const codes = tourAttractionCodes.get(base.tourCode) ?? new Set();
    const tourAttractions = Array.from(codes)
      .map((c) => attractionByCode.get(c))
      .filter((a): a is Attraction => a !== undefined);

    return {
      ...base,
      itinerary: (itineraryByTour.get(base.tourCode) ?? []).sort((a, b) => a.dayNumber - b.dayNumber),
      inclusions: (inclusionsByTour.get(base.tourCode) ?? []).sort((a, b) => a.dayNumber - b.dayNumber),
      dates: datesByTour.get(base.tourCode) ?? [],
      attractions: tourAttractions,
    };
  });

  // Assemble Province objects with relations
  const provinces: Province[] = provincesBases.map((base) => {
    const provinceAttractions = attractions.filter(
      (a) => a.provinceCode === base.provinceCode
    );
    const provinceTours = tours.filter((t) =>
      t.provinces.some(
        (p) => p.toLowerCase() === base.provinceName.toLowerCase() ||
               p.toLowerCase() === base.provinceSlug.toLowerCase()
      )
    );
    return { ...base, attractions: provinceAttractions, tours: provinceTours };
  });

  // Assemble Region objects with relations
  const regions: Region[] = regionBases.map((base) => {
    const regionProvinces = provinces.filter(
      (p) => p.region.toUpperCase() === base.regionCode.toUpperCase()
    );
    const regionAttractions = attractions.filter(
      (a) => a.region.toUpperCase() === base.regionCode.toUpperCase()
    );
    return { ...base, provinces: regionProvinces, attractions: regionAttractions };
  });

  return { tours, attractions, provinces, regions, locations, dishes, faqs, hotels, transports, hubAccess };
}
