import { config, fields, collection, singleton } from '@keystatic/core';

const text = (label: string) => fields.text({ label });
const paragraph = (label: string) => fields.text({ label, multiline: true });
const strings = (label: string) =>
  fields.array(text('Texto'), { label, itemLabel: (p) => p.value });
const image = (label: string) =>
  fields.image({ label, directory: 'public/assets', publicPath: '/assets/' });
const link = (label: string) =>
  fields.object({ text: text('Texto'), href: text('Enlace') }, { label });
const seo = {
  seoTitle: fields.text({ label: 'Título SEO', validation: { isRequired: true } }),
  seoDescription: fields.text({
    label: 'Descripción SEO',
    multiline: true,
    validation: { isRequired: true },
  }),
};
const intro = fields.object(
  {
    eyebrow: text('Antetítulo'),
    title: paragraph('Título'),
    text: paragraph('Descripción'),
    action: text('Texto del botón'),
    href: text('Enlace del botón'),
  },
  { label: 'Presentación' }
);
const section = {
  eyebrow: text('Antetítulo'),
  heading: paragraph('Título'),
  text: paragraph('Descripción'),
};
const page = <S extends Parameters<typeof singleton>[0]['schema']>(
  label: string,
  path: string,
  schema: S
) => singleton({ label, path: `src/content/pages/${path}`, schema: { ...seo, ...schema } });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Mizradev' },
    navigation: {
      Páginas: [
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
      Sitio: ['site'],
      Contenido: ['posts'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Cabecera y pie',
      path: 'src/content/site',
      schema: {
        brandName: text('Nombre de marca'),
        logoLight: image('Logo claro'),
        logoDark: image('Logo oscuro'),
        menuQuote: text('Frase del menú'),
        headerCta: link('Botón de cabecera'),
        contactLink: link('Contacto por escrito'),
        navLinks: fields.array(
          fields.object({ ref: text('Número'), name: text('Texto'), href: text('Enlace') }),
          { label: 'Navegación', itemLabel: (p) => p.fields.name.value }
        ),
        footerText: paragraph('Descripción del pie'),
        footerCta: link('Botón del pie'),
        copyright: text('Copyright (sin año ni marca)'),
        backToTop: text('Volver arriba'),
      },
    }),
    home: page('Inicio', 'home', {
      hero: fields.object(
        {
          ...section,
          cta: link('Botón principal'),
          secondaryCta: link('Botón secundario'),
          image: image('Fotografía principal'),
          imageAlt: text('Texto alternativo'),
          photoIndex: text('Etiqueta de fotografía'),
          showcaseHeading: paragraph('Título sobre fotografía'),
          showcaseText: text('Descripción sobre fotografía'),
          showcaseLink: link('Enlace sobre fotografía'),
          cornerLink: link('Enlace inferior'),
          captionLeft: text('Pie izquierdo'),
          captionRight: text('Pie derecho'),
        },
        { label: 'Hero' }
      ),
      specialties: strings('Especialidades del cintillo'),
      about: fields.object(
        {
          ...section,
          cta: link('Botón'),
          image: image('Retrato'),
          imageAlt: text('Texto alternativo del retrato'),
          photoEyebrow: text('Etiqueta del retrato'),
          photoHeading: paragraph('Título del retrato'),
          values: strings('Principios'),
          collaborationImage: image('Fotografía de colaboración'),
          collaborationAlt: text('Texto alternativo de colaboración'),
          collaborationEyebrow: text('Etiqueta de colaboración'),
          collaborationHeading: paragraph('Título de colaboración'),
          collaborationLink: link('Enlace de colaboración'),
        },
        { label: 'Sobre mí y colaboración' }
      ),
      projects: fields.object(
        { ...section, footerText: text('Texto de cierre'), cta: link('Ver todos los proyectos') },
        { label: 'Proyectos destacados' }
      ),
      services: fields.object(
        {
          ...section,
          cta: link('Llamada a la acción'),
          items: fields.array(
            fields.object({
              step: text('Número'),
              icon: text('Símbolo'),
              name: text('Nombre'),
              description: paragraph('Descripción'),
              deliverables: strings('Entregables'),
            }),
            { label: 'Servicios', itemLabel: (p) => p.fields.name.value }
          ),
        },
        { label: 'Servicios' }
      ),
      expertise: fields.object(
        {
          ...section,
          items: fields.array(
            fields.object({ name: text('Nombre'), description: paragraph('Descripción') }),
            { label: 'Etapas', itemLabel: (p) => p.fields.name.value }
          ),
        },
        { label: 'Proceso' }
      ),
      cta: fields.object(
        { ...section, button: link('Botón principal'), secondaryCta: link('Enlace secundario') },
        { label: 'Llamada final' }
      ),
    }),
    about: page('Sobre mí', 'about', {
      intro,
      banner: fields.object(
        {
          image: image('Imagen'),
          imageAlt: text('Texto alternativo'),
          eyebrow: text('Antetítulo'),
          heading: paragraph('Título'),
        },
        { label: 'Banner' }
      ),
      values: fields.object(
        {
          ...section,
          items: fields.array(
            fields.object({ name: text('Nombre'), description: paragraph('Descripción') }),
            { label: 'Principios', itemLabel: (p) => p.fields.name.value }
          ),
        },
        { label: 'Valores' }
      ),
      note: fields.object({ ...section, cta: link('Enlace') }, { label: 'Nota personal' }),
    }),
    services: page('Servicios', 'services', {
      intro,
      deliverables: fields.object(section, { label: 'Presentación de entregables' }),
    }),
    pricing: page('Propuestas y preguntas', 'pricing', {
      introPage: intro,
      eyebrow: text('Antetítulo de propuestas'),
      heading: paragraph('Título de propuestas'),
      intro: paragraph('Introducción de propuestas'),
      plans: fields.array(
        fields.object({
          eyebrow: text('Antetítulo'),
          name: text('Nombre'),
          description: paragraph('Descripción'),
          price: text('Presupuesto'),
          isFlagged: fields.checkbox({ label: 'Destacado' }),
          action: text('Texto del botón'),
          href: text('Enlace'),
          features: strings('Características'),
        }),
        { label: 'Propuestas', itemLabel: (p) => p.fields.name.value }
      ),
      faq: fields.object(
        {
          ...section,
          cta: link('Enlace'),
          items: fields.array(
            fields.object({ title: text('Pregunta'), answer: paragraph('Respuesta') }),
            { label: 'Preguntas', itemLabel: (p) => p.fields.title.value }
          ),
        },
        { label: 'Preguntas frecuentes' }
      ),
    }),
    caseStudies: page('Galería de proyectos', 'case-studies', {
      intro,
      galleryLabel: text('Etiqueta de galería'),
      filterLabel: text('Etiqueta de filtros'),
      allLabel: text('Filtro: todos'),
      disclaimer: paragraph('Aclaración sobre conceptos'),
      detail: fields.object(
        {
          conceptLabel: text('Prefijo de concepto'),
          backLabel: text('Volver a la galería'),
          projectLabel: text('Etiqueta de proyecto'),
          disciplineLabel: text('Etiqueta de disciplina'),
          typeLabel: text('Etiqueta de tipo'),
          typeText: text('Tipo de trabajo'),
          challengeEyebrow: text('Antetítulo del reto'),
          challengeHeading: text('Título del reto'),
          approachEyebrow: text('Antetítulo de la propuesta'),
          approachHeading: text('Título de la propuesta'),
          outcomeEyebrow: text('Antetítulo del resultado'),
          outcomeHeading: text('Título del resultado'),
          nextLabel: text('Siguiente proyecto'),
        },
        { label: 'Textos de las páginas de proyecto' }
      ),
    }),
    contact: page('Contacto', 'contact', {
      eyebrow: text('Antetítulo'),
      extraText: paragraph('Texto adicional'),
      scheduleLink: link('Agendar llamada'),
      backLink: link('Explorar servicios'),
      info: fields.object(
        {
          addressLabel: text('Etiqueta de modalidad'),
          addressLines: strings('Modalidad'),
          phoneLabel: text('Etiqueta de teléfono'),
          phone: text('Teléfono'),
          emailLabel: text('Etiqueta de correo'),
          email: text('Correo'),
        },
        { label: 'Información de contacto' }
      ),
      form: fields.object(
        {
          heading: paragraph('Título'),
          text: paragraph('Introducción'),
          nameLabel: text('Etiqueta de nombre'),
          namePlaceholder: text('Ejemplo de nombre'),
          emailLabel: text('Etiqueta de correo'),
          emailPlaceholder: text('Ejemplo de correo'),
          serviceLabel: text('Etiqueta de servicio'),
          servicePlaceholder: text('Selección inicial'),
          unsureOption: text('Opción sin servicio definido'),
          messageLabel: text('Etiqueta de mensaje'),
          messagePlaceholder: paragraph('Ejemplo de mensaje'),
          note: paragraph('Nota del formulario'),
          submitLabel: text('Botón de envío'),
          successMessage: paragraph('Confirmación de envío'),
        },
        { label: 'Formulario' }
      ),
    }),
    booking: page('Agendar llamada', 'booking', {
      intro,
      sectionLabel: text('Etiqueta de calendario'),
      calendarTitle: text('Título del calendario'),
      calendarUrl: fields.url({ label: 'URL de TidyCal' }),
      fallbackText: text('Texto si no aparece'),
      fallbackLabel: text('Enlace alternativo'),
    }),
    privacy: singleton({
      label: 'Privacidad',
      path: 'src/content/pages/privacy',
      format: { contentField: 'content' },
      schema: {
        ...seo,
        heading: text('Título'),
        updatedAt: text('Última actualización'),
        content: fields.markdoc({ label: 'Contenido' }),
      },
    }),
    notFound: page('Página 404', 'not-found', {
      code: text('Código'),
      heading: text('Título'),
      text: paragraph('Descripción'),
      cta: link('Botón'),
    }),
    styleguide: page('Identidad visual', 'styleguide', {
      ...section,
      colors: fields.array(
        fields.object({ name: text('Nombre'), hex: text('Color hexadecimal'), use: text('Uso') }),
        { label: 'Paleta', itemLabel: (p) => p.fields.name.value }
      ),
      typography: fields.object({ ...section, cta: link('Botón') }, { label: 'Tipografía' }),
    }),
  },
  collections: {
    posts: collection({
      label: 'Proyectos',
      columns: ['name', 'category', 'order', 'featured'],
      slugField: 'name',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre', validation: { isRequired: true } } }),
        title: text('Título'),
        category: text('Categoría del filtro'),
        discipline: text('Disciplina'),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
        featured: fields.checkbox({ label: 'Mostrar en inicio' }),
        visual: fields.select({
          label: 'Diseño de la vista previa',
          defaultValue: 'commerce',
          options: [
            { label: 'Tienda Alma', value: 'commerce' },
            { label: 'Panel Nexo', value: 'dashboard' },
            { label: 'App Ritmo', value: 'mobile-concept' },
            { label: 'Editorial Raíz', value: 'editorial-concept' },
          ],
        }),
        image: image('Imagen del proyecto (opcional; sustituye la vista previa)'),
        imageAlt: text('Texto alternativo de imagen'),
        summary: paragraph('Resumen'),
        challenge: paragraph('Reto'),
        approach: paragraph('Propuesta'),
        outcome: paragraph('Qué explora'),
        scope: strings('Alcance'),
      },
    }),
  },
});
