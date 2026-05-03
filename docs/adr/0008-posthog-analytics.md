# 0008. PostHog for product analytics

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Once you have users you need to know what they do. At minimum: pageview funnels, signup → activation rates, feature usage. Soon after: session replay, feature flags, A/B tests. Buying these as separate vendors compounds vendor-management cost.

## Decision
Use **PostHog** for analytics, session replay, feature flags, and experimentation. Initialize the browser SDK in the root layout; identify users server-side after auth so anonymous sessions stitch onto the authenticated user.

The `track('event_name', payload)` helper in `packages/analytics/` is typed against an event registry — adding a new event requires updating the registry, which keeps event names from drifting.

## Consequences
**Positive:**
- One vendor for analytics + replay + flags + experiments.
- Generous free tier (1M events/month).
- Self-hostable if we ever outgrow the cloud.

**Negative:**
- Heavier client bundle than a pure-pageview tool like Plausible.
- PostHog's UI does too many things — onboarding new teammates takes time.

## Alternatives considered
- **Mixpanel**: mature analytics, no replay or flags.
- **Amplitude**: similar.
- **Plausible / Fathom**: privacy-first, only pageviews — too narrow.
- **Segment**: routing layer, not analytics — adds cost without replacing PostHog.
