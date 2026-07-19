import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('jwt');
  
  if (!token && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login?redirect=' + request.nextUrl.pathname, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
