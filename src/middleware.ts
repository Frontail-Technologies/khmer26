import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/account',
  '/messages',
  '/post-ad',
  '/notifications',
  '/favorites',
];

// Session cookie names (30-day TTL) — dev and prod variants.
// We check only the long-lived session cookie, not the 15-minute access token cookie,
// to avoid redirect loops during the access-token-expired / in-refresh window.
// The application-level auth guard (useCurrentUser) provides authoritative validation.
const SESSION_COOKIE_DEV = 'k26_session_dev';
const SESSION_COOKIE_PROD = '__Secure-k26_session';

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  return cookies.has(SESSION_COOKIE_DEV) || cookies.has(SESSION_COOKIE_PROD);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    if (pathname.startsWith('/') && !pathname.startsWith('//')) {
      loginUrl.searchParams.set('next', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/messages/:path*',
    '/post-ad',
    '/notifications/:path*',
    '/favorites/:path*',
  ],
};
