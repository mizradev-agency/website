import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

export const projectId = 'qpnmosrg';
export const dataset = 'production';

export default defineConfig({
  name: 'mizradev',
  title: 'Mizradev',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  document: {
    singletons: [
      'site',
      'home',
      'about',
      'services',
      'pricing',
      'caseStudies',
      'contact',
      'booking',
      'privacy',
      'notFound',
      'styleguide',
    ],
  },
});
