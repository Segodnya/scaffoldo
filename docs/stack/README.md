# Stack rationale

One page per service in the scaffoldo stack: what it does, why it's chosen, free-tier limits, alternatives we considered, and the exact env vars + files in the template that consume it.

| Layer | Service | Page |
|-------|---------|------|
| Code generation | Claude Code | [claude.md](./claude.md) |
| Version control + CI | GitHub | [github.md](./github.md) |
| Domain registrar | Namecheap | [namecheap.md](./namecheap.md) |
| DNS / CDN | Cloudflare | [cloudflare.md](./cloudflare.md) |
| App hosting | Vercel | [vercel.md](./vercel.md) |
| Auth | Clerk | [clerk.md](./clerk.md) |
| Database + storage | Supabase | [supabase.md](./supabase.md) |
| Cache + ratelimit | Upstash Redis | [upstash.md](./upstash.md) |
| Vector search | Pinecone | [pinecone.md](./pinecone.md) |
| Transactional email | Resend | [resend.md](./resend.md) |
| Payments | Stripe | [stripe.md](./stripe.md) |
| Product analytics | PostHog | [posthog.md](./posthog.md) |
| Error tracking | Sentry | [sentry.md](./sentry.md) |

Total expected cost at zero traffic: **~$20/month** (Claude subscription), plus $12/year for the domain. Everything else is free until you hit real usage.
