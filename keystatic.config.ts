import { config, fields, collection, singleton } from '@keystatic/core';

const seoFields = {
  seoTitle: fields.text({ label: 'Título SEO', validation: { isRequired: true } }),
  seoDescription: fields.text({
    label: 'Descripción SEO',
    multiline: true,
    validation: { isRequired: true },
  }),
};

const linkFields = {
  text: fields.text({ label: 'Texto', validation: { isRequired: true } }),
  href: fields.text({ label: 'Enlace', validation: { isRequired: true } }),
};

const assetImage = (label: string) =>
  fields.image({
    label,
    directory: 'public/assets',
    publicPath: '/assets/',
  });

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Mizradev' },
    navigation: {
      Páginas: ['home', 'about', 'pricing', 'contact', 'privacy', 'notFound', 'styleguide'],
      Sitio: ['site'],
      Contenido: ['posts'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Cabecera y pie',
      path: 'src/content/site',
      schema: {
        brandName: fields.text({ label: 'Nombre de marca', validation: { isRequired: true } }),
        logoLight: assetImage('Logo (claro)'),
        logoDark: assetImage('Logo (oscuro)'),
        menuQuote: fields.text({ label: 'Cita del menú', multiline: true }),
        navLinks: fields.array(
          fields.object({
            ref: fields.text({ label: 'Número' }),
            name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
            href: fields.text({ label: 'Enlace', validation: { isRequired: true } }),
          }),
          { label: 'Navegación', itemLabel: (props) => props.fields.name.value },
        ),
        footerText: fields.text({ label: 'Texto del pie', multiline: true }),
        copyright: fields.text({ label: 'Copyright' }),
        footerGroups: fields.array(
          fields.object({
            header: fields.text({ label: 'Título del grupo', validation: { isRequired: true } }),
            links: fields.array(
              fields.object({
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                href: fields.text({ label: 'Enlace', validation: { isRequired: true } }),
                isExternal: fields.checkbox({ label: 'Enlace externo', defaultValue: false }),
              }),
              { label: 'Enlaces', itemLabel: (props) => props.fields.name.value },
            ),
          }),
          { label: 'Grupos del pie', itemLabel: (props) => props.fields.header.value },
        ),
      },
    }),
    home: singleton({
      label: 'Inicio',
      path: 'src/content/pages/home',
      schema: {
        ...seoFields,
        hero: fields.object(
          {
            heading: fields.text({ label: 'Título', multiline: true, validation: { isRequired: true } }),
            text: fields.text({ label: 'Subtítulo', multiline: true }),
            cta: fields.object(linkFields, { label: 'Botón' }),
            image: assetImage('Imagen'),
            heroImg: fields.image({
              label: 'heroImg',
              directory: 'public/assets/',
            }),
            imageAlt: fields.text({ label: 'Texto alternativo de la imagen' }),
          },
          { label: 'Hero' },
        ),
        services: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            items: fields.array(
              fields.object({
                step: fields.text({ label: 'Paso' }),
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                description: fields.text({ label: 'Descripción', multiline: true }),
              }),
              { label: 'Servicios', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Servicios' },
        ),
        expertise: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                description: fields.text({ label: 'Descripción', multiline: true }),
              }),
              { label: 'Áreas', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Expertise' },
        ),
        about: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
            cta: fields.object(linkFields, { label: 'Botón' }),
          },
          { label: 'Sobre nosotros' },
        ),
        testimonials: fields.object(
          {
            heading: fields.text({ label: 'Título', multiline: true }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                description: fields.text({ label: 'Cargo' }),
                image: assetImage('Foto'),
                message: fields.text({ label: 'Mensaje', multiline: true }),
                rating: fields.integer({ label: 'Estrellas', defaultValue: 3, validation: { min: 1, max: 5 } }),
              }),
              { label: 'Testimonios', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Testimonios' },
        ),
        cta: fields.object(
          {
            heading: fields.text({ label: 'Título', multiline: true }),
            text: fields.text({ label: 'Texto', multiline: true }),
            button: fields.object(linkFields, { label: 'Botón' }),
          },
          { label: 'Llamada a la acción' },
        ),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/pages/about',
      schema: {
        ...seoFields,
        heading: fields.text({ label: 'Título', validation: { isRequired: true } }),
        intro: fields.text({ label: 'Introducción', multiline: true }),
        mission: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            image: assetImage('Imagen'),
            imageAlt: fields.text({ label: 'Texto alternativo de la imagen' }),
            paragraphs: fields.array(fields.text({ label: 'Párrafo', multiline: true }), {
              label: 'Párrafos',
              itemLabel: (props) => props.value.slice(0, 48) || 'Párrafo',
            }),
            stats: fields.array(
              fields.object({
                name: fields.text({ label: 'Etiqueta', validation: { isRequired: true } }),
                value: fields.text({ label: 'Valor', validation: { isRequired: true } }),
              }),
              { label: 'Estadísticas', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Misión' },
        ),
        values: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            items: fields.array(
              fields.object({
                ref: fields.text({ label: 'Número' }),
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                description: fields.text({ label: 'Descripción', multiline: true }),
              }),
              { label: 'Valores', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Valores' },
        ),
        team: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            members: fields.array(
              fields.object({
                name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
                job: fields.text({ label: 'Puesto' }),
                image: assetImage('Foto'),
              }),
              { label: 'Equipo', itemLabel: (props) => props.fields.name.value },
            ),
          },
          { label: 'Equipo' },
        ),
      },
    }),
    pricing: singleton({
      label: 'Pricing',
      path: 'src/content/pages/pricing',
      schema: {
        ...seoFields,
        heading: fields.text({ label: 'Título', validation: { isRequired: true } }),
        intro: fields.text({ label: 'Introducción', multiline: true }),
        plans: fields.array(
          fields.object({
            name: fields.text({ label: 'Nombre', validation: { isRequired: true } }),
            description: fields.text({ label: 'Descripción', multiline: true }),
            price: fields.text({ label: 'Precio' }),
            periodicity: fields.text({ label: 'Periodicidad' }),
            isFlagged: fields.checkbox({ label: 'Destacado', defaultValue: false }),
            action: fields.text({ label: 'Texto del botón' }),
            href: fields.text({ label: 'Enlace del botón' }),
            features: fields.array(fields.text({ label: 'Característica' }), {
              label: 'Características',
              itemLabel: (props) => props.value,
            }),
          }),
          { label: 'Planes', itemLabel: (props) => props.fields.name.value },
        ),
        faq: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Pregunta', validation: { isRequired: true } }),
                answer: fields.text({ label: 'Respuesta', multiline: true }),
              }),
              { label: 'Preguntas', itemLabel: (props) => props.fields.title.value },
            ),
          },
          { label: 'FAQ' },
        ),
        cta: fields.object(
          {
            heading: fields.text({ label: 'Título', multiline: true }),
            text: fields.text({ label: 'Texto', multiline: true }),
            button: fields.object(linkFields, { label: 'Botón' }),
          },
          { label: 'Llamada a la acción' },
        ),
      },
    }),
    contact: singleton({
      label: 'Contact',
      path: 'src/content/pages/contact',
      schema: {
        ...seoFields,
        info: fields.object(
          {
            addressLabel: fields.text({ label: 'Etiqueta dirección (accesible)' }),
            addressLines: fields.array(fields.text({ label: 'Línea' }), {
              label: 'Dirección',
              itemLabel: (props) => props.value,
            }),
            phoneLabel: fields.text({ label: 'Etiqueta teléfono (accesible)' }),
            phone: fields.text({ label: 'Teléfono' }),
            emailLabel: fields.text({ label: 'Etiqueta email (accesible)' }),
            email: fields.text({ label: 'Email' }),
          },
          { label: 'Datos de contacto' },
        ),
        form: fields.object(
          {
            heading: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
            namePlaceholder: fields.text({ label: 'Placeholder nombre' }),
            emailPlaceholder: fields.text({ label: 'Placeholder email' }),
            messagePlaceholder: fields.text({ label: 'Placeholder mensaje' }),
            submitLabel: fields.text({ label: 'Texto del botón' }),
          },
          { label: 'Formulario' },
        ),
      },
    }),
    privacy: singleton({
      label: 'Privacy',
      path: 'src/content/pages/privacy',
      format: { contentField: 'content' },
      schema: {
        ...seoFields,
        heading: fields.text({ label: 'Título', validation: { isRequired: true } }),
        updatedAt: fields.text({ label: 'Fecha de actualización' }),
        content: fields.document({
          label: 'Contenido',
          formatting: true,
          dividers: true,
          links: true,
          lists: true,
        }),
      },
    }),
    notFound: singleton({
      label: '404',
      path: 'src/content/pages/not-found',
      schema: {
        ...seoFields,
        code: fields.text({ label: 'Código' }),
        heading: fields.text({ label: 'Título', validation: { isRequired: true } }),
        text: fields.text({ label: 'Texto', multiline: true }),
        cta: fields.object(linkFields, { label: 'Botón' }),
      },
    }),
    styleguide: singleton({
      label: 'Styleguide',
      path: 'src/content/pages/styleguide',
      schema: {
        ...seoFields,
        heading: fields.text({ label: 'Título', validation: { isRequired: true } }),
        colorsHeading: fields.text({ label: 'Título de colores' }),
        typographyHeading: fields.text({ label: 'Título de tipografía' }),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Proyectos',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
