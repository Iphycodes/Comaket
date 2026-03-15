import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'token';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/login')) {
    return NextResponse.rewrite(new URL('/auth/login', request.url));
  }

  // Rewrite /@username → /creators/username (vanity URLs for creators)
  const atMatch = path.match(/^\/@(.+)$/);
  if (atMatch) {
    return NextResponse.rewrite(new URL(`/creators/${atMatch[1]}`, request.url));
  }

  // Redirect authenticated users from landing (/) to market
  if (path === '/') {
    const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
    if (token) {
      return NextResponse.redirect(new URL('/market', request.url));
    }
  }

  return NextResponse.next();
}
