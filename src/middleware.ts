import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { AUTH_TOKEN_KEY } from './_shared/constant';
// import { jwtDecode } from 'jwt-decode';
// import { AuthToken } from './_shared/helpers';

// type AuthTokenReturnProps = {
//   isLoggedIn: boolean;
//   expiresAt: Date | null;
// };

// const AuthToken = (token: string | undefined): AuthTokenReturnProps => {
//   const defaultState = {
//     isLoggedIn: false,
//     expiresAt: null,
//   };
//   if (token) {
//     try {
//       const decoded: any = jwtDecode(token);
//       const sessionTimeExp = decoded.exp;
//       return {
//         isLoggedIn: sessionTimeExp > new Date().getTime() / 1000,
//         expiresAt: new Date(sessionTimeExp * 1000),
//       };
//     } catch (e) {
//       return defaultState;
//     }
//   }
//   return defaultState;
// };

export function middleware(request: NextRequest) {
  // const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  // const cookies = request.cookies.get(AUTH_TOKEN_KEY);
  // const { isLoggedIn } = AuthToken(cookies?.value);

  if (path.startsWith('/login')) {
    return NextResponse.rewrite(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
