import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import {
  upsertSubscriptionFromStripe,
  findUserByStripeCustomerId,
  prismaToAppStatus,
} from "@/lib/subscription";
import type { SubscriptionStatus } from "@/lib/auth/types";

export function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const end = (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  return end ? new Date(end * 1000) : null;
}

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    default:
      return "none";
  }
}

export function isStaleStripeCustomerError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const stripeErr = err as { code?: string; message?: string; type?: string };
  if (stripeErr.code === "resource_missing") return true;
  const msg = stripeErr.message?.toLowerCase() ?? "";
  return (
    msg.includes("similar object exists in live mode") ||
    msg.includes("similar object exists in test mode") ||
    msg.includes("no such customer")
  );
}

type DbUser = {
  id: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
};

/** Create or validate Stripe customer; replace stale live/test mismatched IDs. */
export async function ensureStripeCustomerForUser(
  user: DbUser,
  stripe = getStripe(),
): Promise<string> {
  if (!stripe) {
    throw new Error("Stripe client unavailable");
  }

  const createAndSave = async (): Promise<string> => {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id, userEmail: user.email },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
    console.warn("[stripe] created new customer for user", {
      userId: user.id,
      customerPrefix: customer.id.slice(0, 8),
    });
    return customer.id;
  };

  if (!user.stripeCustomerId) {
    return createAndSave();
  }

  try {
    await stripe.customers.retrieve(user.stripeCustomerId);
    return user.stripeCustomerId;
  } catch (err) {
    if (isStaleStripeCustomerError(err)) {
      console.warn("[stripe] replacing stale customer id", {
        userId: user.id,
        oldCustomerPrefix: user.stripeCustomerId.slice(0, 8),
      });
      return createAndSave();
    }
    throw err;
  }
}

export async function resolveUserIdFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<string | null> {
  if (session.metadata?.userId) return session.metadata.userId;
  if (session.client_reference_id) return session.client_reference_id;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId) {
    const user = await findUserByStripeCustomerId(customerId);
    return user?.id ?? null;
  }
  return null;
}

export async function resolveUserIdFromSubscription(
  sub: Stripe.Subscription,
): Promise<string | null> {
  if (sub.metadata?.userId) return sub.metadata.userId;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (customerId) {
    const user = await findUserByStripeCustomerId(customerId);
    return user?.id ?? null;
  }
  return null;
}

export async function upsertSubscriptionFromStripeSubscription(
  userId: string,
  sub: Stripe.Subscription,
  plan?: string | null,
) {
  await upsertSubscriptionFromStripe({
    userId,
    status: mapStripeSubscriptionStatus(sub.status),
    plan: plan ?? sub.metadata?.plan ?? null,
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id ?? null,
    currentPeriodEnd: subscriptionPeriodEnd(sub),
  });
}

export async function syncCheckoutSessionForUser(
  sessionId: string,
  userId: string,
): Promise<{ ok: boolean; status?: SubscriptionStatus; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database not configured" };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Stripe not configured" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false, error: "User not found" };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const ownerId = await resolveUserIdFromCheckoutSession(session);
  if (ownerId && ownerId !== userId) {
    return { ok: false, error: "Checkout session does not belong to this account" };
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId && user.stripeCustomerId !== customerId) {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { ok: false, error: "Checkout is not complete yet" };
  }

  let subscription: Stripe.Subscription | null = null;
  if (session.subscription) {
    subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
  }

  if (!subscription) {
    return { ok: false, error: "No subscription found on checkout session" };
  }

  await upsertSubscriptionFromStripeSubscription(
    userId,
    subscription,
    session.metadata?.plan,
  );

  const record = await prisma.subscription.findUnique({ where: { userId } });
  return {
    ok: true,
    status: prismaToAppStatus(record?.status),
  };
}

/** Re-sync membership from Stripe for the signed-in user (portal refresh). */
export async function syncMembershipFromStripeForUser(userId: string) {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database not configured" };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Stripe not configured" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false, error: "User not found" };
  }

  const customerId = await ensureStripeCustomerForUser(user, stripe);
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });

  const active =
    subs.data.find((s) => s.status === "active" || s.status === "trialing") ??
    subs.data[0];

  if (!active) {
    await upsertSubscriptionFromStripe({
      userId,
      status: "none",
      plan: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
    });
    return { ok: true, status: "none" as SubscriptionStatus };
  }

  await upsertSubscriptionFromStripeSubscription(userId, active, active.metadata?.plan);
  const record = await prisma.subscription.findUnique({ where: { userId } });
  return { ok: true, status: prismaToAppStatus(record?.status) };
}
