/** Shared Tailwind preset. Tailwind v4 prefers CSS-first config via @theme,
 *  so this preset stays minimal — extend in apps/web's app/globals.css. */
const preset = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
};

export default preset;
