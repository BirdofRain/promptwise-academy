/** App-managed free trial (no Stripe card). */

export const APP_TRIAL_DAYS = 7;

export type TrialFields = {
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  trialUsed: boolean;
};

export function isStripePaidStatus(status: string): boolean {
  return status === "active" || status === "trialing";
}

export function isAppTrialActive(fields: TrialFields, now = new Date()): boolean {
  if (!fields.trialEndsAt) return false;
  return fields.trialEndsAt > now;
}

export function isAppTrialExpired(fields: TrialFields, now = new Date()): boolean {
  if (!fields.trialUsed && !fields.trialStartedAt) return false;
  if (!fields.trialEndsAt) return Boolean(fields.trialUsed || fields.trialStartedAt);
  return fields.trialEndsAt <= now;
}

export function canStartAppTrial(fields: TrialFields, isStripePaid: boolean): boolean {
  if (isStripePaid) return false;
  if (fields.trialUsed || fields.trialStartedAt) return false;
  return true;
}

/** Days remaining, rounded up for friendly display. */
export function trialDaysRemaining(trialEndsAt: Date | null, now = new Date()): number | null {
  if (!trialEndsAt || trialEndsAt <= now) return null;
  const ms = trialEndsAt.getTime() - now.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function addTrialDays(from: Date, days = APP_TRIAL_DAYS): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + days);
  return end;
}
