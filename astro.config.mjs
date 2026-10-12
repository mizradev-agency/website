import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: true,
  },
  integrations: [tailwind(), compress(), react(), markdoc(), keystatic()],
});
