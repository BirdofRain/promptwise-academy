import { ButtonLink } from "@/components/ui/button";
import { StartTrialButton } from "@/components/billing/start-trial-button";
import type { UserAccess } from "@/lib/user-access";

export function AccessBanner({ access }: { access: UserAccess }) {
  if (access.isPaidSubscription) {
    return null;
  }

  if (access.isTrialing && access.trialDaysRemaining != null) {
    const days = access.trialDaysRemaining;
    const dayLabel = days === 1 ? "1 day" : `${days} days`;
    return (
      <div className="mb-6 rounded-xl border border-sage/40 bg-sage/10 px-5 py-4">
        <p className="text-lg font-medium text-navy">
          Your free trial is active — {dayLabel} remaining
        </p>
        <p className="mt-1 text-base text-muted">
          Enjoy the full academy while your trial lasts. Subscribe anytime to keep learning
          without interruption.
        </p>
        <ButtonLink href="/pricing" variant="primary" size="sm" className="mt-3">
          Upgrade anytime
        </ButtonLink>
      </div>
    );
  }

  if (access.trialExpired) {
    return (
      <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
        <p className="text-lg font-medium text-navy">Your free trial has ended</p>
        <p className="mt-1 text-base text-muted">
          Subscribe to keep full access to lessons, Prompt Lab, Master Prompt Builder, and the
          complete prompt library.
        </p>
        <ButtonLink href="/pricing" variant="primary" size="sm" className="mt-3">
          View membership options
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
      <p className="text-lg font-medium text-navy">You&apos;re on the free preview</p>
      <p className="mt-1 text-base text-muted">
        Enjoy 2 starter lessons and sample prompts. Start your free 7-day trial to unlock
        everything — no card required.
      </p>
      {access.trialAvailable ? (
        <div className="mt-3 max-w-sm">
          <StartTrialButton size="sm">Start your free 7-day trial</StartTrialButton>
          <p className="mt-2 text-sm text-muted">No card required · Unlock all lessons and tools</p>
        </div>
      ) : (
        <ButtonLink href="/pricing" variant="primary" size="sm" className="mt-3">
          View membership options
        </ButtonLink>
      )}
    </div>
  );
}
