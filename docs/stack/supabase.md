# Supabase

**What:** Hosted Postgres + S3-compatible object storage + (unused here) auth, realtime, edge functions.

**Why chosen:** Real Postgres (not a key-value store with a SQL veneer), generous free tier, built-in pgBouncer pooling for serverless, simple Storage API with signed URLs. We use only the Postgres + Storage parts; auth lives in Clerk.

**Free tier:** 500 MB database, 1 GB storage, 5 GB egress, unlimited API requests, paused after 1 week of inactivity.

**Alternatives considered:** Neon (also good, Postgres-only, branching is killer feature; pick if you want db-only and pricing is better), PlanetScale (MySQL, no FK in older tiers), Railway Postgres (paid-only), self-hosted Postgres (ops burden).

**Used in template by:**
- `packages/db/prisma/schema.prisma` — Prisma points at the Supabase Postgres URL
- `packages/db/src/client.ts` — singleton Prisma client
- `packages/db/src/storage.ts` — Supabase Storage client + `signedUrl(...)` helper
- `apps/web/app/(app)/*` — server components query via Prisma

**Env vars:**
- `DATABASE_URL` — pooled Postgres connection (port 6543)
- `DIRECT_URL` — direct connection (port 5432) used by `prisma migrate`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server only

**Setup:**
1. New project, choose region nearest your Vercel region.
2. Project Settings → Database → copy **Connection string (Pooler)** for `DATABASE_URL` and **Connection string (Session)** for `DIRECT_URL`.
3. Project Settings → API → copy `anon` and `service_role` keys.
4. Storage → create bucket (default name `uploads`).
5. `pnpm db:push` from the project root.
