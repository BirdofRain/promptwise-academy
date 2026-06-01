import Stripe from "stripe";

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_ID_MONTHLY?.trim() &&
      process.env.STRIPE_PRICE_ID_YEARLY?.trim(),
  );
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { typescript: true });
}

export type BillingPlan = "monthly" | "yearly";

export function priceIdForPlan(plan: BillingPlan): string | null {
  if (plan === "yearly") return process.env.STRIPE_PRICE_ID_YEARLY?.trim() ?? null;
  return process.env.STRIPE_PRICE_ID_MONTHLY?.trim() ?? null;
}

export function getAppUrl(): string {
  return process.env.APP_URL?.trim() || "http://localhost:3000";
}
