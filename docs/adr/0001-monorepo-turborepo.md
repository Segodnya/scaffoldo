# 0001. Monorepo with pnpm workspaces + Turborepo

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
A SaaS quickly grows multiple deployable surfaces (web, marketing site, admin, mobile, API). Even at v0, splitting cross-cutting concerns (auth, payments, email, observability) into reusable packages keeps the web app readable and lets us evolve them independently. We need:
- a workspace manager that handles internal packages cleanly,
- task orchestration that doesn't rebuild what hasn't changed,
- something Vercel and CI both natively understand.

## Decision
Use **pnpm workspaces** for dependency hoisting and **Turborepo** for task running and remote caching. Layout:

```
apps/web                # Next.js
packages/{auth,db,payments,email,...}
```

Internal packages publish nothing; they're consumed via workspace protocol (`workspace:*`).

## Consequences
**Positive:**
- One install, one lockfile, fast incremental builds.
- Reusing `packages/auth` from a future `apps/admin` or `apps/api` is free.
- Turborepo's remote cache (free tier on Vercel) makes CI a few seconds for unchanged packages.

**Negative:**
- Slightly steeper onboarding than a single Next.js app.
- Turbo's cache invalidation is a layer to understand when builds misbehave.

## Alternatives considered
- **Single Next.js app**: simpler, but encourages mixing concerns; harder to extract later.
- **Nx**: more capable, more conceptual overhead — overkill for v0.
- **npm workspaces**: works, but pnpm's symlink layout is faster, stricter, and avoids phantom-dep bugs.
