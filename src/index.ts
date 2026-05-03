/**
 * Programmatic API. Importing from `scaffoldo` gives the same engine the CLI
 * uses, for tests and embedders. The CLI itself lives in src/cli.ts.
 */

export { scaffold } from './core/scaffold.js';
export type { ScaffoldOptions, ScaffoldResult } from './core/scaffold.js';
export { QUESTIONS, parseDomainEntities } from './core/interview.js';
export type { Answers, Question, QuestionType, AnswerId } from './core/interview.js';
export { buildPlaceholderMap, substitute, PLACEHOLDER_KEYS } from './core/placeholders.js';
export type { PlaceholderKey } from './core/placeholders.js';
