import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCurrentUserAccess } from "@/lib/user-access";

export {
  canAccessFullLesson,
  canAccessPromptLab,
  canAccessMasterBuilder,
  canAccessPromptCard,
  isPreviewLesson,
} from "@/lib/entitlements";

export async function requireAuth(redirectTo = "/login") {
  const session = await getSession();
  if (!session) {
    redirect(`${redirectTo}?callbackUrl=/app`);
  }
  return session;
}

export async function requirePaidAccess(redirectTo = "/pricing") {
  await requireAuth();
  const access = await getCurrentUserAccess();
  if (!access.hasFullAccess) {
    redirect(`${redirectTo}?reason=subscription`);
  }
  return access;
}

export async function getOptionalUserAccess() {
  return getCurrentUserAccess();
}
