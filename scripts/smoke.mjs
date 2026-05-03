#!/usr/bin/env node
/**
 * End-to-end smoke test. Builds (assumed already built) the CLI, then runs
 * `scaffoldo init --answers-file ...` into a tmp dir and verifies the output.
 * Exits non-zero on any failed assertion.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = join(here, '..');
const cli = join(repoRoot, 'dist', 'cli.js');

if (!existsSync(cli)) {
  console.error('✖ dist/cli.js not found — run `pnpm build` first.');
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), 'scaffoldo-smoke-'));
const targetDir = join(tmp, 'demo');
const answersFile = join(tmp, 'answers.json');

writeFileSync(
  answersFile,
  JSON.stringify({
    projectName: 'Demo App',
    projectSlug: 'demo-app',
    targetDir,
    oneLinePitch: 'A demo SaaS used by scaffoldo to smoke-test itself.',
    targetAudience: 'CI runners',
    coreProblem: 'Scaffolders can quietly regress.',
    coreSolution: 'Scaffold into /tmp on every PR and assert the shape.',
    monetization: 'subscription',
    domainEntities: ['Lead', 'Pipeline'],
    optionalModules: ['pinecone', 'upstash', 'resend'],
  }),
);

execFileSync('node', [cli, 'init', '--answers-file', answersFile], {
  stdio: 'inherit',
  cwd: tmp,
});

const assertExists = (relPath) => {
  const full = join(targetDir, relPath);
  if (!existsSync(full)) {
    console.error(`✖ Expected file missing: ${relPath}`);
    process.exit(1);
  }
};

const assertContains = (relPath, needle) => {
  const full = join(targetDir, relPath);
  const contents = readFileSync(full, 'utf8');
  if (!contents.includes(needle)) {
    console.error(`✖ ${relPath} does not contain: ${needle}`);
    process.exit(1);
  }
};

assertExists('package.json');
assertExists('apps/web/app/(marketing)/page.tsx');
assertExists('apps/web/app/(app)/lead/page.tsx');
assertExists('apps/web/app/(app)/pipeline/page.tsx');
assertExists('packages/db/prisma/schema.prisma');
assertExists('docs/setup.md');
assertExists('docs/checklist.md');
assertExists('.env.example');

assertContains('package.json', '"name": "demo-app"');
assertContains('apps/web/app/(marketing)/page.tsx', 'Demo App');
assertContains('packages/db/prisma/schema.prisma', 'model Lead');
assertContains('packages/db/prisma/schema.prisma', 'model Pipeline');
assertContains('docs/checklist.md', 'Demo App — launch checklist');

if (existsSync(join(targetDir, 'README.md.tmpl'))) {
  console.error('✖ README.md.tmpl was not renamed to README.md');
  process.exit(1);
}
assertExists('README.md');
assertContains('README.md', 'Demo App');

rmSync(tmp, { recursive: true, force: true });
console.log('✔ smoke test passed');
