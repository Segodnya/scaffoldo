# Upstash Redis

**What:** Serverless Redis with HTTP API. Used for rate limiting and short-lived cache.

**Why chosen:** Per-request pricing, free tier generous enough for cold starts and small apps. Official `@upstash/ratelimit` package gives sliding-window/fixed-window/token-bucket primitives in three lines.

**Free tier:** 10,000 commands/day, 256 MB storage, global edge replication.

**Alternatives considered:** Vercel KV (rebrands Upstash anyway), Cloudflare KV (eventually-consistent — wrong primitive for ratelimit), self-hosted Redis (ops burden + Vercel can't reach it).

**Used in template by:**
- `packages/cache/src/redis.ts` — `Redis` client
- `packages/cache/src/ratelimit.ts` — `withRateLimit(...)` helper used on public API routes
- Cache layer for expensive recomputations (none wired by default)

**Env vars:**
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Setup:**
1. Create a Global database.
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

**Skipping:** Drop the `upstash` answer in the interview. Calls to `withRateLimit(...)` no-op when the env vars are absent.
