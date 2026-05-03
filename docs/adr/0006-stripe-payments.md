# 0006. Stripe Checkout + customer portal

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
We must accept money on day one and we must not store card details. Building a custom payment flow means PCI scope, fraud handling, dispute workflows, dunning emails, and proration math — none of which differentiate the product.

## Decision
Use **Stripe Checkout** (hosted) for purchases and **Stripe Customer Portal** for self-service plan changes. Webhook handler (`apps/web/app/api/webhooks/stripe/route.ts`) is the source of truth: every state change in Stripe upserts a `Subscription` row in our DB. The DB row is what the app reads.

Pricing config is code (`packages/payments/src/plans.ts`) — price IDs are looked up from there, not hardcoded in pages.

## Consequences
**Positive:**
- Zero PCI exposure.
- Hosted Checkout supports cards + Apple/Google Pay + many local methods with one toggle.
- Customer portal handles cancel/upgrade/downgrade/invoice retrieval for free.

**Negative:**
- 2.9% + 30¢ per transaction (US) — non-trivial at scale.
- Requires the user to leave our domain mid-checkout (mitigation: domain-matched Checkout pages exist on higher tiers).
- Tax (EU VAT, US sales tax) is the seller's responsibility — Stripe Tax helps but is a separate feature.

## Alternatives considered
- **Lemon Squeezy / Paddle**: Merchant of Record handles tax for you. Worth it if you sell internationally and don't want to deal with VAT thresholds. Trade-off: higher take rate (~5%).
- **Polar.sh**: developer-focused MoR; worth watching.
- **Custom Stripe Elements**: more control, more code, more PCI scope considerations.
