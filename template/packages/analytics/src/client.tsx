'use client';

import { useEffect, type ReactNode } from 'react';
import posthog from 'posthog-js';

interface PostHogProviderProps {
  children: ReactNode;
  apiKey?: string;
  apiHost?: string;
}

/**
 * Initializes PostHog on the client. No-op when keys are absent so the
 * template boots without analytics configured.
 */
export const PostHogProvider = ({
  children,
  apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY,
  apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
}: PostHogProviderProps) => {
  useEffect(() => {
    if (!apiKey) return;
    if (typeof window === 'undefined') return;
    posthog.init(apiKey, { api_host: apiHost, capture_pageview: true, capture_pageleave: true });
  }, [apiKey, apiHost]);

  return <>{children}</>;
};
