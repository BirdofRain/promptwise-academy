# Authentication — PromptWise Academy

## Choice: Auth.js (NextAuth v5) + Prisma + Credentials

We use **Auth.js** (`next-auth@beta`) with the **Prisma adapter** and **email/password (Credentials)** for the paid beta.

### Why Auth.js (not Clerk or Supabase Auth)?

| Option | Pros | Why we did not pick it for MVP |
|--------|------|--------------------------------|
| **Auth.js + Prisma** | Same database as subscriptions & progress; full control; no per-MAU vendor fee; works on Vercel | Slightly more setup than Clerk |
| **Clerk** | Fast UI, hosted | Extra cost, separate user store, syncing subscription state is harder |
| **Supabase Auth** | Good if all-in on Supabase | Locks you to Supabase; we already use Postgres via Prisma |

Credentials is enough for a beta audience (boomers / professionals): familiar email + password, no OAuth required on day one. Google can be added later as another Auth.js provider.

### Modes

| `AUTH_MODE` | Behavior |
|-------------|----------|
| `mock` | Cookie-based dev login (no database). Use for UI work without Postgres. |
| `authjs` | Real Auth.js sessions + Prisma (production and staging). |

Set in `.env.local`:

```bash
AUTH_MODE=authjs
AUTH_SECRET=...   # openssl rand -base64 32
DATABASE_URL=...
```

### Files

- `auth.ts` — Auth.js configuration
- `app/api/auth/[...nextauth]/route.ts` — Auth routes
- `lib/auth/session.ts` — Unified `getSession()` for app code
- `lib/auth/register.ts` — Sign-up server action
- `middleware.ts` — Protects `/app/*`

### Next steps (optional)

1. Add **Google** provider in `auth.ts` for one-click sign-in.
2. Add **email verification** (Resend + VerificationToken).
3. Add **password reset** flow.

See README for env vars and migration commands.
