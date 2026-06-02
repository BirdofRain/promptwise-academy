import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";
import { isAuthJsEnabled } from "@/auth";
import { prismaToAppStatus } from "@/lib/subscription";
import {
  canStartAppTrial,
  isAppTrialActive,
  isAppTrialExpired,
  isStripePaidStatus,
  trialDaysRemaining,
  type TrialFields,
} from "@/lib/trial";
import type { SessionUser, SubscriptionStatus } from "@/lib/auth/types";

export type UserAccess = {
  user: SessionUser | null;
  /** Stripe subscription is active or trialing */
  paid: boolean;
  /** Full academy access (paid subscription or active app trial) */
  hasFullAccess: boolean;
  isTrialing: boolean;
  isPaidSubscription: boolean;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  trialDaysRemaining: number | null;
  trialExpired: boolean;
  trialAvailable: boolean;
  trialAlreadyUsed: boolean;
  subscriptionStatus: SubscriptionStatus;
  plan: string | null;
  currentPeriodEnd: Date | null;
  isAuthenticated: boolean;
};

const emptyAccess: UserAccess = {
  user: null,
  paid: false,
  hasFullAccess: false,
  isTrialing: false,
  isPaidSubscription: false,
  trialStartedAt: null,
  trialEndsAt: null,
  trialDaysRemaining: null,
  trialExpired: false,
  trialAvailable: false,
  trialAlreadyUsed: false,
  subscriptionStatus: "none",
  plan: null,
  currentPeriodEnd: null,
  isAuthenticated: false,
};

function buildAccessFromTrialAndSubscription(params: {
  user: SessionUser;
  subscriptionStatus: SubscriptionStatus;
  plan: string | null;
  currentPeriodEnd: Date | null;
  trial: TrialFields;
}): UserAccess {
  const isPaidSubscription = isStripePaidStatus(params.subscriptionStatus);
  const appTrialActive = !isPaidSubscription && isAppTrialActive(params.trial);
  const trialExpired =
    !isPaidSubscription && !appTrialActive && isAppTrialExpired(params.trial);
  const hasFullAccess = isPaidSubscription || appTrialActive;

  return {
    user: params.user,
    paid: isPaidSubscription,
    hasFullAccess,
    isTrialing: appTrialActive,
    isPaidSubscription,
    trialStartedAt: params.trial.trialStartedAt,
    trialEndsAt: params.trial.trialEndsAt,
    trialDaysRemaining: appTrialActive
      ? trialDaysRemaining(params.trial.trialEndsAt)
      : null,
    trialExpired,
    trialAvailable: canStartAppTrial(params.trial, isPaidSubscription),
    trialAlreadyUsed: params.trial.trialUsed || Boolean(params.trial.trialStartedAt),
    subscriptionStatus: params.subscriptionStatus,
    plan: params.plan,
    currentPeriodEnd: params.currentPeriodEnd,
    isAuthenticated: true,
  };
}

/**
 * Canonical access helper — reads subscription and trial from DB in authjs mode.
 */
export async function getCurrentUserAccess(): Promise<UserAccess> {
  const session = await getSession();
  if (!session?.user) {
    return emptyAccess;
  }

  if (USE_MOCK_AUTH || !isAuthJsEnabled || !isDatabaseConfigured()) {
    const user = session.user;
    const mockTrial: TrialFields = {
      trialStartedAt: null,
      trialEndsAt: null,
      trialUsed: false,
    };
    return buildAccessFromTrialAndSubscription({
      user,
      subscriptionStatus: user.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      trial: mockTrial,
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!dbUser) {
    const user = session.user;
    return buildAccessFromTrialAndSubscription({
      user,
      subscriptionStatus: user.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      trial: { trialStartedAt: null, trialEndsAt: null, trialUsed: false },
    });
  }

  const subscriptionStatus = prismaToAppStatus(dbUser.subscription?.status);
  const user: SessionUser = {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name ?? dbUser.email.split("@")[0],
    role: dbUser.role.toLowerCase() as SessionUser["role"],
    subscriptionStatus,
  };

  return buildAccessFromTrialAndSubscription({
    user,
    subscriptionStatus,
    plan: dbUser.subscription?.plan ?? null,
    currentPeriodEnd: dbUser.subscription?.currentPeriodEnd ?? null,
    trial: {
      trialStartedAt: dbUser.trialStartedAt,
      trialEndsAt: dbUser.trialEndsAt,
      trialUsed: dbUser.trialUsed,
    },
  });
}

export function isPaidAccess(access: UserAccess): boolean {
  return access.hasFullAccess;
}
