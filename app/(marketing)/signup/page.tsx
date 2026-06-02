import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="mx-auto mb-6 max-w-md text-center text-lg text-muted">
        After you sign up, start a <strong className="text-navy">free 7-day trial</strong> — no card
        required. Unlock the full academy instantly.
      </p>
      <AuthForm mode="signup" errorCode={error} />
    </div>
  );
}
