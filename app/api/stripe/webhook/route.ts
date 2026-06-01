import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import {
  resolveUserIdFromCheckoutSession,
  resolveUserIdFromSubscription,
  upsertSubscriptionFromStripeSubscription,
} from "@/lib/stripe-sync";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = await resolveUserIdFromCheckoutSession(session);
  if (!userId || !session.subscription) return;

  const stripe = getStripe();
  if (!stripe) return;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId) {
    await prisma.user.updateMany({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const sub =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  await upsertSubscriptionFromStripeSubscription(userId, sub, session.metadata?.plan);
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const userId = await resolveUserIdFromSubscription(sub);
  if (!userId) return;

  if (sub.status === "canceled" || sub.status === "unpaid" || sub.status === "incomplete_expired") {
    await upsertSubscriptionFromStripeSubscription(userId, sub, sub.metadata?.plan);
    return;
  }

  await upsertSubscriptionFromStripeSubscription(userId, sub, sub.metadata?.plan);
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
