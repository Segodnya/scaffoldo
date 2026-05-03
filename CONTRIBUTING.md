# Contributing to scaffoldo

Thanks for considering a contribution. This document covers everything you need to develop the CLI itself, follow the commit conventions, and understand how releases ship.

## Setup

```bash
pnpm install
pnpm build       # bundles src/ → dist/ via tsup
pnpm typecheck
pnpm lint
pnpm smoke       # scaffolds into a tmp dir and verifies the output
```

Node.js 20+ is required (see `package.json#engines`).

## Project layout

- `src/` — the CLI source. Entry point is `src/cli.ts`; the public API surface is re-exported from `src/index.ts`.
- `template/` — files copied verbatim (or after light variable substitution) into every generated repo. If you change templates, run `pnpm smoke` to verify the output still bootstraps.
- `docs/` — user-facing documentation: the playbook, the 15-item checklist, per-service stack pages, and ADRs.
- `scripts/` — internal helpers (smoke runner, release checks).

## Commit message convention

The repo follows [Conventional Commits 1.0](https://www.conventionalcommits.org/). The commit *type* decides the version bump:

| Type | Bump | Use for |
|---|---|---|
| `feat:` | **minor** (0.1.0 → 0.2.0) | New user-facing capability |
| `fix:` | **patch** (0.1.0 → 0.1.1) | Bug fix |
| `perf:` | **patch** | Performance improvement |
| `feat!:` / `BREAKING CHANGE:` | **major** (0.x → 1.0.0) | Backwards-incompatible change |
| `docs:` | none | README / docs / comments |
| `refactor:` | none | Internal restructure, no behavior change |
| `chore:` / `build:` / `ci:` / `test:` / `style:` | none | Tooling, deps, formatting |
| `revert:` | inferred | Reverting a previous commit |

**Format:**

```
<type>(<optional-scope>): <short summary>

<optional body explaining *why*, not *what*>

<optional footers, e.g. BREAKING CHANGE: …>
```

**Examples:**

```
feat(cli): add --dry-run flag to skip writes
fix(template): correct Stripe webhook signature header name
docs: clarify Trusted Publishing setup in release section
refactor(skill): extract questions list into JSON
feat!: rename `init` command to `create`

BREAKING CHANGE: `scaffoldo init` is now `scaffoldo create`. Existing
scripts must be updated.
```

**Scopes** are optional but useful: `cli`, `template`, `skill`, `docs`, `ci`. Keep summaries imperative ("add", "fix", "remove") and under ~70 chars.

**Pre-1.0 note:** while the package is in `0.x`, breaking changes (`feat!:` / `BREAKING CHANGE:`) bump the **minor** instead of the major — the SemVer "0.x is unstable" convention. `feat:` still bumps minor, `fix:` still bumps patch. The first `1.0.0` is cut deliberately when the API is declared stable.

## Releases

Releases are automated via [release-please](https://github.com/googleapis/release-please) and [Conventional Commits](https://www.conventionalcommits.org/).

**Flow:**

1. Merge PRs into `main` with [Conventional Commit](#commit-message-convention) titles (`feat:`, `fix:`, …).
2. release-please watches `main` and keeps an open **Release PR** that previews the next version + `CHANGELOG.md` diff.
3. Merging the Release PR creates a `vX.Y.Z` git tag.
4. The tag triggers [`.github/workflows/release-please.yml`](.github/workflows/release-please.yml) which builds, smoke-tests, and publishes to npm with provenance via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers).

You don't bump versions by hand. Don't run `npm version`. Don't push tags manually.

## Installing the skill (advanced)

The Claude skill lives at [`.claude/skills/scaffold-saas/`](.claude/skills/scaffold-saas) and is published via [skills.sh](https://skills.sh/Segodnya/scaffoldo). The README shows the global install; here are the other variants:

```bash
# Project-local (default) — installs into the current dir's .claude/skills/
npx skills add Segodnya/scaffoldo

# User-global — /scaffold-saas works in any project on this machine
npx skills add Segodnya/scaffoldo -g

# Non-interactive (CI-friendly) — install globally into Claude Code, skip prompts
npx skills add Segodnya/scaffoldo -a claude-code -g -y
```

Install once per machine (global) or once per project (project-local). After install, open Claude Code and type `/scaffold-saas`.
