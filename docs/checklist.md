# The 15-feature launch checklist

Every SaaS needs the same fifteen capabilities to feel real. scaffoldo wires all of them. This is the canonical list; each scaffolded project gets a project-specific copy in `<targetDir>/docs/checklist.md`.

| # | Capability | Wired in template | ADR |
|---|------------|-------------------|-----|
| 1 | **Auth** — registration, login, logout | `packages/auth/`, `apps/web/middleware.ts`, `apps/web/app/(auth)/`, `apps/web/app/api/webhooks/clerk/route.ts` | [0003](./adr/0003-clerk-auth.md) |
| 2 | **Database** — store users & data | `packages/db/prisma/schema.prisma`, `packages/db/src/client.ts` | [0004](./adr/0004-prisma-supabase.md) |
| 3 | **Payments** — receive charges | `packages/payments/`, `apps/web/app/api/webhooks/stripe/route.ts` | [0006](./adr/0006-stripe-payments.md) |
| 4 | **Security** — protect the app | `apps/web/middleware.ts`, `apps/web/next.config.ts` (CSP, headers), webhook signature verifiers, Upstash ratelimit | — |
| 5 | **Frontend** — UI / UX | `apps/web/app/`, `packages/ui/` (shadcn + Tailwind v4) | [0005](./adr/0005-tailwind-shadcn.md) |
| 6 | **Backend** — APIs & logic | `apps/web/app/api/`, server actions in `apps/web/app/(app)/` | [0002](./adr/0002-nextjs-15-app-router.md) |
| 7 | **Notifications** — email, push, alerts | `packages/email/` (Resend) | [0007](./adr/0007-resend-email.md) |
| 8 | **Analytics** — track usage | `packages/analytics/`, root layout provider | [0008](./adr/0008-posthog-analytics.md) |
| 9 | **Error handling** — no silent failures | `packages/core/src/errors.ts`, `apps/web/app/error.tsx` | — |
| 10 | **Logging** — know what's breaking | `packages/observability/src/logger.ts` (pino), `apps/web/instrumentation.ts` (Sentry) | [0009](./adr/0009-sentry-observability.md) |
| 11 | **File storage** — images, uploads | `packages/db/src/storage.ts` (Supabase Storage signed URLs) | [0004](./adr/0004-prisma-supabase.md) |
| 12 | **Settings** — user preferences | `apps/web/app/(app)/settings/page.tsx` | — |
| 13 | **Onboarding** — first-time user flow | `apps/web/app/(app)/onboarding/page.tsx` (gated on `User.onboardedAt`) | — |
| 14 | **Performance** — fast loading | Next 15 PPR, `next/font`, `next/image`, segment caching | [0002](./adr/0002-nextjs-15-app-router.md) |
| 15 | **Landing page** — explain the product | `apps/web/app/(marketing)/page.tsx` (synthesized from interview answers) | — |

## Bonus capabilities scaffoldo also wires

- **Caching & rate limits** — `packages/cache/` (Upstash Redis) — [ADR 0010](./adr/0010-upstash-redis.md)
- **Vector search / AI** — `packages/ai/` (Pinecone) — [ADR 0011](./adr/0011-pinecone-vector.md)
- **i18n** — `packages/i18n/` + `apps/web/messages/en.json` — [ADR 0012](./adr/0012-next-intl-en-only.md)
- **Monorepo orchestration** — Turborepo + pnpm workspaces — [ADR 0001](./adr/0001-monorepo-turborepo.md)
