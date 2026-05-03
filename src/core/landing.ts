import { promises as fs } from 'node:fs';
import path from 'node:path';
import fse from 'fs-extra';

import type { Answers } from './interview.types.js';
import type { Stage, StageContext, StageResult } from './scaffold.types.js';

const LANDING_PATH = 'apps/web/app/(marketing)/page.tsx';

/**
 * Pure render of the marketing landing. User input flows through JSX
 * expression slots ({...}) wrapping JSON.stringify'd strings, so any
 * `<`, `{`, `}`, `"`, or backtick the user types is JSX-safe by construction.
 */
export const renderLanding = (answers: Answers): string => {
  const audience = JSON.stringify(answers.targetAudience);
  const projectName = JSON.stringify(answers.projectName);
  const pitch = JSON.stringify(answers.oneLinePitch);
  const problem = JSON.stringify(answers.coreProblem);
  const solution = JSON.stringify(answers.coreSolution);
  return `import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          For {${audience}}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {${projectName}}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {${pitch}}
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Get started
          </Link>
          <Link
            href="#features"
            className="rounded-md border px-5 py-2.5 text-sm font-medium"
          >
            Learn more
          </Link>
        </div>
      </section>

      <section id="features" className="grid gap-6 pt-20 sm:grid-cols-2">
        <article className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">The problem</h2>
          <p className="mt-2 text-sm text-muted-foreground">{${problem}}</p>
        </article>
        <article className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">How we solve it</h2>
          <p className="mt-2 text-sm text-muted-foreground">{${solution}}</p>
        </article>
      </section>
    </main>
  );
}
`;
};

/** Overwrites the marketing landing with copy synthesized from the interview. */
export const landingStage: Stage = {
  name: 'landing',
  apply: async (ctx: StageContext): Promise<StageResult> => {
    const file = path.join(ctx.targetDir, LANDING_PATH);
    if (!(await fse.pathExists(file))) return { filesWritten: 0 };
    await fs.writeFile(file, renderLanding(ctx.answers));
    return { filesWritten: 1 };
  },
};
