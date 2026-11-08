import { defineArrayMember, defineField, defineType } from 'sanity';

const stringField = (name: string, title: string, rows?: number) =>
  defineField({ name, title, type: 'text', rows: rows ?? 2 });

const shortField = (name: string, title: string) => defineField({ name, title, type: 'string' });

const imageField = (name: string, title: string) =>
  defineField({ name, title, type: 'image', options: { hotspot: true } });

const stringsField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
  });

const linkField = (name: string, title: string) =>
  defineField({ name, title, type: 'link' });

const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'Título SEO',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'seoDescription',
    title: 'Descripción SEO',
    type: 'text',
    rows: 3,
    validation: (rule) => rule.required(),
  }),
];

const sectionFields = [
  shortField('eyebrow', 'Antetítulo'),
  stringField('heading', 'Título'),
  stringField('text', 'Descripción', 3),
];

const singleton = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineType({ name, title, type: 'document', fields });

const link = defineType({
  name: 'link',
  title: 'Enlace',
  type: 'object',
  fields: [shortField('text', 'Texto'), shortField('href', 'Enlace')],
});

const intro = defineType({
  name: 'intro',
  title: 'Presentación',
  type: 'object',
  fields: [
    shortField('eyebrow', 'Antetítulo'),
    stringField('title', 'Título'),
    stringField('text', 'Descripción', 3),
    shortField('action', 'Texto del botón'),
    shortField('href', 'Enlace del botón'),
  ],
});

const site = singleton('site', 'Cabecera y pie', [
  shortField('brandName', 'Nombre de marca'),
  imageField('logoLight', 'Logo claro'),
  imageField('logoDark', 'Logo oscuro'),
  shortField('menuQuote', 'Frase del menú'),
  linkField('headerCta', 'Botón de cabecera'),
  linkField('contactLink', 'Contacto por escrito'),
  defineField({
    name: 'navLinks',
    title: 'Navegación',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          shortField('ref', 'Número'),
          shortField('name', 'Texto'),
          shortField('href', 'Enlace'),
        ],
        preview: { select: { title: 'name', subtitle: 'href' } },
      }),
    ],
  }),
  stringField('footerText', 'Descripción del pie', 3),
  linkField('footerCta', 'Botón del pie'),
  shortField('copyright', 'Copyright (sin año ni marca)'),
  shortField('backToTop', 'Volver arriba'),
]);

const home = singleton('home', 'Inicio', [
  ...seoFields,
  defineField({
    name: 'hero',
    title: 'Hero',
    type: 'object',
    fields: [
      ...sectionFields,
      linkField('cta', 'Botón principal'),
      linkField('secondaryCta', 'Botón secundario'),
      imageField('image', 'Fotografía principal'),
      shortField('imageAlt', 'Texto alternativo'),
      shortField('photoIndex', 'Etiqueta de fotografía'),
      stringField('showcaseHeading', 'Título sobre fotografía'),
      shortField('showcaseText', 'Descripción sobre fotografía'),
      linkField('showcaseLink', 'Enlace sobre fotografía'),
      linkField('cornerLink', 'Enlace inferior'),
      shortField('captionLeft', 'Pie izquierdo'),
      shortField('captionRight', 'Pie derecho'),
    ],
  }),
  stringsField('specialties', 'Especialidades del cintillo'),
  defineField({
    name: 'about',
    title: 'Sobre mí y colaboración',
    type: 'object',
    fields: [
      ...sectionFields,
      linkField('cta', 'Botón'),
      imageField('image', 'Retrato'),
      shortField('imageAlt', 'Texto alternativo del retrato'),
      shortField('photoEyebrow', 'Etiqueta del retrato'),
      stringField('photoHeading', 'Título del retrato'),
      stringsField('values', 'Principios'),
      imageField('collaborationImage', 'Fotografía de colaboración'),
      shortField('collaborationAlt', 'Texto alternativo de colaboración'),
      shortField('collaborationEyebrow', 'Etiqueta de colaboración'),
      stringField('collaborationHeading', 'Título de colaboración'),
      linkField('collaborationLink', 'Enlace de colaboración'),
    ],
  }),
  defineField({
    name: 'projects',
    title: 'Proyectos destacados',
    type: 'object',
    fields: [
      ...sectionFields,
      shortField('footerText', 'Texto de cierre'),
      linkField('cta', 'Ver todos los proyectos'),
    ],
  }),
  defineField({
    name: 'services',
    title: 'Servicios',
    type: 'object',
    fields: [
      ...sectionFields,
      linkField('cta', 'Llamada a la acción'),
      defineField({
        name: 'items',
        title: 'Servicios',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              shortField('step', 'Número'),
              shortField('icon', 'Símbolo'),
              shortField('name', 'Nombre'),
              stringField('description', 'Descripción', 3),
              stringsField('deliverables', 'Entregables'),
            ],
            preview: { select: { title: 'name', subtitle: 'step' } },
          }),
        ],
      }),
    ],
  }),
  defineField({
    name: 'expertise',
    title: 'Proceso',
    type: 'object',
    fields: [
      ...sectionFields,
      defineField({
        name: 'items',
        title: 'Etapas',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [shortField('name', 'Nombre'), stringField('description', 'Descripción', 3)],
            preview: { select: { title: 'name' } },
          }),
        ],
      }),
    ],
  }),
  defineField({
    name: 'cta',
    title: 'Llamada final',
    type: 'object',
    fields: [
      ...sectionFields,
      linkField('button', 'Botón principal'),
      linkField('secondaryCta', 'Enlace secundario'),
    ],
  }),
]);

const about = singleton('about', 'Sobre mí', [
  ...seoFields,
  defineField({ name: 'intro', title: 'Presentación', type: 'intro' }),
  defineField({
    name: 'banner',
    title: 'Banner',
    type: 'object',
    fields: [
      imageField('image', 'Imagen'),
      shortField('imageAlt', 'Texto alternativo'),
      shortField('eyebrow', 'Antetítulo'),
      stringField('heading', 'Título'),
    ],
  }),
  defineField({
    name: 'values',
    title: 'Valores',
    type: 'object',
    fields: [
      ...sectionFields,
      defineField({
        name: 'items',
        title: 'Principios',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [shortField('name', 'Nombre'), stringField('description', 'Descripción', 3)],
            preview: { select: { title: 'name' } },
          }),
        ],
      }),
    ],
  }),
  defineField({
    name: 'note',
    title: 'Nota personal',
    type: 'object',
    fields: [...sectionFields, linkField('cta', 'Enlace')],
  }),
]);

const services = singleton('services', 'Servicios', [
  ...seoFields,
  defineField({ name: 'intro', title: 'Presentación', type: 'intro' }),
  defineField({
    name: 'deliverables',
    title: 'Presentación de entregables',
    type: 'object',
    fields: sectionFields,
  }),
]);

const pricing = singleton('pricing', 'Propuestas y preguntas', [
  ...seoFields,
  defineField({ name: 'introPage', title: 'Presentación', type: 'intro' }),
  shortField('eyebrow', 'Antetítulo de propuestas'),
  stringField('heading', 'Título de propuestas'),
  stringField('intro', 'Introducción de propuestas', 3),
  defineField({
    name: 'plans',
    title: 'Propuestas',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          shortField('eyebrow', 'Antetítulo'),
          shortField('name', 'Nombre'),
          stringField('description', 'Descripción', 3),
          shortField('price', 'Presupuesto'),
          defineField({ name: 'isFlagged', title: 'Destacado', type: 'boolean' }),
          shortField('action', 'Texto del botón'),
          shortField('href', 'Enlace'),
          stringsField('features', 'Características'),
        ],
        preview: { select: { title: 'name', subtitle: 'price' } },
      }),
    ],
  }),
  defineField({
    name: 'faq',
    title: 'Preguntas frecuentes',
    type: 'object',
    fields: [
      ...sectionFields,
      linkField('cta', 'Enlace'),
      defineField({
        name: 'items',
        title: 'Preguntas',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [shortField('title', 'Pregunta'), stringField('answer', 'Respuesta', 4)],
            preview: { select: { title: 'title' } },
          }),
        ],
      }),
    ],
  }),
]);

const caseStudies = singleton('caseStudies', 'Galería de proyectos', [
  ...seoFields,
  defineField({ name: 'intro', title: 'Presentación', type: 'intro' }),
  shortField('galleryLabel', 'Etiqueta de galería'),
  shortField('filterLabel', 'Etiqueta de filtros'),
  shortField('allLabel', 'Filtro: todos'),
  stringField('disclaimer', 'Aclaración sobre conceptos', 3),
  defineField({
    name: 'detail',
    title: 'Textos de las páginas de proyecto',
    type: 'object',
    fields: [
      shortField('conceptLabel', 'Prefijo de concepto'),
      shortField('backLabel', 'Volver a la galería'),
      shortField('projectLabel', 'Etiqueta de proyecto'),
      shortField('disciplineLabel', 'Etiqueta de disciplina'),
      shortField('typeLabel', 'Etiqueta de tipo'),
      shortField('typeText', 'Tipo de trabajo'),
      shortField('challengeEyebrow', 'Antetítulo del reto'),
      shortField('challengeHeading', 'Título del reto'),
      shortField('approachEyebrow', 'Antetítulo de la propuesta'),
      shortField('approachHeading', 'Título de la propuesta'),
      shortField('outcomeEyebrow', 'Antetítulo del resultado'),
      shortField('outcomeHeading', 'Título del resultado'),
      shortField('nextLabel', 'Siguiente proyecto'),
    ],
  }),
]);

const contact = singleton('contact', 'Contacto', [
  ...seoFields,
  shortField('eyebrow', 'Antetítulo'),
  stringField('extraText', 'Texto adicional', 3),
  linkField('scheduleLink', 'Agendar llamada'),
  linkField('backLink', 'Explorar servicios'),
  defineField({
    name: 'info',
    title: 'Información de contacto',
    type: 'object',
    fields: [
      shortField('addressLabel', 'Etiqueta de modalidad'),
      stringsField('addressLines', 'Modalidad'),
      shortField('phoneLabel', 'Etiqueta de teléfono'),
      shortField('phone', 'Teléfono'),
      shortField('emailLabel', 'Etiqueta de correo'),
      shortField('email', 'Correo'),
    ],
  }),
  defineField({
    name: 'form',
    title: 'Formulario',
    type: 'object',
    fields: [
      stringField('heading', 'Título'),
      stringField('text', 'Introducción', 3),
      shortField('nameLabel', 'Etiqueta de nombre'),
      shortField('namePlaceholder', 'Ejemplo de nombre'),
      shortField('emailLabel', 'Etiqueta de correo'),
      shortField('emailPlaceholder', 'Ejemplo de correo'),
      shortField('serviceLabel', 'Etiqueta de servicio'),
      shortField('servicePlaceholder', 'Selección inicial'),
      shortField('unsureOption', 'Opción sin servicio definido'),
      shortField('messageLabel', 'Etiqueta de mensaje'),
      stringField('messagePlaceholder', 'Ejemplo de mensaje', 3),
      stringField('note', 'Nota del formulario', 3),
      shortField('submitLabel', 'Botón de envío'),
      stringField('successMessage', 'Confirmación de envío', 3),
    ],
  }),
]);

const booking = singleton('booking', 'Agendar llamada', [
  ...seoFields,
  defineField({ name: 'intro', title: 'Presentación', type: 'intro' }),
  shortField('sectionLabel', 'Etiqueta de calendario'),
  shortField('calendarTitle', 'Título del calendario'),
  defineField({ name: 'calendarUrl', title: 'URL de TidyCal', type: 'url' }),
  shortField('fallbackText', 'Texto si no aparece'),
  shortField('fallbackLabel', 'Enlace alternativo'),
]);

const privacy = singleton('privacy', 'Privacidad', [
  ...seoFields,
  shortField('heading', 'Título'),
  shortField('updatedAt', 'Última actualización'),
  defineField({
    name: 'content',
    title: 'Contenido',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        marks: {
          annotations: [
            {
              name: 'link',
              title: 'Enlace',
              type: 'object',
              fields: [defineField({ name: 'href', title: 'URL', type: 'url' })],
            },
          ],
        },
      }),
    ],
  }),
]);

const notFound = singleton('notFound', 'Página 404', [
  ...seoFields,
  shortField('code', 'Código'),
  shortField('heading', 'Título'),
  stringField('text', 'Descripción', 3),
  linkField('cta', 'Botón'),
]);

const styleguide = singleton('styleguide', 'Identidad visual', [
  ...seoFields,
  ...sectionFields,
  defineField({
    name: 'colors',
    title: 'Paleta',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          shortField('name', 'Nombre'),
          shortField('hex', 'Color hexadecimal'),
          shortField('use', 'Uso'),
        ],
        preview: { select: { title: 'name', subtitle: 'hex' } },
      }),
    ],
  }),
  defineField({
    name: 'typography',
    title: 'Tipografía',
    type: 'object',
    fields: [...sectionFields, linkField('cta', 'Botón')],
  }),
]);

const project = defineType({
  name: 'project',
  title: 'Proyectos',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    shortField('title', 'Título'),
    shortField('category', 'Categoría del filtro'),
    shortField('discipline', 'Disciplina'),
    defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 0 }),
    defineField({ name: 'featured', title: 'Mostrar en inicio', type: 'boolean' }),
    defineField({
      name: 'visual',
      title: 'Diseño de la vista previa',
      type: 'string',
      options: {
        list: [
          { title: 'Tienda Alma', value: 'commerce' },
          { title: 'Panel Nexo', value: 'dashboard' },
          { title: 'App Ritmo', value: 'mobile-concept' },
          { title: 'Editorial Raíz', value: 'editorial-concept' },
        ],
      },
    }),
    imageField('image', 'Imagen del proyecto (opcional; sustituye la vista previa)'),
    shortField('imageAlt', 'Texto alternativo de imagen'),
    stringField('summary', 'Resumen', 3),
    stringField('challenge', 'Reto', 4),
    stringField('approach', 'Propuesta', 4),
    stringField('outcome', 'Qué explora', 4),
    stringsField('scope', 'Alcance'),
  ],
  preview: { select: { title: 'name', subtitle: 'category', media: 'image' } },
});

export const schemaTypes = [
  link,
  intro,
  site,
  home,
  about,
  services,
  pricing,
  caseStudies,
  contact,
  booking,
  privacy,
  notFound,
  styleguide,
  project,
];
