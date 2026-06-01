import { ButtonLink } from "@/components/ui/button";

export function PaywallNotice() {
  return (
    <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
      <p className="font-medium text-navy">Unlock the full workshop</p>
      <p className="mt-1 text-sm text-muted">
        Your account is signed in, but a subscription is required for lessons and tools.
      </p>
      <ButtonLink href="/pricing" variant="primary" size="sm" className="mt-3">
        View pricing
      </ButtonLink>
    </div>
  );
}
