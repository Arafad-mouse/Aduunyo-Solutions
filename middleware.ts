import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Match all paths except API, static files, and images
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default function middleware(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;

    // List of public paths that do not require auth
    const publicPaths = [
      '/', '/services', '/loan', '/loan-application', '/our-product',
      '/contact', '/thank-you',
      '/auth/login', '/auth/register', '/auth/forgot-password',
      '/auth/update-password', '/auth/sign-up', '/auth/sign-up-success',
    ];

    // Check if current path is public, API route, or static
    const isPublicPath =
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      publicPaths.includes(pathname) ||
      publicPaths.some(path => path !== '/' && pathname.startsWith(`${path}/`));

    if (isPublicPath) {
      return NextResponse.next();
    }

    // Check for authentication cookies (edge-safe)
    const accessToken = req.cookies.get('sb-access-token')?.value ?? null;
    const refreshToken = req.cookies.get('sb-refresh-token')?.value ?? null;

    if (!accessToken && !refreshToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    // Allow request to continue
    return NextResponse.next();

  } catch (error) {
    console.error('Edge Middleware Error:', error);

    // Fallback redirect on error
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
}
