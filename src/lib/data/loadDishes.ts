import type { DishRow } from '../types/data.js';
import type { Dish } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText, normalizeAssetPath } from './normalize.js';
import { getAssetUrl } from '../getAssetUrl.js';

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean);
}

export function loadDishes(): Dish[] {
  const rows = readCsv<DishRow>('dishes.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      dishCode: r.dish_code,
      name: cleanText(r.name),
      slug: cleanText(r.slug),
      regionCode: cleanText(r.region_code),
      provinceCode: cleanText(r.province_code),
      destinationCode: cleanText(r.destination_code),
      category: cleanText(r.category),
      mealType: cleanText(r.meal_type),
      isProduce: r.is_produce === '1',
      seasonStart: parseInt(r.season_start, 10) || 0,
      seasonEnd: parseInt(r.season_end, 10) || 0,
      descShort: cleanText(r.desc_short),
      imagePath: getAssetUrl(normalizeAssetPath(r.image_path), { slug: cleanText(r.slug), entity: 'dish', kind: 'hero' }),
      tags: parseTags(r.tags),
      isActive: true,
    }));
}
