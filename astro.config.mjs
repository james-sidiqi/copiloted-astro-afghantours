import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.afghantours.com',
  integrations: [tailwind()],
  output: 'static',
  redirects: {
    '/hubs/faizabad-city': '/hubs/faizabad/',
    '/hubs/faizabad-city/': '/hubs/faizabad/',
    '/cultural-experiences/chashma-e-dogh': '/cultural-experiences/culinary/chashma-e-dogh/',
    '/cultural-experiences/chashma-e-dogh/': '/cultural-experiences/culinary/chashma-e-dogh/',
    '/cultural-experiences/arg-restaurant-herat': '/cultural-experiences/culinary/arg-restaurant-herat/',
    '/cultural-experiences/arg-restaurant-herat/': '/cultural-experiences/culinary/arg-restaurant-herat/',
    '/cultural-experiences/aziz-bakery': '/cultural-experiences/culinary/aziz-bakery/',
    '/cultural-experiences/aziz-bakery/': '/cultural-experiences/culinary/aziz-bakery/',
    '/cultural-experiences/adam-khan-chapli-kabob': '/cultural-experiences/culinary/adam-khan-chapli-kabob/',
    '/cultural-experiences/adam-khan-chapli-kabob/': '/cultural-experiences/culinary/adam-khan-chapli-kabob/',
    '/cultural-experiences/qurut-markets-of-bamyan': '/cultural-experiences/culinary/band-e-amir-quroot-dairy/',
    '/cultural-experiences/qurut-markets-of-bamyan/': '/cultural-experiences/culinary/band-e-amir-quroot-dairy/',
    '/cultural-experiences/culinary/band-e-amir-dairy-market-quroot': '/cultural-experiences/culinary/band-e-amir-quroot-dairy/',
    '/cultural-experiences/culinary/band-e-amir-dairy-market-quroot/': '/cultural-experiences/culinary/band-e-amir-quroot-dairy/',
  },

});
