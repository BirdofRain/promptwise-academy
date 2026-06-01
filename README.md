# PromptWise Academy

A calm, premium educational web app that teaches adults how to use ChatGPT for real life — relationships, planning, work, family, and clearer thinking.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Mock auth (cookie session) — ready to swap for Auth.js
- Content seeded in `content/` (no CMS yet)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Mock sign-in

1. Go to `/signup` or `/login`
2. Enter any email (password is ignored in mock mode)
3. Choose subscription status in the dev dropdown:
   - **Active** — full app access
   - **None** — signed in but paywall overlay (test pricing flow)

## Project structure

- `app/(marketing)/` — public pages
- `app/(app)/app/` — protected academy
- `components/` — UI and layout
- `content/` — modules, lessons, prompt library (edit to update content)
- `lib/auth/` — session helpers (replace with Auth.js later)

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Set `AUTH_SECRET` when enabling real auth

## Next phases

- Auth.js + Prisma + Postgres
- Stripe Checkout + webhooks
- OpenAI API route for Master Prompt Builder
- Saved prompts (database)
- Record and embed lesson videos
