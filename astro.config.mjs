// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://travel.varneet.in',
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/volunteering': '/about#volunteer',
    '/contact': '/about#contact',
  },
});

