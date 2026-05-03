import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: 'incremental',
    typedRoutes: true,
  },
  transpilePackages: [
    '@__PROJECT_SLUG__/ai',
    '@__PROJECT_SLUG__/analytics',
    '@__PROJECT_SLUG__/auth',
    '@__PROJECT_SLUG__/cache',
    '@__PROJECT_SLUG__/core',
    '@__PROJECT_SLUG__/db',
    '@__PROJECT_SLUG__/email',
    '@__PROJECT_SLUG__/i18n',
    '@__PROJECT_SLUG__/observability',
    '@__PROJECT_SLUG__/payments',
    '@__PROJECT_SLUG__/ui',
  ],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
