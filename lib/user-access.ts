import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getSession, hasPaidAccess } from "@/lib/auth/session";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";
import { isAuthJsEnabled } from "@/auth";
import { prismaToAppStatus } from "@/lib/subscription";
import type { SessionUser, SubscriptionStatus } from "@/lib/auth/types";

export type UserAccess = {
  user: SessionUser | null;
  paid: boolean;
  subscriptionStatus: SubscriptionStatus;
  plan: string | null;
  currentPeriodEnd: Date | null;
  isAuthenticated: boolean;
};

const emptyAccess: UserAccess = {
  user: null,
  paid: false,
  subscriptionStatus: "none",
  plan: null,
  currentPeriodEnd: null,
  isAuthenticated: false,
};

/**
 * Canonical access helper — reads subscription from DB in authjs mode.
 * Use this for paywall, pricing, account, and dashboard checks.
 */
export async function getCurrentUserAccess(): Promise<UserAccess> {
  const session = await getSession();
  if (!session?.user) {
    return emptyAccess;
  }

  if (USE_MOCK_AUTH || !isAuthJsEnabled || !isDatabaseConfigured()) {
    const user = session.user;
    return {
      user,
      paid: hasPaidAccess(user),
      subscriptionStatus: user.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      isAuthenticated: true,
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!dbUser) {
    return {
      user: session.user,
      paid: hasPaidAccess(session.user),
      subscriptionStatus: session.user.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      isAuthenticated: true,
    };
  }

  const subscriptionStatus = prismaToAppStatus(dbUser.subscription?.status);
  const user: SessionUser = {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name ?? dbUser.email.split("@")[0],
    role: dbUser.role.toLowerCase() as SessionUser["role"],
    subscriptionStatus,
  };

  return {
    user,
    paid: subscriptionStatus === "active" || subscriptionStatus === "trialing",
    subscriptionStatus,
    plan: dbUser.subscription?.plan ?? null,
    currentPeriodEnd: dbUser.subscription?.currentPeriodEnd ?? null,
    isAuthenticated: true,
  };
}

export function isPaidAccess(access: UserAccess): boolean {
  return access.paid;
}
