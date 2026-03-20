import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  // In Astro 5, output: 'static' with an adapter supports per-route server rendering
  // (the old 'hybrid' option was merged into 'static' behaviour).
  // Pages are prerendered by default; routes with `export const prerender = false`
  // are handled at runtime by the node adapter.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
