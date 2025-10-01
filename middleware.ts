import { NextResponse, type NextRequest } from 'next/server';

// Minimal matcher - only run on non-static files
// This is the safest matcher for Edge Runtime
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// List of paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/services',
  '/loan',
  '/loan-application',
  '/our-product',
  '/contact',
  '/thank-you',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/sign-up',
  '/auth/sign-up-success',
  '/api', // Allow all API routes through
];

// Helper to check if path is public
function isPublicPath(pathname: string): boolean {
  // Check exact matches
  if (PUBLIC_PATHS.includes(pathname)) return true;
  
  // Check path prefixes (e.g., /auth/...)
  return PUBLIC_PATHS.some(
    (path) => path !== '/' && pathname.startsWith(path)
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow all API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 2. Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 3. Check for auth tokens
  const hasAuthToken = 
    request.cookies.has('sb-access-token') || 
    request.cookies.has('sb-refresh-token');

  // 4. If no auth token, redirect to login
  if (!hasAuthToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. User is authenticated, allow the request
  return NextResponse.next();
}
