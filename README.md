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
npm install
```

### Start

Once the installation is done, you can now run your app:

```
npm run dev
```

This runs the app in development mode. Open http://localhost:3000 to view it in the browser.

### Build

```
npm run build
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

### Acceso a Keystatic

El CMS está en `/keystatic` y requiere iniciar sesión en `/login`.

1. Copia `.env.example` a `.env` si todavía no existe.
2. Define `ADMIN_USERNAME`.
3. Ejecuta `npm run auth:hash` e introduce tu contraseña. Copia el hash
   resultante a `ADMIN_PASSWORD_HASH` conservando todos los signos `$`.
4. Ejecuta `npm run auth:secrets` y copia `SESSION_SECRET` al `.env`.
   `ADMIN_TOTP_SECRET` es opcional; configúralo solo si has añadido el secreto
   a tu aplicación de autenticación.
5. Reinicia `npm run dev` tras cambiar las credenciales.

Los comandos de npm cargan `.env` con Node antes de iniciar Astro para evitar
que la expansión de variables de Vite altere los signos `$` del hash scrypt.

Para ejecutar la compilación localmente, usa `npm run build` y después
`npm run serve` (Node.js 22.16 o superior). Este último comando carga `.env`
al arrancar. En un servidor también puedes inyectar las mismas variables
desde la configuración del alojamiento y ejecutar `node dist/server/entry.mjs`.
Los secretos se consultan en el servidor y no se incluyen en el cliente.
No publiques `.env` ni lo añadas al repositorio.

Keystatic utiliza almacenamiento local: el proceso necesita acceso de escritura
a `src/content` y `public/assets`, y esos archivos deben persistir en el servidor.

Ready to build and deploy your site? Follow the [official documentation](https://docs.astro.build/en/guides/deploy/).

## Support

If you have any questions or suggestions do not hesitate to contact me.

## License

This project is licensed under the terms of the MIT license.

### Contenidos del sitio

En Keystatic, **Páginas** contiene Inicio, Sobre mí, Servicios, Propuestas y preguntas,
Galería de proyectos, Contacto, Agendar llamada, Privacidad, Página 404 e Identidad visual.
**Cabecera y pie** controla la marca, los logotipos, la navegación y los enlaces globales.
Las secciones compartidas de servicios, proceso, presentación personal y llamada final
se editan en Inicio; las propuestas y preguntas se editan en Propuestas y preguntas.

En **Proyectos** puedes editar Alma, Nexo, Ritmo y Raíz, crear nuevos proyectos,
definir su orden y marcar cuáles aparecen en Inicio. Cada proyecto admite una imagen
con texto alternativo; si no se carga una imagen, conserva su vista previa de diseño.
Los proyectos y sus páginas se leen desde Keystatic en cada petición.

Las fotografías actuales del hero, retrato, colaboración y banner de Sobre mí están
seleccionadas en sus respectivos campos de imagen. Los textos de privacidad y de la
página 404 conservan el contenido que estaba publicado y ahora también se editan en el CMS.

### Cloudflare Pages (web pública)

La web pública se compila como HTML estático para Cloudflare Pages. Keystatic y
su autenticación siguen funcionando localmente mediante `pnpm dev`.

- Repositorio: `mizradev-agency/website`, rama de producción `main`.
- Node.js: `22` (definido en `.node-version`).
- Gestor de paquetes: `pnpm@10.15.1` (definido en `package.json`).
- Comando de compilación en Cloudflare: `pnpm install --frozen-lockfile && pnpm run build:pages`.
- Variables de compilación: `SKIP_DEPENDENCY_INSTALL=1`, `PNPM_VERSION=10.15.1` y `NODE_VERSION=22`.
  Estas variables se guardan en `wrangler.jsonc`. La instalación usa únicamente
  `pnpm-lock.yaml`; se retiró el lockfile obsoleto de Bun.
- Directorio de salida: `dist`.
- No se necesitan las variables `ADMIN_*` ni `SESSION_SECRET` en Cloudflare.

`astro.pages.config.mjs` conserva la configuración local y genera únicamente
las páginas públicas. Los casos de estudio se generan desde los proyectos del
CMS. No se publican la API de Keystatic, el formulario de acceso ni el servidor
Node. Las cabeceras de seguridad y redirecciones se generan en `dist/_headers`
y `dist/_redirects`. `wrangler.jsonc` configura Pages, no Workers.

Para publicar cambios de contenido: inicia `pnpm dev`, guarda tus cambios en
Keystatic y sube los archivos modificados a GitHub. La integración de Pages
reconstruye y publica la web tras cada push a `main`. En Pages, los cambios son
visibles después de esa compilación; la lectura inmediata sin recompilar se
mantiene en el servidor local.

Para un despliegue manual, autentícate con `pnpm exec wrangler login` y ejecuta
`pnpm run deploy:pages`. La creación inicial del proyecto debe hacerse con la
integración Git de Cloudflare para conservar los despliegues automáticos.

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
