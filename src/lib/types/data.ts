/** Raw CSV row interfaces — all fields are strings as parsed from CSV */

export interface AttractionRow {
  attraction_code: string;
  name: string;
  slug: string;
  province: string;
  province_code: string;
  region: string;
  category: string;
  desc_short: string;
  desc_long: string;
  tags: string;
  latitude: string;
  longitude: string;
  thumbnail_path: string;
  image_path: string;
  svg_path: string;
  priority: string;
  is_active: string;
  location_code: string;
}

export interface TourRow {
  tour_code: string;
  name: string;
  slug: string;
  summary: string;
  thumbnail_image_path: string;
  hero_image_path: string;
  image_path_slide1: string;
  image_path_slide2: string;
  image_path_slide3?: string;
  price_from: string;
  duration_days: string;
  group_size: string;
  travel_style: string;
  physical_activity_level: string;
  regions: string;
  provinces: string;
  accommodation_note: string;
  transport_note: string;
  'price_from.1': string;
  'duration_days.1': string;
  min_group_size: string;
  max_group_size: string;
  'travel_style.1': string;
  activity_level: string;
  primary_location_slug: string;
  'accommodation_note.1': string;
  'transport_note.1': string;
  season: string;
  is_featured: string;
  is_active: string;
}

export interface ItineraryRow {
  tour_code: string;
  tour_slug: string;
  day_number: string;
  title: string;
  location: string;
  description: string;
  flight_id: string;
  drive_time_notes: string;
  attraction_codes: string;
}

export interface InclusionRow {
  tour_code: string;
  tour_slug: string;
  day_number: string;
  title: string;
  location: string;
  description: string;
  flight_id: string;
  drive_time_notes: string;
  attraction_codes: string;
}

export interface TourDateRow {
  tour_code: string;
  tour_slug: string;
  date_start: string;
  date_end: string;
  status: string;
  notes: string;
}

export interface TourAttractionMapRow {
  tour_code: string;
  tour_slug: string;
  day_number: string;
  attraction_code: string;
}

export interface ProvinceRow {
  province_code: string;
  province_name: string;
  province_slug: string;
  region: string;
  short_blurb: string;
  full_blurb: string;
  center_lat: string;
  center_lon: string;
  cover_image_path: string;
  square_image_path: string;
  svg_map_path: string;
  is_featured: string;
  feature_rank: string;
}

export interface RegionRow {
  region_code: string;
  region_name: string;
  parent_code: string;
  region_slug: string;
  description: string;
  img_path: string;
  is_active: string;
  sort_order: string;
}

export interface LocationRow {
  location_code: string;
  name: string;
  type: string;
  parent_code: string;
  slug: string;
  is_active: string;
  sort_order: string;
  is_hub: string;
  is_secondary: string;
  has_airport: string;
}

export interface DishRow {
  dish_code: string;
  name: string;
  slug: string;
  region_code: string;
  province_code: string;
  destination_code: string;
  category: string;
  meal_type: string;
  is_produce: string;
  season_start: string;
  season_end: string;
  desc_short: string;
  image_path: string;
  is_active: string;
}

export interface FaqRow {
  faq_id: string;
  page_assignment: string;
  category: string;
  tour_slug: string;
  question: string;
  answer: string;
  is_active: string;
}

export interface HotelPropertyRow {
  hotel_id: string;
  hotel_slug: string;
  hotel_name: string;
  destination_code: string;
  tier: string;
  star_rating: string;
  per_night_price_from: string;
  description: string;
  image_path_property_1: string;
  image_path_property_2: string;
  image_path_property_3: string;
  is_active: string;
}

export interface HotelRoomRow {
  Hotel_id: string;
  hotel_slug: string;
  hotel_name: string;
  destinations_code: string;
  tier: string;
  star_rating: string;
  room_id: string;
  room_type: string;
  max_occupancy: string;
  nightly_cost_usd: string;
  nightly_sell_price_usd: string;
  description: string;
  image_path_property_1: string;
  image_path_property_2: string;
  image_path_property_3: string;
  image_path_room_option_1: string;
  image_path_room_option_2: string;
  is_active: string;
}

export interface RouteMatrixRow {
  route_id: string;
  from_code: string;
  to_code: string;
  distance_km: string;
  drive_hours_low: string;
  drive_hours_high: string;
  road_class: string;
  bus_allowed: string;
  armored_allowed: string;
  armored_months: string;
  notes: string;
}