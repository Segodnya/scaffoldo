# Stripe

**What:** Payments. Checkout-hosted flow + customer portal + webhooks.

**Why chosen:** Industry standard. Best documentation, broadest payment-method coverage, world-class fraud tooling. Hosted Checkout means we don't store card data and we don't ship a PCI workflow.

**Cost:** No platform fee. 2.9% + 30¢ per successful transaction (US). International cards +1.5%.

**Alternatives considered:** Lemon Squeezy / Paddle (Merchant of Record — they handle EU VAT for you, useful if you sell globally and want to dodge tax compliance), Polar.sh (newer, OSS-friendly), Braintree (PayPal-owned, similar pricing).

**Used in template by:**
- `packages/payments/src/client.ts` — Stripe SDK
- `packages/payments/src/plans.ts` — your pricing config (price IDs + display)
- `packages/payments/src/checkout.ts` — `createCheckoutSession({...})`
- `packages/payments/src/portal.ts` — `createPortalSession({...})`
- `apps/web/app/api/webhooks/stripe/route.ts` — verifies signature + updates `Subscription` row

**Env vars:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Setup:**
1. Create products + prices that match your `monetization` answer. Edit `packages/payments/src/plans.ts` with the price IDs.
2. Add webhook endpoint `https://<domain>/api/webhooks/stripe` subscribed to: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`. Copy the signing secret.
3. Local dev: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
