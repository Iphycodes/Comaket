import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_KEY } from './_shared/constant';
import { AuthToken } from './_shared/helpers';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

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

  if (url.pathname === '/apps/giro-debit/settings') {
    url.pathname = '/apps/giro-debit/settings/profile-details';
    return NextResponse.redirect(url);
  }

  if (basePath === 'apps' && !isLoggedIn) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
