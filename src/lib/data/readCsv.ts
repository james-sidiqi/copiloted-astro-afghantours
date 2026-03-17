import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

export function readCsv<T>(filename: string): T[] {
  const dataDir = join(process.cwd(), 'data');
  const filePath = join(dataDir, filename);
  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as T[];
}
