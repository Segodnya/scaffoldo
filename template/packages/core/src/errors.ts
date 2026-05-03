/**
 * Typed error hierarchy. All thrown errors should extend AppError so that the
 * top-level boundary in apps/web can branch on .code without instanceof
 * gymnastics across realm/bundle boundaries.
 */
export type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_failed'
  | 'rate_limited'
  | 'payment_required'
  | 'external_service_failed'
  | 'internal_error';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly cause?: unknown;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    options: { httpStatus?: number; cause?: unknown; details?: Record<string, unknown> } = {},
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = options.httpStatus ?? defaultStatus(code);
    this.cause = options.cause;
    this.details = options.details;
  }
}

const defaultStatus = (code: ErrorCode): number => {
  switch (code) {
    case 'unauthorized':
      return 401;
    case 'forbidden':
      return 403;
    case 'not_found':
      return 404;
    case 'validation_failed':
      return 422;
    case 'rate_limited':
      return 429;
    case 'payment_required':
      return 402;
    case 'external_service_failed':
      return 502;
    default:
      return 500;
  }
};

export const isAppError = (err: unknown): err is AppError =>
  err instanceof AppError ||
  (typeof err === 'object' && err !== null && (err as AppError).name === 'AppError');
