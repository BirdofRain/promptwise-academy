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

## GitHub push

```bash
git init   # if needed
git add .
git commit -m "Your message"
git branch -M main
git remote add origin https://github.com/YOU/promptwise-academy.git
git push -u origin main
```

Install [GitHub CLI](https://cli.github.com/) optional:

```bash
winget install GitHub.cli
gh auth login
gh repo create promptwise-academy --private --source=. --push
```

## Vercel deploy

1. Import the GitHub repo at [vercel.com](https://vercel.com).
2. **Environment variables** — add all from `.env.example` for Production.
3. Set `AUTH_MODE=authjs`, `APP_URL=https://your-domain.vercel.app`.
4. Run migrations against production DB:

   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```

5. Deploy. Add Stripe webhook URL for production domain.
6. Redeploy after env changes if needed.

CLI optional:

```bash
winget install Vercel.Vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel --prod
```

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

## License

Private — all rights reserved.
