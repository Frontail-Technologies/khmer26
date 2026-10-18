import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminHostname, normalizeHostname } from '@/lib/admin-host';

const PROTECTED_PREFIXES = [
  '/account',
  '/messages',
  '/post-ad',
  '/notifications',
  '/checkout',
];

// Session cookie names (30-day TTL) — dev and prod variants.
// We check only the long-lived session cookie, not the 15-minute access token cookie,
// to avoid redirect loops during the access-token-expired / in-refresh window.
// The application-level auth guard (useCurrentUser) provides authoritative validation.
const SESSION_COOKIE_DEV = 'k26_session_dev';
const SESSION_COOKIE_PROD = '__Secure-k26_session';

const ADMIN_INTERNAL_PREFIX = '/admin';

function getRequestHostname(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || request.headers.get('host') || request.nextUrl.host;

  return normalizeHostname(host);
}

function isLegacyAdminPath(pathname: string): boolean {
  return pathname === ADMIN_INTERNAL_PREFIX || pathname.startsWith(`${ADMIN_INTERNAL_PREFIX}/`);
}

function getPublicAdminPath(pathname: string): string {
  if (pathname === ADMIN_INTERNAL_PREFIX) return '/';
  return pathname.slice(ADMIN_INTERNAL_PREFIX.length) || '/';
}

function handleAdminHost(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isLegacyAdminPath(pathname)) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = getPublicAdminPath(pathname);
    return NextResponse.redirect(cleanUrl);
  }

  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = pathname === '/' ? ADMIN_INTERNAL_PREFIX : `${ADMIN_INTERNAL_PREFIX}${pathname}`;
  return NextResponse.rewrite(internalUrl);
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  return cookies.has(SESSION_COOKIE_DEV) || cookies.has(SESSION_COOKIE_PROD);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getRequestHostname(request);

  if (isAdminHostname(hostname)) {
    return handleAdminHost(request);
  }

  if (isLegacyAdminPath(pathname)) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = '/_not-found';
    notFoundUrl.search = '';
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    if (pathname.startsWith('/') && !pathname.startsWith('//')) {
      loginUrl.search = '';
      loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
