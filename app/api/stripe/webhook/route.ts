import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { upsertSubscriptionFromStripe } from "@/lib/subscription";
import type { SubscriptionStatus } from "@/lib/auth/types";

export const runtime = "nodejs";

function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const end = (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  return end ? new Date(end * 1000) : null;
}

function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId || !session.subscription) return;

  const stripe = getStripe();
  if (!stripe) return;

  const sub =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  await upsertSubscriptionFromStripe({
    userId,
    status: mapStripeSubscriptionStatus(sub.status),
    plan: session.metadata?.plan ?? null,
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id ?? null,
    currentPeriodEnd: subscriptionPeriodEnd(sub),
  });
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  await upsertSubscriptionFromStripe({
    userId,
    status: mapStripeSubscriptionStatus(sub.status),
    plan: sub.metadata?.plan ?? null,
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id ?? null,
    currentPeriodEnd: subscriptionPeriodEnd(sub),
  });
}

export async function POST(request: Request) {
  if (!isStripeConfigured() || !isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Webhook not configured (Stripe or database missing)." },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook secret missing." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const existing = await prisma.stripeEvent.findUnique({ where: { eventId: event.id } });
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    await prisma.stripeEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  } catch (err) {
    console.error("[stripe webhook] handler error", event.type, err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
