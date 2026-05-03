import { promises as fs } from 'node:fs';
import path from 'node:path';

import { normalizeAnswers, parseAnswers } from '../core/interview.js';
import type { Answers } from '../core/interview.types.js';

/** Reads a JSON file, validates via `parseAnswers`, then normalizes paths. */
export const loadAnswersFile = async (filePath: string): Promise<Answers> => {
  const raw = await fs.readFile(path.resolve(filePath), 'utf8');
  return normalizeAnswers(parseAnswers(JSON.parse(raw)));
};
