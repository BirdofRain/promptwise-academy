# Deployment guide — PromptWise Academy

## Pre-flight (local)

```bash
npm install
cp .env.example .env.local
npm run test
npm run build
```

## GitHub

```bash
git remote add origin https://github.com/YOUR_USER/promptwise-academy.git
git push -u origin master
```

Or with GitHub CLI:

```bash
gh auth login
gh repo create promptwise-academy --private --source=. --remote=origin --push
```

## Vercel (dashboard)

1. [vercel.com/new](https://vercel.com/new) → Import Git repository.
2. Framework: **Next.js** (auto-detected).
3. Build command: `npm run build` (default — runs `prisma generate && next build`).
4. Install command: `npm install` (runs `postinstall` → `prisma generate`).
5. Add environment variables (Production):

| Variable | Value |
|----------|--------|
| `APP_URL` | `https://your-project.vercel.app` |
| `AUTH_MODE` | `authjs` |
| `AUTH_SECRET` | random 32+ chars |
| `DATABASE_URL` | Neon/Supabase Postgres URL |
| `STRIPE_*` | From Stripe dashboard |
| `OPENAI_API_KEY` | Optional |

6. Deploy → run `DATABASE_URL="..." npx prisma db push` against production DB once.
7. Stripe webhook: `https://your-domain/api/stripe/webhook`.

## Vercel (CLI)

```bash
npm i -g vercel
vercel login
cd prompt-engineering
vercel link
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add AUTH_MODE
vercel env add APP_URL
# ... repeat for Stripe and OpenAI
vercel          # preview
vercel --prod   # production
```

Do not paste secrets into the terminal history on shared machines; use `vercel env add` interactively or the dashboard.
