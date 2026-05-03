import { stripe } from './client.js';
import { getPlan, type PlanId } from './plans.js';

interface CheckoutInput {
  userId: string;
  email: string;
  planId: PlanId;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async ({
  userId,
  email,
  planId,
  successUrl,
  cancelUrl,
}: CheckoutInput): Promise<string> => {
  const plan = getPlan(planId);
  const session = await stripe().checkout.sessions.create({
    mode: plan.interval === 'one-time' ? 'payment' : 'subscription',
    line_items: [{ price: plan.priceId, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, planId },
  });
  if (!session.url) throw new Error('Stripe returned no checkout URL.');
  return session.url;
};
