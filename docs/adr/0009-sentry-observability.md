# 0009. Sentry for error tracking

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Silent failures are the worst class of bug. We need:
- structured logs with timestamps and request context,
- aggregated error reporting with deduplication and grouping,
- sourcemap-aware stack traces from production minified bundles.

PostHog has an Errors product, but its grouping and ergonomics for backend errors are weaker than Sentry's.

## Decision
Use **Sentry** for error tracking + sourcemap upload. Use **pino** in `packages/observability/src/logger.ts` for structured logs; pino's transport pipes errors into Sentry. Configure Sentry in `apps/web/instrumentation.ts` (server + edge) and `sentry.client.config.ts` (browser).

PostHog stays for product analytics; Sentry covers errors. The cost is zero on both free tiers.

## Consequences
**Positive:**
- Best-in-class error grouping and release tracking.
- Sourcemap upload integrated with the Next.js build via `withSentryConfig`.
- pino is fast enough that we don't worry about logging cost.

**Negative:**
- Two analytics-adjacent tools to keep in sync (events go to PostHog, errors go to Sentry).
- Sentry's free tier (5k errors/month) is small once you launch.

## Alternatives considered
- **PostHog Errors only**: drops a vendor, but loses release tracking and grouping.
- **Bugsnag** / **Honeybadger**: paid-only at our scale.
- **Datadog**: vastly overkill.
