// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  site: 'https://travel.varneet.in',
  redirects: {
    '/volunteering': '/about#volunteer',
    '/contact': '/about#contact',
  },
});
