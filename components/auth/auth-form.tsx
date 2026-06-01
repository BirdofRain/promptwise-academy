import Link from "next/link";
import { mockSignIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="font-serif text-2xl text-navy">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-muted">
        {isSignup
          ? "Start learning at your own pace — no rush, no jargon."
          : "Continue your calm path to practical ChatGPT skills."}
      </p>

      <form action={mockSignIn} className="mt-6 space-y-4">
        {isSignup && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy">
              First name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              placeholder="Margaret"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-navy">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-muted">
            Mock sign-in — any password works until real auth is connected.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-navy/15 bg-cream-dark/50 p-3">
          <label htmlFor="plan" className="mb-1 block text-xs font-medium text-muted uppercase">
            Dev: subscription status
          </label>
          <select
            id="plan"
            name="plan"
            defaultValue="active"
            className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy"
          >
            <option value="active">Active (full access)</option>
            <option value="trialing">Trialing</option>
            <option value="none">None (test paywall)</option>
          </select>
        </div>

        <Button type="submit" className="w-full">
          {isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
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
