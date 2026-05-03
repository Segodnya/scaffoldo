/**
 * Typed event registry. Add new events here so the entire codebase agrees on
 * names and payload shape. Drift in these strings is a top source of broken
 * funnels — centralizing makes refactors safe.
 */
export interface EventRegistry {
  signup_completed: { method: 'email' | 'oauth' };
  onboarding_completed: { stepCount: number };
  checkout_started: { plan: string };
  checkout_completed: { plan: string; amountCents: number };
  feature_used: { feature: string };
}

export type EventName = keyof EventRegistry;
export type EventPayload<E extends EventName> = EventRegistry[E];
