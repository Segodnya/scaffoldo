/**
 * Pricing config. Replace `priceId` with the real Stripe price IDs from the
 * dashboard. Add or remove plans freely; the rest of the code reads from
 * PLANS by id and uses the priceId at checkout time.
 *
 * Monetization model selected at scaffold time: __MONETIZATION__
 */
export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceId: string;
  amountCents: number;
  /** Displayed under the price. */
  interval: 'month' | 'year' | 'one-time';
  features: string[];
}

export type PlanId = 'free' | 'pro';

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Get started without a credit card.',
    priceId: '',
    amountCents: 0,
    interval: 'month',
    features: ['Core features', 'Community support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Everything you need to ship.',
    priceId: 'price_REPLACE_ME',
    amountCents: 1900,
    interval: 'month',
    features: ['Everything in Free', 'Email support', 'Higher limits'],
  },
};

export const getPlan = (id: PlanId): Plan => PLANS[id];
