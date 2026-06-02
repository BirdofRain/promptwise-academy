# 7-day free trial (no card)

PromptWise Academy offers an **app-managed** 7-day free trial. It is **not** a Stripe trial — no payment method is collected.

## How it works

1. User creates an account (`AUTH_MODE=authjs` + database).
2. From **Pricing**, **Account**, or the **dashboard banner**, they click **Start your free 7-day trial**.
3. `POST /api/trial/start` sets on the `User` row:
   - `trialStartedAt` = now
   - `trialEndsAt` = now + 7 days
   - `trialUsed` = true
4. While `trialEndsAt > now`, `getCurrentUserAccess()` returns `hasFullAccess: true`.
5. After expiry, access reverts to free preview unless they subscribe via Stripe.

## Prisma fields (`User`)

| Field | Type | Purpose |
|-------|------|---------|
| `trialStartedAt` | `DateTime?` | When the trial began |
| `trialEndsAt` | `DateTime?` | When full access ends |
| `trialUsed` | `Boolean` | Prevents starting a second trial |

Stripe subscriptions remain on the `Subscription` table.

## Access rules (`getCurrentUserAccess`)

- **hasFullAccess** = Stripe subscription `active` or `trialing` **OR** app trial active (`trialEndsAt > now`)
- **trialAvailable** = signed in, no paid subscription, `trialUsed` is false, `trialStartedAt` is null
- **trialExpired** = trial was used/started, end date passed, no paid subscription
- Paid Stripe subscription **always** overrides trial expiration

## Mock mode (`AUTH_MODE=mock`)

- Trial is **not** persisted (no database).
- Use the dev sign-in dropdown **Trialing** to simulate full access in the UI.
- `POST /api/trial/start` returns 503.

## Reset a test user’s trial (Neon / Prisma Studio)

```sql
UPDATE "User"
SET "trialStartedAt" = NULL,
    "trialEndsAt" = NULL,
    "trialUsed" = false
WHERE email = 'your-test@example.com';
```

Or in Prisma Studio: open the user and clear the three trial fields.

## Schema deploy

After pulling trial schema changes:

```powershell
$env:DATABASE_URL="PASTE_PROD_NEON_DATABASE_URL"
npx prisma db push
```

Then redeploy Vercel.

## Manual test checklist

1. Create a new account at `/signup`.
2. Go to `/pricing` → **Start free 7-day trial — no card required**.
3. Confirm redirect to `/app?trial=started` and dashboard banner: **Your free trial is active — X days remaining**.
4. Open **Prompt Lab** — unlocked.
5. Open **Master Prompt Builder** — unlocked.
6. Open **Prompt library** — full library (not only samples).
7. Confirm **Subscribe** buttons on `/pricing` still open Stripe checkout.
8. Try starting trial again → error: trial already used.
9. (Optional) Set `trialEndsAt` to yesterday in DB → confirm free preview + “trial has ended” banner.

## API

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/api/trial/start` | POST | Required | Starts trial; returns `{ ok, redirect }` |

Codes: `NOT_SIGNED_IN`, `ALREADY_PAID`, `TRIAL_ALREADY_USED`, `AUTH_NOT_READY`
