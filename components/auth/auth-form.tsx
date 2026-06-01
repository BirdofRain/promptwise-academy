import Link from "next/link";
import { credentialsSignIn, mockSignIn } from "@/lib/auth/actions";
import { registerUser } from "@/lib/auth/register";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { USE_MOCK_AUTH } from "@/lib/auth/constants";

interface AuthFormProps {
  mode: "login" | "signup";
  errorCode?: string | null;
}

const errorMessages: Record<string, string> = {
  "missing-fields": "Please fill in all required fields.",
  "missing-email": "Please enter your email.",
  "password-short": "Password must be at least 8 characters.",
  "email-exists": "An account with this email already exists. Try signing in.",
  "invalid-credentials": "Email or password is incorrect.",
  "auth-not-configured":
    "Real accounts require AUTH_MODE=authjs and DATABASE_URL. See README.",
  "mock-disabled": "Mock sign-in is disabled. Use email and password with Auth.js.",
  "use-mock-dev-form": "Set AUTH_MODE=mock in .env.local for dev cookie login.",
};

export function AuthForm({ mode, errorCode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const error = errorCode ? errorMessages[errorCode] ?? "Something went wrong." : null;

  return (
    <Card className="mx-auto w-full max-w-md" padding="lg">
      <h1 className="font-serif text-2xl text-navy">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-lg text-muted">
        {isSignup
          ? "Start learning at your own pace — no rush, no jargon."
          : "Continue your calm path to practical ChatGPT skills."}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-base text-red-900" role="alert">
          {error}
        </p>
      )}

      {USE_MOCK_AUTH ? (
        <form action={mockSignIn} className="mt-6 space-y-4">
          <MockFields isSignup={isSignup} />
          <div className="rounded-lg border border-dashed border-navy/15 bg-cream-dark/50 p-3">
            <label htmlFor="plan" className="mb-1 block text-xs font-medium text-muted uppercase">
              Dev: subscription status
            </label>
            <select
              id="plan"
              name="plan"
              defaultValue="none"
              className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-base text-navy"
            >
              <option value="none">Free (preview only)</option>
              <option value="active">Paid (full access)</option>
              <option value="trialing">Trialing</option>
            </select>
          </div>
          <p className="text-sm text-muted">
            AUTH_MODE=mock — any password works. For production, use AUTH_MODE=authjs.
          </p>
          <Button type="submit" className="w-full" size="lg">
            {isSignup ? "Create account (mock)" : "Sign in (mock)"}
          </Button>
        </form>
      ) : (
        <form
          action={isSignup ? registerUser : credentialsSignIn}
          className="mt-6 space-y-4"
        >
          <AuthFields isSignup={isSignup} />
          <Button type="submit" className="w-full" size="lg">
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-base text-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-sage-dark hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-medium text-sage-dark hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </Card>
  );
}

function AuthFields({ isSignup }: { isSignup: boolean }) {
  return (
    <>
      {isSignup && (
        <div>
          <label htmlFor="name" className="mb-1 block text-base font-medium text-navy">
            First name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg text-navy"
            placeholder="Margaret"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-base font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg text-navy"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-base font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg text-navy"
          placeholder="At least 8 characters"
        />
      </div>
    </>
  );
}

function MockFields({ isSignup }: { isSignup: boolean }) {
  return (
    <>
      {isSignup && (
        <div>
          <label htmlFor="name" className="mb-1 block text-base font-medium text-navy">
            First name
          </label>
          <input id="name" name="name" type="text" className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-base font-medium text-navy">
          Email
        </label>
        <input id="email" name="email" type="email" required className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-base font-medium text-navy">
          Password (ignored in mock mode)
        </label>
        <input id="password" name="password" type="password" className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg" />
      </div>
    </>
  );
}
