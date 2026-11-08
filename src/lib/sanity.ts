import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

type ContentRecord = Record<string, any>;

const imageBuilder = createImageUrlBuilder(sanityClient);

export async function getSingleton(name: string): Promise<ContentRecord> {
  const data = await sanityClient.fetch<ContentRecord | null>(
    '*[_id == $id && !(_id in path("drafts.**"))][0]',
    { id: name }
  );

  if (!data) {
    throw new Error(`Falta el contenido de Sanity para "${name}". Edítalo en /studio.`);
  }

  return data;
}

export function assetUrl(image: unknown) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return imageBuilder.image(image as Parameters<typeof imageBuilder.image>[0]).auto('format').url();
}

export async function getProjects() {
  return sanityClient.fetch<Project[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))] {
      ...,
      "slug": slug.current
    } | order(order asc, slug asc)`
  );
}

export type Project = ContentRecord & {
  slug: string;
  name: string;
  title: string;
  category: string;
  discipline: string;
  order?: number;
  featured?: boolean;
  visual?: string;
  image?: unknown;
  imageAlt?: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  scope: string[];
};
