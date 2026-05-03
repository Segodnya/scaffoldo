# 0002. Next.js 15 with App Router

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
We need a frontend framework that handles SSR, SSG, ISR, and API endpoints in one box, with first-class deploy on Vercel and a path to Edge runtimes. Splitting the API from the web is premature for a one-person SaaS — server actions and route handlers cover us until we actually have a second consumer.

## Decision
Use **Next.js 15** with the **App Router**. Use server components by default; client components only where interactivity demands it. Route handlers (`app/api/*/route.ts`) handle webhooks and any external API surface. Server actions handle in-app mutations.

Enable **PPR** (Partial Prerendering) for static-y pages with dynamic islands.

## Consequences
**Positive:**
- One mental model for routing.
- Fewer hydration bugs because most code is server-rendered.
- Streaming + Suspense work without ceremony.
- Deploys to Vercel with zero config.

**Negative:**
- App Router is still maturing; the model shifts every few releases (caching semantics, especially).
- Cold starts on serverless functions can bite. Use Edge runtime for hot endpoints when the SDK supports it (Clerk middleware does, Stripe SDK does not).

## Alternatives considered
- **Pages Router**: stable but on the way out for greenfield work.
- **Remix**: simpler model, weaker static-gen story, no Vercel-tier integration.
- **Astro**: great for marketing, awkward for an authed app.
- **SvelteKit**: smaller ecosystem; Clerk + shadcn parity is worse.
