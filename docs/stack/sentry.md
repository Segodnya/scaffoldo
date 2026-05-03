# Sentry

**What:** Error tracking + performance monitoring + (optionally) session replay.

**Why chosen:** Best-in-class error grouping. First-party Next.js SDK with sourcemap upload baked into the build. PostHog also offers errors but is weaker at backtraces and grouping — we use both because the cost is zero on the free tiers.

**Free tier:** 5,000 errors/month, 10,000 performance events, 1 user, 30-day retention.

**Alternatives considered:** PostHog Errors alone (weaker grouping), Bugsnag (paid-only), Honeybadger (Ruby-leaning), Datadog (overkill at this scale).

**Used in template by:**
- `apps/web/instrumentation.ts` — server + edge Sentry init
- `apps/web/sentry.client.config.ts` — browser Sentry init
- `apps/web/next.config.ts` — `withSentryConfig` for sourcemap upload
- `packages/observability/src/logger.ts` — pino logger that pipes errors into Sentry on `log.error(...)`

**Env vars:**
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN` — required at build time for sourcemap upload

**Setup:**
1. Create project (Next.js platform).
2. Copy DSN.
3. Create an Internal Integration / auth token with `project:releases` and `org:read` scopes.
4. Add `SENTRY_AUTH_TOKEN` to Vercel env (Production only).
