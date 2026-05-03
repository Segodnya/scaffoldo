import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          For __AUDIENCE__
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          __PROJECT_NAME__
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          __PITCH__
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Get started
          </Link>
          <Link
            href="#features"
            className="rounded-md border px-5 py-2.5 text-sm font-medium"
          >
            Learn more
          </Link>
        </div>
      </section>

      <section id="features" className="grid gap-6 pt-20 sm:grid-cols-2">
        <article className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">The problem</h2>
          <p className="mt-2 text-sm text-muted-foreground">__PROBLEM__</p>
        </article>
        <article className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">How we solve it</h2>
          <p className="mt-2 text-sm text-muted-foreground">__SOLUTION__</p>
        </article>
      </section>
    </main>
  );
}
