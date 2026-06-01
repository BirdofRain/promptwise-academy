"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingPlan } from "@/lib/stripe";

interface CheckoutButtonProps {
  plan: BillingPlan;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function CheckoutButton({
  plan,
  children,
  className,
  variant = "primary",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string; hint?: string };

      if (!res.ok) {
        setError(data.hint ? `${data.error} ${data.hint}` : data.error ?? "Checkout unavailable.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size="lg"
        className="w-full"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
            Opening checkout…
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
