import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: true,
  },
  // Vite already minifies CSS. astro-compress's older CSSO parser drops the
  // media range queries emitted by Vite, removing the responsive breakpoints.
  integrations: [
    tailwind(),
    compress({ CSS: false }),
    react(),
    sanity({
      projectId: 'qpnmosrg',
      dataset: 'production',
      apiVersion: '2026-11-07',
      useCdn: true,
      studioBasePath: '/studio',
    }),
  ],
});
