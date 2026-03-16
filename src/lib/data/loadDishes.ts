import type { DishRow } from '../types/data.js';
import type { Dish } from '../types/view-models.js';
import { readCsv } from './readCsv.js';

export function loadDishes(): Dish[] {
  const rows = readCsv<DishRow>('dishes.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      dishCode: r.dish_code,
      name: r.name,
      slug: r.slug,
      regionCode: r.region_code,
      provinceCode: r.province_code,
      destinationCode: r.destination_code,
      category: r.category,
      mealType: r.meal_type,
      isProduce: r.is_produce === '1',
      seasonStart: parseInt(r.season_start, 10) || 0,
      seasonEnd: parseInt(r.season_end, 10) || 0,
      descShort: r.desc_short,
      imagePath: r.image_path,
      isActive: true,
    }));
}
