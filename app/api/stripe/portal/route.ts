import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured, getAppUrl } from "@/lib/stripe";

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
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet. Subscribe from the pricing page first." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable." }, { status: 503 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getAppUrl()}/app/account`,
  });

  return NextResponse.json({ url: portal.url });
}
