import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { SESSION_COOKIE_NAME, USE_MOCK_AUTH } from "@/lib/auth/constants";

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

function mockMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname === "/app" || pathname.startsWith("/app/");

  if (isProtected && !hasValidMockSession(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

const authJsMiddleware = auth((request) => {
  const { pathname } = request.nextUrl;
  const isProtected = pathname === "/app" || pathname.startsWith("/app/");

  if (isProtected && !request.auth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export default USE_MOCK_AUTH ? mockMiddleware : authJsMiddleware;

export const config = {
  matcher: ["/app/:path*"],
};
