/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_VIA_GTM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
