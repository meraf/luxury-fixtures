import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  
  console.log("Middleware checking access to:", request.nextUrl.pathname);
  console.log("Token present:", !!token);

  if (!token) {
    console.log("No token found. Redirecting to /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pos/:path*'],
};