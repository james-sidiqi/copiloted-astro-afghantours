#!/usr/bin/env node
/**
 * Generate public/.htaccess RewriteRules from docs/redirect-map.csv (301/410).
 * Preserves a marked hand-maintained block if present.
 * Production cPanel static hosting must deploy this file with dist/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = path.join(root, 'docs/redirect-map.csv');
const outPath = path.join(root, 'public/.htaccess');

const MARK_START = '# BEGIN AFGHANTOURS-REDIRECT-MAP';
const MARK_END = '# END AFGHANTOURS-REDIRECT-MAP';
const HAND_START = '# BEGIN AFGHANTOURS-HAND';
const HAND_END = '# END AFGHANTOURS-HAND';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // naive CSV: first three fields + rest as reason (reason may contain commas inside quotes)
    const m = line.match(/^([^,]*),([^,]*),([^,]*),(.*)$/);
    if (!m) continue;
    let reason = m[4].trim();
    if (reason.startsWith('"') && reason.endsWith('"')) reason = reason.slice(1, -1);
    rows.push({
      old_path: m[1].trim(),
      final_path: m[2].trim(),
      status_code: m[3].trim(),
      reason,
    });
  }
  return rows;
}

function escapeRegexPath(p) {
  // path like /foo/bar/ → ^foo/bar/?$
  let s = p.replace(/^\//, '').replace(/\/$/, '');
  s = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return s;
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const rules = [];
for (const r of rows) {
  const code = r.status_code;
  if (code !== '301' && code !== '410') continue;
  if (!r.old_path || r.old_path === r.final_path) continue;
  const pattern = escapeRegexPath(r.old_path);
  if (code === '301') {
    if (!r.final_path) continue;
    const dest = r.final_path.startsWith('http') ? r.final_path : r.final_path;
    rules.push(`  # ${r.reason.slice(0, 120)}`);
    rules.push(`  RewriteRule ^${pattern}/?$ ${dest} [R=301,L]`);
  } else if (code === '410') {
    rules.push(`  # ${r.reason.slice(0, 120)}`);
    rules.push(`  RewriteRule ^${pattern}/?$ - [G,L]`);
  }
}

let handBlock = `${HAND_START}
# Hand-maintained host rules (preserved across regenerate). Add carefully.
${HAND_END}`;

if (fs.existsSync(outPath)) {
  const existing = fs.readFileSync(outPath, 'utf8');
  const hs = existing.indexOf(HAND_START);
  const he = existing.indexOf(HAND_END);
  if (hs !== -1 && he !== -1) {
    handBlock = existing.slice(hs, he + HAND_END.length);
  }
}

const generated = `${MARK_START}
# Auto-generated from docs/redirect-map.csv — do not edit by hand.
# Regenerate: node scripts/generate-htaccess.mjs
# Deploy this file with static dist/ on Apache/cPanel. Nginx needs equivalent map.
<IfModule mod_rewrite.c>
  RewriteEngine On
${rules.join('\n')}
</IfModule>
${MARK_END}
`;

const header = `# AfghanTours Apache / cPanel static hosting
# Production MUST use this public/.htaccess (copied into dist/ on build).
# PHP inquiry: public/tour-inquiry.php requires PHP execution; static-only hosts need PUBLIC_FORM_ENDPOINT.
#
`;

fs.writeFileSync(outPath, header + '\n' + handBlock + '\n\n' + generated + '\n');
console.log(`Wrote ${outPath} with ${rules.length / 2} redirect/gone rules`);
