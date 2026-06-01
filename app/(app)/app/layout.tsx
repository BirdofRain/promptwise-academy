import { AppShell } from "@/components/layout/app-shell";
import { PaywallNotice } from "@/components/app/paywall-notice";
import { requireAuth } from "@/lib/access";
import { getCurrentUserAccess } from "@/lib/user-access";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const access = await getCurrentUserAccess();

  return (
    <AppShell>
      {!access.paid && <PaywallNotice />}
      {children}
    </AppShell>
  );
}
