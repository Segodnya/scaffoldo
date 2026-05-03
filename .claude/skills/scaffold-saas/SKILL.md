---
name: scaffold-saas
description: Interview the user about a new SaaS idea, then scaffold a complete Next.js 15 + Clerk + Supabase + Stripe monorepo via the `scaffoldo` CLI. Trigger on `/scaffold-saas`, "scaffold a new SaaS", "start a new project from scaffoldo", or any request to bootstrap a fresh SaaS project from this repo's template.
---

# scaffold-saas

You are running inside the **scaffoldo** repo. The user wants a new SaaS project bootstrapped. This skill conducts the interview and delegates the filesystem work to the `scaffoldo` npm CLI.

## Single source of truth

The canonical question schema lives in [`src/core/interview.ts`](../../../src/core/interview.ts). A human-readable mirror is in [`questions.md`](./questions.md). **Both files must stay in sync** — if you change one, change the other.

## Phase 1 — Interview

Use `AskUserQuestion` to walk the question list. Group up to 4 questions per call to keep the experience tight. Required fields, in order:

1. `projectName` — display name (free text)
2. `projectSlug` — kebab-case slug for the directory and package
3. `targetDir` — absolute path; default to `~/Desktop/<slug>`
4. `oneLinePitch` — one sentence, used as the landing hero
5. `targetAudience` — who is this for
6. `coreProblem` — the problem being solved
7. `coreSolution` — how the product solves it
8. `monetization` — `subscription` / `one-time` / `freemium` / `usage-based`
9. `domainEntities` — 1–5 PascalCase nouns, comma-separated; each becomes a Prisma model + a CRUD route stub
10. `optionalModules` — multi-select from `pinecone`, `upstash`, `resend` (default: all on)

**Validation rules** (mirror `src/core/interview.ts`):

- `projectSlug` must match `/^[a-z][a-z0-9-]*[a-z0-9]$/`
- `domainEntities` items must match `/^[A-Z][A-Za-z0-9]*$/`, between 1 and 5
- `targetDir` must be an absolute path

If a user answer fails validation, ask again with a corrective hint. Do not silently fix it.

## Phase 2 — Delegate to the CLI

Build an answers object that matches the `Answers` interface, write it to a tempfile, then invoke the CLI.

```bash
ANSWERS_FILE="$(mktemp -t scaffoldo-answers-XXXXXX.json)"
cat > "$ANSWERS_FILE" <<'JSON'
{
  "projectName": "...",
  "projectSlug": "...",
  "targetDir": "/absolute/path",
  "oneLinePitch": "...",
  "targetAudience": "...",
  "coreProblem": "...",
  "coreSolution": "...",
  "monetization": "subscription",
  "domainEntities": ["Lead", "Pipeline"],
  "optionalModules": ["pinecone", "upstash", "resend"]
}
JSON
npx scaffoldo@latest init --answers-file "$ANSWERS_FILE"
```

Run that as a single Bash invocation. The CLI prints a `Next steps` block on success.

**During development of scaffoldo itself**, `scaffoldo@latest` may not yet be on npm. Fall back to running the local build:

```bash
node /absolute/path/to/scaffoldo/dist/cli.js init --answers-file "$ANSWERS_FILE"
```

Detect dev mode by checking whether the current working directory is the scaffoldo repo (`package.json` has `"name": "scaffoldo"`). If so, prefer `pnpm --silent build && node ./dist/cli.js init …`.

## Phase 3 — Surface the post-scaffold checklist

After the CLI returns, read these files from the target dir and surface their content to the user inline (do not just point at paths — paste the relevant sections):

- `<targetDir>/docs/setup.md` — per-service signup walkthrough
- `<targetDir>/docs/checklist.md` — the 15-feature launch checklist tailored to this project
- `<targetDir>/.env.example` — list every key that needs a real value before `pnpm dev`

End with a concrete "what to do next" block:

1. `cd <targetDir> && pnpm install`
2. Walk through `docs/setup.md` in order: GitHub → Vercel → Supabase → Clerk → Stripe → (optional services).
3. Paste keys into `.env.local` (copied from `.env.example`).
4. `pnpm db:push` once `DATABASE_URL` is set.
5. `pnpm dev`.

## Hard constraints

- **Never** ask the user for, read, or write real API keys. Only `.env.example` (placeholder values) is touched.
- **Never** run `git commit`, `git push`, `pnpm install`, or `pnpm build` without an explicit user OK — the user's global rules forbid this.
- **English only** in all generated content (overrides the user's global "comments in Russian" preference for scaffoldo and its outputs).
- If the target directory already exists and is non-empty, abort and ask the user to pick a different path. Do **not** pass `--force`.
