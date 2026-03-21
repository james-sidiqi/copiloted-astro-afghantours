import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CnBUKnnD.mjs';
import { manifest } from './manifest_C0aHHBNa.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/itinerary.astro.mjs');
const _page3 = () => import('./pages/attractions/_slug_.astro.mjs');
const _page4 = () => import('./pages/attractions.astro.mjs');
const _page5 = () => import('./pages/contact.astro.mjs');
const _page6 = () => import('./pages/destinations/_slug_.astro.mjs');
const _page7 = () => import('./pages/faq.astro.mjs');
const _page8 = () => import('./pages/food-culture/_slug_.astro.mjs');
const _page9 = () => import('./pages/food-culture.astro.mjs');
const _page10 = () => import('./pages/provinces/_slug_.astro.mjs');
const _page11 = () => import('./pages/regions/_slug_.astro.mjs');
const _page12 = () => import('./pages/regions.astro.mjs');
const _page13 = () => import('./pages/safety.astro.mjs');
const _page14 = () => import('./pages/tours/_slug_.astro.mjs');
const _page15 = () => import('./pages/tours.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/itinerary.ts", _page2],
    ["src/pages/attractions/[slug].astro", _page3],
    ["src/pages/attractions/index.astro", _page4],
    ["src/pages/contact.astro", _page5],
    ["src/pages/destinations/[slug].astro", _page6],
    ["src/pages/faq.astro", _page7],
    ["src/pages/food-culture/[slug].astro", _page8],
    ["src/pages/food-culture/index.astro", _page9],
    ["src/pages/provinces/[slug].astro", _page10],
    ["src/pages/regions/[slug].astro", _page11],
    ["src/pages/regions/index.astro", _page12],
    ["src/pages/safety.astro", _page13],
    ["src/pages/tours/[slug].astro", _page14],
    ["src/pages/tours/index.astro", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///workspaces/copiloted-astro-afghantours/dist/client/",
    "server": "file:///workspaces/copiloted-astro-afghantours/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
