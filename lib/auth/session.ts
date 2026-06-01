import { cookies } from "next/headers";
import { auth as authJs, isAuthJsEnabled } from "@/auth";
import type { Session, SessionUser, SubscriptionStatus } from "./types";
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

async function getMockSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return parseMockSession(decodeURIComponent(raw));
}

async function getAuthJsSession(): Promise<Session | null> {
  const session = await authJs();
  if (!session?.user?.email) return null;

  const sub = (session.user as { subscriptionStatus?: SubscriptionStatus })
    .subscriptionStatus ?? "none";

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? session.user.email.split("@")[0],
      role: ((session.user as { role?: string }).role ?? "user") as SessionUser["role"],
      subscriptionStatus: sub,
    },
    expiresAt: session.expires ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Unified session for app code. Uses mock cookies or Auth.js based on AUTH_MODE.
 */
export async function getSession(): Promise<Session | null> {
  if (USE_MOCK_AUTH) return getMockSession();
  if (isAuthJsEnabled) return getAuthJsSession();
  return getMockSession();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export function hasPaidAccess(user: SessionUser | null): boolean {
  if (!user) return false;
  return user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
}

export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}
