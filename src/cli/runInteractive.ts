import path from 'node:path';
import process from 'node:process';

import { input, select, checkbox } from '@inquirer/prompts';
import kleur from 'kleur';

import { findQuestion, parseDomainEntities, validateField } from '../core/interview.js';
import type { AnswerId, Answers } from '../core/interview.types.js';

const validate = (id: AnswerId) => (value: unknown) => validateField(findQuestion(id), value);

/**
 * Walks the interview interactively via @inquirer/prompts. The JSON-backed
 * path lives in `loadAnswersFile.ts`; both produce the same `Answers` shape
 * by going through `validateField` (interactive) or `parseAnswers` (JSON).
 */
export const runInteractive = async (cwd: string, version: string): Promise<Answers> => {
  process.stdout.write(`${kleur.bold().cyan('scaffoldo')} ${kleur.dim('v' + version)}\n`);
  process.stdout.write(kleur.dim('A few questions, then we scaffold your SaaS.\n\n'));

  const projectName = await input({
    message: findQuestion('projectName').prompt,
    validate: validate('projectName'),
  });

  const defaultSlug = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const projectSlug = await input({
    message: findQuestion('projectSlug').prompt,
    default: defaultSlug,
    validate: validate('projectSlug'),
  });

  const targetDir = await input({
    message: findQuestion('targetDir').prompt,
    default: path.resolve(cwd, projectSlug),
  });

  const oneLinePitch = await input({
    message: findQuestion('oneLinePitch').prompt,
    validate: validate('oneLinePitch'),
  });

  const targetAudience = await input({
    message: findQuestion('targetAudience').prompt,
    validate: validate('targetAudience'),
  });

  const coreProblem = await input({
    message: findQuestion('coreProblem').prompt,
    validate: validate('coreProblem'),
  });

  const coreSolution = await input({
    message: findQuestion('coreSolution').prompt,
    validate: validate('coreSolution'),
  });

  const monetization = (await select({
    message: findQuestion('monetization').prompt,
    default: 'subscription',
    choices: findQuestion('monetization').choices!.map((c) => ({
      name: c.label,
      value: c.value,
      description: c.description,
    })),
  })) as Answers['monetization'];

  const domainRaw = await input({
    message: findQuestion('domainEntities').prompt,
    validate: validate('domainEntities'),
  });

  const optionalModules = (await checkbox({
    message: findQuestion('optionalModules').prompt,
    choices: findQuestion('optionalModules').choices!.map((c) => ({
      name: c.label,
      value: c.value,
      checked: true,
    })),
  })) as Answers['optionalModules'];

  return {
    projectName: projectName.trim(),
    projectSlug: projectSlug.trim(),
    targetDir: path.resolve(targetDir),
    oneLinePitch: oneLinePitch.trim(),
    targetAudience: targetAudience.trim(),
    coreProblem: coreProblem.trim(),
    coreSolution: coreSolution.trim(),
    monetization,
    domainEntities: parseDomainEntities(domainRaw),
    optionalModules,
  };
};
