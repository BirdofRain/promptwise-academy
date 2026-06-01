import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckoutButton } from "@/components/billing/checkout-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
};

const plans = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: "$19",
    period: "per month",
    description: "Flexible — cancel anytime. Full access to lessons and tools.",
    featured: false,
  },
  {
    id: "yearly" as const,
    name: "Annual",
    price: "$149",
    period: "per year",
    description: "Best value — about two months free. Billed once per year.",
    featured: true,
  },
];

const faqs = [
  {
    q: "What do I get for free?",
    a: "Create an account to access 2 starter lessons and a handful of sample prompts. No credit card required to look around.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. If you can use email, you can learn here. We avoid jargon and tech-bro language.",
  },
  {
    q: "Is ChatGPT included?",
    a: "You use your own ChatGPT account (free or Plus). We teach you what to paste and how to guide it.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Manage billing anytime from your account page after subscribing through Stripe.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, calm, and transparent"
        description="One membership. All lessons, the full prompt library, Prompt Lab, and Master Prompt Builder."
        align="center"
        className="mx-auto"
      />

      <Card className="mx-auto mt-8 max-w-2xl" padding="lg">
        <p className="text-lg text-navy">
          <strong>Free preview:</strong> 2 starter lessons + sample prompts.{" "}
          <Link href="/signup" className="text-sage-dark underline">
            Create a free account
          </Link>{" "}
          to begin.
        </p>
      </Card>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            padding="lg"
            className={plan.featured ? "ring-2 ring-gold/50" : undefined}
          >
            {plan.featured && <Badge variant="gold" className="mb-3">Best value</Badge>}
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <p className="mt-4 font-serif text-4xl text-navy">
              {plan.price}
              <span className="text-lg font-sans text-muted"> {plan.period}</span>
            </p>
            <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
            <CheckoutButton plan={plan.id} className="mt-6">
              Subscribe — {plan.name.toLowerCase()}
            </CheckoutButton>
            <p className="mt-3 text-center text-sm text-muted">
              Requires sign-in.{" "}
              <Link href="/login" className="underline">
                Sign in first
              </Link>
            </p>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-base text-muted">
        Stripe opens in a secure checkout window. If checkout is unavailable, configure Stripe
        keys in your environment (see README).
      </p>

      <div className="mt-8 text-center">
        <ButtonLink href="/signup" variant="outline" size="lg">
          Create free account first
        </ButtonLink>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-navy">Common questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="text-lg font-medium text-navy">{faq.q}</dt>
              <dd className="mt-1 text-base text-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
