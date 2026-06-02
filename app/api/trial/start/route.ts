import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { isAuthJsEnabled } from "@/auth";
import { prismaToAppStatus } from "@/lib/subscription";
import { addTrialDays, isStripePaidStatus } from "@/lib/trial";

export async function POST() {
  if (!isDatabaseConfigured() || !isAuthJsEnabled) {
    return NextResponse.json(
      {
        error: "Free trial requires AUTH_MODE=authjs and DATABASE_URL.",
        code: "AUTH_NOT_READY",
      },
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found.", code: "USER_NOT_FOUND" }, { status: 404 });
  }

  const subscriptionStatus = prismaToAppStatus(user.subscription?.status);
  if (isStripePaidStatus(subscriptionStatus)) {
    return NextResponse.json(
      {
        error: "You already have an active membership.",
        code: "ALREADY_PAID",
      },
      { status: 400 },
    );
  }

  if (user.trialUsed || user.trialStartedAt) {
    return NextResponse.json(
      {
        error: "Your free trial has already been used on this account.",
        code: "TRIAL_ALREADY_USED",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const trialEndsAt = addTrialDays(now);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      trialStartedAt: now,
      trialEndsAt,
      trialUsed: true,
    },
  });

  return NextResponse.json({
    ok: true,
    redirect: "/app?trial=started",
    trialEndsAt: trialEndsAt.toISOString(),
  });
}
