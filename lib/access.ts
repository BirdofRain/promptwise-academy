import { redirect } from "next/navigation";
import { getCurrentUser, getSession, hasPaidAccess } from "@/lib/auth/session";

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
  const session = await requireAuth();
  if (!hasPaidAccess(session.user)) {
    redirect(`${redirectTo}?reason=subscription`);
  }
  return session;
}

export async function getOptionalUser() {
  return getCurrentUser();
}
