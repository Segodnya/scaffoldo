# Resend

**What:** Transactional email API. Send via REST or SMTP, with React Email templates.

**Why chosen:** Built by the team that maintains React Email. Best-in-class deliverability for a startup-friendly price. Free tier covers the first thousands of emails per month.

**Free tier:** 100 emails/day, 3,000/month. One verified domain.

**Alternatives considered:** Postmark (excellent reputation, paid-only), SendGrid (heavyweight, opaque deliverability), Loops (audience-focused, less general-purpose), Amazon SES (cheapest at scale, painful DX).

**Used in template by:**
- `packages/email/src/client.ts` — Resend client
- `packages/email/src/templates/welcome.tsx` — sent from the Clerk `user.created` webhook
- `packages/email/src/templates/payment-success.tsx` — sent from the Stripe `checkout.session.completed` webhook

**Env vars:**
- `RESEND_API_KEY`
- `EMAIL_FROM` — verified sender address (e.g. `hello@<your-domain>.com`)

**Setup:**
1. Add and verify your domain (DKIM + SPF DNS records — Cloudflare makes this easy).
2. Generate API key.
3. Verify a sender address.

**Skipping:** Deselect `resend` in the interview. Email senders become no-ops; the rest of the app still functions.
