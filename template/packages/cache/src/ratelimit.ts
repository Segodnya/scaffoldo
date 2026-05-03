import { Ratelimit } from '@upstash/ratelimit';
import { AppError } from '@__PROJECT_SLUG__/core';
import { redis } from './redis.js';

interface RateLimitOptions {
  /** Bucket key — usually `${route}:${ip}` or `${route}:${userId}`. */
  key: string;
  /** Sliding-window limit, e.g. 10 requests per 60s. */
  limit: number;
  windowSeconds: number;
}

let cached: Ratelimit | undefined;

const limiter = (windowSeconds: number, limit: number): Ratelimit | null => {
  const r = redis();
  if (!r) return null;
  if (!cached) {
    cached = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      analytics: true,
    });
  }
  return cached;
};

/**
 * Run `fn` only if the bucket isn't exhausted. Throws AppError('rate_limited')
 * with retry-after info when the limit is hit. No-ops (just runs `fn`) when
 * Upstash isn't configured — the route still works in dev without keys.
 */
export const withRateLimit = async <T>(
  options: RateLimitOptions,
  fn: () => Promise<T>,
): Promise<T> => {
  const rl = limiter(options.windowSeconds, options.limit);
  if (!rl) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ratelimit] Upstash not configured — running without limit.');
    }
    return fn();
  }
  const { success, reset } = await rl.limit(options.key);
  if (!success) {
    throw new AppError('rate_limited', 'Too many requests.', {
      details: { retryAfterMs: reset - Date.now() },
    });
  }
  return fn();
};
