import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured, priceIdForPlan, getAppUrl } from "@/lib/stripe";
import type { BillingPlan } from "@/lib/stripe";
import { isAuthJsEnabled } from "@/auth";
import { ensureStripeCustomerForUser, isStaleStripeCustomerError } from "@/lib/stripe-sync";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "Checkout is not configured yet.",
        code: "STRIPE_NOT_CONFIGURED",
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
    return NextResponse.json(
      { error: "Please sign in first.", code: "NOT_SIGNED_IN" },
      { status: 401 },
    );
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
    return NextResponse.json(
      { error: "Checkout is not configured yet.", code: "PRICE_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured yet.", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found.", code: "USER_NOT_FOUND" }, { status: 404 });
  }

  let customerId: string;
  try {
    customerId = await ensureStripeCustomerForUser(user, stripe);
  } catch (err) {
    console.error("[stripe checkout] customer setup failed", {
      userId: user.id,
      code: (err as { code?: string }).code,
    });
    return NextResponse.json(
      { error: "Could not start checkout. Please try again.", code: "CUSTOMER_ERROR" },
      { status: 500 },
    );
  }

  const appUrl = getAppUrl();

  const sessionParams = {
    customer: customerId,
    mode: "subscription" as const,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
    client_reference_id: user.id,
    metadata: {
      userId: user.id,
      userEmail: user.email,
      plan,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        userEmail: user.email,
        plan,
      },
    },
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Please try again.", code: "SESSION_ERROR" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    if (isStaleStripeCustomerError(err)) {
      console.warn("[stripe checkout] retrying with fresh customer", { userId: user.id });
      try {
        const freshCustomerId = await ensureStripeCustomerForUser(
          { ...user, stripeCustomerId: null },
          stripe,
        );
        const checkoutSession = await stripe.checkout.sessions.create({
          ...sessionParams,
          customer: freshCustomerId,
        });
        if (!checkoutSession.url) {
          return NextResponse.json(
            { error: "Could not start checkout. Please try again.", code: "SESSION_ERROR" },
            { status: 500 },
          );
        }
        return NextResponse.json({ url: checkoutSession.url });
      } catch (retryErr) {
        console.error("[stripe checkout] retry failed", {
          userId: user.id,
          code: (retryErr as { code?: string }).code,
        });
      }
    } else {
      console.error("[stripe checkout] session create failed", {
        userId: user.id,
        code: (err as { code?: string }).code,
      });
    }

    return NextResponse.json(
      { error: "Could not start checkout. Please try again.", code: "CHECKOUT_FAILED" },
      { status: 500 },
    );
  }
}
