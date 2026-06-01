import { AppShell } from "@/components/layout/app-shell";
import { PaywallNotice } from "@/components/app/paywall-notice";
import { requireAuth } from "@/lib/access";
import { hasPaidAccess } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const paid = hasPaidAccess(session.user);

  return (
    <AppShell>
      {!paid && <PaywallNotice />}
      <div className={!paid ? "pointer-events-none opacity-50" : undefined}>{children}</div>
    </AppShell>
  );
}
