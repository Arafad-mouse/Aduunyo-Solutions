import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request's cookies.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request's cookies.
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // This will refresh the user's session if it's expired.
  const { data: { user } } = await supabase.auth.getUser();

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
    publicPaths.some(path => 
      request.nextUrl.pathname === path || 
      (path !== '/' && request.nextUrl.pathname.startsWith(`${path}/`))
    );

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return response;
}
