"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn as authSignIn, signOut as authSignOut, isAuthJsEnabled } from "@/auth";
import type { Session, SubscriptionStatus } from "./types";
import { SESSION_COOKIE_NAME, USE_MOCK_AUTH } from "./constants";
import { AuthError } from "next-auth";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function buildMockSession(
  email: string,
  name: string,
  subscriptionStatus: SubscriptionStatus = "none",
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

async function setMockSessionCookie(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function credentialsSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing-fields");
  }

  if (USE_MOCK_AUTH) {
    redirect("/login?error=use-mock-dev-form");
  }

  if (!isAuthJsEnabled) {
    redirect("/login?error=auth-not-configured");
  }

  try {
    await authSignIn("credentials", {
      email,
      password,
      redirectTo: "/app",
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=invalid-credentials");
    }
    throw error;
  }
}

/** Dev-only mock sign-in when AUTH_MODE=mock */
export async function mockSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const plan = String(formData.get("plan") ?? "none");

  if (!email) {
    redirect("/login?error=missing-email");
  }

  if (!USE_MOCK_AUTH) {
    redirect("/login?error=mock-disabled");
  }

  const subscriptionStatus: SubscriptionStatus =
    plan === "active" ? "active" : plan === "trialing" ? "trialing" : "none";

  await setMockSessionCookie(buildMockSession(email, name, subscriptionStatus));
  redirect("/app");
}

export async function signOut() {
  if (USE_MOCK_AUTH) {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/");
  }
  await authSignOut({ redirectTo: "/" });
}
