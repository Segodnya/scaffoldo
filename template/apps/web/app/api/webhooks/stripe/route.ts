import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { db } from '@__PROJECT_SLUG__/db';
import { verifyWebhook } from '@__PROJECT_SLUG__/payments';
import { sendPaymentSuccessEmail } from '@__PROJECT_SLUG__/email';
import { log } from '@__PROJECT_SLUG__/observability';

const upsertSubscription = async (
  userId: string,
  patch: { stripeCustomerId?: string; stripeSubscriptionId?: string; stripePriceId?: string; status?: string; currentPeriodEnd?: Date },
): Promise<void> => {
  await db.subscription.upsert({
    where: { userId },
    create: { userId, ...patch },
    update: patch,
  });
};

export const POST = async (req: Request): Promise<Response> => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'no signature' }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await verifyWebhook(rawBody, signature);
  } catch (err) {
    log.error(err, 'stripe webhook verification failed');
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id ?? (session.metadata?.userId ?? null);
      if (!userId) break;
      await upsertSubscription(userId, {
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        status: 'active',
      });
      const email = session.customer_details?.email;
      const planId = session.metadata?.planId ?? 'pro';
      if (email) {
        await sendPaymentSuccessEmail(email, {
          plan: planId,
          amountCents: session.amount_total ?? 0,
        });
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      const existing = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
      if (!existing) break;
      await upsertSubscription(existing.userId, {
        stripeSubscriptionId: sub.id,
        stripePriceId: sub.items.data[0]?.price.id,
        status: sub.status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      });
      break;
    }
    default:
      log.info({ type: event.type }, 'unhandled stripe event');
  }

  return NextResponse.json({ ok: true });
};
