import { cookies } from "next/headers";
import type { Session, SessionUser } from "./types";
import { SESSION_COOKIE_NAME, USE_MOCK_AUTH } from "./constants";

function parseMockSession(value: string): Session | null {
  try {
    const parsed = JSON.parse(value) as Session;
    if (!parsed?.user?.email || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt) < new Date()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Server-side session reader. Swap implementation when Auth.js is added.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  if (USE_MOCK_AUTH) {
    return parseMockSession(decodeURIComponent(raw));
  }

  // Future: return getAuthJsSession();
  return parseMockSession(decodeURIComponent(raw));
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export function hasPaidAccess(user: SessionUser | null): boolean {
  if (!user) return false;
  return user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
}
