import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Answers } from './interview.types.js';
import type { Stage, StageContext, StageResult } from './scaffold.types.js';
import { walk } from './walk.js';

/**
 * Placeholder tokens substituted in template files. Use double-underscore
 * boundaries so they are unambiguous in code, JSON, and Markdown alike.
 */
export const PLACEHOLDER_KEYS = [
  '__PROJECT_NAME__',
  '__PROJECT_SLUG__',
  '__PITCH__',
  '__AUDIENCE__',
  '__PROBLEM__',
  '__SOLUTION__',
  '__MONETIZATION__',
  '__YEAR__',
] as const;

export type PlaceholderKey = (typeof PLACEHOLDER_KEYS)[number];

export const buildPlaceholderMap = (answers: Answers): Record<PlaceholderKey, string> => ({
  __PROJECT_NAME__: answers.projectName,
  __PROJECT_SLUG__: answers.projectSlug,
  __PITCH__: answers.oneLinePitch,
  __AUDIENCE__: answers.targetAudience,
  __PROBLEM__: answers.coreProblem,
  __SOLUTION__: answers.coreSolution,
  __MONETIZATION__: answers.monetization,
  __YEAR__: String(new Date().getFullYear()),
});

/** Apply every placeholder substitution to a string in a single pass. */
export const substitute = (input: string, map: Readonly<Record<string, string>>): string => {
  let out = input;
  for (const key of PLACEHOLDER_KEYS) {
    if (out.includes(key)) {
      out = out.split(key).join(map[key]);
    }
  }
  return out;
};

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

/**
 * Walks the scaffolded tree and rewrites every text file in place, applying
 * the placeholder map. Skips known binary extensions.
 */
export const placeholderStage: Stage = {
  name: 'placeholders',
  apply: async (ctx: StageContext): Promise<StageResult> => {
    let filesWritten = 0;
    for await (const file of walk(ctx.targetDir)) {
      if (isBinary(file)) continue;
      const original = await fs.readFile(file, 'utf8');
      const rewritten = substitute(original, ctx.placeholderMap);
      if (rewritten !== original) {
        await fs.writeFile(file, rewritten);
        filesWritten++;
      }
    }
    return { filesWritten };
  },
};
