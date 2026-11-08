# Stone: Astro Theme

Stone is a free and open-source Astro theme specially designed for Business, Marketing, SaaS and Startup websites.

## Key Features:

- **Built with Tailwind CSS & Alpine.js**
- **5+ Pages**
- **15+ Sections**
- Clean & Modern Design
- Fully Responsive
- Dark & Light Mode
- Fast & Performant
- Super Lightweight
- View Transitions (experimental)
- **Prettier** Code Formatter
- **Google Fonts**
- **Remix Icons**
- Free Updates

## Getting Started

### Requirements

- Basic knowledge of Astro, HTML and CSS.
- Text editor (We recommend Visual Studio Code)
- Node.js 22.16 or higher.

### Install dependencies

Navigate to your project folder and install its dependencies:

```
pnpm install
```

### Start

Once the installation is done, you can now run your app:

```
pnpm dev
```

This runs the app in development mode. Open http://localhost:4321 to view it in the browser.

### Build

```
pnpm build
```

This builds the app for production to the `./dist/` folder.

## Project Structure

Inside the project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── .prettierrc
├── astro.config.mjs
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.cjs
└── tsconfig.json
```

- `public/*` - Any static assets (images, fonts, icons, ...)
- `src/*` - Project source code (components, pages, ...)
- `src/components/*` - Reusable Astro components used to build pages.
- `src/layouts/*` - Astro components that define the UI structure shared by one or more pages..
- `src/pages/*` - Astro components used to create new pages on your site. Each page is exposed as a route based on its file name.
- `.prettierrc` - Prettier configuration file.
- `astro.config.mjs` - Astro configuration file.
- `package.json` - File used by JavaScript package managers to manage your dependencies. It also defines the scripts that are commonly used to run Astro.
- `tailwind.config.cjs` - Tailwind configuration file. The theme section is where you define your color palette and fonts.
- `tsconfig.json` - TypeScript configuration file.

## Deployment

### Acceso a Sanity

El CMS está integrado en `/studio` y utiliza el proyecto `mizradev`
(`qpnmosrg`) con el dataset público `production`. Sanity gestiona el acceso con
la cuenta `mizradev@gmail.com`; la web no necesita credenciales administrativas
en `.env`.

Ejecuta `pnpm dev` y abre `http://localhost:4321/studio` para editar. Los cambios
deben publicarse en Studio antes de que la web pública pueda leerlos. Para
ejecutar la compilación localmente, usa `pnpm build` y después `pnpm serve`.

Ready to build and deploy your site? Follow the [official documentation](https://docs.astro.build/en/guides/deploy/).

## Support

If you have any questions or suggestions do not hesitate to contact me.

## License

This project is licensed under the terms of the MIT license.

### Contenidos del sitio

En Sanity Studio, los documentos únicos contienen Inicio, Sobre mí, Servicios, Propuestas y preguntas,
Galería de proyectos, Contacto, Agendar llamada, Privacidad, Página 404 e Identidad visual.
**Cabecera y pie** controla la marca, los logotipos, la navegación y los enlaces globales.
Las secciones compartidas de servicios, proceso, presentación personal y llamada final
se editan en Inicio; las propuestas y preguntas se editan en Propuestas y preguntas.

En **Proyectos** puedes editar Alma, Nexo, Ritmo y Raíz, crear nuevos proyectos,
definir su orden y marcar cuáles aparecen en Inicio. Cada proyecto admite una imagen
con texto alternativo; si no se carga una imagen, conserva su vista previa de diseño.
Los proyectos y sus páginas se leen desde Sanity durante cada compilación.

Las fotografías actuales del hero, retrato, colaboración y banner de Sobre mí están
seleccionadas en sus respectivos campos de imagen. Los textos de privacidad y de la
página 404 conservan el contenido que estaba publicado y ahora también se editan en el CMS.

### Cloudflare Pages (web pública)

La web pública y Sanity Studio se compilan como archivos estáticos para Cloudflare Pages.

- Repositorio: `mizradev-agency/website`, rama de producción `main`.
- Node.js: `22` (definido en `.node-version`).
- Gestor de paquetes: `pnpm@10.15.1` (definido en `package.json`).
- Comando de compilación en Cloudflare: `pnpm install --frozen-lockfile && pnpm run build:pages`.
- Variables de compilación: `SKIP_DEPENDENCY_INSTALL=1`, `PNPM_VERSION=10.15.1` y `NODE_VERSION=22`.
  Estas variables se guardan en `wrangler.jsonc`. La instalación usa únicamente
  `pnpm-lock.yaml`; se retiró el lockfile obsoleto de Bun.
- Directorio de salida: `dist`.
- No se necesitan secretos de Sanity para compilar porque el dataset es público.

`astro.pages.config.mjs` conserva la configuración local y genera las páginas
públicas junto con `/studio`. Los casos de estudio se generan desde los proyectos
de Sanity. Las cabeceras de seguridad y redirecciones se generan en `dist/_headers`
y `dist/_redirects`. `wrangler.jsonc` configura Pages, no Workers.

Para publicar cambios de contenido: edita y publica en Sanity Studio, y después
lanza una nueva compilación de Cloudflare Pages. Los cambios son visibles cuando
termina ese despliegue estático.

Para un despliegue manual, autentícate con `pnpm exec wrangler login` y ejecuta
`pnpm run deploy:pages`. La creación inicial del proyecto debe hacerse con la
integración Git de Cloudflare para conservar los despliegues automáticos.

### Instalación en celulares

`public/site.webmanifest` define el nombre Mizradev, el inicio en `/` y la
apertura en modo `standalone`. Los iconos PNG de 192 y 512 px, el icono
adaptable de Android y el `apple-touch-icon` de 180 px se derivan del archivo
original `public/assets/logo-icon.png`. El layout público enlaza el manifiesto
y los iconos y define el color de la aplicación.

Tras desplegar por HTTPS, en Android usa **Instalar aplicación / Añadir a la
pantalla de inicio**; en iPhone, **Compartir → Añadir a pantalla de inicio**.
Si ya habías añadido el sitio con otro icono, elimina el acceso anterior y
vuelve a añadirlo. Esta configuración permite instalar el sitio; requiere
conexión para cargar las páginas y enviar el formulario.

### Google Analytics 4

El sitio mide GA4 desde el contenedor de Google Tag Manager. La integración
directa de respaldo usa el ID `G-TWETP3RF3B` y está desactivada por defecto
para evitar duplicar visitas. Para cambiar el ID de la integración directa,
define `PUBLIC_GOOGLE_ANALYTICS_ID` con el ID de medición de tu flujo web de GA4.
En local se configura en `.env`; en Cloudflare Pages, añádelo
como variable de **compilación** y vuelve a compilar y desplegar. Es un
identificador público, no un secreto. El HTML estático conserva el valor de la
compilación: cambiarlo solo en tiempo de ejecución no actualiza la etiqueta.

Cuando se habilita la integración directa, la etiqueta se incluye en el layout de las páginas públicas únicamente en
producción y con un ID válido. No se carga con `pnpm dev`. Para desactivarla,
define `PUBLIC_GOOGLE_ANALYTICS_ID` con un
valor vacío y vuelve a compilar.

En GA4, conserva habilitada **Medición mejorada → Vistas de página → Cambios
de página basados en eventos del historial del navegador**. Esta opción mide
la navegación con `ClientRouter`; el sitio inicializa la etiqueta una sola vez
y no envía eventos `page_view` manuales que dupliquen esa medición.

Después de publicar, comprueba la visita inicial y la navegación entre páginas
con Google Tag Assistant y el informe **Tiempo real** de tu propiedad.
Referencia: [instalación oficial de gtag.js](https://developers.google.com/tag-platform/gtagjs).

### Google Tag Manager

El contenedor predeterminado es `GTM-N88V9RRN`. Para cambiarlo, define
`PUBLIC_GOOGLE_TAG_MANAGER_ID` en `.env` o como variable de compilación en
Cloudflare Pages y vuelve a compilar y desplegar. Para desactivarlo, define un
valor vacío y recompila. El contenedor
web se carga únicamente en producción con un ID válido. El script está al
inicio de `<head>` y el respaldo `noscript` al inicio de `<body>`, siguiendo la
[instalación oficial](https://support.google.com/tagmanager/answer/14847097?hl=es).
El contenedor se inicializa una sola vez durante la navegación de Astro y
usa `dataLayer` para las etiquetas configuradas dentro de GTM.

`PUBLIC_GOOGLE_ANALYTICS_VIA_GTM=true` es el valor predeterminado porque GA4 ya
está configurado en ese contenedor. Si cambias a otro contenedor que todavía
no incluye GA4, usa `PUBLIC_GOOGLE_ANALYTICS_VIA_GTM=false` para recuperar
la integración directa y recompila.
La desactivación solo se aplica cuando también existe un ID de GTM válido.

Comprueba el contenedor con **Vista previa / Tag Assistant**. Astro usa
`ClientRouter`: para etiquetas que deban ejecutarse en cada navegación, usa
activadores de cambios del historial. Para GA4 conserva la medición mejorada
del historial; evita añadir otro `page_view` para la misma navegación.
Los cambios en las etiquetas del contenedor deben publicarse desde GTM.

### Formulario de contacto: Resend + Turnstile

`/api/contact` se ejecuta como Pages Function; el resto del sitio sigue estático.
El servidor valida origen, tamaño y campos, el campo trampa y el token de Turnstile
(incluidos hostname y acción `contact`) antes de llamar a Resend. El destinatario
se define en el servidor. El correo del visitante se usa como `reply_to`, nunca
como remitente. No se envían respuestas automáticas al visitante.

Configura en **Pages → mizradev-website → Configuración → Variables y secretos**, en
producción, `RESEND_API_KEY` y `TURNSTILE_SECRET_KEY` como **secretos**.
La clave de Resend solo necesita permiso **Sending access**. Configura también
`TURNSTILE_SITE_KEY`, `CONTACT_HOSTNAME`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`.
Si se definen variables públicas en `wrangler.jsonc`, ese archivo es la fuente
para esas variables. Nunca pongas secretos ahí ni en variables `PUBLIC_*`.
Vuelve a desplegar después de configurar las variables.

Registra en Turnstile el hostname público exacto, con widget Managed. No uses
claves de prueba en producción. El handler comprueba `CONTACT_HOSTNAME` para
impedir envíos desde despliegues de preview. Para un dominio propio, actualiza
esa variable y la lista de hostnames permitidos en Turnstile.
El dominio de producción del formulario es `mizra.dev`, configurado en
`wrangler.jsonc`; los subdominios de despliegue de Pages quedan excluidos.

Resend Free permite 3.000 emails al mes y 100 al día. No habilites pagos por uso.
`onboarding@resend.dev` solo permite enviar al correo propietario de la cuenta;
para otro destinatario o un remitente de marca debes verificar un dominio en
Resend y configurar sus registros DNS. El formulario conserva los datos si falla
un envío y solo confirma éxito cuando Resend acepta el correo; aceptación no
implica entrega en la bandeja de entrada.

Para probar en local, copia `.dev.vars.example` a `.dev.vars` y usa
`pnpm build:pages && pnpm exec wrangler pages dev dist`. Para Astro local, añade
las mismas variables a `.env`. Las claves oficiales de prueba de Turnstile se
reservan a localhost. Ejecuta `node --test tests/contact.test.mjs` para comprobar
los rechazos de seguridad y el envío con proveedores simulados, sin enviar correos.
