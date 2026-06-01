"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshMembershipButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshMembership() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/stripe/sync-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "membership" }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        subscriptionStatus?: string;
        error?: string;
      };

      if (!res.ok) {
        setMessage(data.error ?? "Could not refresh membership status.");
        return;
      }

      setMessage(
        data.subscriptionStatus === "active" || data.subscriptionStatus === "trialing"
          ? "Membership updated — full access is active."
          : "Membership status refreshed.",
      );
      router.refresh();
    } catch {
      setMessage("Could not refresh membership status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" size="sm" onClick={refreshMembership} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Refreshing…
          </>
        ) : (
          "Refresh membership status"
        )}
      </Button>
      {message && (
        <p className="mt-2 text-sm text-muted" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
