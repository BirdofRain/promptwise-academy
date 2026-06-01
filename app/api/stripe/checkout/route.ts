import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured, priceIdForPlan, getAppUrl } from "@/lib/stripe";
import type { BillingPlan } from "@/lib/stripe";
import { isAuthJsEnabled } from "@/auth";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "Stripe is not configured yet.",
        code: "STRIPE_NOT_CONFIGURED",
        hint: "Add STRIPE_SECRET_KEY and price IDs to .env — see README.",
      },
      { status: 503 },
    );
  }

  if (!isDatabaseConfigured() || !isAuthJsEnabled) {
    return NextResponse.json(
      {
        error: "Checkout requires AUTH_MODE=authjs and DATABASE_URL.",
        code: "AUTH_NOT_READY",
      },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  let body: { plan?: BillingPlan };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const plan: BillingPlan = body.plan === "yearly" ? "yearly" : "monthly";
  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured for this plan." }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 503 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const appUrl = getAppUrl();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=canceled`,
    metadata: { userId: user.id, plan },
    subscription_data: {
      metadata: { userId: user.id, plan },
    },
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
