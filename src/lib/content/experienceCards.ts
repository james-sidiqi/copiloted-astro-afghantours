/**
 * Light experience cards from existing public asset folders.
 * Activity cards map to the locked 8 activities (/activities/<slug>/).
 * No invented claims; no cross-substituted activity heroes.
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
  kind: "cultural" | "culinary" | "activity";
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
  { slug: "afghan-weddings", label: "Afghan weddings", blurb: "Hospitality and celebration guests sometimes witness — never staged as a product, always context-dependent." },
];

/** Locked 8 activities — cards link to activity pages, not mini-tours. */
const ACTIVITY_DEFS: Array<{
  id: string;
  label: string;
  blurb: string;
  activityPath: string[];
}> = [
  {
    id: "hiking",
    label: "Hiking",
    blurb: "Day hikes and short walks planned from operational hubs when access allows — not a packaged trek.",
    activityPath: ["hiking"],
  },
  {
    id: "fishing",
    label: "Fishing",
    blurb: "River and lake fishing near selected hubs when season and access allow — inquire; not a catalogue item.",
    activityPath: ["fishing"],
  },
  {
    id: "trekking",
    label: "Trekking",
    blurb: "Multi-day trekking planned mainly from Faizabad — not a single fixed trek package.",
    activityPath: ["trekking"],
  },
  {
    id: "skiing",
    label: "Skiing",
    blurb: "Seasonal highland skiing near Kabul and Bamyan — distinct from the Bamyan Skiing Tour.",
    activityPath: ["skiing"],
  },
  {
    id: "shopping",
    label: "Shopping",
    blurb: "Bazaars and crafts as optional hub stops — top-level activity, not a sightseeing subtype.",
    activityPath: ["shopping"],
  },
  {
    id: "sightseeing",
    label: "Sightseeing",
    blurb: "Historical, religious, scenic, and market sightseeing across hubs — subtypes are tags, not products.",
    activityPath: ["sightseeing"],
  },
  {
    id: "horse-riding",
    label: "Horse riding",
    blurb: "Equestrian experiences near Kabul and Mazar when arrangements allow.",
    activityPath: ["horse-riding"],
  },
  {
    id: "cycling",
    label: "Cycling",
    blurb: "Urban and near-hub cycling from Kabul when conditions allow.",
    activityPath: ["cycling"],
  },
];

/** Map card asset folder slug → cultural-experiences content slug when they differ. */
const CULTURAL_PAGE_SLUG: Record<string, string> = {
  buzkashi: "buzkashi",
  "istalif-pottery": "istalif-pottery",
  "afghan-carpets": "afghan-carpets",
  "glassblowers-of-herat": "glassblowers-of-herat",
  "afghan-weddings": "afghan-weddings",
};

export function getCulturalExperienceCards(limit = 6): ExperienceCard[] {
  if (!dirExists("assets/images/cultural-experiences") && !dirExists("assets/images/experiences/cultural") && !dirExists("assets/images/experiences/culinary")) return [];
  const cards: ExperienceCard[] = [];
  for (const def of CULTURAL_DEFS) {
    const imagePath =
      pickExperienceImage("cultural-experiences", def.slug) ||
      firstExisting(
        `/assets/images/cultural-experiences/${def.slug}/hero.webp`,
        `/assets/images/cultural-experiences/${def.slug}/thumb.webp`,
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

export async function getCulinaryExperienceCards(limit = 6): Promise<ExperienceCard[]> {
  const { getAllCulinaryExperiences, culinaryHref, culinaryImage } = await import("./culinaryExperiences.js");
  const entries = await getAllCulinaryExperiences();
  const cards: ExperienceCard[] = [];
  for (const entry of entries) {
    const imagePath = culinaryImage(entry.slug, entry.data.hero_image, entry.data.image, "thumb");
    cards.push({
      id: entry.slug,
      label: entry.data.title,
      blurb: entry.data.card_description || entry.data.subtitle || entry.data.signature_food,
      imagePath,
      href: culinaryHref(entry.slug),
      kind: "culinary",
    });
    if (cards.length >= limit) break;
  }
  return cards;
}

export function getActivityCards(limit = 8): ExperienceCard[] {
  if (!dirExists("assets/images/activities") && !dirExists("assets/images/experiences/activities")) return [];
  const cards: ExperienceCard[] = [];
  for (const def of ACTIVITY_DEFS) {
    const imagePath =
      resolveActivityExperienceAsset(def.activityPath, "hero") ||
      resolveActivityExperienceAsset(def.activityPath, "thumb");
    if (!imagePath) continue;
    cards.push({
      id: def.id,
      label: def.label,
      blurb: def.blurb,
      imagePath,
      href: `/activities/${def.id}/`,
      kind: "activity",
    });
    if (cards.length >= limit) break;
  }
  return cards;
}
