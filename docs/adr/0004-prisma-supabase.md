# 0004. Prisma ORM on Supabase Postgres

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
We need a typed data layer over a real Postgres. Postgres because: real foreign keys, `jsonb`, full-text search, vector extension if we ever drop Pinecone, mature tooling. We need an ORM/query builder that gives us type safety without trapping us — raw SQL must remain a one-liner away.

## Decision
Use **Prisma** as the ORM and **Supabase** as the Postgres host. Use Prisma's `relationMode = "prisma"` only if we ever switch to a non-FK platform (we don't here). Use Supabase's pgBouncer pooler URL (`DATABASE_URL`, port 6543) for the runtime client and the direct URL (`DIRECT_URL`, port 5432) for migrations.

## Consequences
**Positive:**
- End-to-end types from schema to query result.
- `prisma migrate` covers schema evolution without bespoke tooling.
- Supabase Storage gives us file uploads without a second vendor.

**Negative:**
- Prisma's bundle is heavy. Worth it for v0; revisit at scale if the cold-start budget gets tight.
- Pooler-mode requires `pgbouncer=true` in the URL or transaction-mode connection — a sharp edge for unusual queries (advisory locks, listen/notify).

## Alternatives considered
- **Drizzle**: lighter, type-safe, SQL-first. Strong runner-up; pick it if you want lower bundle size and don't need Prisma Studio.
- **Kysely**: pure query builder, no migration story.
- **Raw `pg` client**: too much boilerplate at v0.
- **Neon Postgres**: better branching, no Storage equivalent.
- **PlanetScale (MySQL)**: no real FKs in older tiers; Postgres ergonomics are better.
