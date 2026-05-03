#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

import { input, select, checkbox } from '@inquirer/prompts';
import { Command } from 'commander';
import kleur from 'kleur';

import { QUESTIONS, parseDomainEntities, type Answers } from './core/interview.js';
import { scaffold } from './core/scaffold.js';

interface InitOptions {
  answersFile?: string;
  force?: boolean;
}

const pkg = createRequire(import.meta.url)('../package.json') as { version: string };
const PKG_VERSION = pkg.version;

const exitWith = (message: string, code = 1): never => {
  process.stderr.write(`${kleur.red('✖')} ${message}\n`);
  process.exit(code);
};

const findQuestion = (id: (typeof QUESTIONS)[number]['id']) => {
  const q = QUESTIONS.find((it) => it.id === id);
  if (!q) throw new Error(`Question not found: ${id}`);
  return q;
};

const validate = (id: (typeof QUESTIONS)[number]['id'], value: unknown): true | string => {
  const q = findQuestion(id);
  if (q.required && (value === undefined || value === null || value === '')) {
    return 'Required.';
  }
  if (q.validate) return q.validate(value);
  return true;
};

const runInteractive = async (cwd: string): Promise<Answers> => {
  process.stdout.write(`${kleur.bold().cyan('scaffoldo')} ${kleur.dim('v' + PKG_VERSION)}\n`);
  process.stdout.write(kleur.dim('A few questions, then we scaffold your SaaS.\n\n'));

  const projectName = await input({
    message: findQuestion('projectName').prompt,
    validate: (v) => validate('projectName', v),
  });

  const defaultSlug = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const projectSlug = await input({
    message: findQuestion('projectSlug').prompt,
    default: defaultSlug,
    validate: (v) => validate('projectSlug', v),
  });

  const targetDir = await input({
    message: findQuestion('targetDir').prompt,
    default: path.resolve(cwd, projectSlug),
  });

  const oneLinePitch = await input({
    message: findQuestion('oneLinePitch').prompt,
    validate: (v) => validate('oneLinePitch', v),
  });

  const targetAudience = await input({
    message: findQuestion('targetAudience').prompt,
    validate: (v) => validate('targetAudience', v),
  });

  const coreProblem = await input({
    message: findQuestion('coreProblem').prompt,
    validate: (v) => validate('coreProblem', v),
  });

  const coreSolution = await input({
    message: findQuestion('coreSolution').prompt,
    validate: (v) => validate('coreSolution', v),
  });

  const monetization = (await select({
    message: findQuestion('monetization').prompt,
    default: 'subscription',
    choices: findQuestion('monetization').choices!.map((c) => ({
      name: c.label,
      value: c.value,
      description: c.description,
    })),
  })) as Answers['monetization'];

  const domainRaw = await input({
    message: findQuestion('domainEntities').prompt,
    validate: (v) => validate('domainEntities', v),
  });

  const optionalModules = (await checkbox({
    message: findQuestion('optionalModules').prompt,
    choices: findQuestion('optionalModules').choices!.map((c) => ({
      name: c.label,
      value: c.value,
      checked: true,
    })),
  })) as Answers['optionalModules'];

  return {
    projectName: projectName.trim(),
    projectSlug: projectSlug.trim(),
    targetDir: path.resolve(targetDir),
    oneLinePitch: oneLinePitch.trim(),
    targetAudience: targetAudience.trim(),
    coreProblem: coreProblem.trim(),
    coreSolution: coreSolution.trim(),
    monetization,
    domainEntities: parseDomainEntities(domainRaw),
    optionalModules,
  };
};

const loadAnswersFile = async (filePath: string): Promise<Answers> => {
  const raw = await fs.readFile(path.resolve(filePath), 'utf8');
  const parsed = JSON.parse(raw) as Partial<Answers>;
  for (const q of QUESTIONS) {
    const value = (parsed as Record<string, unknown>)[q.id];
    const result = validate(q.id, value);
    if (result !== true) exitWith(`answers.${q.id}: ${result}`);
  }
  return {
    ...(parsed as Answers),
    targetDir: path.resolve((parsed as Answers).targetDir),
  };
};

const printNextSteps = (targetDir: string): void => {
  process.stdout.write('\n');
  process.stdout.write(`${kleur.green('✔')} Scaffolded at ${kleur.bold(targetDir)}\n\n`);
  process.stdout.write(`${kleur.bold('Next steps')}\n`);
  process.stdout.write(`  ${kleur.cyan('cd')} ${path.relative(process.cwd(), targetDir) || '.'}\n`);
  process.stdout.write(`  ${kleur.cyan('pnpm install')}\n`);
  process.stdout.write(`  Open ${kleur.underline('docs/setup.md')} — sign up for each service and paste keys into ${kleur.underline('.env.local')}\n`);
  process.stdout.write(`  ${kleur.cyan('pnpm db:push')} ${kleur.dim('# once Supabase URL is set')}\n`);
  process.stdout.write(`  ${kleur.cyan('pnpm dev')}\n\n`);
};

const program = new Command();
program
  .name('scaffoldo')
  .description('One-prompt SaaS scaffolder.')
  .version(PKG_VERSION, '-v, --version');

program
  .command('init')
  .description('Interview, then scaffold a new SaaS into a target directory.')
  .argument('[targetDir]', 'Target directory (overrides interactive answer).')
  .option('--answers-file <path>', 'Skip prompts and read answers from a JSON file.')
  .option('--force', 'Allow scaffolding into a non-empty directory (dangerous).')
  .action(async (cliTargetDir: string | undefined, options: InitOptions) => {
    try {
      const answers = options.answersFile
        ? await loadAnswersFile(options.answersFile)
        : await runInteractive(process.cwd());
      const finalAnswers: Answers = cliTargetDir
        ? { ...answers, targetDir: path.resolve(cliTargetDir) }
        : answers;

      const result = await scaffold(finalAnswers, { force: options.force });
      printNextSteps(result.targetDir);
    } catch (err) {
      if (err instanceof Error) exitWith(err.message);
      exitWith(String(err));
    }
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  if (err instanceof Error) exitWith(err.message);
  exitWith(String(err));
});
