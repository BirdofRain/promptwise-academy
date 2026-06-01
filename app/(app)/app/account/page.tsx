import { signOut } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PortalButton } from "@/components/billing/portal-button";
import { RefreshMembershipButton } from "@/components/billing/refresh-membership-button";
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

function formatPeriodEnd(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const access = await getCurrentUserAccess();
  const { user, paid, subscriptionStatus, plan, currentPeriodEnd } = access;

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
            <dt className="text-muted">Membership</dt>
            <dd className="mt-1">
              <Badge variant={paid ? "sage" : "gold"}>
                {paid ? "Membership active" : "Free preview"}
              </Badge>
            </dd>
          </div>
          {paid && plan && (
            <div>
              <dt className="text-muted">Plan</dt>
              <dd className="font-medium text-navy">{formatPlanLabel(plan)}</dd>
            </div>
          )}
          {paid && currentPeriodEnd && (
            <div>
              <dt className="text-muted">Renews / ends</dt>
              <dd className="font-medium text-navy">{formatPeriodEnd(currentPeriodEnd)}</dd>
            </div>
          )}
          {!USE_MOCK_AUTH && subscriptionStatus !== "none" && (
            <div>
              <dt className="text-muted">Billing status</dt>
              <dd className="font-medium capitalize text-navy">{subscriptionStatus.replace("_", " ")}</dd>
            </div>
          )}
        </dl>

        {!paid && (
          <div className="mt-6">
            <ButtonLink href="/pricing" size="lg">
              View membership options
            </ButtonLink>
          </div>
        )}

        {paid && !USE_MOCK_AUTH && (
          <div className="mt-6">
            <PortalButton />
          </div>
        )}

        {!USE_MOCK_AUTH && (
          <div className="mt-4">
            <RefreshMembershipButton />
          </div>
        )}

        <CardDescription className="mt-4 text-base">
          {USE_MOCK_AUTH
            ? "Mock auth mode — subscription status is set at sign-in for testing."
            : "Billing is handled securely by Stripe."}
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
