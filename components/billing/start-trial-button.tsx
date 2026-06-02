"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartTrialButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

function friendlyTrialError(code?: string, error?: string): string {
  switch (code) {
    case "NOT_SIGNED_IN":
      return "Please sign in first.";
    case "ALREADY_PAID":
      return "You already have full access.";
    case "TRIAL_ALREADY_USED":
      return "Your free trial has already been used on this account.";
    case "AUTH_NOT_READY":
      return "Free trial is not available in this environment.";
    default:
      return error ?? "Could not start your trial. Please try again.";
  }
}

export function StartTrialButton({
  children,
  className,
  variant = "primary",
  size = "lg",
}: StartTrialButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trial/start", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        redirect?: string;
        error?: string;
        code?: string;
      };

      if (!res.ok) {
        setError(friendlyTrialError(data.code, data.error));
        return;
      }

      router.push(data.redirect ?? "/app?trial=started");
      router.refresh();
    } catch {
      setError("Could not start your trial. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        className="w-full"
        onClick={handleStartTrial}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
            Starting your trial…
          </>
        ) : (
          children
        )}
      </Button>
      {error && (
        <p className="mt-2 text-base text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
