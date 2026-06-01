"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Billing portal unavailable.");
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Could not open billing portal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" size="lg" onClick={openPortal} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
            Loading…
          </>
        ) : (
          "Manage billing"
        )}
      </Button>
      {error && (
        <p className="mt-2 text-base text-muted" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
