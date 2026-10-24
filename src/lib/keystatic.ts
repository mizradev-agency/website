import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

type Singletons = typeof reader.singletons;

export async function getSingleton<K extends keyof Singletons>(name: K) {
  const data = await reader.singletons[name].read({ resolveLinkedFiles: true });
  if (!data) {
    throw new Error(
      `Falta el contenido de Keystatic para "${String(name)}". Edítalo en /keystatic.`
    );
  }
  return data;
}

export function assetUrl(image: string | null | undefined) {
  if (!image) return '';
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `/assets/${image}`;
}

export async function getProjects() {
  const entries = await reader.collections.posts.all();
  return entries
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.slug.localeCompare(b.slug));
}

export type Project = Awaited<ReturnType<typeof getProjects>>[number];
