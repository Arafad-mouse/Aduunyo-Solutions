import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default function middleware(request: NextRequest) {
  try {
    const publicPaths = [
      '/', '/services', '/loan', '/loan-application', '/our-product',
      '/contact', '/thank-you',
      '/auth/login', '/auth/register', '/auth/forgot-password',
      '/auth/update-password', '/auth/sign-up', '/auth/sign-up-success',
    ];

    const isPublicPath =
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/favicon.ico') ||
      publicPaths.some(path =>
        request.nextUrl.pathname === path ||
        (path !== '/' && request.nextUrl.pathname.startsWith(`${path}/`))
      );

    if (isPublicPath) return NextResponse.next();

    // Temporarily allow all requests to pass through
    // This helps identify if auth checking is causing the middleware failure
    console.log('Middleware: Processing protected path:', request.nextUrl.pathname);
    
    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login'; // fallback
    return NextResponse.redirect(url);
  }
}
