import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { syncCheckoutSessionForUser } from "@/lib/stripe-sync";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership activated",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout/success");
  }

  const { session_id: sessionId } = await searchParams;
  if (!sessionId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card padding="lg">
          <CardTitle className="text-2xl">Missing checkout session</CardTitle>
          <CardDescription className="mt-3 text-base">
            We could not find your checkout session. If you completed payment, open your account
            page and refresh membership status.
          </CardDescription>
          <ButtonLink href="/app/account" size="lg" className="mt-6">
            Go to account
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const result = await syncCheckoutSessionForUser(sessionId, session.user.id);
  if (result.ok) {
    redirect("/app?upgraded=1");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card padding="lg">
        <CardTitle className="text-2xl">Almost there</CardTitle>
        <CardDescription className="mt-3 text-base">
          {result.error ??
            "Your payment may still be processing. Try refreshing membership status from your account page in a moment."}
        </CardDescription>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/app/account" size="lg">
            Account settings
          </ButtonLink>
          <Link
            href="/app/account"
            className="inline-flex items-center justify-center rounded-lg border border-navy/15 px-5 py-3 text-base font-medium text-navy hover:bg-navy/5"
          >
            Refresh membership status
          </Link>
        </div>
      </Card>
    </div>
  );
}
