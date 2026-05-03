# Vercel

**What:** Hosting + CI for the Next.js app. Edge network, automatic preview URLs per PR, server functions.

**Why chosen:** First-party Next.js host. Zero-config for the App Router. Free hobby tier covers a real product's first ~10k users.

**Free tier:**
- 100 GB bandwidth/month
- Unlimited serverless function invocations (with execution-time caps)
- Automatic HTTPS, previews, rollbacks

**Alternatives considered:** Netlify (close second; weaker Next 15 features support), Cloudflare Pages (cheaper at scale, weaker Next 15 features support), self-hosted on Fly/Railway (more control, more ops).

**Used in template by:**
- `apps/web/next.config.ts` — Next.js config consumed at deploy
- `apps/web/app/` — App Router pages deployed as a mix of edge + server functions
- Webhook endpoints (`/api/webhooks/*`) require stable URLs, which Vercel provides

**Env vars / secrets:** Whatever lives in `.env.local` is mirrored as Vercel project env vars. Critical ones at minimum:
- `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`
- `CLERK_*`, `NEXT_PUBLIC_CLERK_*`
- `STRIPE_*`, `NEXT_PUBLIC_STRIPE_*`

**Setup:**
1. Connect the GitHub repo.
2. Set **Root Directory** to `apps/web`.
3. Set **Build Command** to `pnpm turbo run build --filter=web`.
4. Set **Install Command** to `pnpm install --frozen-lockfile`.
5. Add env vars (Production + Preview separate where appropriate).
