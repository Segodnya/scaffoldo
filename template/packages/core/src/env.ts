/** Read an env var that must be present at runtime. Throws AppError on miss. */
import { AppError } from './errors.js';

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new AppError('internal_error', `Missing required env var: ${name}`);
  }
  return value;
};

export const optionalEnv = (name: string): string | undefined => process.env[name] || undefined;
