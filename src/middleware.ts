import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/login')) {
    return NextResponse.rewrite(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
