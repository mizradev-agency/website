import { defineConfig } from 'astro/config';
import { rm, writeFile } from 'node:fs/promises';
import localConfig from './astro.config.mjs';

// Pages publishes the public site and the embedded Sanity Studio as static assets.
export default defineConfig({
  ...localConfig,
  output: 'static',
  adapter: undefined,
  integrations: [
    ...localConfig.integrations,
    {
      name: 'cloudflare-pages-static',
      hooks: {
        'astro:route:setup': ({ route }) => {
          if (
            route.route === '/api/contact'
          )
            route.prerender = true;
        },
        'astro:build:done': async ({ dir }) => {
          for (const path of ['api']) {
            await rm(new URL(path, dir), { recursive: true, force: true });
          }
          await writeFile(
            new URL('_routes.json', dir),
            JSON.stringify({ version: 1, include: ['/api/contact'], exclude: [] })
          );
          await writeFile(
            new URL('_redirects', dir),
            ['/keystatic /studio 301', '/keystatic/* /studio 301', ''].join('\n')
          );
          await writeFile(
            new URL('_headers', dir),
            [
              '/*',
              '  X-Content-Type-Options: nosniff',
              '  Referrer-Policy: strict-origin-when-cross-origin',
              '  X-Frame-Options: DENY',
              '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
              '',
            ].join('\n')
          );
        },
      },
    },
  ],
});
