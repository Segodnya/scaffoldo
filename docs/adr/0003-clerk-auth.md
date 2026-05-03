# 0003. Clerk for authentication

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Auth is the highest-leverage service to outsource. Rolling our own (or assembling NextAuth + a database session table + email provider + MFA + password reset + OAuth) is weeks of code that doesn't differentiate the product. We want sign-up, sign-in, sessions, OAuth, MFA, organizations, and pre-built UI without writing any of them.

## Decision
Use **Clerk** for all auth. Sync users into our Postgres via the `user.created/updated/deleted` webhook so Prisma joins keep working without round-tripping Clerk on every request.

Protect `(app)/*` routes via `clerkMiddleware()` in `apps/web/middleware.ts`. Treat Clerk's `userId` as the source of truth for identity; the Prisma `User.id` is the same string.

## Consequences
**Positive:**
- Sign-up, sign-in, MFA, OAuth, password reset all out of the box.
- 10k MAU free is enough to validate most ideas.
- Webhook-driven DB sync means our queries stay local.

**Negative:**
- Vendor lock-in. Migrating off later means a forced password reset for every user.
- Pricing past 10k MAU is non-trivial.
- We must verify webhook signatures correctly — a quiet bug here = silent identity desync.

## Alternatives considered
- **NextAuth/Auth.js**: free, but maintenance burden is the entire point we're avoiding.
- **Supabase Auth**: would let us drop one vendor; UI/MFA story is weaker; mixing identity models with Clerk-style hooks is annoying.
- **WorkOS**: enterprise-leaning, expensive at small scale.
- **Lucia**: nice DX, all DIY at the persistence layer.
