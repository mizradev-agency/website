import { defineMiddleware } from 'astro:middleware';

function applySecurityHeaders(response: Response, pathname: string, url: URL) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (url.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }
  if (pathname === '/studio' || pathname.startsWith('/studio/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Static builds have no cookies or request headers; Pages applies _headers.
  if (context.isPrerendered) return next();

  const response = await next();
  return applySecurityHeaders(response, context.url.pathname, context.url);
});
