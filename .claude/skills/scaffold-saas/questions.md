# Interview questions

Human-readable mirror of [`src/core/interview.ts`](../../../src/core/interview.ts). Keep both files in sync.

| # | id | type | required | notes |
|---|----|------|----------|-------|
| 1 | `projectName` | text | yes | Display name. Min 2 chars. |
| 2 | `projectSlug` | text | yes | `/^[a-z][a-z0-9-]*[a-z0-9]$/`. Default: kebab-cased projectName. |
| 3 | `targetDir` | text | yes | Absolute path. Default: `~/Desktop/<slug>`. Must be empty if it exists. |
| 4 | `oneLinePitch` | text | yes | One sentence. Used as landing hero subhead. |
| 5 | `targetAudience` | text | yes | Who it's for. |
| 6 | `coreProblem` | text | yes | The problem being solved. |
| 7 | `coreSolution` | text | yes | How the product solves it. |
| 8 | `monetization` | select | yes | One of: `subscription`, `one-time`, `freemium`, `usage-based`. Default: `subscription`. |
| 9 | `domainEntities` | text | yes | 1–5 PascalCase nouns, comma-separated. Each becomes a Prisma model + CRUD route stub. |
| 10 | `optionalModules` | multiselect | no | Subset of `pinecone`, `upstash`, `resend`. Default: all selected. |

## Where each answer lands in the scaffolded project

| answer | files affected |
|--------|----------------|
| `projectName` | `README.md`, `apps/web/app/(marketing)/page.tsx`, `package.json#name` (root + apps + packages), email templates |
| `projectSlug` | directory name, package names (`@<slug>/...`), `apps/web/package.json` |
| `targetDir` | the scaffold target |
| `oneLinePitch` | landing hero subhead, root `README.md` |
| `targetAudience` | landing eyebrow text |
| `coreProblem` | landing "The problem" card |
| `coreSolution` | landing "How we solve it" card |
| `monetization` | `packages/payments/src/plans.ts` (default plan shape) |
| `domainEntities` | `packages/db/prisma/schema.prisma` (one model each), `apps/web/app/(app)/<entity>/page.tsx` (CRUD shell each) |
| `optionalModules` | `docs/checklist.md` notes; the packages always exist but checklist marks them as stub when not selected |
