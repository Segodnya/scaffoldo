/**
 * Canonical interview schema. The CLI prompts and the Claude skill must walk
 * this list in the same order with the same ids — it is the single source of
 * truth that keeps both surfaces from drifting.
 */
import path from 'node:path';

import type { AnswerId, Answers, Question } from './interview.types.js';

const SLUG_RE = /^[a-z][a-z0-9-]*[a-z0-9]$/;
const PASCAL_RE = /^[A-Z][A-Za-z0-9]*$/;

export const QUESTIONS: ReadonlyArray<Question<AnswerId>> = [
  {
    id: 'projectName',
    prompt: 'Project name (display)',
    help: 'Shown on the landing page, in the README, and in emails.',
    type: 'text',
    required: true,
    validate: (v) =>
      typeof v === 'string' && v.trim().length >= 2 ? true : 'Use at least 2 characters.',
  },
  {
    id: 'projectSlug',
    prompt: 'Project slug (kebab-case, used for the directory name)',
    help: 'Lowercase, hyphenated. Example: "lead-pilot". Used for the package name and folder.',
    type: 'text',
    required: true,
    validate: (v) =>
      typeof v === 'string' && SLUG_RE.test(v)
        ? true
        : 'Lowercase letters, digits, and hyphens. Must start with a letter.',
  },
  {
    id: 'targetDir',
    prompt: 'Target directory (absolute path)',
    help: 'Where to scaffold the project. The directory will be created if missing; must be empty.',
    type: 'text',
    required: true,
  },
  {
    id: 'oneLinePitch',
    prompt: 'One-line pitch',
    help: 'A single sentence that explains what the product does. Used for the hero headline.',
    type: 'text',
    required: true,
  },
  {
    id: 'targetAudience',
    prompt: 'Target audience',
    help: 'Who is this for? Used in landing copy and onboarding.',
    type: 'text',
    required: true,
  },
  {
    id: 'coreProblem',
    prompt: 'Core problem you are solving',
    type: 'text',
    required: true,
  },
  {
    id: 'coreSolution',
    prompt: 'Core solution / how the product solves it',
    type: 'text',
    required: true,
  },
  {
    id: 'monetization',
    prompt: 'Monetization model',
    type: 'select',
    default: 'subscription',
    choices: [
      { value: 'subscription', label: 'Subscription', description: 'Recurring monthly/yearly billing' },
      { value: 'one-time', label: 'One-time payment', description: 'Single charge per purchase' },
      { value: 'freemium', label: 'Freemium', description: 'Free tier + paid upgrade' },
      { value: 'usage-based', label: 'Usage-based', description: 'Metered billing per unit consumed' },
    ],
    required: true,
  },
  {
    id: 'domainEntities',
    prompt: 'Core domain entities (PascalCase, comma-separated, 1–5)',
    help: 'Each becomes a Prisma model and a CRUD route stub. Example: Lead, Pipeline, Note.',
    type: 'text',
    required: true,
    validate: (v) => {
      const parts = Array.isArray(v)
        ? v.map((s) => String(s).trim()).filter(Boolean)
        : typeof v === 'string'
          ? v.split(',').map((s) => s.trim()).filter(Boolean)
          : null;
      if (!parts) return 'Comma-separated list of PascalCase nouns.';
      if (parts.length < 1 || parts.length > 5) return 'Provide between 1 and 5 entities.';
      const bad = parts.find((p) => !PASCAL_RE.test(p));
      return bad ? `"${bad}" is not PascalCase.` : true;
    },
  },
  {
    id: 'optionalModules',
    prompt: 'Optional modules to enable',
    help: 'You can keep these and stub the keys later, or drop them entirely.',
    type: 'multiselect',
    default: ['pinecone', 'upstash', 'resend'],
    choices: [
      { value: 'pinecone', label: 'Pinecone (vector search)' },
      { value: 'upstash', label: 'Upstash Redis (cache + ratelimit)' },
      { value: 'resend', label: 'Resend (transactional email)' },
    ],
  },
];

/** Parse a comma-separated entity string into an array of PascalCase nouns. */
export const parseDomainEntities = (raw: string): string[] =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Look up a question by id; throws if the schema drifts. */
export const findQuestion = (id: AnswerId): Question<AnswerId> => {
  const q = QUESTIONS.find((it) => it.id === id);
  if (!q) throw new Error(`Question not found: ${id}`);
  return q;
};

/**
 * Single source of truth for "is this value acceptable for this question?"
 * — used by both the interactive prompt validators and `parseAnswers`, so
 * both surfaces accept the exact same inputs.
 */
export const validateField = (q: Question<AnswerId>, value: unknown): true | string => {
  if (q.required && (value === undefined || value === null || value === '')) {
    return 'Required.';
  }
  if (q.validate) return q.validate(value);
  return true;
};

/**
 * Validate a raw answers payload against the interview schema. Pure: no
 * path resolution, no side effects. Use `normalizeAnswers` separately to
 * absolutize `targetDir`.
 */
export const parseAnswers = (input: unknown): Answers => {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Answers payload must be an object.');
  }
  const record = input as Record<string, unknown>;
  for (const q of QUESTIONS) {
    const result = validateField(q, record[q.id]);
    if (result !== true) throw new Error(`answers.${q.id}: ${result}`);
  }
  return input as Answers;
};

/** Resolve `targetDir` against the current working directory. */
export const normalizeAnswers = (answers: Answers): Answers => ({
  ...answers,
  targetDir: path.resolve(answers.targetDir),
});
