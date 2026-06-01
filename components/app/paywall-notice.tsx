import { ButtonLink } from "@/components/ui/button";

export function PaywallNotice() {
  return (
    <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
      <p className="text-lg font-medium text-navy">You&apos;re on the free preview</p>
      <p className="mt-1 text-base text-muted">
        Enjoy 2 starter lessons and sample prompts. Subscribe for the full library, Prompt Lab,
        and Master Prompt Builder.
      </p>
      <ButtonLink href="/pricing" variant="primary" size="sm" className="mt-3">
        View membership options
      </ButtonLink>
    </div>
  );
}
