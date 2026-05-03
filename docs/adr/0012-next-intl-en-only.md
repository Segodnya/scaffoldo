# 0012. next-intl with EN-only initial catalog

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Hardcoded strings rot. By the time you decide you need i18n, every component has copy buried in JSX — converting becomes a several-day refactor. The cost of wiring i18n on day one is small; the cost of adding it on day 200 is not.

We ship one locale at v0 (English) but want all UI strings to flow through translation keys.

## Decision
Use **next-intl** with `messages/en.json` as the single catalog. All user-facing text uses the `useTranslations()` hook (client) or `getTranslations()` (server). Adding a second locale later is dropping in `messages/<locale>.json` and toggling the locale-detection middleware.

Russian translations are intentionally **not** included — the user's broader convention preference for RU comments doesn't apply to scaffoldo (this repo is English-only) and the template targets a global audience.

## Consequences
**Positive:**
- Adding a locale is a config change, not a refactor.
- ICU message format is standard.
- next-intl's hook works cleanly with App Router server/client split.

**Negative:**
- Slightly more ceremony per string than a hardcoded literal.
- Translation key drift is a real failure mode — we'll need a "find unused keys" script eventually.

## Alternatives considered
- **No i18n**: cheap now, expensive later.
- **react-i18next**: works fine, less idiomatic with App Router.
- **Lingui**: nice DX, smaller community.
