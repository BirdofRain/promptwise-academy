import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
};

const plans = [
  {
    name: "Monthly",
    price: "$19",
    period: "per month",
    description: "Flexible — cancel anytime. Full access to lessons and tools.",
    featured: false,
  },
  {
    name: "Annual",
    price: "$149",
    period: "per year",
    description: "Best value — two months free. Same full access, billed once a year.",
    featured: true,
  },
];

const faqs = [
  {
    q: "Do I need to be technical?",
    a: "No. This academy assumes zero coding knowledge. If you can use email, you can learn here.",
  },
  {
    q: "Is ChatGPT included?",
    a: "You will use your own ChatGPT account (free or Plus). We teach you what to paste and how to guide it.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Stripe billing will be connected soon; for now, mock sign-in lets you explore the full experience.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, calm, and transparent"
        description="One academy membership. All modules, lessons, prompt library, Prompt Lab, and Master Prompt Builder."
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.featured ? "ring-2 ring-gold/50" : undefined}
          >
            {plan.featured && <Badge variant="gold" className="mb-3">Best value</Badge>}
            <CardTitle>{plan.name}</CardTitle>
            <p className="mt-4 font-serif text-4xl text-navy">
              {plan.price}
              <span className="text-base font-sans text-muted"> {plan.period}</span>
            </p>
            <CardDescription className="mt-4">{plan.description}</CardDescription>
            <ButtonLink href="/signup" className="mt-6 w-full sm:w-auto">
              Get started
            </ButtonLink>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Stripe checkout coming in the next phase. Sign up with mock auth to explore the app
        today.
      </p>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-navy">Common questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-medium text-navy">{faq.q}</dt>
              <dd className="mt-1 text-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
