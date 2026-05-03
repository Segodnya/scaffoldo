'use client';

import { useEffect } from 'react';
import { log } from '@__PROJECT_SLUG__/observability';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error(error, 'rendering error boundary tripped');
  }, [error]);

  return (
    <main className="mx-auto max-w-md p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Something went wrong.</h1>
      <p className="text-sm text-muted-foreground">{error.message || 'Unknown error.'}</p>
      <button
        onClick={() => reset()}
        className="rounded-md border px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </main>
  );
}
