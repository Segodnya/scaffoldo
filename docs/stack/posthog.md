# PostHog

**What:** Product analytics — event capture, funnels, session replay, feature flags, A/B tests, cohort analysis.

**Why chosen:** Single tool for what would otherwise be Mixpanel + LaunchDarkly + FullStory. EU + US hosting available. Generous free tier. OSS-licensed (self-hostable if you outgrow the cloud).

**Free tier:** 1M events/month, 5k session recordings/month, unlimited feature flags, 1M annotations.

**Alternatives considered:** Mixpanel (mature analytics, no replay/flags), Amplitude (similar — paid sooner), Plausible (privacy-first but only pageviews — too narrow), Segment (router, not analytics — adds cost).

**Used in template by:**
- `packages/analytics/src/client.ts` — `posthog-js` browser client
- `packages/analytics/src/server.ts` — `posthog-node` for server-side identify on auth
- `apps/web/app/layout.tsx` — initializes the provider on mount
- `packages/analytics/src/track.ts` — typed `track('event_name', payload)` helper

**Env vars:**
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST` — `https://us.i.posthog.com` or `https://eu.i.posthog.com`

**Setup:**
1. Create a project. Pick US or EU instance (must match data-residency needs).
2. Copy the project API key.
3. (Optional) Enable session replay in the project settings if you want it.
