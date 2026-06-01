import { signOut } from "@/lib/auth/actions";
import { getSession, hasPaidAccess } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PortalButton } from "@/components/billing/portal-button";
import { ButtonLink } from "@/components/ui/button";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await getSession();
  const user = session?.user;
  const paid = hasPaidAccess(user ?? null);

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
                {paid ? "Active member" : "Free preview"}
              </Badge>
            </dd>
          </div>
        </dl>

        {!paid && (
          <div className="mt-6">
            <ButtonLink href="/pricing" size="lg">
              Upgrade to full access
            </ButtonLink>
          </div>
        )}

        {paid && !USE_MOCK_AUTH && (
          <div className="mt-6">
            <PortalButton />
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
