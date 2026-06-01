import type { SubscriptionStatus as PrismaStatus } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import type { SubscriptionStatus } from "@/lib/auth/types";

export function prismaToAppStatus(status: PrismaStatus | null | undefined): SubscriptionStatus {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "TRIALING":
      return "trialing";
    case "CANCELED":
      return "canceled";
    case "PAST_DUE":
      return "past_due";
    default:
      return "none";
  }
}

export function appToPrismaStatus(status: SubscriptionStatus): PrismaStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    default:
      return "NONE";
  }
}

export async function getSubscriptionForUser(userId: string) {
  if (!isDatabaseConfigured()) return null;
  return prisma.subscription.findUnique({ where: { userId } });
}

export async function upsertSubscriptionFromStripe(params: {
  userId: string;
  status: SubscriptionStatus;
  plan?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodEnd?: Date | null;
}) {
  if (!isDatabaseConfigured()) return;

  await prisma.subscription.upsert({
    where: { userId: params.userId },
    create: {
      userId: params.userId,
      status: appToPrismaStatus(params.status),
      plan: params.plan,
      stripeSubscriptionId: params.stripeSubscriptionId,
      stripePriceId: params.stripePriceId,
      currentPeriodEnd: params.currentPeriodEnd,
    },
    update: {
      status: appToPrismaStatus(params.status),
      plan: params.plan ?? undefined,
      stripeSubscriptionId: params.stripeSubscriptionId ?? undefined,
      stripePriceId: params.stripePriceId ?? undefined,
      currentPeriodEnd: params.currentPeriodEnd ?? undefined,
    },
  });
}

export async function findUserByStripeCustomerId(customerId: string) {
  if (!isDatabaseConfigured()) return null;
  return prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    include: { subscription: true },
  });
}
