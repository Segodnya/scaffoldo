# scaffoldo

[![npm version](https://img.shields.io/npm/v/scaffoldo.svg?logo=npm&color=cb3837)](https://www.npmjs.com/package/scaffoldo)
[![npm downloads](https://img.shields.io/npm/dm/scaffoldo.svg?logo=npm&color=cb3837)](https://www.npmjs.com/package/scaffoldo)
[![skills.sh](https://skills.sh/b/Segodnya/scaffoldo)](https://skills.sh/Segodnya/scaffoldo)
[![CI](https://github.com/Segodnya/scaffoldo/actions/workflows/ci.yml/badge.svg)](https://github.com/Segodnya/scaffoldo/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/scaffoldo.svg)](LICENSE)
[![node](https://img.shields.io/node/v/scaffoldo.svg?logo=node.js&logoColor=white)](https://nodejs.org)

> Launch a production-ready SaaS in 5 seconds, not 2 weeks.

## The pain it solves

Every new SaaS needs the same plumbing before the first feature ships: auth, database, payments, email, analytics, error tracking, rate-limiting, logging. Wiring it all together — and getting it production-safe — usually takes 2–3 weeks per project. You make the same decisions, copy the same boilerplate, and re-debug the same webhook signatures every time.

`scaffoldo` collapses all of that into one command. It interviews you about your idea, then generates a Turborepo monorepo with every piece already wired together and ready to deploy.

## Quick start

```bash
# Interactive — ~10 questions, scaffolds in ~5 seconds
npx scaffoldo init

# Non-interactive — drive from a JSON file
npx scaffoldo init --answers-file answers.json
```

## Why scaffoldo

- **Production-ready out of the box.** Sentry, structured logging, rate-limiting, and webhook signature checks are wired in — not left as TODOs.
- **Cheapest credible stack.** Free tiers across the board; you can launch and run for around $20/month.
- **Two front doors.** Use the CLI directly, or invoke `/scaffold-saas` inside Claude Code — same engine, same template, same output.
- **Every choice is justified.** Each service has an ADR in `docs/adr/` explaining *why* it was picked, not just *what* it is.

## What's inside

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

## The 15-item launch list

scaffoldo bakes in everything from [the launch checklist](docs/checklist.md):

1. Auth · 2. Database · 3. Payments · 4. Security · 5. Frontend · 6. Backend · 7. Notifications · 8. Analytics · 9. Error handling · 10. Logging · 11. File storage · 12. Settings · 13. Onboarding · 14. Performance · 15. Landing page

Each item is wired to a real file in the template. See `docs/checklist.md` for the mapping and `docs/adr/` for the architectural decisions behind it.

## Two ways to use it

- **CLI** — `npx scaffoldo init`. Primary entry point, interactive prompts.
- **Claude skill** — type `/scaffold-saas` inside Claude Code. The skill conducts the interview through chat, then shells out to the CLI. Install once with:

  ```bash
  npx skills add Segodnya/scaffoldo -g
  ```

  See [`CONTRIBUTING.md`](CONTRIBUTING.md#installing-the-skill-advanced) for project-local and CI-friendly install variants.

## Documentation

- [`docs/playbook.md`](docs/playbook.md) — full walkthrough from `npx scaffoldo init` to first deploy
- [`docs/checklist.md`](docs/checklist.md) — the 15-feature launch checklist
- [`docs/stack/`](docs/stack) — one page per service (what it does, why chosen, env vars, alternatives)
- [`docs/adr/`](docs/adr) — architecture decision records

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for dev setup, project layout, commit conventions, the release flow, and skill-install variants.

## License

MIT
