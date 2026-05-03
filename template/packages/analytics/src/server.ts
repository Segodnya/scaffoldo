import { PostHog } from 'posthog-node';
import type { EventName, EventPayload } from './events.js';

let cached: PostHog | undefined;

const client = (): PostHog | null => {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!cached) {
    cached = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return cached;
};

export const trackServer = async <E extends EventName>(
  userId: string,
  event: E,
  payload: EventPayload<E>,
): Promise<void> => {
  const c = client();
  if (!c) return;
  c.capture({ distinctId: userId, event, properties: payload as Record<string, unknown> });
};
