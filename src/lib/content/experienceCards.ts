/**
 * Light experience cards from existing public asset folders.
 * No thin SEO pages — cards inspire and direct to Scheduled tours or Custom inquire.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { firstExisting, pickExperienceImage, resolveActivityExperienceAsset } from "../getAssetUrl.js";

export type ExperienceCard = {
  id: string;
  label: string;
  blurb: string;
  imagePath: string;
  href: string;
  kind: "cultural" | "activity";
};

const PUBLIC_ROOT = path.join(process.cwd(), "public");

function dirExists(rel: string): boolean {
  try {
    return fs.existsSync(path.join(PUBLIC_ROOT, rel)) && fs.statSync(path.join(PUBLIC_ROOT, rel)).isDirectory();
  } catch {
    return false;
  }
}

/** Curated cultural experiences (subset of folders) — titles only from folder names, no invented copy claims. */
const CULTURAL_DEFS: Array<{ slug: string; label: string; blurb: string }> = [
  { slug: "buzkashi", label: "Buzkashi", blurb: "A living sport guests may encounter on journeys through northern hubs — timing depends on season and access." },
  { slug: "istalif-pottery", label: "Istalif pottery", blurb: "Craft and village life outside Kabul — often woven into Central routes when conditions allow." },
  { slug: "afghan-carpets", label: "Afghan carpets", blurb: "Markets and makers — part of how many guests experience cities on scheduled or custom itineraries." },
  { slug: "glassblowers-of-herat", label: "Glassblowers of Herat", blurb: "Herat’s craft traditions — relevant when Western hubs are on your route." },
  { slug: "qurut-markets-of-bamyan", label: "Qurut markets of Bamyan", blurb: "Highland markets and food culture around Bamyan — paired with landscape days on Central tours." },
  { slug: "afghan-weddings", label: "Afghan weddings", blurb: "Hospitality and celebration guests sometimes witness — never staged as a product, always context-dependent." },
];

const ACTIVITY_DEFS: Array<{
  id: string;
  label: string;
  blurb: string;
  /** Relative parts under experiences/activities/ (and legacy activities/). */
  activityPath?: string[];
  imageCandidates: string[];
}> = [
  {
    id: "sightseeing-historical",
    label: "Historical sightseeing",
    blurb: "Forts, mosques, and heritage sites — core to most Cultural / Scenic scheduled packages.",
    activityPath: ["sightseeing", "historical"],
    imageCandidates: [
      "/assets/images/experiences/activities/sightseeing/historical/hero.webp",
      "/assets/images/experiences/activities/sightseeing/historical/gallery/01.webp",
      "/assets/images/activities/sightseeing/historical/01.webp",
    ],
  },
  {
    id: "sightseeing-scenic",
    label: "Scenic day travel",
    blurb: "Highlands, lakes, and mountain roads — planned with realistic drive times from Kabul.",
    activityPath: ["sightseeing", "scenic"],
    imageCandidates: [
      "/assets/images/experiences/activities/sightseeing/scenic/hero.webp",
      "/assets/images/experiences/activities/sightseeing/scenic/gallery/01.webp",
      "/assets/images/activities/sightseeing/scenic/01.webp",
    ],
  },
  {
    id: "markets",
    label: "Markets & cities",
    blurb: "Bazaars and urban rhythm — how guests actually spend time in hubs between longer drives.",
    activityPath: ["sightseeing", "markets"],
    imageCandidates: [
      "/assets/images/experiences/activities/sightseeing/markets/hero.webp",
      "/assets/images/experiences/activities/sightseeing/markets/gallery/01.webp",
      "/assets/images/activities/sightseeing/markets/01.webp",
    ],
  },
  {
    id: "birding",
    label: "Birding",
    blurb: "Wetlands and highland birding when season and access allow — custom inquiry rather than a fixed catalogue package.",
    activityPath: ["birding"],
    imageCandidates: [
      "/assets/images/experiences/activities/birding/thumb.webp",
      "/assets/images/experiences/activities/birding/hero.webp",
    ],
  },
  {
    id: "shopping",
    label: "Shopping & crafts",
    blurb: "Carpets, jewellery, and local goods — optional stops, not a shopping-tour product line.",
    imageCandidates: [
      "/assets/images/activities/shopping/01.webp",
      "/assets/images/activities/shopping/02.webp",
    ],
  },
  {
    id: "backcountry-skiing",
    label: "Backcountry skiing",
    blurb: "Seasonal highland skiing where access and conditions allow — inquire; not a fixed published package.",
    imageCandidates: [
      "/assets/images/activities/backcountry-skiing/01.webp",
      "/assets/images/activities/backcountry-skiing/02.webp",
    ],
  },
  {
    id: "fishing",
    label: "Fishing",
    blurb: "River and highland fishing when season and route support it — custom inquiry rather than a catalogue item.",
    activityPath: ["fishing"],
    imageCandidates: [
      "/assets/images/experiences/activities/fishing/hero.webp",
      "/assets/images/experiences/activities/fishing/thumb.webp",
      "/assets/images/activities/fishing/01.webp",
    ],
  },
];

/** Map card asset folder slug → cultural-experiences content slug when they differ. */
const CULTURAL_PAGE_SLUG: Record<string, string> = {
  buzkashi: "buzkashi",
  "istalif-pottery": "istalif-pottery",
  "afghan-carpets": "afghan-carpets",
  "glassblowers-of-herat": "glassblowers-of-herat",
  "afghan-weddings": "afghan-weddings",
  // qurut-markets-of-bamyan has assets but no MD page yet — keep tours CTA
};

export function getCulturalExperienceCards(limit = 6): ExperienceCard[] {
  if (!dirExists("assets/images/cultural-experiences") && !dirExists("assets/images/experiences/cultural") && !dirExists("assets/images/experiences/culinary")) return [];
  const cards: ExperienceCard[] = [];
  for (const def of CULTURAL_DEFS) {
    const imagePath =
      pickExperienceImage("cultural-experiences", def.slug) ||
      firstExisting(
        `/assets/images/cultural-experiences/${def.slug}/thumb.webp`,
        `/assets/images/cultural-experiences/${def.slug}/hero.webp`,
      );
    if (!imagePath) continue;
    cards.push({
      id: def.slug,
      label: def.label,
      blurb: def.blurb,
      imagePath,
      href: CULTURAL_PAGE_SLUG[def.slug]
        ? `/cultural-experiences/${CULTURAL_PAGE_SLUG[def.slug]}`
        : "/tours?type=scheduled",
      kind: "cultural",
    });
    if (cards.length >= limit) break;
  }
  return cards;
}

export function getActivityCards(limit = 6): ExperienceCard[] {
  if (!dirExists("assets/images/activities") && !dirExists("assets/images/experiences/activities")) return [];
  const cards: ExperienceCard[] = [];
  for (const def of ACTIVITY_DEFS) {
    const imagePath =
      (def.activityPath ? resolveActivityExperienceAsset(def.activityPath, "thumb") || resolveActivityExperienceAsset(def.activityPath, "hero") : "") ||
      firstExisting(...def.imageCandidates);
    if (!imagePath) continue;
    const href =
      def.id === "backcountry-skiing" || def.id === "fishing" || def.id === "birding"
        ? "/contact"
        : "/tours?type=scheduled";
    cards.push({
      id: def.id,
      label: def.label,
      blurb: def.blurb,
      imagePath,
      href,
      kind: "activity",
    });
    if (cards.length >= limit) break;
  }
  return cards;
}
