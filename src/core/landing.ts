import { promises as fs } from 'node:fs';
import path from 'node:path';
import fse from 'fs-extra';

import type { Answers } from './interview.js';

const LANDING_PATH = 'apps/web/app/(marketing)/page.tsx';

const escape = (value: string): string => value.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

/**
 * Replace the marketing landing with copy synthesized from the interview.
 * The template ships a static placeholder version; this overwrites it with a
 * project-tailored hero/features block.
 */
export const rewriteLanding = async (targetDir: string, answers: Answers): Promise<void> => {
  const file = path.join(targetDir, LANDING_PATH);
  if (!(await fse.pathExists(file))) return;

  const contents = `import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          For ${escape(answers.targetAudience)}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          ${escape(answers.projectName)}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          ${escape(answers.oneLinePitch)}
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
          <p className="mt-2 text-sm text-muted-foreground">
            ${escape(answers.coreProblem)}
          </p>
        </article>
        <article className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">How we solve it</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ${escape(answers.coreSolution)}
          </p>
        </article>
      </section>
    </main>
  );
}
`;
  await fs.writeFile(file, contents);
};
