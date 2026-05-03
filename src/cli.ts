#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

import { Command } from 'commander';

import { loadAnswersFile } from './cli/loadAnswersFile.js';
import { exitWith, printNextSteps } from './cli/presenter.js';
import { runInteractive } from './cli/runInteractive.js';
import type { Answers } from './core/interview.types.js';
import { scaffold } from './core/scaffold.js';

interface InitOptions {
  answersFile?: string;
  force?: boolean;
}

const pkg = createRequire(import.meta.url)('../package.json') as { version: string };
const PKG_VERSION = pkg.version;

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
        : await runInteractive(process.cwd(), PKG_VERSION);
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
