import Stripe from 'stripe';
import { requireEnv } from '@__PROJECT_SLUG__/core';

let cached: Stripe | undefined;

export const stripe = (): Stripe => {
  if (!cached) {
    cached = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });
  }
  return cached;
};
