import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for api, static files, and images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}
