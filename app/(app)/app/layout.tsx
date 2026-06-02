import { AppShell } from "@/components/layout/app-shell";
import { AccessBanner } from "@/components/app/access-banner";
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
      <AccessBanner access={access} />
      {children}
    </AppShell>
  );
}
