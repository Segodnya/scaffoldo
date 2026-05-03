export type QuestionType = 'text' | 'select' | 'multiselect' | 'confirm';

export interface Question<TId extends string = string> {
  id: TId;
  prompt: string;
  help?: string;
  type: QuestionType;
  default?: string | string[] | boolean;
  choices?: readonly { value: string; label: string; description?: string }[];
  validate?: (value: unknown) => true | string;
  required?: boolean;
}

export type AnswerId =
  | 'projectName'
  | 'projectSlug'
  | 'targetDir'
  | 'oneLinePitch'
  | 'targetAudience'
  | 'coreProblem'
  | 'coreSolution'
  | 'monetization'
  | 'domainEntities'
  | 'optionalModules';

export interface Answers {
  projectName: string;
  projectSlug: string;
  targetDir: string;
  oneLinePitch: string;
  targetAudience: string;
  coreProblem: string;
  coreSolution: string;
  monetization: 'subscription' | 'one-time' | 'freemium' | 'usage-based';
  /** 1..5 PascalCase domain nouns, e.g. ["Lead", "Pipeline", "Note"]. */
  domainEntities: string[];
  optionalModules: ('pinecone' | 'upstash' | 'resend')[];
}
