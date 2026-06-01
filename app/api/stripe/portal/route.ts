import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured, getAppUrl } from "@/lib/stripe";
import { ensureStripeCustomerForUser, isStaleStripeCustomerError } from "@/lib/stripe-sync";

export async function POST() {
  if (!isStripeConfigured() || !isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Billing portal not configured.", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable." }, { status: 503 });
  }

  let customerId: string;
  try {
    customerId = await ensureStripeCustomerForUser(user, stripe);
  } catch (err) {
    console.error("[stripe portal] customer setup failed", {
      userId: user.id,
      code: (err as { code?: string }).code,
    });
    return NextResponse.json(
      { error: "No billing account yet. Subscribe from the pricing page first." },
      { status: 400 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppUrl()}/app/account`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    if (isStaleStripeCustomerError(err)) {
      const freshId = await ensureStripeCustomerForUser({ ...user, stripeCustomerId: null }, stripe);
      const portal = await stripe.billingPortal.sessions.create({
        customer: freshId,
        return_url: `${getAppUrl()}/app/account`,
      });
      return NextResponse.json({ url: portal.url });
    }
    console.error("[stripe portal] session create failed", {
      userId: user.id,
      code: (err as { code?: string }).code,
    });
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}
