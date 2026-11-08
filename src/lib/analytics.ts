// Public identifiers, with build-time overrides for other environments.
export const tagManagerId = (
  import.meta.env.PUBLIC_GOOGLE_TAG_MANAGER_ID ?? 'GTM-N88V9RRN'
).trim();

export const tagManagerEnabled =
  import.meta.env.PROD && /^GTM-[A-Z0-9]+$/.test(tagManagerId);

// GA4 is configured inside the site's GTM container.
export const analyticsViaTagManager =
  tagManagerEnabled &&
  (import.meta.env.PUBLIC_GOOGLE_ANALYTICS_VIA_GTM ?? 'true') === 'true';
