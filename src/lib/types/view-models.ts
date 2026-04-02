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
  priority: number;
  isActive: boolean;
  locationCode: string;
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
  imageSlide3: string;
  priceFrom: number;
  durationDays: number;
  groupSize: string;
  travelStyle: string;
  activityLevel: string;
  regions: string[];
  provinces: string[];
  accommodationNote: string;
  transportNote: string;
  season: string;
  isFeatured: boolean;
  isActive: boolean;
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

export interface SiteData {
  tours: Tour[];
  attractions: Attraction[];
  provinces: Province[];
  regions: Region[];
  locations: Location[];
  dishes: Dish[];
  faqs: Faq[];
  hotels: HotelProperty[];
}
