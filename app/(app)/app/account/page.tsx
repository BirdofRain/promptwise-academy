import { signOut } from "@/lib/auth/actions";
import { getSession, hasPaidAccess } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await getSession();
  const user = session?.user;
  const paid = hasPaidAccess(user ?? null);

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Your account</h1>
      <p className="mt-2 text-muted">Profile and membership settings.</p>

      <Card className="mt-8 max-w-lg">
        <CardTitle>Profile</CardTitle>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Name</dt>
            <dd className="font-medium text-navy">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-navy">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Subscription</dt>
            <dd className="mt-1">
              <Badge variant={paid ? "sage" : "gold"}>
                {user?.subscriptionStatus ?? "none"}
              </Badge>
            </dd>
          </div>
        </dl>
        <CardDescription className="mt-4">
          Stripe billing and customer portal will connect here in the next phase.
        </CardDescription>
      </Card>

      <form action={signOut} className="mt-8">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  );
}
