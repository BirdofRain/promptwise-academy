import type { ReactNode } from "react";
import { UpgradeCTA } from "./upgrade-cta";
import { hasPaidAccess, getCurrentUser } from "@/lib/auth/session";

export async function PaidFeatureGate({
  children,
  featureName,
}: {
  children: ReactNode;
  featureName: string;
}) {
  const user = await getCurrentUser();
  if (hasPaidAccess(user)) {
    return <>{children}</>;
  }

  return (
    <div className="app-readable">
      <UpgradeCTA
        title={`${featureName} is for members`}
        description={`Subscribe to use ${featureName} and access the complete PromptWise Academy library.`}
      />
    </div>
  );
}
