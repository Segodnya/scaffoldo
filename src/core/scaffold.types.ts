import type { Answers } from './interview.types.js';

export interface ScaffoldOptions {
  /** Override the bundled `template/` directory. Used by tests. */
  templateDir?: string;
  /** If true, scaffold even when targetDir is non-empty (for tests only). */
  force?: boolean;
  /**
   * Override the post-copy pipeline. Defaults to the exported `STAGES`.
   * Pass a filtered/extended list to add custom transformations or to skip
   * built-in ones (useful for tests and embedders).
   */
  stages?: readonly Stage[];
}

export interface ScaffoldResult {
  targetDir: string;
  filesWritten: number;
}

/**
 * Read-only context handed to every Stage. The orchestrator builds it once
 * after copying the template; stages inspect it and act on disk.
 */
export interface StageContext {
  readonly answers: Answers;
  readonly targetDir: string;
  readonly placeholderMap: Readonly<Record<string, string>>;
}

export interface StageResult {
  filesWritten: number;
}

/**
 * Single seam between the orchestrator and each post-copy transformation.
 * Adding a step is a matter of writing one Stage and registering it in the
 * `STAGES` array — no other module needs to learn about it.
 */
export interface Stage {
  readonly name: string;
  apply(ctx: StageContext): Promise<StageResult>;
}
