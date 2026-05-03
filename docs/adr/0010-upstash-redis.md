# 0010. Upstash Redis for cache + ratelimit

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Public API routes (signup, contact form, anything callable without auth) need rate limiting to survive the first time someone scripts against them. We also want a place to cache expensive recomputations without spinning up another vendor.

Vercel's serverless model rules out running our own Redis nearby — anything we touch from a serverless function must be reachable over HTTP from anywhere.

## Decision
Use **Upstash Redis** with the HTTP API. Wrap `@upstash/ratelimit` in `packages/cache/src/ratelimit.ts` as `withRateLimit(...)`. The module is **opt-in** in the interview; when env vars are missing the helper short-circuits and the route just runs unprotected (with a `console.warn` in dev).

## Consequences
**Positive:**
- Per-request pricing — cheap at low volume.
- Globally replicated; latency is fine from any Vercel region.
- The `@upstash/ratelimit` package is well-maintained and the API is small.

**Negative:**
- The HTTP API is a tiny bit slower than a TCP-pinned Redis on the same VPC (irrelevant at our scale).
- Free tier is 10k commands/day — easy to blow through if you put rate-limit checks on every authed route.

## Alternatives considered
- **Vercel KV**: rebrands Upstash anyway.
- **Cloudflare KV**: eventually-consistent, wrong primitive for atomic counters.
- **Self-hosted Redis**: not reachable from Vercel without networking gymnastics.
