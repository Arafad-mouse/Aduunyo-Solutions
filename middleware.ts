import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default function middleware(request: NextRequest) {
  // Just allow everything through for now - minimal middleware
  return NextResponse.next();
}
