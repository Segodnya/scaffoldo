/**
 * Programmatic API. Importing from `scaffoldo` gives the same engine the CLI
 * uses, for tests and embedders. The CLI itself lives in src/cli.ts.
 */

export { scaffold, STAGES } from './core/scaffold.js';
export type {
  ScaffoldOptions,
  ScaffoldResult,
  Stage,
  StageContext,
  StageResult,
} from './core/scaffold.types.js';

export {
  QUESTIONS,
  findQuestion,
  normalizeAnswers,
  parseAnswers,
  parseDomainEntities,
  validateField,
} from './core/interview.js';
export type { AnswerId, Answers, Question, QuestionType } from './core/interview.types.js';

export {
  PLACEHOLDER_KEYS,
  buildPlaceholderMap,
  placeholderStage,
  substitute,
} from './core/placeholders.js';
export type { PlaceholderKey } from './core/placeholders.js';

export { landingStage, renderLanding } from './core/landing.js';
export { domainEntitiesStage, renderEntityPage, renderModel } from './core/domain.js';
export { projectChecklistStage, renderChecklist } from './core/checklist.js';
