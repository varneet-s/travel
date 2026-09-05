// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://travel.varneet.in',
  redirects: {
    '/volunteering': '/about#volunteer',
    '/contact': '/about#contact',
  },
});
