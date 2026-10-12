/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ADMIN_USERNAME?: string;
  readonly ADMIN_PASSWORD_HASH?: string;
  readonly SESSION_SECRET?: string;
  readonly ADMIN_TOTP_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
