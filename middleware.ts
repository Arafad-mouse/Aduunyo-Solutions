// Empty middleware file for testing
import { NextResponse } from 'next/server';

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'] // Minimal matcher to reduce scope
};
