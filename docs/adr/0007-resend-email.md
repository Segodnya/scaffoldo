# 0007. Resend for transactional email

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
We need transactional email (welcome, payment receipt, password reset proxies, alerts). We do **not** need bulk marketing email at v0 — Clerk handles auth-flow email itself. Whatever we pick must have good deliverability at low volume and a sensible templating story.

## Decision
Use **Resend** with React Email templates. The `packages/email/` package exposes typed `sendWelcomeEmail({...})`-style functions; templates are React components in `packages/email/src/templates/`.

This module is **opt-in** in the interview — if `resend` isn't selected, the senders become no-ops so the rest of the app keeps working.

## Consequences
**Positive:**
- Built by the React Email team — tooling and templates are first-class.
- Deliverability comparable to Postmark on the free tier.
- React templates compose with the rest of our component code.

**Negative:**
- Younger company than Postmark or SendGrid; risk of pricing or feature pivots.
- 3,000 emails/month is the free ceiling — small for a viral launch.

## Alternatives considered
- **Postmark**: best-in-class deliverability, paid-only.
- **SendGrid**: heavyweight, opaque.
- **Loops**: marketing-leaning.
- **Amazon SES**: cheapest at scale, painful DX, you handle templating yourself.
