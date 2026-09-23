export interface Attraction {
  attractionCode: string;
  name: string;
  slug: string;
  province: string;
  provinceCode: string;
  region: string;
  category: string;
  descShort: string;
  descLong: string;
  tags: string[];
  latitude: number;
  longitude: number;
  thumbnailPath: string;
  imagePath: string;
  svgPath: string;
  locationCode?: string;
  priority: number;
  isActive: boolean;
}

export interface ItineraryDay {
  tourCode: string;
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  flightId: string;
  driveTimeNotes: string;
  attractionCodes: string[];
  attractions: Attraction[];
}

export interface InclusionDay {
  tourCode: string;
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  flightId: string;
  driveTimeNotes: string;
  attractionCodes: string[];
}

export interface TourDate {
  tourCode: string;
  tourSlug: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  notes: string;
}

export interface Tour {
  tourCode: string;
  name: string;
  slug: string;
  summary: string;
  thumbnailImagePath: string;
  heroImagePath: string;
  imageSlide1: string;
  imageSlide2: string;
  priceFrom: number;
  durationDays: number;
  groupSize: string;
  travelStyle: string;
  activityLevel: string;
  regions: string[];
  provinces: string[];
  primaryLocationSlug: string;
  accommodationNote: string;
  transportNote: string;
  season: string;
  isFeatured: boolean;
  isActive: boolean;
  /** scheduled | private-fixed — itinerary-based tours only */
  productClass: 'scheduled' | 'private-fixed';
  // Relations
  itinerary: ItineraryDay[];
  inclusions: InclusionDay[];
  dates: TourDate[];
  attractions: Attraction[];
}

export interface Province {
  provinceCode: string;
  provinceName: string;
  provinceSlug: string;
  region: string;
  shortBlurb: string;
  fullBlurb: string;
  centerLat: number;
  centerLon: number;
  coverImagePath: string;
  squareImagePath: string;
  svgMapPath: string;
  isFeatured: boolean;
  featureRank: number;
  // Relations
  attractions: Attraction[];
  tours: Tour[];
}

export interface Region {
  regionCode: string;
  regionName: string;
  parentCode: string;
  regionSlug: string;
  description: string;
  imgPath: string;
  isActive: boolean;
  sortOrder: number;
  // Relations
  provinces: Province[];
  attractions: Attraction[];
}

export interface Location {
  locationCode: string;
  name: string;
  type: string;
  parentCode: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  isHub: boolean;
  isSecondary: boolean;
  hasAirport: boolean;
}

export interface Dish {
  dishCode: string;
  name: string;
  slug: string;
  regionCode: string;
  provinceCode: string;
  destinationCode: string;
  category: string;
  mealType: string;
  isProduce: boolean;
  seasonStart: number;
  seasonEnd: number;
  descShort: string;
  imagePath: string;
  tags: string[];
  isActive: boolean;
}

export interface Faq {
  faqId: string;
  pageAssignment: string;
  category: string;
  tourSlug: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
  relatedLinks: string[];
  imagePath: string;
  verificationNote: string;
  sourceRef: string;
}

export interface HotelRoom {
  roomId: string;
  roomType: string;
  maxOccupancy: number;
  nightlyCostUsd: number;
  nightlySellPriceUsd: number;
  description: string;
  imagePaths: string[];
  isActive: boolean;
}

export interface HotelProperty {
  hotelId: string;
  hotelSlug: string;
  hotelName: string;
  destinationsCode: string;
  tier: string;
  starRating: number;
  perNightPriceFrom: number;
  description: string;
  imagePaths: string[];
  isActive: boolean;
}

export interface TransportOption {
  transportId: string;
  transportName: string;
  transportSlug: string;
  tier: string;
  vehicleType: string;
  minPax: number;
  maxPax: number;
  routeGroupId: string;
  logicNotes: string;
  isActive: boolean;
}

export interface HubAttractionAccess {
  baseLocationCode: string;
  attractionCode: string;
  transportMode: string;
  nominalMinutes: number;
  planningMinutes: number;
  accessType: string;
  roadCondition: string;
  notes: string;
  isActive: boolean;
}

export interface MapStop {
  stopNumber: number;
  dayNumber: number;
  attractionCode: string;
  name: string;
  lat: number;
  lng: number;
  province: string;
  category: string;
  descShort: string;
  slug: string;
}


export type ProductClass = 'scheduled' | 'private-fixed';

/** Specialist logistics — MUST NOT carry durationDays / priceFrom / itinerary / dates */
export interface SpecialistService {
  serviceCode: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  audience: string;
  serviceType: string;
  regionsSupported: string[];
  planningNotes: string;
  accommodationNote: string;
  transportNote: string;
  supportNote: string;
  availabilityNote: string;
  imagePath: string;
  heroImagePath: string;
  ctaLabel: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface ReturnJourney {
  journeyCode: string;
  name: string;
  slug: string;
  audience: string;
  summary: string;
  description: string;
  examplesOfSupport: string;
  possibleRegions: string[];
  planningNotes: string;
  accommodationNote: string;
  transportNote: string;
  availabilityNote: string;
  heroImagePath: string;
  imagePath: string;
  ctaLabel: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CustomJourney {
  journeyCode: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  audience: string;
  heroImagePath: string;
  imagePath: string;
  ctaLabel: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface SiteData {
  tours: Tour[];
  specialistServices: SpecialistService[];
  returnJourneys: ReturnJourney[];
  customJourneys: CustomJourney[];
  attractions: Attraction[];
  provinces: Province[];
  regions: Region[];
  locations: Location[];
  dishes: Dish[];
  faqs: Faq[];
  hotels: HotelProperty[];
  transports: TransportOption[];
  hubAccess: HubAttractionAccess[];
}
