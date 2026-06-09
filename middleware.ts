// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the auth token from cookies
  const token = request.cookies.get('auth_token');

  // 2. Define the path we want to protect
  const isPosPath = request.nextUrl.pathname.startsWith('/pos');

  // 3. If the user is trying to access /pos but has no token, redirect to login
  if (isPosPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Otherwise, continue with the request
  return NextResponse.next();
}

// 5. IMPORTANT: Only trigger this middleware for the /pos path and its sub-paths
export const config = {
  matcher: ['/pos/:path*'],
};