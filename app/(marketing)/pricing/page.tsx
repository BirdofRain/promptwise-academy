import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { PortalButton } from "@/components/billing/portal-button";
import { StartTrialButton } from "@/components/billing/start-trial-button";
import { getCurrentUserAccess } from "@/lib/user-access";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";
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
    q: "Is there a free trial?",
    a: "Yes. Create an account and start a free 7-day trial — no credit card required. You get full access to lessons, Prompt Lab, and the prompt library instantly.",
  },
  {
    q: "What do I get for free without a trial?",
    a: "You can browse with 2 starter lessons and sample prompts before starting your trial or subscribing.",
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

export default async function PricingPage() {
  const access = await getCurrentUserAccess();
  const {
    isAuthenticated,
    isPaidSubscription,
    hasFullAccess,
    isTrialing,
    trialAvailable,
    trialExpired,
    trialDaysRemaining,
  } = access;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, calm, and transparent"
        description="Try everything free for 7 days — no card required. Or subscribe when you're ready."
        align="center"
        className="mx-auto"
      />

      {!isAuthenticated && (
        <Card className="mx-auto mt-8 max-w-2xl" padding="lg">
          <p className="text-lg text-navy">
            <strong>Start with a free 7-day trial.</strong> Create an account to unlock all lessons
            and tools instantly — no credit card required.{" "}
            <Link href="/signup" className="text-sage-dark underline">
              Create a free account
            </Link>
          </p>
        </Card>
      )}

      {isAuthenticated && isPaidSubscription && (
        <Card className="mx-auto mt-8 max-w-2xl border-sage/30 bg-sage/5" padding="lg">
          <p className="text-lg text-navy">
            <strong>Membership active.</strong> You have full access to lessons, Prompt Lab, and
            Master Prompt Builder.
          </p>
          {!USE_MOCK_AUTH && (
            <div className="mt-4">
              <PortalButton />
            </div>
          )}
        </Card>
      )}

      {isAuthenticated && isTrialing && !isPaidSubscription && (
        <Card className="mx-auto mt-8 max-w-2xl border-sage/30 bg-sage/5" padding="lg">
          <p className="text-lg text-navy">
            <strong>Your trial is active</strong>
            {trialDaysRemaining != null && (
              <> — {trialDaysRemaining === 1 ? "1 day" : `${trialDaysRemaining} days`} remaining</>
            )}
            . Unlock the full academy today, or subscribe anytime to keep learning after your trial.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/app" size="lg">
              Go to your academy
            </ButtonLink>
            <ButtonLink href="#plans" variant="outline" size="lg">
              Upgrade anytime
            </ButtonLink>
          </div>
        </Card>
      )}

      {isAuthenticated && trialExpired && !isPaidSubscription && (
        <Card className="mx-auto mt-8 max-w-2xl border-gold/30 bg-gold/10" padding="lg">
          <p className="text-lg text-navy">
            <strong>Your free trial has ended.</strong> Subscribe below to keep full access to
            lessons, Prompt Lab, and the complete prompt library.
          </p>
        </Card>
      )}

      {isAuthenticated && trialAvailable && (
        <Card className="mx-auto mt-8 max-w-2xl ring-2 ring-sage/30" padding="lg">
          <Badge variant="sage" className="mb-3">
            Recommended
          </Badge>
          <CardTitle className="text-2xl">Start your free 7-day trial</CardTitle>
          <CardDescription className="mt-3 text-base">
            No card required. Unlock all lessons, Prompt Lab, Master Prompt Builder, and the full
            prompt library instantly.
          </CardDescription>
          {!USE_MOCK_AUTH ? (
            <StartTrialButton className="mt-6">
              Start free 7-day trial — no card required
            </StartTrialButton>
          ) : (
            <p className="mt-4 text-base text-muted">
              Free trial is stored in the database when AUTH_MODE=authjs. In mock mode, choose
              &quot;Trialing&quot; in the dev sign-in form to simulate full access.
            </p>
          )}
        </Card>
      )}

      {isAuthenticated &&
        !isPaidSubscription &&
        !trialAvailable &&
        !isTrialing &&
        !trialExpired && (
          <Card className="mx-auto mt-8 max-w-2xl" padding="lg">
            <p className="text-lg text-navy">
              <strong>Signed in as {access.user?.email}.</strong> Choose a plan below to unlock
              the full academy.
            </p>
          </Card>
        )}

      <div id="plans" className="mt-12 grid gap-6 md:grid-cols-2">
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
            {hasFullAccess && isPaidSubscription ? (
              <ButtonLink href="/app" variant="secondary" size="lg" className="mt-6 w-full">
                Go to your academy
              </ButtonLink>
            ) : (
              <>
                <CheckoutButton plan={plan.id} className="mt-6">
                  Subscribe — {plan.name.toLowerCase()}
                </CheckoutButton>
                {!isAuthenticated && (
                  <p className="mt-3 text-center text-sm text-muted">
                    Requires sign-in.{" "}
                    <Link href="/login?callbackUrl=/pricing" className="underline">
                      Sign in first
                    </Link>
                  </p>
                )}
              </>
            )}
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-base text-muted">
        Stripe checkout is secure. Your 7-day trial does not require a card — only a paid
        subscription uses Stripe.
      </p>

      {!isAuthenticated && (
        <div className="mt-8 text-center">
          <ButtonLink href="/signup" variant="outline" size="lg">
            Create free account to start your trial
          </ButtonLink>
        </div>
      )}

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
