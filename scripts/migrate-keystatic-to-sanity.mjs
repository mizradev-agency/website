import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const output = resolve(process.argv[2] || join(root, '.sanity', 'migration.ndjson'));
const imageFields = new Set(['image', 'logoLight', 'logoDark', 'collaborationImage']);

const pageDocuments = {
  about: 'about',
  booking: 'booking',
  'case-studies': 'caseStudies',
  contact: 'contact',
  home: 'home',
  'not-found': 'notFound',
  pricing: 'pricing',
  services: 'services',
  styleguide: 'styleguide',
};

function key(prefix, index) {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function portableSpan(text, blockKey, index, marks = []) {
  return { _key: key(`${blockKey}-span`, index), _type: 'span', marks, text };
}

function portableBlock(text, style, index, listItem) {
  const blockKey = key('block', index);
  const children = [];
  const markDefs = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let spanIndex = 0;
  let match;

  while ((match = linkPattern.exec(text))) {
    if (match.index > cursor) {
      children.push(portableSpan(text.slice(cursor, match.index), blockKey, spanIndex++));
    }
    const linkKey = key(`${blockKey}-link`, markDefs.length);
    markDefs.push({ _key: linkKey, _type: 'link', href: match[2] });
    children.push(portableSpan(match[1], blockKey, spanIndex++, [linkKey]));
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length || children.length === 0) {
    children.push(portableSpan(text.slice(cursor), blockKey, spanIndex));
  }

  return {
    _key: blockKey,
    _type: 'block',
    children,
    markDefs,
    style,
    ...(listItem ? { level: 1, listItem } : {}),
  };
}

function markdownToPortableText(markdown) {
  const blocks = [];
  const lines = markdown.trim().split(/\r?\n/);
  let paragraph = [];

  const flush = () => {
    if (!paragraph.length) return;
    blocks.push(portableBlock(paragraph.join(' '), 'normal', blocks.length));
    paragraph = [];
  };

  for (const line of lines) {
    if (!line.trim()) {
      flush();
    } else if (line.startsWith('## ')) {
      flush();
      blocks.push(portableBlock(line.slice(3), 'h2', blocks.length));
    } else if (line.startsWith('### ')) {
      flush();
      blocks.push(portableBlock(line.slice(4), 'h3', blocks.length));
    } else if (line.startsWith('- ')) {
      flush();
      blocks.push(portableBlock(line.slice(2), 'normal', blocks.length, 'bullet'));
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();
  return blocks;
}

function addKeysAndAssets(value, fieldName = '', path = 'root') {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const transformed = addKeysAndAssets(item, fieldName, `${path}-${index}`);
      if (transformed && typeof transformed === 'object' && !Array.isArray(transformed)) {
        return { _key: key(path.replace(/[^a-z0-9-]/gi, '-'), index), ...transformed };
      }
      return transformed;
    });
  }

  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([name, child]) => {
      if (imageFields.has(name) && typeof child === 'string' && child.startsWith('/assets/')) {
        const absolutePath = join(root, 'public', child);
        return [name, { _type: 'image', _sanityAsset: `image@file://${absolutePath}` }];
      }
      return [name, addKeysAndAssets(child, name, `${path}-${name}`)];
    })
  );
}

async function readYaml(path) {
  return parse(await readFile(join(root, path), 'utf8'));
}

async function readPrivacy() {
  const source = await readFile(join(root, 'src/content/pages/privacy.mdoc'), 'utf8');
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error('No se pudo leer el frontmatter de privacy.mdoc');
  return { ...parse(match[1]), content: markdownToPortableText(match[2]) };
}

const documents = [];
documents.push({
  _id: 'site',
  _type: 'site',
  ...addKeysAndAssets(await readYaml('src/content/site.yaml')),
});

for (const [filename, type] of Object.entries(pageDocuments)) {
  documents.push({
    _id: type,
    _type: type,
    ...addKeysAndAssets(await readYaml(`src/content/pages/${filename}.yaml`)),
  });
}

documents.push({ _id: 'privacy', _type: 'privacy', ...addKeysAndAssets(await readPrivacy()) });

for (const slug of ['alma', 'nexo', 'raiz', 'ritmo']) {
  const data = addKeysAndAssets(await readYaml(`src/content/projects/${slug}.yaml`));
  documents.push({
    _id: `project-${slug}`,
    _type: 'project',
    ...data,
    slug: { _type: 'slug', current: slug },
  });
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`);
console.log(`Preparados ${documents.length} documentos para Sanity en ${output}`);
