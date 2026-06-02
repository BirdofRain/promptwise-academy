import type { ReactNode } from "react";
import { UpgradeCTA } from "./upgrade-cta";
import { getCurrentUserAccess } from "@/lib/user-access";

export async function PaidFeatureGate({
  children,
  featureName,
}: {
  children: ReactNode;
  featureName: string;
}) {
  const access = await getCurrentUserAccess();
  if (access.hasFullAccess) {
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
