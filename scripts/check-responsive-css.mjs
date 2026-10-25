import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Check the artifact after every build integration has finished. A second CSS
// minifier previously removed these queries while reporting a successful build.
const assetDir = new URL('../dist/_astro/', import.meta.url);
const files = (await readdir(assetDir)).filter((file) => file.endsWith('.css'));
const css = (await Promise.all(files.map((file) => readFile(new URL(file, assetDir), 'utf8')))).join('\n');
for (const width of [600, 900, 1100]) {
  const query = new RegExp(`@media[^{}]*(?:max-width:\\s*${width}px|width\\s*<=\\s*${width}px|${width}px\\s*>=\\s*width)`);
  assert.ok(query.test(css), `Falta el breakpoint de ${width}px en el CSS publicado.`);
}
console.log('CSS responsive verificado: breakpoints de móvil, tablet y navegación presentes.');
