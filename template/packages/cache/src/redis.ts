import { Redis } from '@upstash/redis';

let cached: Redis | undefined;

/** Lazy Redis client. Returns null if Upstash env vars are missing. */
export const redis = (): Redis | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!cached) cached = new Redis({ url, token });
  return cached;
};
