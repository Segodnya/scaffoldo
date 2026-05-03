# 0005. Tailwind v4 + shadcn/ui

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
The UI layer needs to ship fast at v0 and survive a redesign at v1. We want primitives we own (so the brand isn't locked to a vendor's look) but we don't want to write a button component from scratch.

## Decision
Use **Tailwind CSS v4** for styling and **shadcn/ui** for component primitives. shadcn copies components into the repo (under `packages/ui/src/components/`) — we own them outright, can restyle them freely, and never block on a vendor releasing a new variant.

Tailwind v4 lands the new CSS-first config with `@theme` and gets faster compile times via Lightning CSS.

## Consequences
**Positive:**
- Sane defaults for buttons, dialogs, dropdowns, forms, command-k, toasts.
- No runtime CSS-in-JS cost.
- Brand changes are a single CSS variable away.

**Negative:**
- Component upgrades are manual (re-run `pnpm dlx shadcn@latest add ...`).
- Two related but distinct mental models (utility CSS + copied components).

## Alternatives considered
- **Tailwind alone**: hand-roll components — slow to ship.
- **Mantine** / **Chakra**: pre-built, harder to customize, runtime CSS overhead.
- **Radix Themes**: nice, but less idiomatic with Tailwind.
- **Park UI** / **Headless UI**: similar to shadcn's headless half but without the curated component set.
