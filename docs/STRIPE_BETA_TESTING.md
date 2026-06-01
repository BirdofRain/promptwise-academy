# Stripe beta testing checklist

Use this guide when testing PromptWise Academy checkout, webhooks, and paid entitlements in staging or production.

## Required Vercel environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production and Preview as needed):

| Variable | Purpose |
|----------|---------|
| `APP_URL` | Canonical app URL, no trailing slash (e.g. `https://promptwise-academy.vercel.app`) |
| `AUTH_MODE` | Must be `authjs` for real checkout |
| `AUTH_SECRET` | Auth.js signing secret (`openssl rand -base64 32`) |
| `DATABASE_URL` | Pooled Postgres connection string (Neon recommended) |
| `STRIPE_SECRET_KEY` | Stripe secret key — **test** (`sk_test_...`) or **live** (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) from Stripe Dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Matching publishable key (`pk_test_...` or `pk_live_...`) |
| `STRIPE_PRICE_ID_MONTHLY` | Price ID for monthly plan (`price_...`) |
| `STRIPE_PRICE_ID_YEARLY` | Price ID for yearly plan (`price_...`) |

Optional:

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Master Prompt Builder AI mode |
| `DATABASE_URL_UNPOOLED` | Direct Neon URL for `prisma db push` locally |

## Test vs live mode warning

**Never mix test and live Stripe objects.**

- A `stripeCustomerId` created with a **live** key (`cus_...` in live mode) will fail if you later use a **test** secret key.
- Symptom: `No such customer: 'cus_...', a similar object exists in live mode, but a test mode key was used`.

The app now auto-recovers by creating a new customer in the current key mode and updating `User.stripeCustomerId`. For a clean test, use a fresh test user or clear the stale customer ID in the database.

**Rule:** Test keys + test price IDs + test webhook endpoint. Live keys + live price IDs + live webhook endpoint.

## How to find price IDs

1. Open [Stripe Dashboard → Products](https://dashboard.stripe.com/products).
2. Select your PromptWise Academy product.
3. Under **Pricing**, copy the **Price ID** (`price_...`) for monthly and yearly.
4. Set `STRIPE_PRICE_ID_MONTHLY` and `STRIPE_PRICE_ID_YEARLY` in Vercel.

Ensure the price IDs match your Stripe mode (test vs live).

## How to configure the webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://promptwise-academy.vercel.app/api/stripe/webhook`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` on Vercel.
5. Redeploy after changing env vars.

For local webhook testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the CLI `whsec_...` in `.env.local` while listening.

## Test checkout with card 4242

1. Set `AUTH_MODE=authjs` and all Stripe test env vars.
2. Create a test user at `/signup`.
3. Sign in and go to `/pricing`.
4. Click **Subscribe — monthly** (signed-in users should not see “Sign in first”).
5. On Stripe Checkout, use:
   - Card: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits
   - ZIP: any valid value
6. Complete payment — you should land on `/checkout/success?session_id=...` then redirect to `/app?upgraded=1`.

## Stale live/test `stripeCustomerId`

If checkout failed with a mode mismatch:

1. **Automatic:** The checkout route detects invalid customers and creates a new one.
2. **Manual (optional):** In Prisma Studio or SQL, set `User.stripeCustomerId = NULL` for the affected user, then retry checkout.
3. **Refresh:** On `/app/account`, click **Refresh membership status** to pull subscription state from Stripe.

## Verify database rows

Use `npx prisma studio` or Neon SQL editor.

### User table

- `id`, `email`, `stripeCustomerId` — customer ID should match current Stripe mode.
- Subscription summary is stored on the related `Subscription` row (not duplicated on `User`).

### Subscription table

- `userId` — links to User
- `status` — `ACTIVE`, `TRIALING`, `PAST_DUE`, `CANCELED`, or `NONE`
- `plan` — `monthly` or `yearly`
- `stripeSubscriptionId`, `stripePriceId`, `currentPeriodEnd`

After successful checkout, status should be `ACTIVE` (or `TRIALING` if using a trial).

### StripeEvent table

- Idempotent webhook processing — each Stripe `event.id` is stored once.

## Entitlements checklist

After checkout sync:

- [ ] Dashboard does **not** show the free preview banner
- [ ] `/app/prompt-lab` and `/app/prompt-builder` are unlocked
- [ ] `/app/account` shows **Membership active** and **Manage billing**
- [ ] `/pricing` shows membership active (not “Sign in first”)

## Checkout success sync

Success URL format:

```
/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

The success page:

1. Requires signed-in user
2. Retrieves the Checkout Session from Stripe
3. Verifies ownership via metadata `userId`, `client_reference_id`, or `stripeCustomerId`
4. Upserts `Subscription` in Postgres
5. Redirects to `/app?upgraded=1`

If the webhook is delayed, this path still activates membership immediately.

## Mock mode (`AUTH_MODE=mock`)

Local UI testing without a database:

- Checkout routes return 503 (expected)
- Subscription status comes from the mock session cookie at sign-in
- Use mock sign-in options to toggle free vs paid UI

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Pricing shows “Sign in first” while logged in | Page not reading auth | Fixed — pricing uses `getCurrentUserAccess()` |
| Paid but still free preview | DB not synced | Visit checkout success URL or use **Refresh membership status** |
| Webhook 503 | Missing `STRIPE_WEBHOOK_SECRET` or `DATABASE_URL` | Set env vars, redeploy |
| Checkout 503 | Missing price IDs or Stripe keys | Verify all Stripe env vars |
| Customer mode mismatch | Stale `stripeCustomerId` | Retry checkout (auto-fix) or null customer ID in DB |

## Deploy reminder

After env changes:

```bash
npx vercel deploy --prod
```

Or push to `master` if Vercel Git integration is connected.
