import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

import type { Answers } from './interview.types.js';
import type {
  ScaffoldOptions,
  ScaffoldResult,
  Stage,
  StageContext,
  StageResult,
} from './scaffold.types.js';
import { buildPlaceholderMap, placeholderStage } from './placeholders.js';
import { domainEntitiesStage } from './domain.js';
import { landingStage } from './landing.js';
import { projectChecklistStage } from './checklist.js';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Locate the bundled template. After tsup the CLI lives at `dist/cli.js`,
 * so `../template` resolves to the package root's `template/`.
 */
const defaultTemplateDir = (): string => path.resolve(here, '..', 'template');

const ensureEmpty = async (dir: string, force: boolean): Promise<void> => {
  try {
    const entries = await fs.readdir(dir);
    if (entries.length > 0 && !force) {
      throw new Error(`Target directory is not empty: ${dir}`);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true });
      return;
    }
    throw err;
  }
};

/** Renames `README.md.tmpl` to `README.md` so placeholder substitution can run on the template body without TypeScript/Markdown tooling tripping over the raw tokens. */
const renameReadmeStage: Stage = {
  name: 'rename-readme',
  apply: async (ctx: StageContext): Promise<StageResult> => {
    const tmpl = path.join(ctx.targetDir, 'README.md.tmpl');
    if (!(await fse.pathExists(tmpl))) return { filesWritten: 0 };
    await fse.move(tmpl, path.join(ctx.targetDir, 'README.md'), { overwrite: true });
    return { filesWritten: 1 };
  },
};

/**
 * Pipeline of post-copy transformations. Order matters: placeholder
 * substitution must run before any stage that depends on resolved file paths,
 * and the README rename happens after substitution so the body is rewritten
 * while still under its `.tmpl` name.
 */
export const STAGES: readonly Stage[] = [
  placeholderStage,
  renameReadmeStage,
  domainEntitiesStage,
  landingStage,
  projectChecklistStage,
];

export const scaffold = async (
  answers: Answers,
  options: ScaffoldOptions = {},
): Promise<ScaffoldResult> => {
  const templateDir = options.templateDir || defaultTemplateDir();
  const targetDir = path.resolve(answers.targetDir);

  await ensureEmpty(targetDir, options.force || false);
  await fse.copy(templateDir, targetDir, { overwrite: true, errorOnExist: false });

  const ctx: StageContext = {
    answers,
    targetDir,
    placeholderMap: buildPlaceholderMap(answers),
  };

  const stages = options.stages || STAGES;
  let filesWritten = 0;
  for (const stage of stages) {
    const result = await stage.apply(ctx);
    filesWritten += result.filesWritten;
  }

  return { targetDir, filesWritten };
};
