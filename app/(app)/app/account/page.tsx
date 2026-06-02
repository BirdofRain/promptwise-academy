import { signOut } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PortalButton } from "@/components/billing/portal-button";
import { RefreshMembershipButton } from "@/components/billing/refresh-membership-button";
import { StartTrialButton } from "@/components/billing/start-trial-button";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUserAccess } from "@/lib/user-access";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

function formatPlanLabel(plan: string | null): string {
  if (plan === "yearly") return "Annual membership";
  if (plan === "monthly") return "Monthly membership";
  return "Membership";
}

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function accountStatusLabel(access: Awaited<ReturnType<typeof getCurrentUserAccess>>): string {
  if (access.isPaidSubscription) return "Membership active";
  if (access.isTrialing) return "Free trial active";
  if (access.trialExpired) return "Trial ended";
  return "Free preview";
}

export default async function AccountPage() {
  const access = await getCurrentUserAccess();
  const {
    user,
    isPaidSubscription,
    isTrialing,
    trialAvailable,
    trialExpired,
    trialDaysRemaining,
    trialEndsAt,
    subscriptionStatus,
    plan,
    currentPeriodEnd,
  } = access;

  const statusLabel = accountStatusLabel(access);
  const badgeVariant =
    isPaidSubscription || isTrialing ? "sage" : trialExpired ? "gold" : "gold";

  return (
    <div className="app-readable">
      <h1 className="font-serif text-3xl text-navy">Your account</h1>
      <p className="mt-2 text-xl text-muted">Profile and membership</p>

      <Card className="mt-8 max-w-lg" padding="lg">
        <CardTitle className="text-xl">Profile</CardTitle>
        <dl className="mt-4 space-y-3 text-base">
          <div>
            <dt className="text-muted">Name</dt>
            <dd className="font-medium text-navy">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-navy">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Account status</dt>
            <dd className="mt-1">
              <Badge variant={badgeVariant}>{statusLabel}</Badge>
            </dd>
          </div>
          {isTrialing && trialEndsAt && (
            <>
              <div>
                <dt className="text-muted">Trial ends</dt>
                <dd className="font-medium text-navy">{formatDate(trialEndsAt)}</dd>
              </div>
              {trialDaysRemaining != null && (
                <div>
                  <dt className="text-muted">Time remaining</dt>
                  <dd className="font-medium text-navy">
                    {trialDaysRemaining === 1
                      ? "1 day"
                      : `${trialDaysRemaining} days`}
                  </dd>
                </div>
              )}
            </>
          )}
          {isPaidSubscription && plan && (
            <div>
              <dt className="text-muted">Plan</dt>
              <dd className="font-medium text-navy">{formatPlanLabel(plan)}</dd>
            </div>
          )}
          {isPaidSubscription && currentPeriodEnd && (
            <div>
              <dt className="text-muted">Renews / ends</dt>
              <dd className="font-medium text-navy">{formatDate(currentPeriodEnd)}</dd>
            </div>
          )}
          {!USE_MOCK_AUTH && isPaidSubscription && subscriptionStatus !== "none" && (
            <div>
              <dt className="text-muted">Billing status</dt>
              <dd className="font-medium capitalize text-navy">
                {subscriptionStatus.replace("_", " ")}
              </dd>
            </div>
          )}
        </dl>

        {trialAvailable && !USE_MOCK_AUTH && (
          <div className="mt-6">
            <StartTrialButton>Start your free 7-day trial</StartTrialButton>
            <p className="mt-2 text-sm text-muted">No card required</p>
          </div>
        )}

        {trialAvailable && USE_MOCK_AUTH && (
          <p className="mt-4 text-base text-muted">
            App trial is not persisted in mock mode. Use the dev &quot;Trialing&quot; option at
            sign-in to simulate full access.
          </p>
        )}

        {(trialExpired || (!isPaidSubscription && !isTrialing)) && !trialAvailable && (
          <div className="mt-6">
            <ButtonLink href="/pricing" size="lg">
              View membership options
            </ButtonLink>
          </div>
        )}

        {isTrialing && (
          <div className="mt-6">
            <ButtonLink href="/pricing" size="lg">
              Upgrade anytime
            </ButtonLink>
          </div>
        )}

        {isPaidSubscription && !USE_MOCK_AUTH && (
          <div className="mt-6">
            <PortalButton />
          </div>
        )}

        {!USE_MOCK_AUTH && isPaidSubscription && (
          <div className="mt-4">
            <RefreshMembershipButton />
          </div>
        )}

        <CardDescription className="mt-4 text-base">
          {USE_MOCK_AUTH
            ? "Mock auth mode — subscription status is set at sign-in for testing."
            : "Your 7-day trial is managed by PromptWise. Paid subscriptions are billed securely through Stripe."}
        </CardDescription>
      </Card>

      <form action={signOut} className="mt-8">
        <Button type="submit" variant="outline" size="lg">
          Sign out
        </Button>
      </form>
    </div>
  );
}
