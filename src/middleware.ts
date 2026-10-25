import { defineMiddleware } from 'astro:middleware';
import {
  CSRF_COOKIE,
  SESSION_COOKIE,
  getSession,
  isSameOrigin,
  sessionCookieOptions,
} from './lib/auth';

const ADMIN_PREFIXES = ['/keystatic', '/api/keystatic'];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isAdminPath(pathname: string) {
  return ADMIN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

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
  if (isAdminPath(pathname) || pathname === '/login' || pathname === '/logout') {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Static builds have no cookies or request headers; Pages applies _headers.
  if (context.isPrerendered) return next();

  const { pathname } = context.url;
  const session = getSession(context);

  if (MUTATING_METHODS.has(context.request.method) && isAdminPath(pathname)) {
    if (!isSameOrigin(context.request, context.url)) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  if (isAdminPath(pathname) && !session) {
    if (pathname.startsWith('/api/')) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    const nextPath = encodeURIComponent(`${pathname}${context.url.search}`);
    return context.redirect(`/login?next=${nextPath}`);
  }

  const response = await next();
  applySecurityHeaders(response, pathname, context.url);

  if (session && response.status < 400) {
    const token = context.cookies.get(SESSION_COOKIE)?.value;
    const csrf = context.cookies.get(CSRF_COOKIE)?.value;
    if (token) {
      context.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(context.url));
    }
    if (csrf) {
      context.cookies.set(CSRF_COOKIE, csrf, {
        httpOnly: true,
        sameSite: 'strict',
        secure: context.url.protocol === 'https:',
        path: '/',
        maxAge: 60 * 60,
      });
    }
  }

  return response;
});
