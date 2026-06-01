import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

/**
 * Keep middleware edge-light — do NOT import auth.ts (pulls Prisma + bcrypt).
 * Full session validation runs in server components via getSession().
 */

const USE_MOCK_AUTH = process.env.AUTH_MODE === "mock";

const AUTHJS_SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
];

function hasValidMockSession(request: NextRequest): boolean {
  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return false;
  try {
    const session = JSON.parse(decodeURIComponent(raw));
    if (!session?.expiresAt) return false;
    return new Date(session.expiresAt) > new Date();
  } catch {
    return false;
  }
}

function hasAuthJsSessionCookie(request: NextRequest): boolean {
  return AUTHJS_SESSION_COOKIES.some((name) => Boolean(request.cookies.get(name)?.value));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname === "/app" || pathname.startsWith("/app/");

  if (!isProtected) {
    return NextResponse.next();
  }

  const authenticated = USE_MOCK_AUTH
    ? hasValidMockSession(request)
    : hasAuthJsSessionCookie(request);

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
