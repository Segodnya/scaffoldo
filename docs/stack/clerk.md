# Clerk

**What:** Drop-in auth — sign-up, sign-in, sessions, user profile, MFA, OAuth providers, organizations.

**Why chosen:** Best-in-class DX for Next.js App Router. Pre-built UI components that look reasonable, plus full headless control if needed. Webhooks make user sync to your DB trivial.

**Free tier:** 10,000 monthly active users, all auth methods, including MFA.

**Alternatives considered:** NextAuth/Auth.js (free, but more code to maintain — sessions, providers, password reset, MFA all DIY), Supabase Auth (would consolidate vendors but UI/MFA story is weaker), WorkOS (enterprise-leaning, expensive at small scale).

**Used in template by:**
- `apps/web/middleware.ts` — `clerkMiddleware()` protects `(app)/*` routes
- `apps/web/app/(auth)/sign-in` and `sign-up` — Clerk-hosted UI
- `apps/web/app/api/webhooks/clerk/route.ts` — `user.created/updated/deleted` → Prisma upsert
- `packages/auth/` — server-side helpers (`getCurrentUser`, etc.)

**Env vars:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`

**Setup:**
1. Create application → choose auth methods → grab keys.
2. Add webhook endpoint `https://<domain>/api/webhooks/clerk` subscribed to `user.created`, `user.updated`, `user.deleted`. Copy signing secret to `CLERK_WEBHOOK_SECRET`.
