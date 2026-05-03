# GitHub

**What:** Git hosting + Actions CI + package registry trust path for npm provenance.

**Why chosen:** Default. Free private repos, free Actions minutes for public repos, OIDC trust path required for `npm publish --provenance`.

**Free tier:** Unlimited public + private repos. 2,000 Actions minutes/month on free plan.

**Alternatives considered:** GitLab (heavier UI, fewer integrations), Codeberg (no Actions equivalent for our release workflow), self-hosted Gitea (overkill for solo work).

**Used in template by:**
- `.github/workflows/ci.yml` — typecheck, lint, smoke-test on PR
- `.github/workflows/release.yml` — `npm publish` on `v*.*.*` tag
- Vercel reads pushes from `main` to deploy `apps/web`
- Clerk + Stripe webhook URLs point at the deployed Vercel URL, which is fed by GitHub

**Env vars / secrets:**
- `NPM_TOKEN` (repo secret) — required for `release.yml` to publish

**Setup:**
1. Create a private repo named after `<projectSlug>`.
2. `git remote add origin git@github.com:<you>/<slug>.git && git push -u origin main`.
3. (For releases) Settings → Secrets → add `NPM_TOKEN`.
