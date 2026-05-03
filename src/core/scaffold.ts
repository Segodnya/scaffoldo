import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

import type { Answers } from './interview.js';
import { buildPlaceholderMap, substitute } from './placeholders.js';
import { stubDomainEntities } from './domain.js';
import { rewriteLanding } from './landing.js';
import { renderProjectChecklist } from './checklist.js';

export interface ScaffoldOptions {
  /** Override the bundled `template/` directory. Used by tests. */
  templateDir?: string;
  /** If true, scaffold even when targetDir is non-empty (for tests only). */
  force?: boolean;
}

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Locate the bundled template. After tsup the CLI lives at `dist/cli.js`,
 * so `../template` resolves to the package root's `template/`.
 */
const defaultTemplateDir = (): string => path.resolve(here, '..', 'template');

/** Files we never substitute placeholders in (binary or noisy formats). */
const BINARY_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.zip',
  '.pdf',
]);

const isBinary = (file: string): boolean => BINARY_EXT.has(path.extname(file).toLowerCase());

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

const walk = async function* (root: string): AsyncGenerator<string> {
  const stack: string[] = [root];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        yield full;
      }
    }
  }
};

export interface ScaffoldResult {
  targetDir: string;
  filesWritten: number;
}

export const scaffold = async (
  answers: Answers,
  options: ScaffoldOptions = {},
): Promise<ScaffoldResult> => {
  const templateDir = options.templateDir ?? defaultTemplateDir();
  const targetDir = path.resolve(answers.targetDir);

  await ensureEmpty(targetDir, options.force ?? false);
  await fse.copy(templateDir, targetDir, { overwrite: true, errorOnExist: false });

  const map = buildPlaceholderMap(answers);
  let filesWritten = 0;

  for await (const file of walk(targetDir)) {
    if (isBinary(file)) continue;
    const original = await fs.readFile(file, 'utf8');
    const rewritten = substitute(original, map);
    if (rewritten !== original) {
      await fs.writeFile(file, rewritten);
      filesWritten++;
    }
  }

  // Rename README.md.tmpl → README.md after substitution.
  const tmplReadme = path.join(targetDir, 'README.md.tmpl');
  if (await fse.pathExists(tmplReadme)) {
    await fse.move(tmplReadme, path.join(targetDir, 'README.md'), { overwrite: true });
  }

  await stubDomainEntities(targetDir, answers.domainEntities);
  await rewriteLanding(targetDir, answers);
  await renderProjectChecklist(targetDir, answers);

  return { targetDir, filesWritten };
};
