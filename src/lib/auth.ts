import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { AstroCookies } from 'astro';

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = 'ks_session';
export const CSRF_COOKIE = 'ks_csrf';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MAX_PASSWORD_LENGTH = 128;
const MAX_USERNAME_LENGTH = 64;
const SCRYPT_KEYLEN = 64;

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_FAILURES = 5;
const RATE_LOCK_MS = 15 * 60 * 1000;

type RateEntry = { failures: number; windowStart: number; lockedUntil: number };
const attempts = new Map<string, RateEntry>();

type SessionPayload = {
  u: string;
  iat: number;
  exp: number;
};

export type CookieRequest = {
  url: URL;
  cookies: AstroCookies;
};

export function getAuthConfig() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? '';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';
  const sessionSecret = process.env.SESSION_SECRET?.trim() ?? '';
  const totpSecret = process.env.ADMIN_TOTP_SECRET?.trim() ?? '';

  return {
    username,
    passwordHash,
    sessionSecret,
    totpSecret,
    totpEnabled: totpSecret.length > 0,
  };
}

export function isAuthConfigured() {
  const { username, passwordHash, sessionSecret } = getAuthConfig();
  return username.length > 0 && passwordHash.length > 0 && sessionSecret.length >= 32;
}

export function cookieSecure(url: URL) {
  return url.protocol === 'https:';
}

export function sessionCookieOptions(url: URL) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: cookieSecure(url),
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

function csrfCookieOptions(url: URL) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: cookieSecure(url),
    path: '/',
    maxAge: 60 * 60,
  };
}

function hmac(secret: string, value: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, Buffer.alloc(left.length));
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createCsrfToken() {
  return randomBytes(32).toString('base64url');
}

export function setCsrfCookie(ctx: CookieRequest, token: string) {
  ctx.cookies.set(CSRF_COOKIE, token, csrfCookieOptions(ctx.url));
}

export function verifyCsrf(ctx: CookieRequest, token: string | undefined) {
  const cookieToken = ctx.cookies.get(CSRF_COOKIE)?.value;
  if (!token || !cookieToken) return false;
  return safeEqual(token, cookieToken);
}

export function signSession(username: string, secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    u: username,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `v1.${body}.${hmac(secret, body)}`;
}

export function readSession(token: string | undefined, secret: string): SessionPayload | null {
  if (!token || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return null;
  const [, body, signature] = parts;
  if (!body || !signature || !safeEqual(signature, hmac(secret, body))) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.u !== 'string' || typeof payload.exp !== 'number') return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession(ctx: CookieRequest) {
  const { sessionSecret } = getAuthConfig();
  if (!sessionSecret) return null;
  return readSession(ctx.cookies.get(SESSION_COOKIE)?.value, sessionSecret);
}

export function setSessionCookie(ctx: CookieRequest, username: string) {
  const { sessionSecret } = getAuthConfig();
  ctx.cookies.set(SESSION_COOKIE, signSession(username, sessionSecret), sessionCookieOptions(ctx.url));
}

export function clearAuthCookies(ctx: CookieRequest) {
  const base = { path: '/', secure: cookieSecure(ctx.url), sameSite: 'strict' as const };
  ctx.cookies.delete(SESSION_COOKIE, base);
  ctx.cookies.delete(CSRF_COOKIE, base);
}

export function isSameOrigin(request: Request, url: URL) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).origin === url.origin;
    } catch {
      return false;
    }
  }

  if (request.method === 'GET' || request.method === 'HEAD') return true;

  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).origin === url.origin;
  } catch {
    return false;
  }
}

export function isSafeAdminRedirect(path: string | null) {
  if (!path) return '/keystatic';
  if (!path.startsWith('/keystatic')) return '/keystatic';
  if (path.startsWith('//') || path.includes('\\')) return '/keystatic';
  return path;
}

export function getClientKey(request: Request, clientAddress: string) {
  return clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.lockedUntil > now) return true;
  if (now - entry.windowStart > RATE_WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return false;
}

export function registerLoginFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.windowStart > RATE_WINDOW_MS) {
    attempts.set(key, { failures: 1, windowStart: now, lockedUntil: 0 });
    return;
  }
  current.failures += 1;
  if (current.failures >= RATE_MAX_FAILURES) {
    current.lockedUntil = now + RATE_LOCK_MS;
  }
}

export function registerLoginSuccess(key: string) {
  attempts.delete(key);
}

export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const saltHex = parts[4];
  const hashHex = parts[5];
  if (!n || !r || !p || !saltHex || !hashHex) return false;

  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const actual = (await scryptAsync(password, salt, SCRYPT_KEYLEN, { N: n, r, p })) as Buffer;
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function base32Decode(input: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = input.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();
  let bits = '';
  for (const char of cleaned) {
    const value = alphabet.indexOf(char);
    if (value === -1) continue;
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number) {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter & 0xffffffff, 4);
  const digest = createHmac('sha1', secret).update(buf).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return (code % 10 ** 6).toString().padStart(6, '0');
}

export function verifyTotp(code: string, secret: string) {
  const cleaned = code.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleaned)) return false;
  const key = base32Decode(secret);
  if (key.length === 0) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let window = -1; window <= 1; window += 1) {
    if (safeEqual(cleaned, hotp(key, counter + window))) return true;
  }
  return false;
}

export async function authenticate(username: string, password: string, totpCode: string) {
  const config = getAuthConfig();
  if (!isAuthConfigured()) return false;
  if (username.length > MAX_USERNAME_LENGTH || password.length > MAX_PASSWORD_LENGTH) return false;

  const userOk = safeEqual(username, config.username);
  const passwordOk = await verifyPassword(password, config.passwordHash);
  const totpOk = config.totpEnabled ? verifyTotp(totpCode, config.totpSecret) : true;

  return userOk && passwordOk && totpOk;
}

export const LOGIN_ERROR_MESSAGE =
  'No se pudo iniciar sesión. Revisa los datos o espera unos minutos e inténtalo de nuevo.';
