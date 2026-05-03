# __PROJECT_NAME__ — service setup

scaffoldo never sees real keys. This file is your manual walkthrough. Do these in order — later services consume keys from earlier ones.

## 1. GitHub
Create a private repo named `__PROJECT_SLUG__`. Don't initialize with a README.

```bash
git init
git remote add origin git@github.com:<you>/__PROJECT_SLUG__.git
git add .
git commit -m "init: scaffoldo"
git push -u origin main
```

## 2. Vercel
Connect the GitHub repo. Set:
- **Root Directory:** `apps/web`
- **Build Command:** `pnpm turbo run build --filter=web`
- **Install Command:** `pnpm install --frozen-lockfile`

You'll add env vars below; do that *after* the other services hand them out.

## 3. Supabase Postgres
1. New project. Pick the region closest to your Vercel region.
2. Project Settings → Database:
   - Copy the **Connection string (Pooler)** → `DATABASE_URL`
   - Copy the **Connection string (Session)** → `DIRECT_URL`
3. Project Settings → API:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
4. Storage → New bucket → `uploads`.
5. Locally: `pnpm db:push`.

## 4. Clerk auth
1. New application. Pick auth methods (email + social as needed).
2. API Keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Webhooks → endpoint `https://<your-vercel-app>/api/webhooks/clerk`. Subscribe to `user.created`, `user.updated`, `user.deleted`. Copy signing secret → `CLERK_WEBHOOK_SECRET`.

## 5. Stripe payments
1. Create products + prices to match the `__MONETIZATION__` model. Update `packages/payments/src/plans.ts` with the price IDs.
2. Developers → API keys:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Developers → Webhooks → endpoint `https://<your-vercel-app>/api/webhooks/stripe`. Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.created` / `updated` / `deleted`
   - `invoice.payment_succeeded` / `payment_failed`
   Copy signing secret → `STRIPE_WEBHOOK_SECRET`.
4. Local dev: `pnpm stripe:listen`.

## 6. Resend (email)
1. Verify your sending domain (DKIM/SPF DNS records — Cloudflare has a one-click flow for these).
2. Generate API key → `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to a verified sender (e.g. `hello@__PROJECT_SLUG__.com`).

## 7. Upstash Redis
1. New Global database.
2. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST tab.

## 8. Pinecone (vector search) — optional
1. Create a serverless index. Match dimension to your embedding model (1536 for `text-embedding-3-small`).
2. `PINECONE_API_KEY` and `PINECONE_INDEX` (the index name).
3. If embedding via OpenAI, set `OPENAI_API_KEY`.

## 9. PostHog
1. Create project. Pick US or EU instance.
2. Project API key → `NEXT_PUBLIC_POSTHOG_KEY`.
3. `NEXT_PUBLIC_POSTHOG_HOST` is `https://us.i.posthog.com` or `https://eu.i.posthog.com`.

## 10. Sentry
1. Create Next.js project. Copy DSN → `NEXT_PUBLIC_SENTRY_DSN`.
2. `SENTRY_ORG` (slug) and `SENTRY_PROJECT` (slug) from the project URL.
3. Settings → Auth Tokens → Create with `project:releases` + `org:read` → `SENTRY_AUTH_TOKEN`. Add this to **Vercel Production env vars** (not `.env.local` unless you want sourcemap upload from your dev machine).

## 11. Domain (Namecheap → Cloudflare → Vercel)
1. Buy `__PROJECT_SLUG__.com` at Namecheap.
2. Add the domain to Cloudflare. Update Namecheap nameservers to Cloudflare's.
3. In Vercel → Domains → add the domain. Vercel tells you which Cloudflare DNS records to add.
4. Set Cloudflare SSL/TLS to **Full (strict)**.

## Done

```bash
cp .env.example .env.local
# paste each key from above
pnpm db:push
pnpm dev
```

Hit `/api/health` — if it returns `{"ok":true}` you're up.
