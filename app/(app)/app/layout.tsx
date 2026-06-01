import { AppShell } from "@/components/layout/app-shell";
import { PaywallNotice } from "@/components/app/paywall-notice";
import { requireAuth } from "@/lib/access";
import { getCurrentUser, hasPaidAccess } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const user = await getCurrentUser();
  const paid = hasPaidAccess(user ?? null);

  return (
    <AppShell>
      {!paid && <PaywallNotice />}
      {children}
    </AppShell>
  );
}
