import * as Sentry from '@sentry/nextjs';

export const captureException = (err: unknown, context?: Record<string, unknown>): void => {
  try {
    Sentry.captureException(err, context ? { extra: context } : undefined);
  } catch {
    // Sentry not initialized yet (cold start) — drop silently.
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  try {
    Sentry.captureMessage(message, level);
  } catch {
    // ignored
  }
};
