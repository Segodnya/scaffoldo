# scaffoldo — Next.js 15 SaaS starter CLI

> One-prompt SaaS scaffolder. Generate a production-ready **Next.js 15 + Clerk + Supabase + Stripe + Resend + PostHog + Sentry** Turborepo from an interview — deployable in minutes.

`scaffoldo` is an open-source SaaS boilerplate generator for indie hackers and small teams. It turns the question "what do I actually need to launch a SaaS?" into a single command: it interviews you about your idea, then bootstraps a production-grade Next.js 15 monorepo (App Router, TypeScript, Tailwind v4, shadcn/ui, Prisma, Turborepo, pnpm) with auth, payments, email, analytics, and observability already wired together.

**Also known as:** Next.js SaaS starter · Clerk + Stripe boilerplate · Supabase Next.js template · Turborepo SaaS kit · indie-hacker scaffold · `create-saas-app` alternative.

## Quick start

```bash
# Interactive — asks ~10 questions, scaffolds in ~5 seconds
npx scaffoldo init

# Non-interactive — drive from a JSON file (used by the Claude skill)
npx scaffoldo init --answers-file answers.json

# (Optional) Install the Claude skill so /scaffold-saas works in any project
npx scaffoldo install-skill              # → ~/.claude/skills/scaffold-saas
npx scaffoldo install-skill --target .   # → ./.claude/skills/scaffold-saas
```

## What you get

A monorepo at `<targetDir>/` with:

```
apps/web                 # Next.js 15 (App Router) — landing, dashboard, auth, settings
packages/auth            # Clerk helpers
packages/db              # Prisma + Supabase Postgres
packages/payments        # Stripe checkout, customer portal, webhooks
packages/email           # Resend transactional email
packages/analytics       # PostHog
packages/observability   # Sentry + pino logger
packages/cache           # Upstash Redis + ratelimit
packages/ai              # Pinecone vector search
packages/i18n            # next-intl (EN-only catalog by default)
packages/ui              # shadcn/ui + Tailwind v4
packages/core            # shared types + AppError hierarchy
packages/config          # eslint / tsconfig / tailwind presets
docs/setup.md            # how to sign up for each service and where keys go
docs/checklist.md        # the 15-feature launch checklist, scoped to your project
.env.example             # every env var the template references
```

`.env.example` lists every required key. `docs/setup.md` walks you through each service's signup. `scaffoldo` never touches real secrets — you paste them yourself.

## Two front doors

- **CLI** — `npx scaffoldo init`. Primary entry point. Interactive prompts.
- **Claude skill** — invoke `/scaffold-saas` inside Claude Code. The skill conducts the interview through the chat, then shells out to the CLI. Same engine, same template, same output.

### Installing the Claude skill

The skill ships **inside** the npm tarball but Claude Code only discovers skills under `~/.claude/skills/` (user-global) or `<project>/.claude/skills/` (project-local). One command copies it where Claude expects:

```bash
# User-global — /scaffold-saas works in any project on this machine
npx scaffoldo install-skill

# Project-local — /scaffold-saas works only in the current directory
npx scaffoldo install-skill --target .

# Re-install over an existing copy
npx scaffoldo install-skill --force
```

You only need to do this once per machine (or once per project if you prefer the project-local install). After that, open Claude Code and type `/scaffold-saas`.

## The 15-item launch list

scaffoldo bakes in everything from [the launch checklist](docs/checklist.md):

1. Auth · 2. Database · 3. Payments · 4. Security · 5. Frontend · 6. Backend · 7. Notifications · 8. Analytics · 9. Error handling · 10. Logging · 11. File storage · 12. Settings · 13. Onboarding · 14. Performance · 15. Landing page

Each item is wired to a real file in the template. See `docs/checklist.md` for the mapping and `docs/adr/` for the architectural decisions behind it.

## The stack

Built around the cheapest credible stack to launch a real product (~$20/mo):

- **Hosting:** Vercel (free) — `docs/stack/vercel.md`
- **Auth:** Clerk (free tier) — `docs/stack/clerk.md`
- **DB:** Supabase Postgres (free) — `docs/stack/supabase.md`
- **Payments:** Stripe (2.9% per txn) — `docs/stack/stripe.md`
- **Email:** Resend (free) — `docs/stack/resend.md`
- **Analytics:** PostHog (free) — `docs/stack/posthog.md`
- **Errors:** Sentry (free) — `docs/stack/sentry.md`
- **Cache/ratelimit:** Upstash Redis (free) — `docs/stack/upstash.md`
- **Vector search:** Pinecone (free) — `docs/stack/pinecone.md`
- **Domain + DNS:** Namecheap + Cloudflare — `docs/stack/namecheap.md`, `docs/stack/cloudflare.md`
- **VCS + CI:** GitHub (free) — `docs/stack/github.md`
- **Code:** Claude Code — `docs/stack/claude.md`

## Documentation

- [`docs/playbook.md`](docs/playbook.md) — full walkthrough from `npx scaffoldo init` to first deploy
- [`docs/checklist.md`](docs/checklist.md) — the 15-feature launch checklist
- [`docs/stack/`](docs/stack) — one page per service (what it does, why chosen, env vars, alternatives)
- [`docs/adr/`](docs/adr) — architecture decision records

## Develop scaffoldo itself

```bash
pnpm install
pnpm build       # bundles src/ → dist/ via tsup
pnpm typecheck
pnpm lint
pnpm smoke       # scaffolds into a tmp dir and verifies the output
```

Releases publish to npm on `v*.*.*` git tag — see [`.github/workflows/release.yml`](.github/workflows/release.yml).

## License

MIT
