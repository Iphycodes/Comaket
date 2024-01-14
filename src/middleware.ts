import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_KEY } from './_shared/constant';
import { AuthToken } from './_shared/helpers';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  // if (!request.cookies || typeof request.cookies.get !== 'function') {
  //   console.error('Cookies object or get method is not available.');
  //   return NextResponse.next();
  // }

  const cookies = request.cookies.get(AUTH_TOKEN_KEY);
  const { isLoggedIn } = AuthToken(cookies?.value);
  const basePath = url.pathname.split('/')[1];

  if (path.startsWith('/login')) {
    return NextResponse.rewrite(new URL('/auth/login', request.url));
  }

  if (url.pathname.split('/')[2] === 'business' && !isLoggedIn) {
    url.pathname = '/auth/register';
    return NextResponse.redirect(url);
  }

  if (basePath === 'app' && !isLoggedIn) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
