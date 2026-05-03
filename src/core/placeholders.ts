import type { Answers } from './interview.js';

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
export const substitute = (input: string, map: Record<PlaceholderKey, string>): string => {
  let out = input;
  for (const key of PLACEHOLDER_KEYS) {
    if (out.includes(key)) {
      out = out.split(key).join(map[key]);
    }
  }
  return out;
};
