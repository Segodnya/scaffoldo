# Architecture Decision Records

Each ADR captures one architectural choice the template makes. Format: Status / Context / Decision / Consequences. Numbered sequentially; never renumbered.

| # | Title | Status |
|---|-------|--------|
| [0001](./0001-monorepo-turborepo.md) | Monorepo with pnpm workspaces + Turborepo | Accepted |
| [0002](./0002-nextjs-15-app-router.md) | Next.js 15 with App Router | Accepted |
| [0003](./0003-clerk-auth.md) | Clerk for authentication | Accepted |
| [0004](./0004-prisma-supabase.md) | Prisma ORM on Supabase Postgres | Accepted |
| [0005](./0005-tailwind-shadcn.md) | Tailwind v4 + shadcn/ui | Accepted |
| [0006](./0006-stripe-payments.md) | Stripe Checkout + customer portal | Accepted |
| [0007](./0007-resend-email.md) | Resend for transactional email | Accepted |
| [0008](./0008-posthog-analytics.md) | PostHog for product analytics | Accepted |
| [0009](./0009-sentry-observability.md) | Sentry for error tracking | Accepted |
| [0010](./0010-upstash-redis.md) | Upstash Redis for cache + ratelimit | Accepted |
| [0011](./0011-pinecone-vector.md) | Pinecone for vector search | Accepted |
| [0012](./0012-next-intl-en-only.md) | next-intl with EN-only initial catalog | Accepted |

## Template

When adding a new ADR, copy this skeleton:

```markdown
# NNNN. <decision>

- **Status:** Proposed | Accepted | Superseded by ADR-NNNN
- **Date:** YYYY-MM-DD

## Context
What problem are we solving? What constraints matter?

## Decision
What we chose. Be specific.

## Consequences
Positive, negative, neutral. What this decision makes easy or hard later.

## Alternatives considered
Brief mention of options ruled out and why.
```
