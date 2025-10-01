import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for api, static files, and images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  // List of public paths that don't require authentication
  const publicPaths = [
    '/',                 // Home
    '/services',         // Our Partners & Clients page
    '/loan',             // Apply Now page
    '/loan-application', // Alternate apply path
    '/our-product',      // Products page (singular dir)
    '/contact',
    '/thank-you',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/sign-up',
    '/auth/sign-up-success',
  ];

  // Check if the current path is public, an API route, or a static file
  const isPublicPath = 
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    publicPaths.some(path => 
      request.nextUrl.pathname === path || 
      (path !== '/' && request.nextUrl.pathname.startsWith(`${path}/`))
    );

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for Supabase session cookies
  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  
  // Simple check - if no session cookies exist, redirect to login
  // The actual session validation will happen on the server-side
  if (!accessToken && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return NextResponse.next();
}
