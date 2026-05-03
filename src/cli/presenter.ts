import path from 'node:path';
import process from 'node:process';

import kleur from 'kleur';

export const exitWith = (message: string, code = 1): never => {
  process.stderr.write(`${kleur.red('✖')} ${message}\n`);
  process.exit(code);
};

export const printNextSteps = (targetDir: string): void => {
  process.stdout.write('\n');
  process.stdout.write(`${kleur.green('✔')} Scaffolded at ${kleur.bold(targetDir)}\n\n`);
  process.stdout.write(`${kleur.bold('Next steps')}\n`);
  process.stdout.write(`  ${kleur.cyan('cd')} ${path.relative(process.cwd(), targetDir) || '.'}\n`);
  process.stdout.write(`  ${kleur.cyan('pnpm install')}\n`);
  process.stdout.write(
    `  Open ${kleur.underline('docs/setup.md')} — sign up for each service and paste keys into ${kleur.underline('.env.local')}\n`,
  );
  process.stdout.write(`  ${kleur.cyan('pnpm db:push')} ${kleur.dim('# once Supabase URL is set')}\n`);
  process.stdout.write(`  ${kleur.cyan('pnpm dev')}\n\n`);
};
