import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection.
 * 
 * Since we use Zustand with localStorage for session,
 * we can't read it in middleware (server-side).
 * Instead, we check for our mock cookie/header presence.
 * 
 * Note: In a real app, this would validate a JWT or 
 * session cookie. For this mock, we rely on client-side
 * route guards (see useAuthGuard hook).
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublic) {
    return NextResponse.next();
  }

  // For this mock implementation, we let the client handle
  // auth redirects since session is in localStorage.
  // In production, we'd check a cookie here.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
