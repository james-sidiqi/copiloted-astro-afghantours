/**
 * Custom journey audience marketing cards (inquiry-led, not fixed itineraries).
 * Images resolve only from existing return-journeys / custom-tours / flat tour assets.
 */
import { firstExisting } from "../getAssetUrl.js";

export type CustomAudience = {
  id: string;
  label: string;
  blurb: string;
  imagePath: string;
  href: string;
  assetNote: string;
};

const AUDIENCE_DEFS: Array<{
  id: string;
  label: string;
  blurb: string;
  candidates: string[];
  assetNote: string;
}> = [
  {
    id: "diaspora",
    label: "Diaspora",
    blurb: "Return journeys planned from Kabul — family, heritage, and practical logistics around current access.",
    candidates: [
      "/assets/images/return-journeys/diaspora/afghan-diaspora-heritage.webp",
      "/assets/images/return-journeys/diaspora/family-trip.webp",
      "/assets/images/return-journeys/diaspora/family-trip-museum.webp",
    ],
    assetNote: "return-journeys/diaspora/",
  },
  {
    id: "veterans",
    label: "Veterans",
    blurb: "Return visits for veterans, contractors, and diplomats — route-aware timing, not a brochure template.",
    candidates: [
      "/assets/images/custom-tours/veteran-return/hero.webp",
      "/assets/images/custom-tours/veteran-return/thumb.webp",
      "/assets/images/return-journeys/veterans-contractors-diplomats/james-with-ambassador.webp",
    ],
    assetNote: "custom-tours/veteran-return + return-journeys/veterans-contractors-diplomats/",
  },
  {
    id: "peace-corps",
    label: "Peace Corps alumni",
    blurb: "Former Peace Corps volunteers returning with context, care, and on-the-ground planning from Kabul.",
    candidates: [
      "/assets/images/return-journeys/peace-corps/initial-peace-corps-group-article.webp",
      "/assets/images/return-journeys/peace-corps/peace-corps-kabul-times.webp",
      "/assets/images/return-journeys/peace-corps/peace-corps-logo.webp",
    ],
    assetNote: "return-journeys/peace-corps/",
  },
  {
    id: "business",
    label: "Business travelers",
    blurb: "Investment scouting, meetings, and ground support — coordinated locally around permits and conditions.",
    candidates: [
      "/assets/images/custom-tours/business-investment/hero.webp",
      "/assets/images/custom-tours/business-investment/thumb.webp",
    ],
    assetNote: "custom-tours/business-investment/",
  },
  {
    id: "artists",
    label: "Artists",
    blurb: "Creative fieldwork and photography-focused travel — inquiry-led; no fixed day-by-day package.",
    candidates: [
      "/assets/images/tours/photography-documentary.webp",
      "/assets/images/tours/photography-tour.webp",
      "/assets/images/custom-tours/media-support/hero.webp",
      "/assets/images/custom-tours/custom-cultural-expeditions/gallery-1.webp",
    ],
    assetNote: "No dedicated artists folder — mapped to photography/media assets",
  },
  {
    id: "media",
    label: "Media",
    blurb: "Journalists and documentary teams — logistics, access awareness, and Kabul-based coordination.",
    candidates: [
      "/assets/images/custom-tours/media-support/hero.webp",
      "/assets/images/custom-tours/media-support/thumb.webp",
      "/assets/images/custom-tours/media-support/overview.webp",
    ],
    assetNote: "custom-tours/media-support/",
  },
];

export function getCustomAudiences(): CustomAudience[] {
  return AUDIENCE_DEFS.map((d) => {
    const imagePath = firstExisting(...d.candidates) || d.candidates[0] || "";
    return {
      id: d.id,
      label: d.label,
      blurb: d.blurb,
      imagePath,
      href: `/contact?audience=${encodeURIComponent(d.id)}`,
      assetNote: d.assetNote,
    };
  });
}

export function isCustomTravelStyle(travelStyle: string | null | undefined): boolean {
  return (travelStyle || "").trim().toLowerCase() === "custom";
}
