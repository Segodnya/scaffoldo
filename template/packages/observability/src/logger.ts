import pino from 'pino';
import { captureException } from './sentry.js';

const base = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'apiKey'],
});

/**
 * Wrapped logger. log.error(...) also forwards to Sentry so errors land in
 * one place regardless of which surface (browser/edge/server) emitted them.
 */
export const log = {
  debug: base.debug.bind(base),
  info: base.info.bind(base),
  warn: base.warn.bind(base),
  error: (objOrErr: unknown, msg?: string): void => {
    if (objOrErr instanceof Error) {
      base.error({ err: objOrErr }, msg ?? objOrErr.message);
      captureException(objOrErr);
    } else {
      base.error(objOrErr as object, msg);
      if (msg) captureException(new Error(msg));
    }
  },
};
