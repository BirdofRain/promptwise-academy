"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, SubscriptionStatus } from "./types";
import { SESSION_COOKIE_NAME, USE_MOCK_AUTH } from "./constants";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function buildMockSession(
  email: string,
  name: string,
  subscriptionStatus: SubscriptionStatus = "active",
): Session {
  return {
    user: {
      id: `mock_${Buffer.from(email).toString("base64url").slice(0, 12)}`,
      email,
      name: name || email.split("@")[0],
      role: "user",
      subscriptionStatus,
    },
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
  };
}

async function setSessionCookie(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function mockSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const plan = String(formData.get("plan") ?? "active");

  if (!email) {
    redirect("/login?error=missing-email");
  }

  if (!USE_MOCK_AUTH) {
    redirect("/login?error=auth-not-configured");
  }

  const subscriptionStatus: SubscriptionStatus =
    plan === "none" ? "none" : plan === "trialing" ? "trialing" : "active";

  const session = buildMockSession(email, name, subscriptionStatus);
  await setSessionCookie(session);
  redirect("/app");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}
