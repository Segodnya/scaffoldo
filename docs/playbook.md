# scaffoldo playbook

End-to-end walkthrough: from `npx scaffoldo init` to a deployed SaaS at a real domain. Follow this in order on your first project; subsequent projects can skip the "Account setup" step.

---

## 0. One-time prerequisites

| Need | Install |
|------|---------|
| Node 20+ | `nvm install 20` |
| pnpm | `npm i -g pnpm` |
| Stripe CLI | `brew install stripe/stripe-cli/stripe` |
| GitHub CLI (optional) | `brew install gh` |

You'll also want accounts on the services in [`stack/`](./stack/). Free tiers are enough for development; you only need a card for Stripe (and only when you go live).

---

## 1. Scaffold

```bash
npx scaffoldo init
```

The CLI runs the interview defined in [`../src/core/interview.ts`](../src/core/interview.ts) and writes a fresh monorepo to your target directory. The output is described in [`checklist.md`](./checklist.md).

> Inside Claude Code you can also run the [`/scaffold-saas`](../.claude/skills/scaffold-saas/SKILL.md) skill — it conducts the same interview through chat and shells out to the CLI.

---

## 2. Account setup (in this order)

The order matters because later services consume keys from earlier ones.

### 2.1 GitHub
- Create a private repo named `<projectSlug>`. Don't initialize with a README — push the scaffolded one.
- `cd <targetDir> && git init && git remote add origin git@github.com:<you>/<slug>.git`.

### 2.2 Vercel
- Connect the GitHub repo. Vercel auto-detects the Next.js app at `apps/web`.
- Set the **Root Directory** to `apps/web`. Set **Build Command** to `pnpm turbo run build --filter=web`.

### 2.3 Supabase
- New project → copy `Project URL`, `anon` key, `service_role` key, and `Database URL` (use the **pooled** connection string, port 6543).
- Paste into `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.
- `pnpm db:push` to apply the Prisma schema.

### 2.4 Clerk
- New application → copy `Publishable Key` and `Secret Key`.
- In Clerk dashboard → Webhooks → endpoint `https://<your-vercel-app>/api/webhooks/clerk` (subscribe to `user.created`, `user.updated`, `user.deleted`). Copy the signing secret.
- Paste: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`.

### 2.5 Stripe
- New product(s) matching your `monetization` answer. Copy each price ID into `packages/payments/src/plans.ts`.
- Webhook endpoint `https://<your-vercel-app>/api/webhooks/stripe` (subscribe to `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`). Copy the signing secret.
- Paste: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

### 2.6 PostHog, Sentry, Resend, Upstash, Pinecone (as enabled)
- Each service's signup steps, key names, and where to paste them are in [`stack/`](./stack/).
- Defaults are chosen so the app **boots** without these — features that depend on them just no-op.

### 2.7 Domain (Namecheap + Cloudflare)
- Buy at Namecheap. Point DNS to Cloudflare. In Cloudflare, add an `A` / `CNAME` record per Vercel's instructions.
- See [`stack/namecheap.md`](./stack/namecheap.md) and [`stack/cloudflare.md`](./stack/cloudflare.md).

---

## 3. Local development loop

```bash
cd <targetDir>
pnpm install
cp .env.example .env.local                  # paste real values
pnpm db:push                                # apply Prisma schema to Supabase
pnpm dev                                    # turbo runs apps/web on :3000
stripe listen --forward-to :3000/api/webhooks/stripe
```

Smoke test:
- `/` (landing) renders.
- `/sign-in` → Clerk signs you in.
- `/dashboard` is reachable post-auth.
- `/api/health` returns `200 {ok:true}`.

---

## 4. Deploying

- Push to `main`. Vercel auto-deploys the `apps/web` build.
- Promote env vars from `.env.local` into Vercel project settings (use the **Production**, **Preview**, **Development** toggles thoughtfully — most keys are the same across all three; Stripe and Clerk should have **separate test/live keys** for prod).
- Verify the Clerk and Stripe webhook URLs point at the production URL, not localhost.

---

## 5. Releasing scaffoldo (maintainers only)

```bash
# bump version in package.json, commit
git tag v0.1.x
git push origin v0.1.x
```

`.github/workflows/release.yml` runs `pnpm build` and `npm publish --provenance --access public`. Requires `NPM_TOKEN` repo secret with publish rights.

---

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Vercel build fails on Prisma generate | Missing `DATABASE_URL` at build time | Add it as a build env var (or use `prisma generate --no-engine`). |
| Clerk middleware loops | Public route not allow-listed | Add it to `publicRoutes` in `apps/web/middleware.ts`. |
| Stripe webhook signature fails | Test/live secret mismatch | Re-copy the secret from the dashboard for the matching environment. |
| `pnpm dev` exits immediately | Port 3000 in use | `lsof -i :3000` and kill the offending process. |
| Sentry uploads sourcemaps but errors show minified | Missing `SENTRY_AUTH_TOKEN` in CI env | Add the token in Vercel for Production. |
