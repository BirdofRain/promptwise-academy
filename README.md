# PromptWise Academy

A calm, premium web academy that teaches adults how to use ChatGPT for real life — relationships, planning, work, family, and clearer thinking.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Auth.js** (NextAuth v5) + **Prisma** + **PostgreSQL** — see [docs/AUTH.md](docs/AUTH.md)
- **Stripe** Checkout + webhooks + Customer Portal
- **OpenAI** (optional) for Master Prompt Builder
- Content in `content/` seed files — see [docs/CONTENT.md](docs/CONTENT.md)

## Local setup

### 1. Install

```bash
git clone <your-repo-url>
cd prompt-engineering
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

**Quick UI dev (no database):**

```bash
AUTH_MODE=mock
AUTH_SECRET=any-random-string-for-dev
```

**Production-like beta:**

```bash
AUTH_MODE=authjs
AUTH_SECRET=<openssl rand -base64 32>
DATABASE_URL=postgresql://...
```

### 3. Database (when `AUTH_MODE=authjs`)

Using [Neon](https://neon.tech) (recommended) or any Postgres:

```bash
npx prisma db push
# or for migration history:
npx prisma migrate dev --name init
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_URL` | Prod | e.g. `https://yourdomain.com` |
| `AUTH_MODE` | Yes | `mock` or `authjs` |
| `AUTH_SECRET` | authjs | `openssl rand -base64 32` |
| `DATABASE_URL` | authjs | Postgres connection string |
| `STRIPE_SECRET_KEY` | Payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Payments | Webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | For future client Stripe.js |
| `STRIPE_PRICE_ID_MONTHLY` | Payments | Recurring price ID |
| `STRIPE_PRICE_ID_YEARLY` | Payments | Recurring price ID |
| `OPENAI_API_KEY` | Optional | AI-enhanced Master Prompt Builder |

Full template: [.env.example](.env.example)

## Auth setup

We use **Auth.js + Credentials + Prisma** (not Clerk/Supabase Auth) so users, subscriptions, and progress live in one database.

- **Sign up:** `/signup` creates a user + empty subscription row
- **Sign in:** `/login` with email/password
- **Protected routes:** `/app/*` via `middleware.ts`

Details: [docs/AUTH.md](docs/AUTH.md)

### Mock mode (`AUTH_MODE=mock`)

- Any password works; pick subscription status in the dev dropdown
- Progress stored in cookies
- Stripe checkout returns 503 (configure authjs + DB for real billing tests)

## Paywall & entitlements

| Tier | Access |
|------|--------|
| **Free (signed in)** | 2 preview lessons, sample prompts (`isFreeSample`), dashboard |
| **Paid** (`active` / `trialing`) | All lessons, full prompt library, Prompt Lab, Master Builder |

Configure preview lessons in `lib/entitlements.ts` (`FREE_PREVIEW_LESSON_SLUGS`).

## Stripe setup

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → create monthly + yearly recurring prices.
2. Copy price IDs to `STRIPE_PRICE_ID_MONTHLY` and `STRIPE_PRICE_ID_YEARLY`.
3. **Developers → API keys** → `STRIPE_SECRET_KEY`.
4. **Webhooks** → Add endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`  
   Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`  
   Copy `STRIPE_WEBHOOK_SECRET`.

**Local webhook testing:**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Checkout and portal routes return clear JSON errors if Stripe is not configured — safe for dev without keys.

## OpenAI setup

Add `OPENAI_API_KEY` to enable AI-enhanced prompts in Master Prompt Builder (`/app/prompt-builder`).

Without it, a strong **template fallback** is used (no key exposed to the browser).

## Database models

- `User` — account + `stripeCustomerId`
- `Subscription` — status synced from Stripe
- `LessonProgress` — completed lesson slugs
- `SavedPrompt` — reserved for saved favorites
- `PromptBuilderHistory` — master builder runs
- `StripeEvent` — webhook idempotency

```bash
npm run db:studio   # Browse data
```

## Content editing

Edit modules, lessons, and prompts in `content/` — no CMS required.

See [docs/CONTENT.md](docs/CONTENT.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | lint + typecheck |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:studio` | Prisma Studio |

## Verify before deploy

```bash
npm run test    # lint + typecheck
npm run build   # prisma generate + next build
```

Secrets: copy [.env.example](.env.example) to `.env.local` locally. **Never commit** `.env` or `.env.local` (ignored via `.gitignore`).

Full deploy walkthrough: [docs/DEPLOY.md](docs/DEPLOY.md).

## GitHub push

This repo uses branch **`master`**. After creating a GitHub repository:

```powershell
cd c:\Users\samue\prompt-engineering
git remote add origin https://github.com/YOUR_USER/promptwise-academy.git
git push -u origin master
```

**GitHub CLI** (Windows):

```powershell
winget install GitHub.cli
gh auth login
cd c:\Users\samue\prompt-engineering
gh repo create promptwise-academy --private --source=. --remote=origin --push
```

## Vercel deploy

### Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. Leave **Framework Preset** as Next.js; **Build Command** `npm run build`.
3. Add **Environment Variables** for **Production** (see launch checklist below).
4. Deploy, then run once from your machine:

   ```bash
   set DATABASE_URL=your-production-neon-url
   npx prisma db push
   ```

5. In Stripe, set webhook URL to `https://YOUR_DOMAIN/api/stripe/webhook`.
6. Redeploy after adding or changing env vars.

### CLI

```powershell
winget install Vercel.Vercel
vercel login
cd c:\Users\samue\prompt-engineering
vercel link
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add AUTH_MODE
vercel env add APP_URL
vercel
vercel --prod
```

Use `vercel env add` or the dashboard — do not commit secrets to git.

## Production environment (Vercel)

| Variable | Production value |
|----------|------------------|
| `APP_URL` | `https://your-domain.vercel.app` |
| `AUTH_MODE` | `authjs` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | Postgres (Neon recommended) |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` for beta |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |
| `STRIPE_PRICE_ID_MONTHLY` | Stripe Price ID |
| `STRIPE_PRICE_ID_YEARLY` | Stripe Price ID |
| `OPENAI_API_KEY` | Optional |

Preview deployments can use the same vars or a separate Neon branch database.

## Project structure

```
app/
  (marketing)/     Public pages
  (app)/app/       Protected academy
  api/
    auth/          Auth.js
    stripe/        Checkout, webhook, portal
    prompts/       Master builder API
content/           Modules, lessons, prompts (edit here)
lib/               Auth, db, stripe, entitlements, progress
prisma/            Database schema
docs/              AUTH.md, CONTENT.md
```

## Launch checklist (paid beta)

- [ ] **Database** — Neon/Supabase Postgres; `npx prisma db push` on production `DATABASE_URL`
- [ ] **Auth** — `AUTH_MODE=authjs`, `AUTH_SECRET` set; test `/signup` and `/login`
- [ ] **APP_URL** — matches live Vercel URL (required for Auth.js callbacks)
- [ ] **Stripe** — products/prices created; env vars set; webhook → `/api/stripe/webhook`
- [ ] **OpenAI** — `OPENAI_API_KEY` on Vercel (optional; template fallback works without it)
- [ ] **Content** — edit lessons/prompts in `content/` per [docs/CONTENT.md](docs/CONTENT.md)
- [ ] **Videos** — replace lesson placeholders with embed URLs when recordings are ready
- [ ] **Smoke test** — free preview → checkout → paid access → Prompt Lab → Master Builder

## License

Private — all rights reserved.
