import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isAuthJsEnabled } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  syncCheckoutSessionForUser,
  syncMembershipFromStripeForUser,
} from "@/lib/stripe-sync";

export async function POST(request: Request) {
  if (!isDatabaseConfigured() || !isAuthJsEnabled) {
    return NextResponse.json(
      { error: "Membership sync requires AUTH_MODE=authjs and DATABASE_URL.", code: "AUTH_NOT_READY" },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please sign in first.", code: "NOT_SIGNED_IN" },
      { status: 401 },
    );
  }

  let body: { sessionId?: string; mode?: "session" | "membership" } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const result = body.sessionId
    ? await syncCheckoutSessionForUser(body.sessionId, session.user.id)
    : await syncMembershipFromStripeForUser(session.user.id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Could not sync membership.", code: "SYNC_FAILED" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    subscriptionStatus: result.status,
  });
}
