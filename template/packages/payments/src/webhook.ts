import type Stripe from 'stripe';
import { AppError, requireEnv } from '@__PROJECT_SLUG__/core';
import { stripe } from './client.js';

/**
 * Verify a Stripe webhook payload. Returns the parsed event or throws an
 * AppError that the route handler can map to a 400 response.
 */
export const verifyWebhook = async (rawBody: string, signature: string): Promise<Stripe.Event> => {
  try {
    return stripe().webhooks.constructEvent(rawBody, signature, requireEnv('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    throw new AppError('validation_failed', 'Stripe webhook signature mismatch.', { cause: err });
  }
};
